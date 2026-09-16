// v3 stage 2b — B1 visual checkpoint: deterministic composite at 1080x1350 + 360px feed proof.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { Resvg } from "@resvg/resvg-js";
import sharp from "sharp";
import { ROOT, writeStage } from "../lib/io.mjs";
import { b1Svg, PORTRAIT } from "./lib/b1-svg.mjs";

const fontFiles = ["Inter-Regular.ttf", "Inter-Medium.ttf", "Inter-SemiBold.ttf"].map((f) =>
  path.join(ROOT, "assets/fonts", f),
);

const outDir = path.join(ROOT, "data", "proofs");
fs.mkdirSync(outDir, { recursive: true });

const svg = b1Svg(PORTRAIT);
fs.writeFileSync(path.join(outDir, "b1-1080x1350.svg"), svg);

const png = new Resvg(svg, {
  fitTo: { mode: "width", value: PORTRAIT.W },
  font: { fontFiles, loadSystemFonts: false, defaultFontFamily: "Inter" },
})
  .render()
  .asPng();

const full = path.join(outDir, "b1-1080x1350.png");
fs.writeFileSync(full, png);

const small = path.join(outDir, "b1-360w.png");
await sharp(png).resize({ width: 360, kernel: "lanczos3" }).png().toBuffer().then((b) => fs.writeFileSync(small, b));

writeStage("v3-4-render-b1.json", {
  stage: "b1-render",
  ran_at: new Date().toISOString(),
  mode: "deterministic-only (Astra's production call)",
  engine: "@resvg/resvg-js + sharp",
  typeface: "Inter (assets/fonts)",
  image_model_called: null,
  files: [
    { file: "data/proofs/b1-1080x1350.png", width: 1080, height: 1350, sha256_16: crypto.createHash("sha256").update(png).digest("hex").slice(0, 16) },
    { file: "data/proofs/b1-360w.png", width: 360 },
  ],
});
console.log("rendered", full, small);
