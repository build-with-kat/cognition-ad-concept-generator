// v2 stage 3 — render the text-free illustration panels for the workflow-led executions.
// Only the illustration is model-generated; all text, the lockup and the CTA are typeset
// deterministically in stage 4.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import sharp from "sharp";
import { ROOT, readStage, writeStage, requireEnv } from "../lib/io.mjs";

const API_KEY = requireEnv("OPENAI_API_KEY");
const IMAGE_MODEL = process.env.PANEL_MODEL ?? "gpt-image-2.5-sunburst";
const SIZE = "1088x816"; // 4:3, both sides divisible by 16 as the API requires

const direction = readStage("v2-2-astra-direction.json");
const specs = direction.specs.filter((s) => s.panel?.present);
const outDir = path.join(ROOT, "data", "panels");
fs.mkdirSync(outDir, { recursive: true });

const records = [];
for (const spec of specs) {
  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: { Authorization: `Bearer ${API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: IMAGE_MODEL, prompt: spec.panel.render_prompt, size: SIZE, n: 1 }),
  });
  if (!res.ok) throw new Error(`OpenAI images ${res.status} for ${spec.id}: ${await res.text()}`);
  const body = await res.json();
  const b64 = body.data[0].b64_json;
  const buf = Buffer.from(b64, "base64");
  const file = path.join(outDir, `${spec.id}.png`);
  await sharp(buf).png().toFile(file);
  records.push({
    execution_id: spec.id,
    image_model: IMAGE_MODEL,
    size: SIZE,
    file: path.relative(ROOT, file),
    sha256_16: crypto.createHash("sha256").update(buf).digest("hex").slice(0, 16),
    prompt: spec.panel.render_prompt,
    usage: body.usage ?? null,
    role: "illustration panel only — text, lockup and CTA are composited deterministically in stage 4",
  });
  console.log(`rendered ${spec.id}`);
}

writeStage("v2-3-render-panels.json", {
  provider: "openai",
  api: "images.generations",
  generated_at: new Date().toISOString(),
  panels: records,
});
