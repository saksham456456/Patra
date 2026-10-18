// Browser-only. Reads photos and PDFs ON THE DEVICE. Nothing here makes a network request
// except loading our own self-hosted OCR assets from /ocr (spec §5.2, §S2).
import { ExtractError, LOW_CONFIDENCE, MAX_EDGE_PX, MAX_IMAGE_BYTES, MAX_PAGES, MAX_PDF_BYTES, joinTextItems } from "./text";

export interface ExtractProgress { stage: "loading" | "reading"; page: number; pages: number; pct: number }
export interface ExtractResult { text: string; confidence: number | null; pages: number; lowConfidence: boolean }

type Worker = import("tesseract.js").Worker;

async function makeWorker(onPct: (p: number) => void): Promise<Worker> {
  const { createWorker } = await import("tesseract.js");
  try {
    return await createWorker(["eng", "hin"], 1, {
      workerPath: "/ocr/worker.min.js",
      corePath: "/ocr",
      langPath: "/ocr",
      gzip: true,
      workerBlobURL: false,
      logger: (m: { status: string; progress: number }) => { if (m.status === "recognizing text") onPct(m.progress); },
    });
  } catch {
    throw new ExtractError("unavailable");
  }
}

/** Draws to a canvas capped at MAX_EDGE_PX. Re-encoding through a canvas also drops EXIF and GPS data. */
async function imageToCanvas(source: Blob): Promise<HTMLCanvasElement> {
  const bmp = await createImageBitmap(source).catch(() => { throw new ExtractError("unreadable"); });
  const scale = Math.min(1, MAX_EDGE_PX / Math.max(bmp.width, bmp.height));
  const c = document.createElement("canvas");
  c.width = Math.round(bmp.width * scale); c.height = Math.round(bmp.height * scale);
  c.getContext("2d")!.drawImage(bmp, 0, 0, c.width, c.height);
  bmp.close();
  return c;
}

export async function extractFromFile(file: File, onProgress: (p: ExtractProgress) => void): Promise<ExtractResult> {
  const isPdf = file.type === "application/pdf" || /\.pdf$/i.test(file.name);
  const isImage = /^image\/(jpeg|png|webp)$/.test(file.type);
  if (!isPdf && !isImage) throw new ExtractError("type");
  if (file.size > (isPdf ? MAX_PDF_BYTES : MAX_IMAGE_BYTES)) throw new ExtractError("too_big");

  onProgress({ stage: "loading", page: 0, pages: 1, pct: 0 });
  let worker: Worker | null = null;
  const confidences: number[] = [];
  const texts: string[] = [];

  try {
    if (isImage) {
      const canvas = await imageToCanvas(file);
      worker = await makeWorker((p) => onProgress({ stage: "reading", page: 1, pages: 1, pct: p }));
      const { data } = await worker.recognize(canvas);
      texts.push(data.text); confidences.push(data.confidence);
      return finish(texts, confidences, 1);
    }

    const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
    pdfjs.GlobalWorkerOptions.workerSrc = "/ocr/pdf.worker.min.mjs";
    const doc = await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise.catch((e: { name?: string }) => {
      throw new ExtractError(e?.name === "PasswordException" ? "password" : "unreadable");
    });
    const pages = Math.min(doc.numPages, MAX_PAGES);
    for (let n = 1; n <= pages; n++) {
      onProgress({ stage: "reading", page: n, pages, pct: 0 });
      const page = await doc.getPage(n);
      let text = joinTextItems((await page.getTextContent()).items as { str?: string; hasEOL?: boolean }[]);
      if (text.length < 30) { // looks like a scan: render the page and OCR it
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width; canvas.height = viewport.height;
        await page.render({ canvas, canvasContext: canvas.getContext("2d")!, viewport }).promise;
        worker ??= await makeWorker((p) => onProgress({ stage: "reading", page: n, pages, pct: p }));
        const { data } = await worker.recognize(canvas);
        text = data.text; confidences.push(data.confidence);
      }
      texts.push(text);
    }
    return finish(texts, confidences, pages);
  } finally {
    await worker?.terminate();
  }
}

function finish(texts: string[], confidences: number[], pages: number): ExtractResult {
  const text = texts.map((t, i) => (texts.length > 1 ? `--- Page ${i + 1} ---\n` : "") + t.trim()).join("\n\n").trim();
  if (text.length < 10) throw new ExtractError("unreadable");
  const confidence = confidences.length ? Math.round(confidences.reduce((a, b) => a + b, 0) / confidences.length) : null;
  return { text, confidence, pages, lowConfidence: confidence !== null && confidence < LOW_CONFIDENCE };
}
