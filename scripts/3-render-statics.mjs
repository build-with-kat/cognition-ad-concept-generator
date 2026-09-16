// Stage 3 — render statics with OpenAI Images (gpt-image-2.5-sunburst for heroes,
// gpt-image-2.5-flare for volume), then Brand Lock review by gpt-6-astra vision.
// Brand Lock fail -> discard, regenerate once, then fail that concept.
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { ROOT, readInput, readStage, writeStage, extractJson, requireEnv } from "./lib/io.mjs";

const API_KEY = requireEnv("OPENAI_API_KEY");
const HERO_MODEL = process.env.HERO_IMAGE_MODEL ?? "gpt-image-2.5-sunburst";
const VOLUME_MODEL = process.env.VOLUME_IMAGE_MODEL ?? "gpt-image-2.5-flare";
const JUDGE_MODEL = process.env.ASTRA_MODEL ?? "gpt-6-astra";

// gpt-image requires both dimensions divisible by 16, so render one notch up at
// the exact target aspect ratio and downscale to the Meta sizes.
const RATIOS = [
  { name: "1080x1080", gen: "1088x1088", w: 1080, h: 1080 },
  { name: "1080x1350", gen: "1088x1360", w: 1080, h: 1350 },
];

const brandKit = readInput("cognition-brand-kit.md");
const strategy = readStage("1-claude-strategy.json");
const direction = readStage("2-astra-visual-direction.json");
const outDir = path.join(ROOT, "public", "ads");
fs.mkdirSync(outDir, { recursive: true });

const FORBIDDEN = `Render as a flat vector poster: perfectly uniform solid background colour, no paper texture, no grain, no noise, no canvas fibre, no photographic lighting, no vignette, no gradient of any kind.
Absolutely forbidden: neon robots, humanoid or mascot figures, cartoon agents, purple or magenta gradients, cyberpunk glow, fake IDE windows, illegible lorem code, stock office photography, ornate serif styling, drop shadows, watermarks, signatures, extra logos, any text other than the exact strings specified, and any misspelling of the specified text.`;

async function generate(model, prompt, gen) {
  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: { Authorization: `Bearer ${API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model, prompt, size: gen, n: 1 }),
  });
  if (!res.ok) throw new Error(`images ${model} ${res.status}: ${await res.text()}`);
  const body = await res.json();
  return { buffer: Buffer.from(body.data[0].b64_json, "base64"), usage: body.usage };
}

async function brandLock(spec, angle, pngBuffer, ratioName) {
  const res = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: { Authorization: `Bearer ${API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: JUDGE_MODEL,
      instructions:
        "You are the Brand Lock reviewer for Cognition paid statics. Judge only what is visibly in the image, as a human scrolling a feed would see it. Be strict about misspelled, missing or extra text, forbidden imagery, and a clearly wrong background colour. Do NOT fail an item you cannot verify by eye (exact pixel coordinates, exact hex values, exact point sizes, percentage of negative space): mark those pass when the render is visually consistent with the intent. Reply with JSON only.",
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: `<brand-kit-forbidden>
${brandKit.split("## 4. Forbidden")[1]?.split("---")[0] ?? ""}
</brand-kit-forbidden>

Concept: ${angle.name} (${ratioName})
Required visible text, exactly and only these strings:
- headline: ${JSON.stringify(spec.layout.headline.text)}
- subline: ${JSON.stringify(spec.layout.subline?.text ?? "")}
- tag: ${JSON.stringify(spec.layout.tag?.text ?? "")}
- mark: ${JSON.stringify(spec.layout.mark?.asset ?? "")}
Ground colour must be ${spec.palette.ground}.

Checklist:
${spec.brand_lock_checklist.map((c, i) => `${i + 1}. ${c}`).join("\n")}

Return: {"checks":[{"item":"<checklist item>","pass":true|false,"note":"<short>"}],"text_rendered_correctly":true|false,"forbidden_elements":["..."],"pass":true|false,"verdict":"<one sentence>"}
pass is true only if every visually verifiable check passes, text is rendered correctly with no extra or misspelled words, and forbidden_elements is empty. Items that cannot be verified by eye must be marked pass with note "not visually verifiable".`,
            },
            { type: "input_image", image_url: `data:image/png;base64,${pngBuffer.toString("base64")}`, detail: "high" },
          ],
        },
      ],
      max_output_tokens: 6000,
    }),
  });
  if (!res.ok) throw new Error(`judge ${res.status}: ${await res.text()}`);
  const body = await res.json();
  const text =
    body.output_text ??
    (body.output ?? [])
      .flatMap((o) => o.content ?? [])
      .filter((c) => c.type === "output_text")
      .map((c) => c.text)
      .join("\n");
  return extractJson(text);
}

function renderPrompt(spec, ratio) {
  return `${spec.render_prompt}

Canvas: ${ratio.name} (${ratio.gen} render), aspect ${ratio.name === "1080x1080" ? "1:1" : "4:5"}.
Ratio adaptation: ${spec.ratio_adaptation[ratio.name] ?? ""}
Layout grid: ${spec.layout.grid}
Headline (exact text, ${spec.layout.headline.size_px}px, ${spec.layout.headline.weight}, ${spec.layout.headline.tracking} tracking, max ${spec.layout.headline.max_lines} lines): "${spec.layout.headline.text}" — ${spec.layout.headline.position}
Subline: ${spec.layout.subline?.text ? `"${spec.layout.subline.text}" — ${spec.layout.subline.position}` : "none"}
Mono tag: ${spec.layout.tag?.text ? `"${spec.layout.tag.text}" in ${spec.layout.tag.color} — ${spec.layout.tag.position}` : "none"}
Mark: ${spec.layout.mark?.asset ?? "none"} — ${spec.layout.mark?.position ?? ""}
Motif: ${spec.layout.motif}
Palette: ground ${spec.palette.ground}, ink ${spec.palette.ink}, accent ${spec.palette.accent} (${spec.palette.accent_usage}).
Type: ${spec.type_system.display}; ${spec.type_system.mono} for the mono tag. ${spec.type_system.notes}
Safe zones: ${spec.safe_zones}
Keep roughly ${spec.negative_space_pct}% of the canvas empty.
${FORBIDDEN}`;
}

const results = [];
const usage = [];

for (const spec of direction.specs) {
  const angle = strategy.angles.find((a) => a.id === spec.id);
  const model = spec.tier === "hero" ? HERO_MODEL : VOLUME_MODEL;
  const record = { id: spec.id, tier: spec.tier, image_model: model, status: "passed", renders: [] };

  for (const ratio of RATIOS) {
    let placed = null;
    for (let attempt = 1; attempt <= 2; attempt++) {
      console.log(`${spec.id} ${ratio.name} attempt ${attempt} via ${model}`);
      const { buffer, usage: u } = await generate(model, renderPrompt(spec, ratio), ratio.gen);
      usage.push({ stage: "image", id: spec.id, ratio: ratio.name, attempt, model, ...u });
      const resized = await sharp(buffer).resize(ratio.w, ratio.h, { fit: "fill" }).png().toBuffer();
      const review = await brandLock(spec, angle, resized, ratio.name);
      console.log(`  brand lock: ${review.pass ? "PASS" : "FAIL"} — ${review.verdict}`);

      if (review.pass) {
        const file = `${spec.id}-${ratio.name}.png`;
        fs.writeFileSync(path.join(outDir, file), resized);
        placed = { ratio: ratio.name, file: `/ads/${file}`, attempts: attempt, brand_lock: review };
        break;
      }
      // discarded: the failing render is never written to public/ads
      const discardDir = path.join(ROOT, "data", "discards");
      fs.mkdirSync(discardDir, { recursive: true });
      fs.writeFileSync(path.join(discardDir, `${spec.id}-${ratio.name}-attempt${attempt}.png`), resized);
      if (attempt === 2) placed = { ratio: ratio.name, file: null, attempts: 2, brand_lock: review };
    }
    record.renders.push(placed);
    if (!placed.file) record.status = "failed_brand_lock";
  }

  results.push(record);
}

writeStage("3-render-statics.json", {
  hero_model: HERO_MODEL,
  volume_model: VOLUME_MODEL,
  judge_model: JUDGE_MODEL,
  provider: "openai",
  generated_at: new Date().toISOString(),
  ratios: RATIOS.map((r) => ({ output: r.name, rendered_at: r.gen })),
  usage,
  results,
});
