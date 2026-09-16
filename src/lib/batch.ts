import batch from "../../data/batch.json";

export type BrandLockCheck = { item: string; pass: boolean; note?: string };

export type Render = {
  ratio: string;
  src: string | null;
  sha256_16: string | null;
  image_model: string;
  attempts: number;
  brand_lock: { pass: boolean; verdict: string; forbidden_elements: string[]; checks: BrandLockCheck[] };
};

export type Concept = {
  id: string;
  name: string;
  track: "self-serve" | "enterprise" | string;
  tier: string;
  icp: string;
  jtbd: string;
  insight: string;
  proof: string;
  cta: string;
  copy: { primary: string; headline: string; description: string };
  kill_metric: { metric: string; threshold: string; rationale: string };
  citation: { quote: string; source: string; section: string };
  avoid: string[];
  visual: {
    director_model: string;
    concept_line: string;
    ground: string;
    accent: string;
    negative_space_pct: number;
    motif: string;
    safe_zones: string;
    brand_lock_checklist: string[];
  };
  status: string;
  renders: Render[];
};

export type Batch = {
  batch_id: string;
  generated_at: string;
  orchestrated_by: string;
  inputs: { file: string; role?: string; sha256_16: string }[];
  pipeline: {
    stage: number;
    name: string;
    provider: string;
    model?: string;
    models?: Record<string, string>;
    api?: string;
    ran_at: string;
    output: string;
    policy?: string;
    trace: string;
  }[];
  research: { bullet: string; citation: string; section: string; source: string }[];
  batch_direction: string;
  concepts: Concept[];
  push: { simulated: boolean; note: string };
};

export const getBatch = (): Batch => batch as unknown as Batch;
