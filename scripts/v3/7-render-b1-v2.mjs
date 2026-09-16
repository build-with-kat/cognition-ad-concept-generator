// v3 — B1 correction. One composed maintenance artifact, deterministic only (no image-model calls).
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { Resvg } from "@resvg/resvg-js";
import sharp from "sharp";
import { ROOT, writeStage } from "../lib/io.mjs";

const W = 1080;
const H = 1350;
const GROUND = "#F7F6F5";
const INK = "#191919";
const MUTED = "#6B6B6B";
const LINE = "#D9D6D2";
const ACCENT = "#317CFF";

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const base = (y, size, lh) => y + lh / 2 + size * 0.355;
const t = (c, { x, y, size, lh = size * 1.2, w = 500, color = INK, tr = 0, anchor = "start" }) =>
  c
    .split("\n")
    .map(
      (line, i) =>
        `<text x="${x}" y="${base(y + i * lh, size, lh)}" font-family="Inter" font-weight="${w}" font-size="${size}" fill="${color}" letter-spacing="${tr}" text-anchor="${anchor}">${esc(line)}</text>`,
    )
    .join("\n");

// artifact: one maintenance sheet, backed by two offset leaves so it reads as the same work repeating
// across repositories. No torn edges, no app chrome, no arrows, no status states.
const CARD = { x: 72, y: 452, w: 906, h: 512 };
const PAD = 52;
const tasks = ["Remove stale feature flags", "Update dependencies", "Fix flaky tests"];
const ROW_TOP = CARD.y + 108;
const ROW_H = 122;

const parts = [
  `<rect width="${W}" height="${H}" fill="${GROUND}"/>`,
  t("Devin", { x: 72, y: 116, size: 50, lh: 58, w: 500, tr: -0.6 }),
  t("The feature shipped.\nThe cleanup didn't.", { x: 72, y: 214, size: 86, lh: 94, w: 500, tr: -2 }),
];

for (const [i, off] of [30, 15].entries()) {
  void i;
  parts.push(
    `<rect x="${CARD.x + off}" y="${CARD.y + off}" width="${CARD.w}" height="${CARD.h}" fill="#FFFFFF" stroke="${LINE}" stroke-width="2" rx="4"/>`,
  );
}
parts.push(
  `<rect x="${CARD.x}" y="${CARD.y}" width="${CARD.w}" height="${CARD.h}" fill="#FFFFFF" stroke="${INK}" stroke-width="2.5" rx="4"/>`,
);
parts.push(
  t("RECURRING MAINTENANCE", { x: CARD.x + PAD, y: CARD.y + 44, size: 27, lh: 34, w: 500, color: MUTED, tr: 1.6 }),
);
parts.push(
  t("EVERY REPO", {
    x: CARD.x + CARD.w - PAD,
    y: CARD.y + 44,
    size: 27,
    lh: 34,
    w: 500,
    color: ACCENT,
    tr: 1.6,
    anchor: "end",
  }),
);

tasks.forEach((task, i) => {
  const top = ROW_TOP + i * ROW_H;
  parts.push(`<rect x="${CARD.x + PAD}" y="${top}" width="${CARD.w - PAD * 2}" height="2" fill="${LINE}"/>`);
  parts.push(t(task, { x: CARD.x + PAD, y: top + 32, size: 54, lh: 66, w: 500, tr: -0.8 }));
});
parts.push(
  t("Illustration", {
    x: CARD.x + CARD.w - PAD,
    y: CARD.y + CARD.h - 62,
    size: 24,
    lh: 30,
    w: 400,
    color: "#A3A09C",
    anchor: "end",
  }),
);

parts.push(
  t("Delegate recurring maintenance\nacross repos to Devin.", { x: 72, y: 1046, size: 46, lh: 56, w: 500, tr: -0.8 }),
);
parts.push(`<rect x="72" y="1194" width="352" height="84" rx="8" fill="#000000"/>`);
parts.push(
  t("Contact sales", { x: 72 + 176, y: 1194 + 21, size: 36, lh: 42, w: 500, color: "#FFFFFF", anchor: "middle" }),
);

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${parts.join("\n")}</svg>`;

const outDir = path.join(ROOT, "data", "proofs");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "b1-v2-1080x1350.svg"), svg);

const fontFiles = ["Inter-Regular.ttf", "Inter-Medium.ttf", "Inter-SemiBold.ttf"].map((f) =>
  path.join(ROOT, "assets/fonts", f),
);
const png = new Resvg(svg, {
  fitTo: { mode: "width", value: W },
  font: { fontFiles, loadSystemFonts: false, defaultFontFamily: "Inter" },
})
  .render()
  .asPng();
fs.writeFileSync(path.join(outDir, "b1-v2-1080x1350.png"), png);
const small = await sharp(png).resize({ width: 360, height: 450, fit: "fill", kernel: "lanczos3" }).png().toBuffer();
fs.writeFileSync(path.join(outDir, "b1-v2-360x450.png"), small);

writeStage("v3-7-render-b1-v2.json", {
  stage: "b1-correction",
  ran_at: new Date().toISOString(),
  mode: "deterministic-only",
  engine: "@resvg/resvg-js + sharp",
  image_model_called: null,
  cta_destination: "https://cognition.com/demo",
  content: { headline: "The feature shipped.\nThe cleanup didn't.", solution: "Delegate recurring maintenance across repos to Devin.", cta: "Contact sales", tasks },
  files: [
    { file: "data/proofs/b1-v2-1080x1350.png", sha256_16: crypto.createHash("sha256").update(png).digest("hex").slice(0, 16) },
    { file: "data/proofs/b1-v2-360x450.png" },
  ],
});
console.log("ok");
