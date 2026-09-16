// v3 stage 2b (variant) — one image-model render of B1's illustration layer (text-free), composited
// under the same locked type. Produced so Astra can compare it against the deterministic execution.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { Resvg } from "@resvg/resvg-js";
import sharp from "sharp";
import { ROOT, writeStage, requireEnv } from "../lib/io.mjs";

const API_KEY = requireEnv("OPENAI_API_KEY");
const MODEL = process.env.IMAGE_MODEL ?? "gpt-image-2.5-sunburst";
const SIZE = "1088x816";

const prompt = `Flat 2D editorial vector illustration, no text of any kind.
Background: uniform warm off-white #F7F6F5, no gradient, no texture, no shadow, no perspective.
Subject: three evenly spaced vertical columns of plain white paper work-sheets outlined in thin black ink.
In every column: a short paper strip at the top whose bottom edge is a ragged torn edge, then a clear gap, then a much taller sheet directly below whose top edge is the matching ragged torn edge, as if the strip was torn off it. The tall sheet has two slightly offset white backing leaves behind it, so it reads as a thick stack of remaining work.
The sheets are completely blank inside — no writing, no letters, no numbers, no lines of text, no scribbles, no icons, no checkboxes, no arrows, no logos, no user interface, no code, no people, no robots.
Style: precise flat vector, uniform thin black outlines, pure white fills, no drop shadows, no 3D, no highlights, generous even spacing, centered composition with margins on all sides.`;

const res = await fetch("https://api.openai.com/v1/images/generations", {
  method: "POST",
  headers: { "content-type": "application/json", authorization: `Bearer ${API_KEY}` },
  body: JSON.stringify({ model: MODEL, prompt, size: SIZE, n: 1 }),
});
if (!res.ok) throw new Error(`OpenAI images ${res.status}: ${await res.text()}`);
const json = await res.json();
const raw = Buffer.from(json.data[0].b64_json, "base64");

const outDir = path.join(ROOT, "data", "proofs");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "b1-panel-raw.png"), raw);

// snap near-white noise back to the exact ground so the panel sits on a flat field
const { data, info } = await sharp(raw).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const g = [0xf7, 0xf6, 0xf5];
for (let i = 0; i < data.length; i += info.channels) {
  const lum = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
  if (lum >= 236) {
    data[i] = g[0];
    data[i + 1] = g[1];
    data[i + 2] = g[2];
  }
}
const flat = await sharp(data, { raw: { width: info.width, height: info.height, channels: info.channels } })
  .png()
  .toBuffer();
const trimmed = await sharp(flat).trim({ background: "#F7F6F5", threshold: 8 }).toBuffer();
const panel = await sharp(trimmed).resize({ width: 936, height: 470, fit: "inside" }).png().toBuffer();
const pm = await sharp(panel).metadata();

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const base = (y, size, lh) => y + lh / 2 + size * 0.355;
const t = (c, x, y, size, lh, w, color = "#191919", tr = 0, anchor = "start") =>
  c
    .split("\n")
    .map(
      (line, i) =>
        `<text x="${x}" y="${base(y + i * lh, size, lh)}" font-family="Inter" font-weight="${w}" font-size="${size}" fill="${color}" letter-spacing="${tr}" text-anchor="${anchor}">${esc(line)}</text>`,
    )
    .join("");

const panelY = 470;
const panelX = 72 + Math.round((936 - pm.width) / 2);
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350" viewBox="0 0 1080 1350">
<rect width="1080" height="1350" fill="#F7F6F5"/>
${t("Devin", 72, 140, 44, 52, 500, "#191919", -0.5)}
${t("The AI software engineer", 284, 150, 30, 38, 400)}
${t("The feature shipped.\nThe cleanup didn't.", 72, 240, 76, 82, 500, "#191919", -1.5)}
${t("ILLUSTRATIVE REPOSITORY WORKLOADS", 72, 422, 27, 34, 500, "#6B6B6B", 1.4)}
<image x="${panelX}" y="${panelY}" width="${pm.width}" height="${pm.height}" href="data:image/png;base64,${panel.toString("base64")}"/>
${t("Migrations, dependency upgrades,\ncoverage gaps — across every repo.", 72, 986, 36, 44, 400)}
<rect x="72" y="1096" width="6" height="32" fill="#317CFF"/>
${t("Devin playbooks for recurring maintenance.", 96, 1092, 32, 40, 500)}
<rect x="72" y="1140" width="336" height="72" rx="8" fill="#000000"/>
${t("Contact sales", 240, 1155, 34, 42, 500, "#FFFFFF", 0, "middle")}
</svg>`;

const fontFiles = ["Inter-Regular.ttf", "Inter-Medium.ttf", "Inter-SemiBold.ttf"].map((f) =>
  path.join(ROOT, "assets/fonts", f),
);
const png = new Resvg(svg, {
  fitTo: { mode: "width", value: 1080 },
  font: { fontFiles, loadSystemFonts: false, defaultFontFamily: "Inter" },
})
  .render()
  .asPng();
fs.writeFileSync(path.join(outDir, "b1-generated-1080x1350.png"), png);
const small = await sharp(png).resize({ width: 360, kernel: "lanczos3" }).png().toBuffer();
fs.writeFileSync(path.join(outDir, "b1-generated-360w.png"), small);

writeStage("v3-5-render-b1-generated.json", {
  stage: "b1-render-variant",
  ran_at: new Date().toISOString(),
  image_model: MODEL,
  size: SIZE,
  prompt,
  panel_sha256_16: crypto.createHash("sha256").update(raw).digest("hex").slice(0, 16),
  composited_in_code: ["headline", "support", "illustration label", "capability line", "Devin signature", "CTA"],
  model_generated: ["text-free paper work-artifact illustration layer"],
  files: ["data/proofs/b1-generated-1080x1350.png", "data/proofs/b1-generated-360w.png", "data/proofs/b1-panel-raw.png"],
});
console.log("variant rendered");
