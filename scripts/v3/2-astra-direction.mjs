// v3 stage 1b — ONE consolidated Astra call: creative direction for the four approved-pending concepts.
import fs from "node:fs";
import path from "node:path";
import { readInput, writeStage, extractJson, requireEnv, readStage } from "../lib/io.mjs";

const API_KEY = requireEnv("OPENAI_API_KEY");
const MODEL = process.env.ASTRA_MODEL ?? "gpt-6-astra";
const ROOT = path.resolve(import.meta.dirname, "../..");

const strategy = readStage("v3-1-claude-strategy.json");
const brandKit = readInput("cognition-brand-kit.md");

const briefs = strategy.angles.map((a) => ({
  angle: a.title,
  icp: a.icp,
  audience: a.audience,
  insight: a.insight,
  concepts: a.concepts.map((c) => ({
    id: c.id,
    name: c.name,
    approach: c.approach,
    buyer_situation: c.buyer_situation,
    objection_or_motivation: c.objection_or_motivation,
    messaging_hypothesis: c.messaging_hypothesis,
    headline: c.ad.headline,
    support: c.ad.support,
    cta: c.ad.cta,
    proof: c.proof.statement,
    proof_attribution: c.proof.attribution,
    claims_to_avoid: c.claims_to_avoid,
  })),
}));

const b64 = (p) => `data:image/png;base64,${fs.readFileSync(path.join(ROOT, p)).toString("base64")}`;

const instruction = `You are the creative director on four Meta static ads for Devin (Cognition). This is an independent portfolio project; a marketer reviews your direction before anything is rendered.

BRAND KIT (authoritative):
${brandKit}

AVAILABLE ASSETS: official Cognition primary lockup, black and white PNG (attached). Inter Regular/Medium/SemiBold. No product screenshots, no session recordings, no customer logos, no photography budget, no illustrator. Anything else must be constructed from type, shape and colour, or generated — and generated imagery must not depict real product UI, code or screenshots.

BRANDING RULE: do not place a small "Cognition" lockup and a small "Devin" wordmark beside each other as competing marks. Choose one: the official Cognition lockup, or plain text "Devin" set in Inter. Say which and why.

FOUR STRATEGY BRIEFS:
${JSON.stringify(briefs, null, 2)}

ATTACHED NEGATIVE REFERENCES: four ads from the previous round of this project. They are generic — centred headline slabs and grey outline workflow diagrams with arrows and document icons. Do not repeat that solution.

DIRECT THE WORK. For each of the four concepts decide:
- what the intended buyer recognises in the first half second,
- what the image says that the headline does not,
- what makes it feel specific to Devin rather than to any AI tool,
- the central visual idea (a real idea, not a layout description),
- composition and hierarchy at 1080x1350,
- typography (Inter weights, relative scale, line breaks, alignment),
- branding treatment and placement,
- CTA treatment,
- which source assets are needed, and which parts must be composited deterministically in code rather than generated, so that text, the lockup and the CTA are exact,
- concrete failure conditions: what would make you reject the render.

Do not force the four into fixed categories, do not prescribe whitespace percentages, and do not default to arrows and outline document icons. The four must look like a considered set, not four unrelated ads: state what holds them together and what deliberately differs between the self-serve pair and the enterprise pair.

Also note anything at 360px display width (a Meta feed card) that would break.

Return ONE JSON object, no prose outside it:
{
  "set_logic": { "shared": "<what unifies all four>", "self_serve_vs_enterprise": "<what deliberately differs>" },
  "concepts": [
    {
      "id": "<concept id>",
      "first_half_second": "<what the buyer recognises>",
      "beyond_the_headline": "<what the visual adds>",
      "why_devin_specific": "<...>",
      "central_visual_idea": "<...>",
      "composition": "<1080x1350 composition and hierarchy>",
      "typography": "<Inter weights, scale relationships, line breaks, alignment>",
      "branding": { "treatment": "cognition-lockup | devin-wordmark", "placement": "<...>", "why": "<...>" },
      "cta": "<treatment and placement>",
      "assets": { "generated": ["<what, if anything, an image model should produce — or empty>"], "composited_in_code": ["<text, lockup, CTA, rules...>"] },
      "small_size_risk": "<what breaks at 360px and the mitigation>",
      "reject_if": ["<concrete failure condition>", "..."]
    }
  ]
}`;

const content = [
  { type: "input_text", text: instruction },
  { type: "input_image", image_url: b64("brand-refs/Cognition_PrimaryLockup_Black.png") },
  { type: "input_image", image_url: b64("public/ads/v2/self-serve-handoff-a-1080x1350.png") },
  { type: "input_image", image_url: b64("public/ads/v2/self-serve-handoff-b-1080x1350.png") },
  { type: "input_image", image_url: b64("public/ads/v2/enterprise-playbook-a-1080x1350.png") },
  { type: "input_image", image_url: b64("public/ads/v2/enterprise-playbook-b-1080x1350.png") },
];

const res = await fetch("https://api.openai.com/v1/responses", {
  method: "POST",
  headers: { "content-type": "application/json", authorization: `Bearer ${API_KEY}` },
  body: JSON.stringify({ model: MODEL, input: [{ role: "user", content }], max_output_tokens: 16000 }),
});
if (!res.ok) throw new Error(`OpenAI ${res.status}: ${await res.text()}`);
const json = await res.json();
const text =
  json.output_text ??
  (json.output ?? [])
    .flatMap((o) => o.content ?? [])
    .map((c) => c.text ?? "")
    .join("");
const parsed = extractJson(text);

const ids = strategy.angles.flatMap((a) => a.concepts.map((c) => c.id));
const got = (parsed.concepts ?? []).map((c) => c.id);
const missing = ids.filter((i) => !got.includes(i));

writeStage("v3-2-astra-direction.json", {
  stage: "creative-direction",
  model: json.model,
  ran_at: new Date().toISOString(),
  usage: json.usage,
  validation: { missing_concepts: missing },
  ...parsed,
});

if (missing.length) {
  console.error("MISSING CONCEPTS:", missing.join(", "));
  process.exitCode = 2;
} else {
  console.log("all four concepts directed");
}
