// Copies self-hosted OCR/PDF assets into public/ocr so the browser never contacts a CDN (spec S2).
// Run after installing dependencies: pnpm setup:ocr  (needs network once, for the language data).
import { cpSync, existsSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { gzipSync } from "node:zlib";
import path from "node:path";

try {
const require = createRequire(import.meta.url);
const out = path.resolve("public/ocr");
mkdirSync(out, { recursive: true });

const tessDir = path.dirname(require.resolve("tesseract.js/package.json"));
cpSync(path.join(tessDir, "dist/worker.min.js"), path.join(out, "worker.min.js"));

const coreDir = path.dirname(require.resolve("tesseract.js-core/package.json", { paths: [tessDir] }));
for (const f of readdirSync(coreDir).filter((f) => /-lstm\.wasm\.js$/.test(f))) cpSync(path.join(coreDir, f), path.join(out, f));

const pdfDir = path.dirname(require.resolve("pdfjs-dist/package.json"));
cpSync(path.join(pdfDir, "legacy/build/pdf.worker.min.mjs"), path.join(out, "pdf.worker.min.mjs"));

// Language data (fast models). Downloaded once, stored gzipped as tesseract.js expects.
for (const lang of ["eng", "hin"]) {
  const dest = path.join(out, `${lang}.traineddata.gz`);
  if (existsSync(dest)) continue;
  const res = await fetch(`https://raw.githubusercontent.com/tesseract-ocr/tessdata_fast/main/${lang}.traineddata`);
  if (!res.ok) throw new Error(`Failed to download ${lang}: ${res.status}`);
  writeFileSync(dest, gzipSync(Buffer.from(await res.arrayBuffer())));
}
console.log("OCR assets ready in public/ocr");

} catch (e) {
  console.warn("setup-ocr: could not prepare OCR assets (" + e.message + "). Photo/PDF input will not work until you run: pnpm setup:ocr");
}
