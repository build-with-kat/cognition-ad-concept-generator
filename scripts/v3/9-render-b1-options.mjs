// v3 — render Astra's two B1 sketches. Option 1 is pure deterministic composition; option 2 uses
// exactly one image-generation call for a text-free plate, with all copy typeset in code on top.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { Resvg } from "@resvg/resvg-js";
import sharp from "sharp";
import { ROOT, readStage, writeStage, requireEnv } from "../lib/io.mjs";

const W = 1080;
const H = 1350;
const spec = readStage("v3-8-astra-b1-options.json");
const outDir = path.join(ROOT, "data", "proofs");
fs.mkdirSync(outDir, { recursive: true });

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const baseline = (y, size, lh) => y + lh / 2 + size * 0.355;
const ANCHOR = { start: "start", middle: "middle", end: "end" };

function renderElements(elements) {
  return elements
    .map((e) => {
      if (e.kind === "rect") {
        return `<rect x="${e.x}" y="${e.y}" width="${e.w}" height="${e.h}" rx="${e.radius ?? 0}" fill="${e.fill}" opacity="${e.opacity ?? 1}"/>`;
      }
      const lh = e.line_height_px ?? e.size_px * 1.2;
      return String(e.content)
        .split("\n")
        .map(
          (line, i) =>
            `<text x="${e.x}" y="${baseline(e.y + i * lh, e.size_px, lh)}" font-family="Inter" font-weight="${e.weight ?? 500}" font-size="${e.size_px}" fill="${e.color}" letter-spacing="${e.tracking_px ?? 0}" text-anchor="${ANCHOR[e.align] ?? "start"}" opacity="${e.opacity ?? 1}">${esc(line)}</text>`,
        )
        .join("\n");
    })
    .join("\n");
}

const fontFiles = ["Inter-Regular.ttf", "Inter-Medium.ttf", "Inter-SemiBold.ttf"].map((f) =>
  path.join(ROOT, "assets/fonts", f),
);

async function rasterise(svg, name) {
  const png = new Resvg(svg, {
    fitTo: { mode: "width", value: W },
    font: { fontFiles, loadSystemFonts: false, defaultFontFamily: "Inter" },
  })
    .render()
    .asPng();
  fs.writeFileSync(path.join(outDir, `${name}-1080x1350.png`), png);
  const small = await sharp(png).resize({ width: 360, height: 450, fit: "fill", kernel: "lanczos3" }).png().toBuffer();
  fs.writeFileSync(path.join(outDir, `${name}-360x450.png`), small);
  return crypto.createHash("sha256").update(png).digest("hex").slice(0, 16);
}

// ---- option 1: typography-led, deterministic ----
const o1 = spec.option1;
const svg1 = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<rect width="${W}" height="${H}" fill="${o1.background ?? "#F7F6F5"}"/>
${renderElements(o1.elements)}
</svg>`;
const sha1 = await rasterise(svg1, "b1-opt1");

// ---- option 2: one image-generation call, type composited on top ----
const o2 = spec.option2;
const API_KEY = requireEnv("OPENAI_API_KEY");
const IMAGE_MODEL = process.env.IMAGE_MODEL ?? "gpt-image-2.5-sunburst";
const res = await fetch("https://api.openai.com/v1/images/generations", {
  method: "POST",
  headers: { "content-type": "application/json", authorization: `Bearer ${API_KEY}` },
  body: JSON.stringify({ model: IMAGE_MODEL, prompt: o2.image_prompt, size: o2.image_size ?? "1088x1360", n: 1 }),
});
if (!res.ok) throw new Error(`OpenAI images ${res.status}: ${await res.text()}`);
const raw = Buffer.from((await res.json()).data[0].b64_json, "base64");
fs.writeFileSync(path.join(outDir, "b1-opt2-plate.png"), raw);
const plate = await sharp(raw).resize(W, H, { fit: "cover" }).png().toBuffer();

const p = o2.image_placement ?? { x: 0, y: 0, w: W, h: H };
const scrim =
  o2.scrim?.present && o2.scrim.shape !== "none"
    ? `<linearGradient id="s" x1="0" y1="0" x2="0" y2="1">
<stop offset="0" stop-color="${o2.scrim.color}" stop-opacity="${o2.scrim.shape === "top" ? o2.scrim.to_opacity : o2.scrim.from_opacity}"/>
<stop offset="1" stop-color="${o2.scrim.color}" stop-opacity="${o2.scrim.shape === "top" ? o2.scrim.from_opacity : o2.scrim.to_opacity}"/>
</linearGradient>`
    : "";
const svg2 = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<defs>${scrim}</defs>
<rect width="${W}" height="${H}" fill="#F7F6F5"/>
<image x="${p.x ?? 0}" y="${p.y ?? 0}" width="${p.w ?? W}" height="${p.h ?? H}" href="data:image/png;base64,${plate.toString("base64")}"/>
${scrim ? `<rect x="0" y="${o2.scrim.y}" width="${W}" height="${o2.scrim.h}" fill="url(#s)"/>` : ""}
${renderElements(o2.elements)}
</svg>`;
const sha2 = await rasterise(svg2, "b1-opt2");

// side-by-side sheet for comparison
const gap = 40;
const pad = 40;
const sheet = await sharp({
  create: { width: 360 * 2 + gap + pad * 2, height: 450 + pad * 2, channels: 3, background: "#FFFFFF" },
})
  .composite([
    { input: path.join(outDir, "b1-opt1-360x450.png"), left: pad, top: pad },
    { input: path.join(outDir, "b1-opt2-360x450.png"), left: pad + 360 + gap, top: pad },
  ])
  .png()
  .toBuffer();
fs.writeFileSync(path.join(outDir, "b1-options-side-by-side.png"), sheet);

writeStage("v3-9-render-b1-options.json", {
  stage: "b1-two-options-render",
  ran_at: new Date().toISOString(),
  option1: { mode: "deterministic-only", image_model_called: null, sha256_16: sha1, idea: o1.idea },
  option2: {
    mode: "one generated plate + deterministic type",
    image_model: IMAGE_MODEL,
    size: o2.image_size,
    sha256_16: sha2,
    idea: o2.idea,
  },
  cta: "Get a demo",
  destination: "https://cognition.com/demo",
  files: [
    "data/proofs/b1-opt1-1080x1350.png",
    "data/proofs/b1-opt1-360x450.png",
    "data/proofs/b1-opt2-1080x1350.png",
    "data/proofs/b1-opt2-360x450.png",
    "data/proofs/b1-options-side-by-side.png",
  ],
});
console.log("rendered both options");
