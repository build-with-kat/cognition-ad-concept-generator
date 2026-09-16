# Devin Creative Lab

*Independent project · Built with Devin.* Not affiliated with Cognition.

A one-off paid-social creative packet for Devin. Opening `/` shows a review board where the creative work has **already run**: two messaging hypotheses, two executions each, four creatives waiting on a human verdict. There is no Run button — the pipeline executed once, in a Devin session, and its output is baked into the repo.

## Scope

| Angle | Message | Audience | CTA → destination |
|---|---|---|---|
| Self-serve | Hand off the ticket. Review the PR. | Developers delegating well-scoped engineering work | Get started → `https://devin.ai/` |
| Enterprise | One playbook. Many repos. | Engineering leaders owning repeatable maintenance across repositories | Get a demo → `https://cognition.com/demo#company` · See how they did it → `https://devin.ai/customers/fefundinfo` |

Four executions: **A1** the dependency update (task-led), **A2** show me the diff (review/control-led), **B1** the cleanup that stayed (pain-led), **B2** FE fundinfo playbooks (customer-proof-led). Each ships at 1080×1350 (primary) and 1080×1080, the square a deliberate re-layout rather than a crop. That is 4 creatives and 8 files; the format adaptations are the same creative behind a toggle, not separate concepts.

Both angles are **hypotheses to test**, not proven winners. No results, savings figures, customer logos or performance claims appear anywhere, because none are supported by the inputs.

## What actually ran

Against the research files in `inputs/` and the supplied Devin logo in `brand-refs/`:

| Stage | Model / engine | Job | Trace |
|---|---|---|---|
| 1 | `claude-opus-5` (Anthropic Messages API) | Strategy: two angles, four concepts, Meta copy, buyer insight, **verbatim** research quotes, proposed metric, claims to avoid | `data/stages/v3-1-claude-strategy.json` |
| 2 | `gpt-6-astra` (OpenAI Responses API) | Art direction for the four executions | `data/stages/v3-2-astra-direction.json` |
| 3 | `gpt-6-astra` | Direction critique and refinement after the first treatments were rejected | `data/stages/v3-3-astra-refine.json`, `v3-8-astra-b1-options.json` |
| 4 | `gpt-image-2.5-sunburst` (OpenAI Images) | One image-generation experiment for the enterprise pain concept — **reviewed and rejected**, not used in any finished ad | `data/stages/v3-5-render-b1-generated.json`, `v3-9-render-b1-options.json` |
| 5 | resvg + sharp (local) | Deterministic composition of all 8 finished files in Inter over the supplied logo — no generated pixels | `data/stages/v3-10-production-set.json` |
| 6 | — | Bake `data/batch.json` + `public/ads/live/*.png` | `data/batch.json` |

Stage 1 hard-fails if a quote is not a verbatim substring of its source file. No model renders text or the logo: everything legible is typeset in code from Inter (`assets/fonts/`) over the supplied `brand-refs/brand-logo-devin.png`.

The four finished ads contain **no generated imagery**. They have no measured performance, and the rejection feedback saved in the board does not train anything.

## The board

Sticky header with **Approve all (4)** and a *Demo only* label, then the two angle sections. Each section has the angle title, a one-sentence buyer insight, a **Why this angle?** disclosure (insight, hypothesis, exact market-truth section and quote, the synthesis reading, and the proposed metric), and its two creative cards with a 4:5 / 1:1 toggle and a persistent approval row.

Clicking a creative opens a detail view: full-resolution preview, Meta primary/headline/description, verified destination, PNG downloads, an optional Meta feed preview, and the evidence mapping for that angle.

**Nothing is published.** Approve shows *"Approved for demo queue — nothing published"*, covers both format adaptations, and offers Undo. Reject takes one line of feedback. Approve all only touches pending executions and never overwrites a rejection. All decisions live in `localStorage` — the feedback is **saved only**; the generation pipeline does not read it. There is no Meta API call anywhere in this repo.

Proposed metrics are cost per activated signup (self-serve) and cost per qualified meeting (enterprise). Activation and qualification must be defined before launch; no kill thresholds or hypothetical results are shown.

## Archive

Earlier batches are preserved: `data/archive/batch-v1.json`, `data/archive/batch-v2.json`, `data/archive/stages-v1/`, `public/ads/archive/`. Rejected B1 explorations (pencil, paper stack) remain in `data/stages/` as archived experiments only.

## Re-running the pipeline

Only needed for a fresh batch; the shipped batch is committed.

```bash
export ANTHROPIC_API_KEY=...   # strategy
export OPENAI_API_KEY=...      # direction
node scripts/v3/1-claude-strategy.mjs
node scripts/v3/2-astra-direction.mjs
node scripts/v3/10-production-set.mjs   # no model calls
node scripts/v3/11-bake-batch.mjs       # no model calls
```

Each model script stops loudly if its key is missing; production and bake need no keys. `scripts/` (v1) and `scripts/v2/` hold the earlier pipelines for reference.

## Develop

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
```

## Deploy to Vercel

Fully static App Router build with no runtime env vars — the models were called once, in this repo's history, not at request time.

1. Push this repo to GitHub.
2. In Vercel: **Add New → Project → Import** this repo.
3. Framework preset **Next.js**; build command `npm run build`; output directory default. No environment variables required.
4. **Deploy.**

Or from the CLI: `npx vercel` then `npx vercel --prod`.
