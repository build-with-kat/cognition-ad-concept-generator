# Cognition · Creative Testing Lab

A one-off paid-creative packet for Cognition (makers of Devin). Opening `/` shows a board where the creative engine has **already run**: research, five messaging angles, and ten rendered Meta statics waiting on a human verdict. There is no Run button — the pipeline executed once, in a Devin session, and its output is baked into the repo.

## What actually ran

Devin orchestrated three models in one session against `inputs/cognition-brand-kit.md` and `inputs/market-truth.md`:

| Stage | Model | Job | Trace |
|---|---|---|---|
| 1 | `claude-opus-5` (Anthropic) | Research summary + 5 distinct messaging angles + Meta copy, kill metric and a **verbatim** market-truth citation per angle | `data/stages/1-claude-strategy.json` |
| 2 | `gpt-6-astra` (OpenAI Responses API, image-in) | Visual director only: a locked image spec per concept — layout grid, type, safe zones, ratio adaptation, Brand Lock checklist, render prompt | `data/stages/2-astra-visual-direction.json` |
| 3 | `gpt-image-2.5-sunburst` (2 heroes) · `gpt-image-2.5-flare` (3 volume) | Render each concept at 1080×1080 and 1080×1350, then Brand Lock review by `gpt-6-astra` vision | `data/stages/3-render-statics.json` |
| 4 | — | Bake everything into `data/batch.json` + `public/ads/*.png` | `data/batch.json` |

Stage 1 hard-fails if any citation is not a verbatim substring of `inputs/market-truth.md`, or if the ICP split is not 3 self-serve / 2 enterprise. Stage 3 enforces **Brand Lock: fail → discard, regenerate once, then fail that concept** — discarded renders never reach `public/ads` (they are kept in `data/discards/` for inspection). This batch: 5/5 concepts passed, one concept needed its single regeneration.

Images are generated at 1088×1088 / 1088×1360 (the image API requires dimensions divisible by 16) and downscaled to the exact Meta sizes, so the aspect ratios are exact.

### ICP split (3 / 2)

- **Self-serve (3)** — Free → Pro $20 → Max $200 IC developers: *Assign, walk away, review*; *Inspect the receipt*; *Stop rationing the agent*.
- **Enterprise (2)** — VP Eng / CTO: *Bounded autonomy*; *One playbook, many repos*. Workload pricing, never seats; no invented ROI or unverified logos.

## The board

`/` has three sections:

1. **Research** — five bullets, each beside the verbatim market-truth line it rests on.
2. **New messaging angles** — JTBD, ICP, proof, Meta copy (primary / headline / description), the **kill metric** with its threshold, the **citation**, and what the angle must never claim.
3. **Statics** — Meta-style feed previews at 1080×1080 or 1080×1350, each with **✓ Approve** and **✗ Reject**, plus **Approve all**.

**Approve is simulated.** It fires a toast — `Queued in Meta · Paused · $50 daily cap` — and writes the decision to `localStorage`. No Meta API call is made anywhere in this repo. **Reject** asks for one line of feedback and files it into taste memory (`localStorage`), which is what would steer the next batch.

## Re-running the pipeline

Only needed if you want a fresh batch; the shipped batch is committed.

```bash
export ANTHROPIC_API_KEY=...   # stage 1
export OPENAI_API_KEY=...      # stages 2-3
node scripts/1-claude-strategy.mjs
node scripts/2-astra-visual-direction.mjs
node scripts/3-render-statics.mjs
node scripts/4-bake-batch.mjs
```

Each script stops loudly if its key is missing. Drop real winning ads or Desktop crops into `inputs/winners/` and stage 2 passes them to Astra as image input.

## Develop

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
```

## Deploy to Vercel

The app is a fully static App Router build with no runtime env vars — the models were called once, in this repo's history, not at request time.

1. Push this repo to GitHub.
2. In Vercel: **Add New → Project → Import** this repo.
3. Framework preset **Next.js**; build command `npm run build`; output directory default. No environment variables are required.
4. **Deploy.**

Or from the CLI: `npx vercel` then `npx vercel --prod`.
