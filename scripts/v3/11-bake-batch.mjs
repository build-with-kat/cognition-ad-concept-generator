// Promotes the approved candidate creatives to live assets and bakes data/batch.json (schema 3).
// No model calls: copy, citations and provenance are read from the recorded stage files.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

const CHECKED = "2026-09-16";
const liveDir = path.join(ROOT, "public/ads/live");
const archiveDir = path.join(ROOT, "public/ads/archive");
fs.mkdirSync(liveDir, { recursive: true });
fs.mkdirSync(archiveDir, { recursive: true });
fs.mkdirSync(path.join(ROOT, "data/archive"), { recursive: true });

// archive the previous live set + batch
if (fs.existsSync(path.join(ROOT, "public/ads/v2"))) {
  fs.cpSync(path.join(ROOT, "public/ads/v2"), path.join(archiveDir, "v2"), { recursive: true });
  fs.rmSync(path.join(ROOT, "public/ads/v2"), { recursive: true, force: true });
}
const prevBatch = path.join(ROOT, "data/batch.json");
const archivedBatch = path.join(ROOT, "data/archive/batch-v2.json");
if (fs.existsSync(prevBatch) && !fs.existsSync(archivedBatch)) {
  fs.copyFileSync(prevBatch, archivedBatch);
}

const fmtOf = (id, key) => {
  const rel = `ads/live/${id}-${key}.png`;
  const from = path.join(ROOT, "public/ads/candidates", `${id}-${key}.png`);
  const to = path.join(ROOT, "public", rel);
  fs.copyFileSync(from, to);
  const buf = fs.readFileSync(to);
  const [width, height] = key.split("x").map(Number);
  return {
    src: `/${rel}`,
    file: `public/${rel}`,
    width,
    height,
    sha256_16: crypto.createHash("sha256").update(buf).digest("hex").slice(0, 16),
  };
};

const formats = (id) => ({ "4:5": fmtOf(id, "1080x1350"), "1:1": fmtOf(id, "1080x1080") });

const dest = (url, note) => ({ url, checked_at: CHECKED, http_status: 200, note });

const PROVENANCE = {
  strategy_model: "claude-opus-5",
  direction_model: "gpt-6-astra",
  composited_in_code: ["headline", "supporting line", "supplied Devin logo", "CTA button", "attribution and qualifier"],
  model_generated: [],
};

const research = [
  {
    id: "buyer",
    kind: "Buyer observation",
    finding: "Developers describe delegation in terms of a receipt they can inspect: the human stays accountable for proving the code works.",
    quote: "Your job is to deliver code you have proven to work.",
    source_file: "inputs/buyer-creator-signals-2026-09-15.md",
    section: "Finding 2 — Trust language = receipt / proof / junior-shaped review",
    source_url: "https://simonwillison.net/2025/dec/18/code-proven-to-work/",
    implication: "Both self-serve statics keep the merge decision with the developer instead of promising autonomy.",
    label: "OBS",
  },
  {
    id: "format",
    kind: "Competitive format observation",
    finding: "Cognition's sampled Meta inventory is video/creator with comment-to-DM; the static, copy-led slot that competitors dominate is open.",
    quote: "Cognition ~110 active; sampled cards overwhelmingly video with comment-to-DM. Viktor ~650 active; static/templated claim cards dominate.",
    source_file: "inputs/competitive-campaign-signals-2026-09-15.md",
    section: "Finding 1 — static DR is the gap",
    source_url: null,
    implication: "All four concepts are statics with a direct site CTA rather than a comment bridge.",
    label: "OBS",
  },
  {
    id: "proof",
    kind: "Customer proof",
    finding: "FE fundinfo reports running automated Devin playbooks across approximately 1,800 active repositories, via automation it built itself.",
    quote: "1,800 — repositories managed with automated Devin playbooks via custom Replit apps",
    source_file: "inputs/customer-stories-2026-09.md",
    section: "FE fundinfo customer story",
    source_url: "https://devin.ai/customers/fefundinfo",
    implication: "The enterprise angle gets one named implementation at estate scale (B2) alongside the pain-led execution (B1).",
    label: "REPORTED",
  },
];

const angles = [
  {
    id: "self-serve-handoff",
    track: "self-serve",
    title: "Hand off the ticket. Review the PR.",
    audience: "Developers weighing whether to delegate defined engineering tasks inside existing repositories.",
    insight: "Developers will delegate defined chores only if the finished work comes back inspectable and they keep the merge.",
    hypothesis:
      "If a static names one recognisable chore and states plainly that the developer still reads the diff and owns the merge, it will convert better than generic 'AI software engineer' framing on cost per activated signup.",
    evidence: {
      source_file: "inputs/buyer-creator-signals-2026-09-15.md",
      section: "Finding 2 — Trust language = receipt / proof / junior-shaped review",
      quote: "Your job is to deliver code you have proven to work.",
      label: "OBS",
      reading:
        "It evidences a practitioner norm that the human stays accountable for proving code works, which is why 'you keep the merge' should resonate; it says nothing about whether Devin's output is correct.",
      source_url: "https://simonwillison.net/2025/dec/18/code-proven-to-work/",
    },
    measurement: {
      metric: "Cost per activated signup",
      definition_note:
        "Agree before launch that an activated signup means a new account that starts a first Devin session, not an email captured on the signup page.",
    },
    executions: [
      {
        id: "A1",
        angle_id: "self-serve-handoff",
        label: "A1 · The dependency update",
        approach: "task-led",
        concept_line: "One named chore is the focal point; the accent colour carries the task itself.",
        ad: {
          headline: "Hand off the dependency update.\nYou review the PR.",
          support: "Devin makes the changes in your repo and opens a pull request.",
          cta: "Get started",
          destination: dest("https://devin.ai/", "Devin product site."),
        },
        meta: {
          primary:
            "A dependency update is the kind of ticket that has a clear definition of done.\nHand it to Devin. It works in your repo and opens a pull request.\nYou read the diff and decide whether it merges.",
          headline: "Hand off the dependency update.",
          description: "You still review the PR.",
        },
        proof: {
          type: "product-capability",
          statement:
            "Devin is positioned as an agent that plans, writes and ships code inside existing codebases and toolchains, returning a pull request.",
          source_file: "inputs/cognition-company-context.md",
          source_url: null,
          attribution: "none — product capability",
        },
        claims_avoided: [
          "no success-rate, time-saved or cost-per-ticket figure",
          "no promise that dependency updates come back correct, tested or merge-ready",
          "no 'no supervision' or 'no coding required' framing",
        ],
        formats: formats("A1"),
        provenance: PROVENANCE,
      },
      {
        id: "A2",
        angle_id: "self-serve-handoff",
        label: "A2 · Show me the diff",
        approach: "review/control-led",
        concept_line: "Call and response across a rule: Devin's action on the left, the developer's decision answering it on the right.",
        ad: {
          headline: "Devin opens the PR.\nYou decide if it merges.",
          support: "Delegate the task. Review the diff.",
          cta: "Get started",
          destination: dest("https://devin.ai/", "Devin product site."),
        },
        meta: {
          primary:
            "The worry is not speed. It is whether the change is right.\nDevin does the work in your repo and opens a pull request you can read: the diff, the tests, the session.\nYou review it the way you would review a teammate, and you own the merge.",
          headline: "What changed? Show me the diff.",
          description: "Devin ships it. You merge it.",
        },
        proof: {
          type: "product-capability",
          statement:
            "Devin's output is a pull request in the team's existing workflow, with sessions the engineer can open. This execution promotes the review-before-merge workflow; it is not a claim that Devin can never merge automatically.",
          source_file: "inputs/cognition-brand-kit.md",
          source_url: "https://devin.ai/",
          attribution: "none — product capability",
        },
        claims_avoided: [
          "not positioned as a tool for reviewing human-written code — Devin is the author here",
          "no claim that a green CI run means the change is correct",
          "no claim that Devin's diffs are always small or merge-ready",
        ],
        formats: formats("A2"),
        provenance: PROVENANCE,
      },
    ],
  },
  {
    id: "enterprise-playbook",
    track: "enterprise",
    title: "One playbook. Many repos.",
    audience: "Engineering and platform leaders accountable for maintenance spread across a large repository estate.",
    insight: "Maintenance work survives every sprint; leaders need it run across many repos without adding coordination overhead.",
    hypothesis:
      "If the creative names the leftover maintenance work and frames Devin as one repeatable playbook pointed at many repositories, it will produce cheaper qualified meetings than capability or fleet-of-agents messaging.",
    evidence: {
      source_file: "inputs/customer-stories-2026-09.md",
      section: "FE fundinfo customer story — why they started",
      quote:
        "security updates, dependency upgrades, testing coverage gaps, and technical debt remediation. Over time, this work began to crowd out new feature development.",
      label: "REPORTED",
      reading:
        "One named company describing maintenance crowding out feature work supports the pain framing; it is not evidence that this is universal or that Devin clears such backlogs.",
      source_url: "https://devin.ai/customers/fefundinfo",
    },
    measurement: {
      metric: "Cost per qualified meeting",
      definition_note:
        "Agree before launch that a qualified meeting means a held conversation with a leader who owns multi-repo maintenance; judge the customer-proof execution on engaged case-study visits with meetings tracked downstream.",
    },
    executions: [
      {
        id: "B1",
        angle_id: "enterprise-playbook",
        label: "B1 · The cleanup that stayed",
        approach: "pain-led",
        concept_line: "Typographic contrast: the shipped line sits light on the ground, the unfinished work outweighs it inside an ink band.",
        ad: {
          headline: "The feature shipped.\nThe cleanup didn't.",
          support: "Delegate recurring maintenance across repos to Devin.",
          cta: "Get a demo",
          destination: dest("https://cognition.com/demo#company", "Cognition demo request form."),
        },
        meta: {
          primary:
            "The migration landed. The deprecated calls, the flaky tests and the dependency upgrades did not.\nPoint one Devin playbook at that recurring work, across the repositories that need it.\nYour engineers review the pull requests.",
          headline: "One playbook. Many repos.",
          description: "Maintenance work, delegated.",
        },
        proof: {
          type: "product-capability",
          statement:
            "Devin playbooks — standardized prompts attached to recurring tasks — can be triggered across repositories, as described in the mechanics sections of the published customer stories.",
          source_file: "inputs/customer-stories-2026-09.md",
          source_url: "https://devin.ai/customers/ramp",
          attribution: "none — product capability",
        },
        claims_avoided: [
          "no ROI, capacity, hours-saved or cost figure",
          "no claim that maintenance runs without human review",
          "no headcount-reduction framing, pricing or customer logos",
        ],
        formats: formats("B1"),
        provenance: PROVENANCE,
      },
      {
        id: "B2",
        angle_id: "enterprise-playbook",
        label: "B2 · FE fundinfo playbooks",
        approach: "customer-proof-led",
        concept_line: "The reported number is the artwork, with the customer's name attached directly above it.",
        ad: {
          headline: "FE fundinfo\n1,800 repositories.",
          support: "Managed with automated Devin playbooks through custom-built tooling.",
          qualifier: "Custom implementation, not a typical result. Source: Devin\u2019s FE fundinfo customer story.",
          cta: "See how they did it",
          destination: dest("https://devin.ai/customers/fefundinfo", "The FE fundinfo customer story this ad cites."),
        },
        meta: {
          primary:
            "FE fundinfo reports running automated Devin playbooks across all 1,800 of its active code repositories.\nThe orchestration around it — finding repositories that need work, triggering sessions, tracking progress — is tooling FE fundinfo built itself.\nTheir engineers stay in review on anything beyond low-risk changes.",
          headline: "Devin playbooks. 1,800 repos.",
          description: "FE fundinfo's reported implementation.",
        },
        proof: {
          type: "customer-result",
          statement:
            "\"1,800 — repositories managed with automated Devin playbooks via custom Replit apps\" (reported scope). The story describes an automation system FE fundinfo built with Replit that finds repositories needing updates, triggers Devin sessions, tracks progress and handles errors, auto-merging low-risk changes.",
          source_file: "inputs/customer-stories-2026-09.md",
          source_url: "https://devin.ai/customers/fefundinfo",
          attribution:
            "FE fundinfo, as published on its devin.ai customer story page. Scope is FE fundinfo's own estate — 200+ engineers, approximately 1,800 active code repositories. FE fundinfo has not endorsed this independent project.",
        },
        claims_avoided: [
          "1,800 is the repository count under management, not completed migrations",
          "no 10% capacity figure and no 2–4x projection in this execution",
          "not presented as a typical or guaranteed outcome, and not as out-of-the-box automation",
          "no customer logo and no implied endorsement",
        ],
        formats: formats("B2"),
        provenance: PROVENANCE,
      },
    ],
  },
];

const batch = {
  schema: "devin-creative-lab/3",
  generated_at: new Date().toISOString(),
  product: { title: "Devin Creative Lab", subtitle: "Independent project · Built with Devin" },
  scope: {
    angles: 2,
    executions: 4,
    formats_per_execution: ["4:5", "1:1"],
    note: "Format adaptations are deliberate re-layouts of the same creative, not separate concepts.",
  },
  inputs: [
    "inputs/buyer-creator-signals-2026-09-15.md",
    "inputs/competitive-campaign-signals-2026-09-15.md",
    "inputs/cognition-brand-kit.md",
    "inputs/cognition-company-context.md",
    "inputs/customer-stories-2026-09.md",
    "inputs/market-truth.md",
    "brand-refs/brand-logo-devin.png",
  ],
  pipeline: [
    { stage: "strategy", provider: "anthropic", model: "claude-opus-5", trace: "data/stages/v3-1-claude-strategy.json" },
    { stage: "art direction", provider: "openai", api: "responses", model: "gpt-6-astra", trace: "data/stages/v3-2-astra-direction.json" },
    { stage: "direction critique", provider: "openai", api: "responses", model: "gpt-6-astra", trace: "data/stages/v3-3-astra-refine.json" },
    {
      stage: "image-generation experiment (rejected, not in the final ads)",
      provider: "openai",
      api: "images.generations",
      model: "gpt-image-2.5-sunburst",
      trace: "data/stages/v3-8-astra-b1-options.json",
    },
    {
      stage: "final composition",
      provider: "local",
      engine: "@resvg/resvg-js + sharp",
      typeface: "Inter (assets/fonts)",
      trace: "data/stages/v3-10-production-set.json",
    },
  ],
  research,
  limitations: [
    "Approval is local to this browser. Nothing is published and there is no Meta integration.",
    "Rejection feedback is saved in localStorage only; it is not read by any model and trains nothing.",
    "No performance data is shown because none exists — these are test candidates, not results.",
    "Every pixel in the four finished ads is composed in code from the supplied Devin logo and Inter; none of them contains generated imagery.",
    "FE fundinfo's reported figures describe its own estate and its own custom automation. FE fundinfo has not endorsed this project.",
  ],
  angles,
};

fs.writeFileSync(path.join(ROOT, "data/batch.json"), `${JSON.stringify(batch, null, 2)}\n`);
console.log("baked data/batch.json ·", batch.angles.flatMap((a) => a.executions).length, "executions");
