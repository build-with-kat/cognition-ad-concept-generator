import batch from "../../data/batch.json";

export type Destination = { url: string; checked_at: string; http_status: number; page_title?: string; note: string };

export type FormatKey = "4:5" | "1:1";

export type FormatRender = {
  src: string;
  file: string;
  width: number;
  height: number;
  sha256_16: string;
};

export type Proof = {
  type: string;
  statement: string;
  source_file: string;
  source_url: string | null;
  attribution: string;
};

export type Execution = {
  id: string;
  angle_id: string;
  label: string;
  short_label: string;
  approach: string;
  concept_line: string;
  ad: { headline: string; support: string; qualifier?: string; cta: string; destination: Destination };
  meta: { primary: string; headline: string; description: string };
  proof: Proof;
  claims_avoided: string[];
  formats: Record<FormatKey, FormatRender>;
  provenance: {
    strategy_model: string;
    direction_model: string;
    composited_in_code: string[];
    model_generated: string[];
  };
};

export type Finding = {
  id: string;
  kind: string;
  finding: string;
  quote: string;
  source_file: string;
  section: string;
  source_url: string | null;
  implication: string;
  implication_label?: string;
  label: string;
  citation: {
    label: string;
    url: string | null;
    note: string | null;
    segments?: { text: string; url: string | null }[];
  };
};

export type Angle = {
  id: string;
  track: "self-serve" | "enterprise";
  title: string;
  audience_label: string;
  audience: string;
  insight: string;
  hypothesis: string;
  evidence: {
    source_file: string;
    section: string;
    quote: string;
    label: string;
    reading: string;
    source_url: string | null;
    citation: { label: string; url: string | null };
  };
  measurement: { metric: string; definition_note: string };
  executions: Execution[];
};

export type Batch = {
  schema: string;
  generated_at: string;
  product: { title: string; subtitle: string };
  scope: { angles: number; executions: number; formats_per_execution: FormatKey[]; note: string };
  inputs: string[];
  pipeline: { stage: string; provider: string; model?: string | null; api?: string; engine?: string; typeface?: string; trace: string }[];
  research: Finding[];
  limitations: string[];
  angles: Angle[];
};

export const getBatch = (): Batch => batch as unknown as Batch;

export const allExecutions = (b: Batch): Execution[] => b.angles.flatMap((a) => a.executions);
