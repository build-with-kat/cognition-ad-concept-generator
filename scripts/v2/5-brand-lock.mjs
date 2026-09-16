// v2 stage 5 — Brand Lock. gpt-6-astra looks at the finished composites and checks them
// against its own per-execution checklist. Results stay in the data files, never in the UI.
import fs from "node:fs";
import path from "node:path";
import { ROOT, readStage, writeStage, extractJson, requireEnv } from "../lib/io.mjs";

const API_KEY = requireEnv("OPENAI_API_KEY");
const MODEL = process.env.ASTRA_MODEL ?? "gpt-6-astra";

const direction = readStage("v2-2-astra-direction.json");
const composites = readStage("v2-4-composite-ads.json");

const results = [];
for (const exec of composites.executions) {
  const spec = direction.specs.find((s) => s.id === exec.execution_id);
  const images = exec.renders.map((r) => ({
    type: "input_image",
    image_url: `data:image/png;base64,${fs.readFileSync(path.join(ROOT, "public", r.src.replace(/^\//, ""))).toString("base64")}`,
    detail: "high",
  }));

  const prompt = `Review the two attached finished statics (first 1080x1350, then 1080x1080) for execution "${exec.execution_id}".

Checklist:
${spec.brand_lock_checklist.map((c, i) => `${i + 1}. ${c}`).join("\n")}

Judge only what is visually verifiable. Do not fail an item because an exact pixel value or percentage cannot be measured by eye.
Return ONE JSON object: {"pass": true|false, "verdict": "<2 sentences>", "checks": [{"item": "<checklist item>", "pass": true|false, "note": "<short>"}], "forbidden_elements": ["<anything present that the brand kit forbids, else empty>"]}`;

  const res = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: { Authorization: `Bearer ${API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      instructions: "You are the Brand Lock reviewer for Cognition paid social. Be strict but only about what is visible.",
      input: [{ role: "user", content: [{ type: "input_text", text: prompt }, ...images] }],
      max_output_tokens: 8000,
    }),
  });
  if (!res.ok) throw new Error(`OpenAI ${res.status} for ${exec.execution_id}: ${await res.text()}`);
  const body = await res.json();
  const text =
    body.output_text ??
    (body.output ?? []).flatMap((o) => o.content ?? []).filter((c) => c.type === "output_text").map((c) => c.text).join("\n");
  const parsed = extractJson(text);
  results.push({ execution_id: exec.execution_id, model: MODEL, ...parsed });
  console.log(`${exec.execution_id}: ${parsed.pass ? "PASS" : "FAIL"}`);
}

writeStage("v2-5-brand-lock.json", {
  model: MODEL,
  provider: "openai",
  api: "responses",
  generated_at: new Date().toISOString(),
  reviews: results,
});
