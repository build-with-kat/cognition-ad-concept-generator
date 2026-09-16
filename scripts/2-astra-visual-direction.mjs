// Stage 2 — gpt-6-astra acts as visual director only (OpenAI Responses API).
// Image-in when inputs/winners/* exist; brand lockups are always passed as visual truth.
import fs from "node:fs";
import path from "node:path";
import { ROOT, readInput, readStage, writeStage, extractJson, requireEnv } from "./lib/io.mjs";

const API_KEY = requireEnv("OPENAI_API_KEY");
const MODEL = process.env.ASTRA_MODEL ?? "gpt-6-astra";

const brandKit = readInput("cognition-brand-kit.md");
const strategy = readStage("1-claude-strategy.json");

const HERO_IDS = strategy.angles.slice(0, 2).map((a) => a.id); // 2 heroes, 3 volume

function imageParts(dir, label) {
  const abs = path.join(ROOT, dir);
  if (!fs.existsSync(abs)) return [];
  return fs
    .readdirSync(abs)
    .filter((f) => /\.(png|jpg|jpeg|webp)$/i.test(f))
    .map((f) => ({
      file: `${dir}/${f}`,
      label,
      part: {
        type: "input_image",
        image_url: `data:image/${f.split(".").pop().toLowerCase() === "png" ? "png" : "jpeg"};base64,${fs
          .readFileSync(path.join(abs, f))
          .toString("base64")}`,
        detail: "high",
      },
    }));
}

const winners = imageParts("inputs/winners", "winner reference");
const lockups = imageParts("brand-refs", "official Cognition lockup");
const refs = [...winners, ...lockups];

const instructions = `You are the visual director for a Cognition (Devin) paid-social static batch.
You do not write copy and you do not render. You emit a locked image specification that a rendering model must follow literally.
The attached images are ${winners.length ? "prior winning creative and " : ""}official Cognition lockups: treat them as visual truth, never as ads to copy.`;

const prompt = `<brand-kit>
${brandKit}
</brand-kit>

<concepts>
${JSON.stringify(
  strategy.angles.map((a) => ({
    id: a.id,
    name: a.name,
    track: a.track,
    icp: a.icp,
    proof: a.proof,
    cta: a.cta,
    headline: a.copy.headline,
    description: a.copy.description,
    tier: HERO_IDS.includes(a.id) ? "hero" : "volume",
  })),
  null,
  2,
)}
</concepts>

Return ONE JSON object, no prose outside it:

{
  "batch_direction": "2-3 sentences: how these five statics read as one system and how they differ",
  "specs": [
    {
      "id": "<concept id, all five, same order>",
      "tier": "hero" | "volume",
      "concept_line": "one sentence describing what the viewer sees",
      "layout": {
        "grid": "explicit description of the composition grid and margins in px on a 1080x1080 canvas",
        "headline": { "text": "<exact headline string from the concept, unchanged>", "position": "...", "size_px": <int>, "weight": "regular|medium", "tracking": "tight|normal", "max_lines": <int> },
        "subline": { "text": "<short supporting line or empty string>", "position": "...", "size_px": <int> },
        "tag": { "text": "<short all-caps mono tag or empty string>", "color": "#317CFF", "position": "..." },
        "mark": { "asset": "Cognition three-circle mark or DEVIN wordmark", "position": "...", "height_px": <int>, "clearspace_px": <int> },
        "motif": "the single non-type visual element, or 'none' — never a fake IDE, never a mascot"
      },
      "palette": { "ground": "#F7F6F5" | "#000000", "ink": "...", "accent": "#317CFF", "accent_usage": "where the single accent appears" },
      "type_system": { "display": "clean grotesque sans, Inter-like", "mono": "Geist Mono / IBM Plex Mono", "notes": "..." },
      "safe_zones": "explicit: no critical type in the top 10% or bottom 10% of the canvas; state the px bands for 1080x1080 and 1080x1350",
      "ratio_adaptation": { "1080x1080": "how the layout sits in the square", "1080x1350": "what gains the extra 270px of height" },
      "negative_space_pct": <int 40-70>,
      "brand_lock_checklist": ["7-10 binary, checkable statements a reviewer can verify by looking at the render"],
      "render_prompt": "The literal prompt for the image model. Describe an editorial typographic poster. Spell out every word of visible text in quotes and state that no other text may appear. State the exact background hex, ink hex, accent hex and where each is used. Forbid: neon robots, mascots, humanoid figures, purple or magenta gradients, cyberpunk glow, fake IDE windows, lorem code, stock office photography, extra logos, watermarks, misspellings."
    }
  ]
}

Rules:
- Default ground is #F7F6F5. At most ONE of the five specs may use a #000000 ground, and it must be an enterprise concept.
- Typographic first: one headline, optional one subline, optional mark or DEVIN wordmark, one small accent tag.
- Heroes may carry one restrained non-type motif; volume statics stay pure type + mark.
- Every spec must differ structurally (alignment, scale, mark placement, motif), not just in wording.
- No ornate serifs, no busy photography, no purple.`;

const content = [{ type: "input_text", text: prompt }, ...refs.map((r) => r.part)];

const res = await fetch("https://api.openai.com/v1/responses", {
  method: "POST",
  headers: { Authorization: `Bearer ${API_KEY}`, "Content-Type": "application/json" },
  body: JSON.stringify({
    model: MODEL,
    instructions,
    input: [{ role: "user", content }],
    max_output_tokens: 20000,
  }),
});

if (!res.ok) throw new Error(`OpenAI ${res.status}: ${await res.text()}`);
const body = await res.json();
const text =
  body.output_text ??
  (body.output ?? [])
    .flatMap((o) => o.content ?? [])
    .filter((c) => c.type === "output_text")
    .map((c) => c.text)
    .join("\n");
const parsed = extractJson(text);

const ids = strategy.angles.map((a) => a.id);
const specIds = parsed.specs.map((s) => s.id);
if (specIds.length !== 5 || ids.some((id) => !specIds.includes(id))) {
  throw new Error(`spec/concept mismatch: ${specIds.join(",")}`);
}
const darkGrounds = parsed.specs.filter((s) => s.palette.ground.toLowerCase() === "#000000");
if (darkGrounds.length > 1) throw new Error(`too many dark grounds: ${darkGrounds.map((s) => s.id).join(",")}`);

writeStage("2-astra-visual-direction.json", {
  model: MODEL,
  provider: "openai",
  api: "responses",
  generated_at: new Date().toISOString(),
  image_inputs: refs.map((r) => ({ file: r.file, role: r.label })),
  usage: body.usage,
  ...parsed,
});
