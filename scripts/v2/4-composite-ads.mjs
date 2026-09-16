// v2 stage 4 — deterministic compositing.
// Every word of ad copy, the official Cognition lockup and the CTA button are typeset in code
// (Inter via satori -> resvg), so no image model is responsible for text or logo fidelity.
// The workflow-led executions inset the text-free illustration panel rendered in stage 3.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import sharp from "sharp";
import { ROOT, readStage, writeStage } from "../lib/io.mjs";

const FORMATS = [
  { key: "1080x1350", w: 1080, h: 1350, ratio: "4:5", type: 1, space: 1, panelMaxH: 430 },
  { key: "1080x1080", w: 1080, h: 1080, ratio: "1:1", type: 1, space: 0.8, panelMaxH: 300 },
];

const fonts = [
  { name: "Inter", weight: 400, style: "normal", data: fs.readFileSync(path.join(ROOT, "assets/fonts/Inter-Regular.ttf")) },
  { name: "Inter", weight: 500, style: "normal", data: fs.readFileSync(path.join(ROOT, "assets/fonts/Inter-Medium.ttf")) },
  { name: "Inter", weight: 600, style: "normal", data: fs.readFileSync(path.join(ROOT, "assets/fonts/Inter-SemiBold.ttf")) },
];

const copyStage = readStage("v2-1-claude-copy.json");
const direction = readStage("v2-2-astra-direction.json");
const panelStage = readStage("v2-3-render-panels.json");

const MUTED = "#6B6B6B";
const WEIGHT = { regular: 400, medium: 500, semibold: 600 };

const el = (type, props = {}, children) => ({ type, props: { ...props, children } });

function dataUri(buf) {
  return `data:image/png;base64,${buf.toString("base64")}`;
}

async function lockupUri(asset) {
  return dataUri(fs.readFileSync(path.join(ROOT, "brand-refs", asset)));
}

// The image model leaves faint tonal noise in nominally flat areas. Everything lighter than the
// threshold is snapped back to the exact ground colour so the panel sits on a perfectly uniform field.
async function flatten(buffer, ground) {
  const { data, info } = await sharp(buffer).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const g = [parseInt(ground.slice(1, 3), 16), parseInt(ground.slice(3, 5), 16), parseInt(ground.slice(5, 7), 16)];
  for (let i = 0; i < data.length; i += info.channels) {
    const lum = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
    if (lum >= 232) {
      data[i] = g[0];
      data[i + 1] = g[1];
      data[i + 2] = g[2];
      data[i + 3] = 255;
    }
  }
  return sharp(data, { raw: { width: info.width, height: info.height, channels: info.channels } }).png().toBuffer();
}

async function panelAsset(executionId, ground, targetW, maxH) {
  const rec = panelStage.panels.find((p) => p.execution_id === executionId);
  if (!rec) throw new Error(`no panel rendered for ${executionId}`);
  const flat = await flatten(fs.readFileSync(path.join(ROOT, rec.file)), ground);
  const trimmed = await sharp(flat).trim({ background: ground, threshold: 6 }).toBuffer();
  const meta = await sharp(trimmed).metadata();
  const k = Math.min(targetW / meta.width, maxH / meta.height);
  const w = Math.round(meta.width * k);
  const h = Math.round(meta.height * k);
  const resized = await sharp(trimmed).resize({ width: w, height: h, fit: "inside" }).png().toBuffer();
  return { uri: dataUri(resized), width: w, height: h, source: rec.file, sha256_16: rec.sha256_16 };
}

function headlineBlock(text, spec, t) {
  return el(
    "div",
    { style: { display: "flex", flexDirection: "column" } },
    text.split("\n").map((line, i) =>
      el(
        "div",
        {
          key: String(i),
          style: {
            fontSize: Math.round(spec.headline.size_px * t),
            fontWeight: WEIGHT[spec.headline.weight] ?? 500,
            lineHeight: spec.headline.leading ?? 1.02,
            letterSpacing: `${spec.headline.tracking_px ?? -2}px`,
            color: spec.ink,
          },
        },
        line,
      ),
    ),
  );
}

async function buildTree({ spec, exec, format, panel }) {
  const t = format.type;
  const s = format.space;
  const margin = Math.round(spec.margin_px * s);
  const lockupH = spec.lockup.height_px ?? 48;
  const brand = el("div", { style: { display: "flex", alignItems: "center", gap: 72 } }, [
    el("img", { key: "lk", src: await lockupUri(spec.lockup.asset), height: lockupH, width: Math.round(lockupH * 2.4) }),
    el(
      "div",
      {
        key: "nm",
        style: { fontSize: Math.round(lockupH * 0.62), fontWeight: 500, color: spec.ink, letterSpacing: "-0.5px" },
      },
      "Devin",
    ),
  ]);

  const support = exec.ad.support
    ? el(
        "div",
        {
          style: {
            fontSize: Math.round(spec.support.size_px * t),
            fontWeight: WEIGHT[spec.support.weight] ?? 400,
            color: spec.support.color === "ink" ? spec.ink : spec.support.color === "accent" ? "#317CFF" : MUTED,
            marginTop: Math.round(32 * s),
            maxWidth: 890,
            lineHeight: 1.35,
          },
        },
        exec.ad.support,
      )
    : null;

  const steps = exec.artifact?.content?.steps ?? [];
  const artifactNote = exec.artifact?.kind === "illustration" ? exec.artifact.content.note : "";
  const panelBlock = panel
    ? el("div", { style: { display: "flex", flexDirection: "column", marginTop: Math.round(56 * s) } }, [
        el("img", { key: "p", src: panel.uri, width: panel.width, height: panel.height }),
        steps.length
          ? el(
              "div",
              {
                key: "s",
                style: {
                  display: "flex",
                  gap: Math.round(18 * s),
                  marginTop: Math.round(28 * s),
                  fontSize: 24,
                  color: MUTED,
                  letterSpacing: "0.2px",
                },
              },
              steps.flatMap((label, i) => [
                el("div", { key: `l${i}` }, label),
                i < steps.length - 1 ? el("div", { key: `a${i}`, style: { color: "#B9B7B4" } }, "→") : null,
              ]),
            )
          : null,
        artifactNote
          ? el(
              "div",
              { key: "n", style: { marginTop: Math.round(20 * s), fontSize: 19, color: "#9A9894" } },
              artifactNote,
            )
          : null,
      ])
    : null;

  const cta = el(
    "div",
    {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: spec.cta.height_px ?? 96,
        paddingLeft: 52,
        paddingRight: 52,
        background: spec.ground === "#191919" ? "#FFFFFF" : "#000000",
        color: spec.ground === "#191919" ? "#191919" : "#FFFFFF",
        borderRadius: 10,
        fontSize: spec.cta.size_px ?? 32,
        fontWeight: 500,
        letterSpacing: "-0.2px",
      },
    },
    exec.ad.cta,
  );

  return el(
    "div",
    {
      style: {
        width: format.w,
        height: format.h,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: spec.ground,
        padding: margin,
        fontFamily: "Inter",
      },
    },
    [
      el("div", { key: "top", style: { display: "flex", marginBottom: Math.round(40 * s) } }, [brand]),
      el("div", { key: "mid", style: { display: "flex", flexDirection: "column" } }, [
        headlineBlock(exec.ad.headline, spec, t),
        support,
        panelBlock,
      ]),
      el("div", { key: "bot", style: { display: "flex", marginTop: Math.round(48 * s) } }, [cta]),
    ],
  );
}

const outDir = path.join(ROOT, "public", "ads", "v2");
fs.mkdirSync(outDir, { recursive: true });

const executions = copyStage.angles.flatMap((a) => a.executions.map((e) => ({ angle: a, exec: e })));
const records = [];

for (const { angle, exec } of executions) {
  const spec = direction.specs.find((s) => s.id === exec.id);
  if (!spec) throw new Error(`no spec for ${exec.id}`);
  const renders = [];
  for (const format of FORMATS) {
    const panel = spec.panel?.present
      ? await panelAsset(
          exec.id,
          spec.ground,
          Math.round((format.w - spec.margin_px * 2 * format.space) * 0.96),
          format.panelMaxH,
        )
      : null;
    const tree = await buildTree({ spec, exec, format, panel });
    const svg = await satori(tree, { width: format.w, height: format.h, fonts, embedFont: true });
    const png = new Resvg(svg, { fitTo: { mode: "width", value: format.w } }).render().asPng();
    const buf = await sharp(png).resize(format.w, format.h, { fit: "fill" }).png().toBuffer();
    const file = path.join(outDir, `${exec.id}-${format.key}.png`);
    fs.writeFileSync(file, buf);
    renders.push({
      format: format.key,
      ratio: format.ratio,
      src: `/ads/v2/${exec.id}-${format.key}.png`,
      width: format.w,
      height: format.h,
      sha256_16: crypto.createHash("sha256").update(buf).digest("hex").slice(0, 16),
      panel_source: panel ? panel.source : null,
    });
    console.log(`composited ${exec.id} ${format.key}`);
  }
  records.push({
    execution_id: exec.id,
    angle_id: angle.id,
    treatment: exec.treatment,
    composited_in_code: ["headline", "support", "official Cognition lockup", "product name Devin", "CTA button"],
    model_generated: spec.panel?.present ? ["illustration panel (text-free)"] : [],
    renders,
  });
}

writeStage("v2-4-composite-ads.json", {
  engine: "satori + @resvg/resvg-js",
  typeface: "Inter 4.1 (assets/fonts)",
  generated_at: new Date().toISOString(),
  note: "All text and logo pixels are deterministic; only workflow-led illustration panels come from an image model.",
  executions: records,
});
