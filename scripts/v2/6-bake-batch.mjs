// v2 stage 6 — bake the active batch. Archives whatever active batch exists first.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { ROOT, readStage } from "../lib/io.mjs";

const copyStage = readStage("v2-1-claude-copy.json");
const direction = readStage("v2-2-astra-direction.json");
const panels = readStage("v2-3-render-panels.json");
const composites = readStage("v2-4-composite-ads.json");
const brandLock = readStage("v2-5-brand-lock.json");

const DESTINATIONS = {
  "Get started": {
    url: "https://app.devin.ai/",
    checked_at: "2026-09-16",
    http_status: 200,
    note: "Reachable sign-in / start surface for Devin.",
  },
  "Book a demo": {
    url: "https://cognition.ai/contact",
    checked_at: "2026-09-16",
    http_status: 200,
    page_title: "Get a Demo | Cognition",
    note: "Cognition's demo request page.",
  },
};

const LABELS = { "typography-led": "Execution A · Typography", "workflow-led": "Execution B · Workflow" };

function sha16(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex").slice(0, 16);
}

const angles = copyStage.angles.map((angle) => ({
  id: angle.id,
  track: angle.id.startsWith("self-serve") ? "self-serve" : "enterprise",
  title: angle.title,
  audience: angle.audience,
  insight: angle.insight,
  hypothesis: angle.hypothesis,
  evidence: {
    source_file: "inputs/market-truth.md",
    section: angle.evidence.section,
    quote: angle.evidence.quote,
    label: angle.evidence.label,
    reading: angle.evidence.reading,
    source_url: null,
  },
  measurement: { metric: angle.success_metric, definition_note: angle.metric_note },
  executions: angle.executions.map((exec) => {
    const spec = direction.specs.find((s) => s.id === exec.id);
    const comp = composites.executions.find((c) => c.execution_id === exec.id);
    const lock = brandLock.reviews.find((r) => r.execution_id === exec.id);
    const panel = panels.panels.find((p) => p.execution_id === exec.id) ?? null;
    return {
      id: exec.id,
      angle_id: angle.id,
      label: LABELS[exec.treatment],
      treatment: exec.treatment,
      concept_line: spec.concept_line,
      ad: { ...exec.ad, destination: DESTINATIONS[exec.ad.cta] },
      meta: exec.meta,
      artifact:
        exec.artifact.kind === "illustration"
          ? {
              kind: "illustration",
              note: exec.artifact.content.note,
              steps: exec.artifact.content.steps,
              ticket: exec.artifact.content.ticket_id ? `${exec.artifact.content.ticket_id} · ${exec.artifact.content.ticket_title}` : null,
              repos: exec.artifact.content.repos,
            }
          : { kind: "none" },
      formats: Object.fromEntries(
        comp.renders.map((r) => [
          r.ratio,
          {
            src: r.src,
            file: `public${r.src}`,
            width: r.width,
            height: r.height,
            sha256_16: sha16(path.join(ROOT, "public", r.src.replace(/^\//, ""))),
          },
        ]),
      ),
      provenance: {
        copy_model: copyStage.model,
        direction_model: direction.model,
        composited_in_code: comp.composited_in_code,
        model_generated: comp.model_generated,
        panel: panel ? { image_model: panel.image_model, size: panel.size, prompt: panel.prompt, sha256_16: panel.sha256_16 } : null,
        brand_lock: lock
          ? {
              pass: lock.pass,
              verdict: lock.verdict,
              forbidden_elements: lock.forbidden_elements,
              checks: lock.checks,
              accepted_exception: lock.pass
                ? null
                : "Reviewer counts the product name 'Devin' beside the Cognition lockup as extra copy. Devin branding on the creative is a brief requirement, so the open item is accepted deliberately rather than fixed.",
            }
          : null,
      },
    };
  }),
}));

const batch = {
  schema: "devin-creative-lab/2",
  generated_at: new Date().toISOString(),
  product: { title: "Devin Creative Lab", subtitle: "Independent project · Built with Devin" },
  scope: {
    angles: angles.length,
    executions: angles.reduce((n, a) => n + a.executions.length, 0),
    formats_per_execution: ["4:5", "1:1"],
    note: "Format adaptations are the same creative, not separate concepts.",
  },
  inputs: ["inputs/cognition-brand-kit.md", "inputs/market-truth.md", "brand-refs/Cognition_PrimaryLockup_Black.png"],
  pipeline: [
    { stage: "copy", provider: "anthropic", model: copyStage.model, trace: "data/stages/v2-1-claude-copy.json" },
    { stage: "art direction", provider: "openai", api: "responses", model: direction.model, trace: "data/stages/v2-2-astra-direction.json" },
    {
      stage: "illustration panels",
      provider: "openai",
      api: "images.generations",
      model: panels.panels[0]?.image_model ?? null,
      trace: "data/stages/v2-3-render-panels.json",
    },
    { stage: "compositing", provider: "local", engine: composites.engine, typeface: composites.typeface, trace: "data/stages/v2-4-composite-ads.json" },
    { stage: "brand lock", provider: "openai", api: "responses", model: brandLock.model, trace: "data/stages/v2-5-brand-lock.json" },
  ],
  limitations: [
    "Approval is local to this browser. Nothing is published and there is no Meta integration.",
    "Rejection feedback is saved in localStorage only; the generation pipeline does not read it.",
    "Workflow graphics are illustrations, not product screenshots or execution evidence.",
    "Angles are hypotheses to test. No performance results are shown because none exist.",
  ],
  angles,
};

const activePath = path.join(ROOT, "data", "batch.json");
if (fs.existsSync(activePath)) {
  const prev = JSON.parse(fs.readFileSync(activePath, "utf8"));
  if (prev.schema !== batch.schema) {
    const archiveDir = path.join(ROOT, "data", "archive");
    fs.mkdirSync(archiveDir, { recursive: true });
    fs.writeFileSync(path.join(archiveDir, "batch-v1.json"), JSON.stringify(prev, null, 2));
    console.log("archived previous active batch -> data/archive/batch-v1.json");
  }
}
fs.writeFileSync(activePath, JSON.stringify(batch, null, 2));
console.log(`wrote data/batch.json (${batch.scope.angles} angles, ${batch.scope.executions} executions)`);
