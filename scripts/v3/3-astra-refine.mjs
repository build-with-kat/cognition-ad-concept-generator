// v3 stage 2a — ONE focused Astra call: refine the four treatments, fully specify B1 for production.
import fs from "node:fs";
import path from "node:path";
import { readInput, writeStage, readStage, extractJson, requireEnv, ROOT } from "../lib/io.mjs";

const API_KEY = requireEnv("OPENAI_API_KEY");
const MODEL = process.env.ASTRA_MODEL ?? "gpt-6-astra";

const strategy = readStage("v3-1-claude-strategy.json");
const direction = readStage("v3-2-astra-direction.json");
const brandKit = readInput("cognition-brand-kit.md");

const b64 = (p) => `data:image/png;base64,${fs.readFileSync(path.join(ROOT, p)).toString("base64")}`;

const instruction = `You directed four Meta statics for Devin (Cognition) in a previous call. The marketer approved the STRATEGY and rejected parts of your VISUAL direction. Revise it. You are the creative director and the critic here, not a palette checker.

YOUR PREVIOUS DIRECTION (for reference — supersede it where the marketer objects):
${JSON.stringify(direction, null, 2)}

APPROVED STRATEGY (locked copy and proof — do not reopen):
${JSON.stringify(strategy.angles, null, 2)}

BRAND KIT:
${brandKit}

MARKETER'S VERDICT AND NEW LOCKS
- Plain-text "Devin" signature only. No Cognition lockup, no invented mark. AGREED with you.
- REMOVE ALL PRICING from images and Meta copy. Your Free/Pro/Max ladder is rejected: it is not first-party verified and is out of scope.
- REMOVE the projected 2-4x figure from the entire packet. Keep FE fundinfo's 10% reported capacity result OUT of the image (detail copy only, accurately attributed).
- #F7F6F5 ground, #191919 ink, black CTAs, sparse #317CFF. Legible, intentional typography, strong hierarchy.
- "Do not interpret minimalism as huge empty areas with tiny copy." Several of your frames read as empty typography cards. That is the core objection.
- Illustrative work artifacts ARE allowed. They must not masquerade as authentic product or customer evidence. No fabricated screenshots, code, PRs, quotes, results or metrics.
- A1/A2 advertise human review as the workflow; do not claim Devin can never auto-merge. Do not imply every task automatically produces passing tests.
- No customer logos and no implication that a customer endorses this independent project.

PER-CONCEPT INSTRUCTIONS FROM THE MARKETER
A1 "Hand off the dependency update. You review the PR." — Keep the message. The displaced strip is INSUFFICIENT: it just looks like task prioritisation. The visual must make three things legible: a recognisable engineering chore, that work being delegated to Devin, and a change coming back for developer review. No generic arrows, no outline document icons.
A2 "Devin opens the PR. You decide if it merges." — Keep the message. REPLACE the abstract black PR mass and the unbridged YOUR CALL gap: the audience should not need your notes to get it. Show the relationship between delegated execution and the developer's review decision. A clearly illustrative change/review artifact is acceptable. Devin's execution role must be unmistakable so this does not read as an ad for code-review software.
B1 "The feature shipped. The cleanup didn't." — Supporting proposition: use Devin for recurring engineering maintenance across repositories. Make the contrast between shipped feature work and remaining maintenance immediately recognisable. NOT acceptable: arbitrary strips of engineering words (your previous answer), stock-office imagery, robots or AI mascots, decorative 3D objects, another mostly-empty typography card. THIS IS THE VISUAL-QUALITY CHECKPOINT FOR THE WHOLE SET and the only concept being rendered now.
B2 "Devin playbooks. 1,800 repositories." — DROP the exactly-1,800-units requirement; a representative field may illustrate scale but must not imply exact encoding or completed jobs. FE fundinfo attribution must be prominent enough to read at mobile-feed size. Preserve the implementation context: FE fundinfo built custom automation to run Devin playbooks across its estate — not an out-of-the-box result.

PRODUCTION APPROACH — decide honestly, per concept
Available: gpt-image-2.5-sunburst / gpt-image-2.5-flare for meaningful visual generation, and deterministic compositing (Satori + Resvg + Sharp, Inter Regular/Medium/SemiBold) for exact text, branding, attribution and CTA. Generated imagery must never depict real product UI, code or screenshots. Do not add generated decoration merely to justify an image call; equally, do not default everything to type-only if generation genuinely makes a concept stronger.

B1 MUST BE FULLY SPECIFIED FOR PRODUCTION NOW, including a literal image-generation prompt if you want generation. The prompt must produce a background/illustrative layer only — no text, no letterforms, no numbers, no UI, no logos, no people's faces, no robots — because all text is composited afterwards. Give exact pixel geometry on a 1080x1350 canvas for every composited element, and the same for the later 1080x1080 adaptation as a deliberate recomposition (not a crop).

Return ONE JSON object, no prose outside it:
{
  "b1": {
    "central_visual_idea": "<the idea, stated so a marketer gets it without notes>",
    "how_it_communicates_the_problem": "<how the visual says something the headline does not>",
    "why_devin_role_is_clear": "<...>",
    "production": {
      "mode": "generated-layer-plus-composite" | "deterministic-only",
      "image_model": "gpt-image-2.5-sunburst" | "gpt-image-2.5-flare" | null,
      "image_prompt": "<literal prompt, or null>",
      "image_size": "1088x1360" | "1088x816" | "1024x1024" | null,
      "how_the_layer_is_used": "<placement, crop, opacity, colour treatment, how it sits under the type>"
    },
    "canvas_1080x1350": {
      "background": "<...>",
      "elements": [ { "name": "<element>", "content": "<exact text or shape description>", "font": "Inter Regular|Medium|SemiBold", "size_px": 0, "line_height_px": 0, "color": "#......", "x": 0, "y": 0, "w": 0, "h": 0, "notes": "<...>" } ]
    },
    "square_1080x1080_recomposition": "<how it is rebuilt, not cropped>",
    "legibility_at_360px": "<what must survive and how>",
    "reject_if": ["<concrete failure condition>", "..."]
  },
  "a1": { "central_visual_idea": "<...>", "revised_direction": "<short but concrete: composition, artifact, what the reader sees, production mode>", "reject_if": ["..."] },
  "a2": { "central_visual_idea": "<...>", "revised_direction": "<...>", "reject_if": ["..."] },
  "b2": { "central_visual_idea": "<...>", "revised_direction": "<...>", "reject_if": ["..."] },
  "set_logic": "<what holds the four together now>",
  "dropped_from_previous_direction": ["<what you are explicitly retracting and why>"]
}`;

const content = [
  { type: "input_text", text: instruction },
  { type: "input_image", image_url: b64("public/ads/v2/enterprise-playbook-a-1080x1350.png") },
  { type: "input_image", image_url: b64("public/ads/v2/enterprise-playbook-b-1080x1350.png") },
];

const res = await fetch("https://api.openai.com/v1/responses", {
  method: "POST",
  headers: { "content-type": "application/json", authorization: `Bearer ${API_KEY}` },
  body: JSON.stringify({ model: MODEL, input: [{ role: "user", content }], max_output_tokens: 20000 }),
});
if (!res.ok) throw new Error(`OpenAI ${res.status}: ${await res.text()}`);
const json = await res.json();
const text =
  json.output_text ??
  (json.output ?? []).flatMap((o) => o.content ?? []).map((c) => c.text ?? "").join("");
const parsed = extractJson(text);

const problems = [];
for (const k of ["b1", "a1", "a2", "b2"]) if (!parsed[k]) problems.push(`missing ${k}`);
if (parsed.b1?.production?.mode === "generated-layer-plus-composite" && !parsed.b1.production.image_prompt)
  problems.push("b1 wants generation but gave no prompt");
if (!parsed.b1?.canvas_1080x1350?.elements?.length) problems.push("b1 has no composited elements");

writeStage("v3-3-astra-refine.json", {
  stage: "creative-direction-refine",
  model: json.model,
  ran_at: new Date().toISOString(),
  usage: json.usage,
  validation: { problems },
  ...parsed,
});
console.log(problems.length ? `PROBLEMS: ${problems.join("; ")}` : "refine clean");
