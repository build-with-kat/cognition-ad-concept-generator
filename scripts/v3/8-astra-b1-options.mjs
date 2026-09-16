// v3 — one Astra direction call producing two genuinely different B1 sketches:
// option 1 typographic (deterministic render), option 2 one image metaphor + composited type.
import { writeStage, readStage, readInput, extractJson, requireEnv } from "../lib/io.mjs";

const API_KEY = requireEnv("OPENAI_API_KEY");
const MODEL = process.env.ASTRA_MODEL ?? "gpt-6-astra";
const brand = readInput("cognition-brand-kit.md");
const strategy = readStage("v3-1-claude-strategy.json");
const b1 = strategy.angles.flatMap((a) => a.concepts ?? []).find((c) => c.id === "B1") ?? strategy;

const instruction = `Art-direct TWO rough sketches of the same Devin paid-social static, B1, at 1080x1350. A human marketer will pick a direction; these are sketches, not final assets.

Locked copy, identical in both options:
- Devin signature (plain text, no lockup)
- Headline: "The feature shipped.\\nThe cleanup didn't."
- Supporting line: "Delegate recurring maintenance across repos to Devin."
- CTA button: "Get a demo"
Palette: ground #F7F6F5, ink #191919, black CTA with white text, sparse #317CFF only where it earns its place. Typeface Inter (400/500/600 available).

Concept context (approved, do not reopen): enterprise engineering buyers; the feature work ships and the recurring maintenance across many repositories does not get done.
${JSON.stringify(b1).slice(0, 2500)}

Brand notes:
${brand.slice(0, 2000)}

OPTION 1 — TYPOGRAPHY-LED, rendered deterministically (no image generation).
A deliberate typographic composition with real hierarchy and tension. It must NOT be a near-empty page with a headline and a stranded button. Use scale, placement, weight, alignment, colour and negative space to embody "shipped" versus "didn't". Absolutely no paper sheets, task lists, repository grids, diagrams, icons or decorative motifs. Rules are allowed only if they carry meaning.

OPTION 2 — IMAGE-LED, exactly one image-generation call.
ONE photographic or painterly metaphor for unfinished work or residual burden. Image plus headline must land immediately, with no caption or art-direction note needed. Forbidden: UI chrome, labelled objects, legends, captions, paper stacks, workflow diagrams, robots, generic stock office imagery, generic mess, construction scenes, arbitrary drama, several metaphors at once, and any text inside the image (generated text will be discarded). You choose the composition and where the type sits; leave deliberate room for it.

Both must read at 360x450: headline first, obvious visual-to-message relationship, legible supporting line, visible CTA, and nothing that could be mistaken for a real customer screenshot or a documented result.

Return ONE JSON object and nothing else. Coordinates are absolute pixels on a 1080x1350 canvas, y measured from the top of each text's line box.

{
  "option1": {
    "idea": "<one sentence>",
    "tension_device": "<how the composition expresses shipped vs not-done>",
    "background": "#F7F6F5",
    "elements": [
      { "kind": "text", "role": "signature|headline|support|cta_label|accent_word|other",
        "content": "<exact string, \\n for line breaks>", "x": 0, "y": 0, "size_px": 0, "line_height_px": 0,
        "weight": 400, "color": "#191919", "tracking_px": 0, "align": "start|middle|end", "opacity": 1 },
      { "kind": "rect", "role": "cta_button|rule|field", "x": 0, "y": 0, "w": 0, "h": 0, "radius": 0, "fill": "#000000", "opacity": 1 }
    ],
    "why_not_empty": "<why this is not a near-empty page>",
    "read_at_360": "<what survives at feed size>"
  },
  "option2": {
    "idea": "<one sentence>",
    "metaphor": "<the single metaphor>",
    "image_prompt": "<full prompt for the image model; text-free; specify the empty region reserved for type>",
    "image_size": "1088x1360",
    "image_placement": { "mode": "full_bleed|panel", "x": 0, "y": 0, "w": 0, "h": 0 },
    "scrim": { "present": true, "shape": "top|bottom|none", "color": "#F7F6F5", "from_opacity": 0, "to_opacity": 1, "y": 0, "h": 0 },
    "elements": [ { "kind": "text", "role": "signature|headline|support|cta_label", "content": "...", "x": 0, "y": 0, "size_px": 0, "line_height_px": 0, "weight": 500, "color": "#191919", "tracking_px": 0, "align": "start", "opacity": 1 },
                  { "kind": "rect", "role": "cta_button", "x": 0, "y": 0, "w": 0, "h": 0, "radius": 8, "fill": "#000000", "opacity": 1 } ],
    "read_at_360": "<what survives at feed size>",
    "risks": ["<how this sketch could fail>"]
  }
}

Include every piece of locked copy exactly once per option, including the CTA label sitting on its button. Keep all type at least 64px inside the canvas edges.`;

const res = await fetch("https://api.openai.com/v1/responses", {
  method: "POST",
  headers: { "content-type": "application/json", authorization: `Bearer ${API_KEY}` },
  body: JSON.stringify({ model: MODEL, input: [{ role: "user", content: [{ type: "input_text", text: instruction }] }], max_output_tokens: 16000 }),
});
if (!res.ok) throw new Error(`OpenAI ${res.status}: ${await res.text()}`);
const json = await res.json();
const text = json.output_text ?? (json.output ?? []).flatMap((o) => o.content ?? []).map((c) => c.text ?? "").join("");
const parsed = extractJson(text);

const problems = [];
for (const key of ["option1", "option2"]) {
  const o = parsed[key];
  if (!o) problems.push(`missing ${key}`);
  else {
    const all = (o.elements ?? []).filter((e) => e.kind === "text").map((e) => e.content).join(" ");
    for (const s of ["Devin", "The feature shipped.", "The cleanup didn't.", "Delegate recurring maintenance", "Get a demo"]) {
      if (!all.includes(s)) problems.push(`${key}: missing copy "${s}"`);
    }
  }
}
if (parsed.option2 && !parsed.option2.image_prompt) problems.push("option2: no image prompt");

writeStage("v3-8-astra-b1-options.json", {
  stage: "b1-two-options-direction",
  model: json.model,
  ran_at: new Date().toISOString(),
  usage: json.usage,
  validation: { problems },
  ...parsed,
});
console.log(problems.length ? `problems: ${problems.join("; ")}` : "options clean");
