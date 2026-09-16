// Stage 4 — bake the three stage traces into data/batch.json (the file the board reads).
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { ROOT, readStage } from "./lib/io.mjs";

const strategy = readStage("1-claude-strategy.json");
const direction = readStage("2-astra-visual-direction.json");
const renders = readStage("3-render-statics.json");

const sha = (p) => crypto.createHash("sha256").update(fs.readFileSync(path.join(ROOT, p))).digest("hex").slice(0, 16);

const concepts = strategy.angles.map((angle) => {
  const spec = direction.specs.find((s) => s.id === angle.id);
  const render = renders.results.find((r) => r.id === angle.id);
  return {
    id: angle.id,
    name: angle.name,
    track: angle.track,
    tier: render.tier,
    icp: angle.icp,
    jtbd: angle.jtbd,
    insight: angle.insight,
    proof: angle.proof,
    cta: angle.cta,
    copy: angle.copy,
    kill_metric: angle.kill_metric,
    citation: { quote: angle.citation, source: "inputs/market-truth.md", section: angle.citation_section },
    avoid: angle.avoid,
    visual: {
      director_model: direction.model,
      concept_line: spec.concept_line,
      ground: spec.palette.ground,
      accent: spec.palette.accent,
      negative_space_pct: spec.negative_space_pct,
      motif: spec.layout.motif,
      safe_zones: spec.safe_zones,
      brand_lock_checklist: spec.brand_lock_checklist,
    },
    status: render.status,
    renders: render.renders.map((r) => ({
      ratio: r.ratio,
      src: r.file,
      sha256_16: r.file ? sha(path.join("public", r.file)) : null,
      image_model: render.image_model,
      attempts: r.attempts,
      brand_lock: {
        pass: r.brand_lock.pass,
        verdict: r.brand_lock.verdict,
        forbidden_elements: r.brand_lock.forbidden_elements,
        checks: r.brand_lock.checks,
      },
    })),
  };
});

const batch = {
  batch_id: `cognition-lab-${renders.generated_at.slice(0, 10)}`,
  generated_at: renders.generated_at,
  orchestrated_by: "Devin (single session, run once)",
  inputs: [
    { file: "inputs/cognition-brand-kit.md", sha256_16: sha("inputs/cognition-brand-kit.md") },
    { file: "inputs/market-truth.md", sha256_16: sha("inputs/market-truth.md") },
    ...direction.image_inputs.map((i) => ({ file: i.file, role: i.role, sha256_16: sha(i.file) })),
  ],
  pipeline: [
    {
      stage: 1,
      name: "Research + messaging",
      provider: "anthropic",
      model: strategy.model,
      ran_at: strategy.generated_at,
      output: "5 research bullets, 5 distinct angles (3 self-serve / 2 enterprise), Meta copy + kill metric + verbatim market-truth citation",
      usage: strategy.usage,
      trace: "data/stages/1-claude-strategy.json",
    },
    {
      stage: 2,
      name: "Visual direction",
      provider: "openai",
      model: direction.model,
      api: direction.api,
      ran_at: direction.generated_at,
      image_inputs: direction.image_inputs,
      output: "Locked image spec per concept: layout, type, safe zones, Brand Lock checklist, render prompt",
      usage: direction.usage,
      trace: "data/stages/2-astra-visual-direction.json",
    },
    {
      stage: 3,
      name: "Render + Brand Lock",
      provider: "openai",
      models: { hero: renders.hero_model, volume: renders.volume_model, brand_lock_judge: renders.judge_model },
      ran_at: renders.generated_at,
      ratios: renders.ratios,
      policy: "Brand Lock fail -> discard, regenerate once, then fail that concept",
      output: `${renders.results.filter((r) => r.status === "passed").length}/5 concepts passed Brand Lock`,
      trace: "data/stages/3-render-statics.json",
    },
  ],
  research: strategy.research.map((r) => ({ ...r, source: "inputs/market-truth.md" })),
  batch_direction: direction.batch_direction,
  concepts,
  push: { simulated: true, note: "Approve is a simulated Meta push: queued, paused, $50 daily cap. No Meta API call is made." },
};

fs.writeFileSync(path.join(ROOT, "data", "batch.json"), JSON.stringify(batch, null, 2));
console.log(`wrote data/batch.json — ${concepts.length} concepts, ${concepts.flatMap((c) => c.renders).filter((r) => r.src).length} statics`);
