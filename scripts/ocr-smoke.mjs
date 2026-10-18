// Smoke test of the OCR engine and language data in Node (the browser path uses the same assets).
import { createWorker } from "tesseract.js";
const w = await createWorker(["eng", "hin"], 1, { langPath: "public/ocr", gzip: true, cacheMethod: "none" });
const { data } = await w.recognize(process.argv[2] ?? "/tmp/letter.png");
console.log("confidence:", Math.round(data.confidence));
console.log(data.text.trim());
await w.terminate();
