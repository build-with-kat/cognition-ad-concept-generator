# Devin Creative Lab

*Independent project · Built with Devin.* Not affiliated with Cognition.

A one-off paid-social creative packet for Devin. Opening `/` shows a review board where the creative work has **already run**: two messaging hypotheses, two executions each, four creatives waiting on a human verdict. There is no Run button — the pipeline executed once, in a Devin session, and its output is baked into the repo.

## Scope

| Angle | Message | Audience | CTA → destination |
|---|---|---|---|
| Self-serve | Hand off the ticket. Review the PR. | Developers delegating well-scoped engineering work | Get started → `https://app.devin.ai/` |
| Enterprise | One playbook. Many repos. | Engineering leaders owning repeatable maintenance across repositories | Book a demo → `https://cognition.ai/contact` |

Each angle has two executions — **A, typography-led** and **B, workflow-led** — and each execution ships at 1080×1350 (primary) and 1080×1080 (adaptation). That is 4 creatives and 8 files; the format adaptations are the same creative behind a toggle, not separate concepts.

Both angles are **hypotheses to test**, not proven winners. No results, savings figures, customer logos or performance claims appear anywhere, because none are supported by the inputs.

## What actually ran

Against `inputs/cognition-brand-kit.md`, `inputs/market-truth.md` and the official lockups in `brand-refs/`:

| Stage | Model / engine | Job | Trace |
|---|---|---|---|
| 1 | `claude-opus-5` (Anthropic Messages API) | Copy for the two locked angles: headline, support line, Meta primary/headline/description, buyer insight, test hypothesis, **verbatim** market-truth quote, proposed metric | `data/stages/v2-1-claude-copy.json` |
| 2 | `gpt-6-astra` (OpenAI Responses API, image-in) | Art direction only: layout, type scale, safe margins, lockup placement, CTA treatment, illustration brief, Brand Lock checklist | `data/stages/v2-2-astra-direction.json` |
| 3 | `gpt-image-2.5-sunburst` (OpenAI Images) | The two **text-free** workflow illustration panels for the B executions | `data/stages/v2-3-render-panels.json` |
| 4 | Satori + resvg + sharp (local) | Deterministic compositing of all 8 files — headline, support, official lockup and CTA are typeset in code, never generated | `data/stages/v2-4-composite-ads.json` |
| 5 | `gpt-6-astra` (vision) | Brand Lock review of the finished files against each execution's checklist | `data/stages/v2-5-brand-lock.json` |
| 6 | — | Bake `data/batch.json` + `public/ads/v2/*.png` | `data/batch.json` |

Stage 1 hard-fails if a quote is not a verbatim substring of `inputs/market-truth.md` or if an insight exceeds 20 words. Image generation is deliberately never responsible for small text or the logo: the panels are text-free and everything legible is composited from Inter (`assets/fonts/`) and the supplied `Cognition_PrimaryLockup_Black.png`. Panels are generated at dimensions divisible by 16 (an API constraint) and resized with sharp.

**Open Brand Lock item:** the reviewer marks the product name *Devin* beside the Cognition lockup as extra copy on the two typography executions. Devin branding on the creative is a requirement of the brief, so that item is accepted knowingly rather than fixed; the full verdicts are in `data/batch.json` and `data/stages/v2-5-brand-lock.json`.

## The board

Sticky header with **Approve all (4)** and a *Demo only* label, then the two angle sections. Each section has the angle title, a one-sentence buyer insight, a **Why this angle?** disclosure (insight, hypothesis, exact market-truth section and quote, the synthesis reading, and the proposed metric), and its two creative cards with a 4:5 / 1:1 toggle and a persistent approval row.

Clicking a creative opens a detail view: full-resolution preview, Meta primary/headline/description, verified destination, PNG downloads, an optional Meta feed preview, and the evidence mapping for that angle.

**Nothing is published.** Approve shows *"Approved for demo queue — nothing published"*, covers both format adaptations, and offers Undo. Reject takes one line of feedback. Approve all only touches pending executions and never overwrites a rejection. All decisions live in `localStorage` — the feedback is **saved only**; the generation pipeline does not read it. There is no Meta API call anywhere in this repo.

Proposed metrics are cost per activated signup (self-serve) and cost per qualified meeting (enterprise). Activation and qualification must be defined before launch; no kill thresholds or hypothetical results are shown.

## Archive

The earlier five-angle batch is preserved: `data/archive/batch-v1.json`, `data/archive/stages-v1/`, `public/ads/archive/`.

## Re-running the pipeline

Only needed for a fresh batch; the shipped batch is committed.

```bash
export ANTHROPIC_API_KEY=...   # stage 1
export OPENAI_API_KEY=...      # stages 2, 3, 5
node scripts/v2/1-claude-copy.mjs
node scripts/v2/2-astra-direction.mjs
node scripts/v2/3-render-panels.mjs
node scripts/v2/4-composite-ads.mjs
node scripts/v2/5-brand-lock.mjs
node scripts/v2/6-bake-batch.mjs
```

Each script stops loudly if its key is missing. `scripts/` (v1) holds the original five-angle pipeline for reference.

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
