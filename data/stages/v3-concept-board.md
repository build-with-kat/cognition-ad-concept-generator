# Four-concept board — Stage 1 (strategy + art direction only)

Strategy: `claude-opus-5` · Direction: `gpt-6-astra` · Run 2026-09-16 · No images generated, no UI changed.
Full records: `data/stages/v3-1-claude-strategy.json`, `data/stages/v3-2-astra-direction.json`.

---

## Angle A — Self-serve · "Hand off the ticket. Review the PR."

**Insight:** Developers will delegate defined chores only if the finished work comes back inspectable and they keep the merge.
**Metric:** cost per activated signup (activation = account that starts a first Devin session; agree before launch).
**Angle evidence (OBS):** "Your job is to deliver code you have proven to work." — Simon Willison, via `buyer-creator-signals` Finding 2 · https://simonwillison.net/2025/dec/18/code-proven-to-work/
*Proves a practitioner norm that humans stay accountable; proves nothing about Devin's output quality.*

### A1 — "The dependency update" (task-led)

| | |
|---|---|
| **Audience** | Dev with a dependency-upgrade ticket carried across three sprints; knows exactly what done looks like. |
| **Buyer insight** | Practitioners already name the delegable slice: "dependency bump, small CRUD + tests, coverage on one module, reproducible bugfix, migrate deprecated API, missing docs" (`buyer-creator-signals` Finding 5 · https://ai-tldr.dev/learn/ai-coding-tools/coding-agents-assistants/cloud-coding-agents-explained/). Naming one known-delegable chore reads credible where a capability claim reads as hype. |
| **Headline** | Hand off the dependency update. / You review the PR. |
| **Support** | You write the ticket. Devin opens the PR with the diff and tests. |
| **Proof** | Product capability only (agent works in existing repos, returns a PR). No numbers. |
| **Visual direction** | *Pull one chore out of the pile.* Three flat black typographic strips — FEATURE WORK / DEPENDENCY UPDATE / BUG FIXES — with the dependency strip decisively displaced right, leaving a clean interruption in the stack. One blue edge. No ticket UI, no arrows, no icons. Plain-text "Devin" signature. All type composited in code. |
| **Reject if** | Strips read as a fake Linear board; the chore is shown checked-off/merged; the displacement isn't obvious. |
| **CTA** | Get started → https://app.devin.ai/ |

### A2 — "Show me the diff" (objection-led)

| | |
|---|---|
| **Audience** | Interested but stuck on supervision: if it works while I'm away, how do I know what changed before it hits main. |
| **Buyer insight** | "Devin hands you a finished diff to check, Claude Code lets you watch and interrupt" (r/windsurf, `buyer-creator-signals` Finding 11 · https://www.reddit.com/r/windsurf/comments/1v0vrnw/my_experience_comparing_the_pro_plans_devin_vs/). Buyers choose by review loop, not model brand. |
| **Headline** | Devin opens the PR. / You decide if it merges. |
| **Support** | Read the diff. Run the tests. You keep the merge. |
| **Proof** | Product capability: output is a PR in the existing workflow; merge stays human. |
| **Visual direction** | *An unfinished lockup.* A black mass reading **PR** stops above an oversized **YOUR CALL.** — the two nearly form one typographic object but an off-white gap and a short blue stop-rule keep them apart. The unbridged gap is the idea. No merge button, no green check, no CI chrome. |
| **Reject if** | Anything bridges the gap; a merge control or green CI appears; Devin reads as reviewing human-written code. |
| **CTA** | Get started → https://app.devin.ai/ |

---

## Angle B — Enterprise · "One playbook. Many repos."

**Insight:** Maintenance work survives every sprint; leaders need it run across many repos without adding coordination overhead.
**Metric:** cost per qualified meeting (B1); engaged case-study visits with meetings tracked downstream (B2).
**Angle evidence (INT — synthesis, not independent demand data):** "(migrations, flaky tests, dependency bumps, coverage gaps) — one playbook / many repos" — `market-truth` §2B.

### B1 — "The cleanup that stayed" (pain-led)

| | |
|---|---|
| **Audience** | Platform lead planning next quarter, watching the same upgrade/test/debt work carry over again. |
| **Buyer insight** | FE fundinfo's own description of the pressure: "security updates, dependency upgrades, testing coverage gaps, and technical debt remediation. Over time, this work began to crowd out new feature development." (https://devin.ai/customers/fefundinfo) |
| **Headline** | The feature shipped. / The cleanup didn't. |
| **Support** | Run recurring work across repos with Devin playbooks. |
| **Proof** | Playbook mechanics as described on the Ramp and FE fundinfo story pages. No figures in this concept. |
| **Visual direction** | *The missing feature, the remaining weight.* "FEATURE / SHIPPED" beside an empty slot; beneath it dense black bands — MIGRATIONS, DEPENDENCY UPGRADES, COVERAGE GAPS — repeating past the right crop. The absence is the composition; the maintenance occupies the frame. Small blue ENTERPRISE label. |
| **Reject if** | The empty slot gets filled; the first noun on any band is clipped at 360px; repetition reads as code/dashboard; any ROI or hours figure appears. |
| **CTA** | Contact sales → https://cognition.ai/contact |

### B2 — "FE fundinfo playbooks" (proof-led)

| | |
|---|---|
| **Audience** | Leader who accepts the idea but wants a comparable estate — hundreds of engineers, thousands of repos — actually operating it. |
| **Buyer insight** | Objection is scale and governance, not concept. Chosen over Ramp's 80 PRs/week and AngelList's 5.2x because 1,800 repos under one playbook system *is* this angle; the bigger numbers belong to different stories. |
| **Headline** | Devin playbooks. / 1,800 repositories. |
| **Support (on image)** | FE fundinfo reports 1,800 repositories managed with automated Devin playbooks via custom Replit apps. Source: devin.ai |
| **Proof** | REPORTED, FE fundinfo only: 1,800 repos managed with automated Devin playbooks; 10% immediate capacity increase (Meta copy only). Their 2–4x is a **projection** over 2–5 years and is labelled as such; never merged with Ramp or AngelList figures; no logo, no implied endorsement. |
| **Visual direction** | *Make the denominator visible.* A large 1,800 paired with an exactly-counted field of 1,800 identical black units — managed scope, not completed jobs. No ticks, no success colour, no network lines. Attribution set at readable size, not legal grey. |
| **Reject if** | The field isn't exactly 1,800 units or gains completion marks; attribution illegible at 360px; the figure reads as Devin-wide or typical; 10% / 2–4x added to the image. |
| **CTA** | See how FE fundinfo did it → https://devin.ai/customers/fefundinfo |

---

## What holds the set together

Astra: four engineering posters on one grammar — solid work-masses, deliberate gaps, exact type on #F7F6F5 with #191919 and one #317CFF intervention per frame. Self-serve works at the scale of one task and one decision; enterprise changes the unit to an estate. **Branding: plain-text "Devin" signature throughout — not the Cognition lockup beside a Devin wordmark**, per your note about competing marks.

## Model + asset report

- Strategy: `claude-opus-5` (Anthropic Messages API). Every research quote machine-validated verbatim against the source file — clean.
- Direction: `gpt-6-astra` (OpenAI Responses API), with the brand kit, the four briefs, the official lockup and the four previous ads as negative references.
- Image access: `gpt-image-2.5-sunburst` and `gpt-image-2.5-flare` are both listed as available on the key. **Not called.**
- Astra specified zero generated imagery — all four are deterministic type/vector composition, so Stage 2 may not need the image models at all.

## Gaps and one thing I overrode

- **Pricing:** Astra pushed a Free/Pro $20/Max $200 ladder onto the self-serve frames. Not in our verified sources (the research file explicitly says don't treat comparison-blog prices as verified) and your brief removed pricing — I'd drop it unless you confirm the numbers first-party.
- No first-party product screenshot, session or diff asset exists for this project, so no product-UI hero is possible without fabricating one.
- No Devin-specific substantiation for the control/halting/spend-cap objections in the research — those come from Cursor and Claude Code users; no such claim is made.
- No public Devin success-rate or review-survival data, so A1/A2 stay capability-framed.
- No enterprise security/governance proof in the pack (SSO, audit, isolation) — enterprise rests on workflow plus one named implementation.
- "One playbook. Many repos." is an untested hypothesis phrase, not validated buyer wording.
