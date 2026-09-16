// v3 production pass — four approved concepts, portrait + deliberate square re-layout.
// Deterministic composition only: Inter via resvg, supplied Devin logo composited as a raster asset.
// No image-model calls, no strategy calls.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { Resvg } from "@resvg/resvg-js";
import sharp from "sharp";
import { ROOT, writeStage } from "../lib/io.mjs";

const GROUND = "#F7F6F5";
const INK = "#191919";
const PAPER = "#F7F6F5";
const ACCENT = "#317CFF";
const HAIR = "#D9D6D2";
const MUTED = "#6B6B6B";

const logoBuf = fs.readFileSync(path.join(ROOT, "brand-refs/brand-logo-devin.png"));
const LOGO_URI = `data:image/png;base64,${logoBuf.toString("base64")}`;
const LOGO_RATIO = 1988 / 529;

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const baseline = (y, size, lh) => y + lh / 2 + size * 0.355;

const T = (content, { x, y, size, lh = Math.round(size * 1.15), w = 500, color = INK, tr = 0, align = "start" }) =>
  String(content)
    .split("\n")
    .map(
      (line, i) =>
        `<text x="${x}" y="${baseline(y + i * lh, size, lh)}" font-family="Inter" font-weight="${w}" font-size="${size}" fill="${color}" letter-spacing="${tr}" text-anchor="${align}">${esc(line)}</text>`,
    )
    .join("\n");
const R = ({ x, y, w, h, fill, radius = 0 }) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${radius}" fill="${fill}"/>`;
const HR = (x1, x2, y, color = HAIR) => R({ x: x1, y, w: x2 - x1, h: 2, fill: color });
const LOGO = (x, y, h) => `<image x="${x}" y="${y}" width="${Math.round(h * LOGO_RATIO)}" height="${h}" href="${LOGO_URI}"/>`;
const CTA = (label, { x, y, w, h, size }) => [
  R({ x, y, w, h, fill: "#000000", radius: 8 }),
  T(label, { x: x + w / 2, y: y + (h - size * 1.24) / 2, size, lh: Math.round(size * 1.24), w: 500, color: "#FFFFFF", align: "middle" }),
];

// --- concepts -------------------------------------------------------------
// A1: task-led. The named task is the focal point, set in accent inside the headline.
const a1 = {
  portrait: () => [
    LOGO(72, 84, 52),
    T("Hand off the", { x: 72, y: 316, size: 100, lh: 112, w: 500, tr: -3 }),
    T("dependency update.", { x: 72, y: 428, size: 100, lh: 112, w: 600, tr: -3, color: ACCENT }),
    T("You review the PR.", { x: 72, y: 540, size: 100, lh: 112, w: 500, tr: -3 }),
    HR(72, 1008, 760),
    T("Devin makes the changes in your repo\nand opens a pull request.", { x: 72, y: 844, size: 42, lh: 56, w: 400, tr: -0.5 }),
    ...CTA("Get started", { x: 72, y: 1128, w: 312, h: 96, size: 38 }),
  ],
  square: () => [
    LOGO(72, 76, 46),
    T("Hand off the", { x: 72, y: 236, size: 82, lh: 92, w: 500, tr: -2.5 }),
    T("dependency update.", { x: 72, y: 328, size: 82, lh: 92, w: 600, tr: -2.5, color: ACCENT }),
    T("You review the PR.", { x: 72, y: 420, size: 82, lh: 92, w: 500, tr: -2.5 }),
    HR(72, 1008, 596),
    T("Devin makes the changes in your repo\nand opens a pull request.", { x: 72, y: 636, size: 38, lh: 50, w: 400, tr: -0.5 }),
    ...CTA("Get started", { x: 72, y: 880, w: 300, h: 92, size: 36 }),
  ],
};

// A2: control-led. Devin's line sits left, the developer's decision answers it from the right,
// separated by a single rule — the handoff is the composition, not a diagram.
const a2 = {
  portrait: () => [
    LOGO(72, 84, 52),
    T("Devin opens the PR.", { x: 72, y: 320, size: 94, lh: 106, w: 500, tr: -3 }),
    HR(72, 1008, 498),
    T("You decide", { x: 1008, y: 556, size: 94, lh: 106, w: 600, tr: -3, align: "end" }),
    T("if it merges.", { x: 1008, y: 662, size: 94, lh: 106, w: 600, tr: -3, align: "end" }),
    T("Delegate the task. Review the diff.", { x: 72, y: 900, size: 42, lh: 56, w: 400, tr: -0.5 }),
    R({ x: 72, y: 986, w: 88, h: 6, fill: ACCENT }),
    ...CTA("Get started", { x: 72, y: 1128, w: 312, h: 96, size: 38 }),
  ],
  square: () => [
    LOGO(72, 76, 46),
    T("Devin opens the PR.", { x: 72, y: 228, size: 76, lh: 86, w: 500, tr: -2.5 }),
    HR(72, 1008, 378),
    T("You decide", { x: 1008, y: 422, size: 76, lh: 86, w: 600, tr: -2.5, align: "end" }),
    T("if it merges.", { x: 1008, y: 508, size: 76, lh: 86, w: 600, tr: -2.5, align: "end" }),
    T("Delegate the task. Review the diff.", { x: 72, y: 690, size: 38, lh: 50, w: 400, tr: -0.5 }),
    R({ x: 72, y: 764, w: 80, h: 6, fill: ACCENT }),
    ...CTA("Get started", { x: 72, y: 880, w: 300, h: 92, size: 36 }),
  ],
};

// B1: approved Option 1 — the unfinished half carries more weight inside an ink field.
const b1 = {
  portrait: () => [
    LOGO(64, 72, 52),
    T("The feature shipped.", { x: 64, y: 248, size: 88, lh: 110, w: 400, tr: -3 }),
    R({ x: 0, y: 428, w: 1080, h: 424, fill: INK }),
    T("The cleanup didn't.", { x: 64, y: 568, size: 98, lh: 120, w: 600, tr: -3.5, color: PAPER }),
    T("Delegate recurring maintenance\nacross repos to Devin.", { x: 64, y: 916, size: 42, lh: 56, w: 400, tr: -0.5 }),
    ...CTA("Get a demo", { x: 64, y: 1118, w: 304, h: 104, size: 38 }),
  ],
  square: () => [
    LOGO(64, 68, 48),
    T("The feature shipped.", { x: 64, y: 214, size: 74, lh: 92, w: 400, tr: -2.5 }),
    R({ x: 0, y: 340, w: 1080, h: 300, fill: INK }),
    T("The cleanup didn't.", { x: 64, y: 434, size: 82, lh: 100, w: 600, tr: -3, color: PAPER }),
    T("Delegate recurring maintenance\nacross repos to Devin.", { x: 64, y: 700, size: 38, lh: 50, w: 400, tr: -0.5 }),
    ...CTA("Get a demo", { x: 64, y: 884, w: 296, h: 92, size: 36 }),
  ],
};

// B2: proof-led. The reported number is the artwork; attribution sits directly on it.
const b2 = {
  portrait: () => [
    LOGO(72, 84, 52),
    T("FE fundinfo", { x: 72, y: 296, size: 54, lh: 66, w: 500, tr: -1 }),
    HR(72, 1008, 384, INK),
    T("1,800", { x: 72, y: 416, size: 250, lh: 264, w: 600, tr: -10 }),
    T("repositories", { x: 72, y: 690, size: 76, lh: 88, w: 400, tr: -2, color: ACCENT }),
    T("Managed with automated Devin playbooks\nthrough custom-built tooling.", { x: 72, y: 872, size: 40, lh: 52, w: 400, tr: -0.5 }),
    T("Custom implementation, not a typical result.\nSource: Devin\u2019s FE fundinfo customer story.", { x: 72, y: 1004, size: 32, lh: 42, w: 400, color: MUTED }),
    ...CTA("See how they did it", { x: 72, y: 1152, w: 440, h: 96, size: 38 }),
  ],
  square: () => [
    LOGO(72, 76, 46),
    T("FE fundinfo", { x: 72, y: 216, size: 46, lh: 58, w: 500, tr: -1 }),
    HR(72, 1008, 292, INK),
    T("1,800", { x: 72, y: 318, size: 188, lh: 200, w: 600, tr: -8 }),
    T("repositories", { x: 72, y: 512, size: 60, lh: 72, w: 400, tr: -1.6, color: ACCENT }),
    T("Managed with automated Devin playbooks\nthrough custom-built tooling.", { x: 72, y: 642, size: 36, lh: 46, w: 400, tr: -0.5 }),
    T("Custom implementation, not a typical result.\nSource: Devin\u2019s FE fundinfo customer story.", { x: 72, y: 768, size: 28, lh: 36, w: 400, color: MUTED }),
    ...CTA("See how they did it", { x: 72, y: 890, w: 418, h: 90, size: 36 }),
  ],
};

const CONCEPTS = [
  { id: "A1", angle: "self-serve", label: "The dependency update", cta: "Get started", destination: "https://devin.ai/", build: a1 },
  { id: "A2", angle: "self-serve", label: "Show me the diff", cta: "Get started", destination: "https://devin.ai/", build: a2 },
  { id: "B1", angle: "enterprise", label: "The cleanup that stayed", cta: "Get a demo", destination: "https://cognition.com/demo#company", build: b1 },
  { id: "B2", angle: "enterprise", label: "FE fundinfo playbooks", cta: "See how they did it", destination: "https://devin.ai/customers/fefundinfo", build: b2 },
];

const FORMATS = [
  { key: "1080x1350", w: 1080, h: 1350, ratio: "4:5", pick: "portrait" },
  { key: "1080x1080", w: 1080, h: 1080, ratio: "1:1", pick: "square" },
];

const fontFiles = ["Inter-Regular.ttf", "Inter-Medium.ttf", "Inter-SemiBold.ttf"].map((f) =>
  path.join(ROOT, "assets/fonts", f),
);
const outDir = path.join(ROOT, "public", "ads", "candidates");
const proofDir = path.join(ROOT, "data", "proofs", "candidates");
fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync(proofDir, { recursive: true });

const records = [];
for (const c of CONCEPTS) {
  const renders = [];
  for (const f of FORMATS) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${f.w}" height="${f.h}" viewBox="0 0 ${f.w} ${f.h}">
<rect width="${f.w}" height="${f.h}" fill="${GROUND}"/>
${c.build[f.pick]().flat().join("\n")}
</svg>`;
    const png = new Resvg(svg, {
      fitTo: { mode: "width", value: f.w },
      font: { fontFiles, loadSystemFonts: false, defaultFontFamily: "Inter" },
    })
      .render()
      .asPng();
    const file = path.join(outDir, `${c.id}-${f.key}.png`);
    fs.writeFileSync(file, png);
    if (f.pick === "portrait") {
      const small = await sharp(png).resize({ width: 360, height: 450, fit: "fill", kernel: "lanczos3" }).png().toBuffer();
      fs.writeFileSync(path.join(proofDir, `${c.id}-360x450.png`), small);
    }
    renders.push({
      format: f.key,
      ratio: f.ratio,
      src: `/ads/candidates/${c.id}-${f.key}.png`,
      sha256_16: crypto.createHash("sha256").update(png).digest("hex").slice(0, 16),
    });
  }
  records.push({ ...c, build: undefined, renders });
}

// labelled 2x2 contact sheet
const CW = 360;
const CH = 450;
const gap = 44;
const pad = 48;
const capH = 40;
const sheetW = pad * 2 + CW * 2 + gap;
const sheetH = pad * 2 + (CH + capH) * 2 + gap;
const captions = [
  { text: "Self-serve · A1 — dependency update", col: 0, row: 0 },
  { text: "Self-serve · A2 — show me the diff", col: 1, row: 0 },
  { text: "Enterprise · B1 — cleanup that stayed", col: 0, row: 1 },
  { text: "Enterprise · B2 — FE fundinfo playbooks", col: 1, row: 1 },
];
const capSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${sheetW}" height="${sheetH}"><rect width="${sheetW}" height="${sheetH}" fill="#FFFFFF"/>${captions
  .map((c) =>
    T(c.text, {
      x: pad + c.col * (CW + gap),
      y: pad + c.row * (CH + capH + gap) + CH + 8,
      size: 18,
      lh: 24,
      w: 500,
      color: INK,
    }),
  )
  .join("")}</svg>`;
const capLayer = new Resvg(capSvg, { font: { fontFiles, loadSystemFonts: false, defaultFontFamily: "Inter" } }).render().asPng();
const sheet = await sharp(capLayer)
  .composite(
    captions.map((c, i) => ({
      input: path.join(proofDir, `${["A1", "A2", "B1", "B2"][i]}-360x450.png`),
      left: pad + c.col * (CW + gap),
      top: pad + c.row * (CH + capH + gap),
    })),
  )
  .png()
  .toBuffer();
fs.writeFileSync(path.join(proofDir, "contact-sheet.png"), sheet);

writeStage("v3-10-production-set.json", {
  stage: "production-candidates",
  ran_at: new Date().toISOString(),
  composition: "deterministic only — @resvg/resvg-js + sharp, Inter (assets/fonts), supplied brand-refs/brand-logo-devin.png",
  image_model_calls: 0,
  strategy_provenance: ["data/stages/v3-1-claude-strategy.json", "data/stages/v3-3-astra-refine.json", "data/stages/v3-8-astra-b1-options.json"],
  concepts: records,
});
console.log("production set rendered");
