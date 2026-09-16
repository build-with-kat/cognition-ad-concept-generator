// v3 stage 2c — Astra inspects the actual B1 rasters (full size + 360px feed width) and picks/corrects.
import fs from "node:fs";
import path from "node:path";
import { writeStage, readStage, extractJson, requireEnv, ROOT } from "../lib/io.mjs";

const API_KEY = requireEnv("OPENAI_API_KEY");
const MODEL = process.env.ASTRA_MODEL ?? "gpt-6-astra";
const refine = readStage("v3-3-astra-refine.json");

const b64 = (p) => `data:image/png;base64,${fs.readFileSync(path.join(ROOT, p)).toString("base64")}`;

const instruction = `You directed B1 for Devin. Two actual renders follow, in this order:
1. DETERMINISTIC execution, exactly to your spec, 1080x1350.
2. The same at 360px display width (Meta feed size).
3. GENERATED-LAYER variant, 1080x1350: the paper artifact came from gpt-image-2.5-sunburst as a text-free layer with your type composited over it.
4. That variant at 360px.

Your production spec and reject list:
${JSON.stringify(refine.b1, null, 2)}

Judge the actual pixels, not your intentions. Answer honestly; a "fail" is cheaper than a bad ad.

Evaluate for each render:
- Is the engineering problem recognisable immediately, unprompted, in about five seconds?
- Does the visual communicate something beyond the headline?
- Is Devin's role clear?
- Is it materially stronger than a mostly-empty typography card?
- Are headline, support, branding and CTA readable — at 360px too?
- Are all claims accurate, with nothing implying real product evidence, customer evidence or completed work?
- Any of your reject_if conditions triggered?

Then pick which one ships, and if the winner needs a correction, give EXACT changes to the numeric spec (element name, old value, new value). One corrective render only, so be decisive and specific. If the winner is good enough to ship, say so plainly rather than inventing polish.

Return ONE JSON object, no prose outside it:
{
  "deterministic": { "verdict": "pass" | "fail", "five_second_read": "<what a cold viewer gets>", "beyond_headline": "<...>", "devin_role": "<...>", "vs_empty_typography_card": "<...>", "legibility_360": "<...>", "claim_accuracy": "<...>", "reject_conditions_triggered": ["..."], "problems": ["..."] },
  "generated_layer": { "verdict": "pass" | "fail", "five_second_read": "<...>", "beyond_headline": "<...>", "devin_role": "<...>", "vs_empty_typography_card": "<...>", "legibility_360": "<...>", "claim_accuracy": "<...>", "reject_conditions_triggered": ["..."], "problems": ["..."] },
  "winner": "deterministic" | "generated_layer",
  "why_winner": "<...>",
  "image_generation_verdict": "<did generation earn its place in this concept, and should the other three use it>",
  "corrections": [ { "element": "<name from the spec>", "change": "<exact change>", "reason": "<...>" } ],
  "ship_without_correction": true | false
}`;

const content = [
  { type: "input_text", text: instruction },
  { type: "input_image", image_url: b64("data/proofs/b1-1080x1350.png") },
  { type: "input_image", image_url: b64("data/proofs/b1-360w.png") },
  { type: "input_image", image_url: b64("data/proofs/b1-generated-1080x1350.png") },
  { type: "input_image", image_url: b64("data/proofs/b1-generated-360w.png") },
];

const res = await fetch("https://api.openai.com/v1/responses", {
  method: "POST",
  headers: { "content-type": "application/json", authorization: `Bearer ${API_KEY}` },
  body: JSON.stringify({ model: MODEL, input: [{ role: "user", content }], max_output_tokens: 12000 }),
});
if (!res.ok) throw new Error(`OpenAI ${res.status}: ${await res.text()}`);
const json = await res.json();
const text =
  json.output_text ?? (json.output ?? []).flatMap((o) => o.content ?? []).map((c) => c.text ?? "").join("");
const parsed = extractJson(text);

writeStage("v3-6-astra-review-b1.json", {
  stage: "b1-visual-review",
  model: json.model,
  ran_at: new Date().toISOString(),
  usage: json.usage,
  reviewed: [
    "data/proofs/b1-1080x1350.png",
    "data/proofs/b1-360w.png",
    "data/proofs/b1-generated-1080x1350.png",
    "data/proofs/b1-generated-360w.png",
  ],
  ...parsed,
});
console.log("winner:", parsed.winner, "| ship as-is:", parsed.ship_without_correction);
for (const c of parsed.corrections ?? []) console.log(" -", c.element, ":", c.change);
