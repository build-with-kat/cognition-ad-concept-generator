# Buyer–creator signals — Cognition (Devin)

**Access date:** 2026-09-15 (America/New_York)  
**Scope:** Cognition / Devin only — public sources  
**Role use:** Paid Media Marketer — Meta static creative tests  
**Stance:** Deepen seeded frame (delegate bounded work → inspect receipt); do not redo company context  
**Answer status:** Answer.AI Jan 2025 = **dated trust-debt** only — not a current product benchmark

---

## How to read

| Tag | Meaning |
|-----|---------|
| **OBS** | Direct observation / quotation from a cited public source |
| **CLAIM** | Interpretation grounded in OBS; confidence noted |
| **INT** | Inference for creative / positioning — not evidence of purchase intent |

**Rules for this artifact**
- Engagement, hiring, funding, or case-study logos ≠ purchase intent.
- Partner / SEO / competitor-adjacent comparison guides are labeled; they are not independent buyer diaries.
- Pricing, ACU, merge-rate, or ROI figures appear only when a cited source states them — **never invent numbers for Meta**.
- X quotes are transcribed from a signed-in browser pass on 2026-09-15 (visible first-page cards only); not an exhaustive index.
- Reddit browser pass completed 2026-09-15 (signed-out UI, no captcha; visible posts/comments only) — ScrapeCreators API still 402; see Access limitations.

**Seeded frame (deepen, don’t contradict)**
- Market shift: “AI replaces developers” → **delegate bounded work, then inspect the receipt**.
- Credible Devin shape: senior-level codebase understanding + junior parallel execution — not autonomous senior judgment.
- Objections seed: unpredictable success; merged PR ≠ good PR; interactive feels safer; cost predictability; need diffs / CI / recordings / review time.
- Message territories seed: context back (ticket→tested PR); backlog parallelism; don’t trust demo—inspect proof; modernization economics; understand repo before changing (DeepWiki→PR).

---

## Findings (12)

### Finding 1 — Category nouns are settled: cloud / background / async agent = ticket → PR

| Field | Content |
|-------|---------|
| **OBS** | AI/TLDR (updated 2026-06-13): cloud coding agent = async / background agent that “goes off to a fresh remote machine… and comes back later with a finished pull request”; local = “pair programmer,” cloud = “ticket-taker”; “You don't babysit it. You delegate, walk away, and check the result when it's ready.” · https://ai-tldr.dev/learn/ai-coding-tools/coding-agents-assistants/cloud-coding-agents-explained/ · category explainer · access 2026-09-15 |
| **OBS** | BuildMVPFast (2026-07-04): “You’re a dispatcher.” Agents own a ticket end-to-end; output is “a branch and a PR, not a suggestion in your editor.” · https://www.buildmvpfast.com/blog/background-coding-agents-async-parallel-team-2026 · practitioner-flavored agency blog · access 2026-09-15 |
| **OBS (X)** | Trylions: “cloud agent = async GitHub-native coding worker, not a renamed chat sidebar” — research repo, plan, ephemeral env, tests/linters, open/iterate toward a PR; distinct from IDE agent mode; bounded session. · https://x.com/Trylions/status/2099890997488500757 · X browser pass 2026-09-15 |
| **CLAIM** | High confidence — Buyers share category vocabulary that matches the seeded Devin frame: **delegate → walk away → review PR**. Meta can lead with category nouns before brand. |
| **INT** | Headline nouns: *async PR*, *background agent*, *dispatcher*, *ticket → PR*, *async GitHub-native worker*. |

---

### Finding 2 — Trust language = receipt / proof / junior-shaped review — not autonomy theater

| Field | Content |
|-------|---------|
| **OBS** | Simon Willison (2025-12-18): “Your job is to deliver code you have proven to work.” Giant untested PRs = “dereliction of duty”; humans own accountability. · https://simonwillison.net/2025/dec/18/code-proven-to-work/ · practitioner newsletter · access 2026-09-15 |
| **OBS** | Addy Osmani (2026-06-15): hard part moved from writing to “deciding whether to trust it”; agent PR reviewer can be “the first human being to ever lay eyes on this code”; require evidence before review (intent, diff size, test output, proof it ran). · https://addyosmani.com/blog/agentic-code-review/ · practitioner blog · access 2026-09-15 |
| **OBS** | BuildMVPFast: “Review the PR like it came from a junior”; nastiest failure = **test rewrite** (behavior + assertions rewritten to stay green). · same URL Finding 1 |
| **OBS** | HN Devin user (cloudking, Ramp thread): Devin can “send you a screen recording of the working feature with a PR.” · https://news.ycombinator.com/item?id=46589842 · HN practitioner · access 2026-09-15 |
| **OBS (X)** | decipherx: “keep the first patch and the reviewed patch. how many generated lines survive review is the number i want beside every coding agent benchmark.” · https://x.com/stacktrace01/status/2099982839530050022 · X browser pass 2026-09-15 |
| **CLAIM** | High confidence — Market trust language = **receipt / proof / evidence / junior review / don’t rubber-stamp green CI / review-survival**. Aligns with seeded “inspect the receipt” and “merged ≠ good.” |
| **INT** | Avoid “fully autonomous senior engineer.” Prefer: *inspect the receipt*, *prove it works*, *review like a sharp intern*, *diffs + CI + recording*, *lines that survive review*. |

---

### Finding 3 — Dominant comparison frame: operate (Cursor / Claude Code) vs delegate (Devin / cloud teammate)

| Field | Content |
|-------|---------|
| **OBS** | Matt Abrams / Builder.io (2026-01-06): “With Claude, you operate; with Devin, you delegate.” Claude = continuous local loop; Devin = task assignment, hosted env, phased checkpoints, DeepWiki indexing. · https://www.builder.io/blog/devin-vs-claude-code · competitor-adjacent · access 2026-09-15 |
| **OBS** | Snowman Labs (2026-07-16, **official Cognition partner**): Cursor agents “belong to the developer”; Devin agents “belong to the organization”; individual coding speed vs organizational throughput. · https://snowmanlabs.com/insights/devin-vs-cursor · partner / vendor-adjacent · access 2026-09-15 |
| **OBS** | HN `deet` (customer, Cognition SWE-2 thread ~5 days before access): Devin among “best cloud-hosted, team-managed coding agents”; different starting place than Claude Code / Codex as “individually controlled single-developer tools”; “team-focus.” · https://news.ycombinator.com/item?id=49647006 · HN · access 2026-09-15 · note: self-disclosed AI-coworker startup bias |
| **CLAIM** | Medium–high — Comparison discourse consistently uses **operate vs delegate / local vs cloud / developer-owned vs org-owned**. Useful for Meta contrast without win-rate claims. |
| **INT** | Phrases: *assign and walk away*, *you operate / it executes*, *org backlog not just your editor*, *pair vs ticket*. |

---

### Finding 4 — Objections that still dominate (category + dated Devin trust-debt)

| Field | Content |
|-------|---------|
| **OBS** | **Answer.AI (2025-01-08) — dated trust-debt:** 14 failures / 3 successes / 3 inconclusive of 20 tasks; “couldn’t discern any pattern to predict which tasks would work”; salvage time worse than starting over; preferred Cursor-style incremental control. Quotes: tasks so small “I may as well do them myself”; larger tasks “likely fail.” · https://www.answer.ai/posts/2025-01-08-devin · **historical objection language only — not a 2026 product claim** · access 2026-09-15 |
| **OBS** | Ask HN (~4 months before access): cloud agents “way too expensive” for side projects; data protection / integration lacking; “badly advertised”; local wins on trust/latency; blank-canvas setup cost; datacenter IPs blocked. · https://news.ycombinator.com/item?id=47862274 · HN Ask · access 2026-09-15 |
| **OBS** | Sean Kim on Copilot cloud agent (2026-05-19): self-review can praise “focused” shortcuts while solving the wrong problem — “polish-versus-intent.” · https://blog.imseankim.com/github-copilot-coding-agent-3-months-model-picker-self-review-cli-handoff-review/ · competitor practitioner · access 2026-09-15 |
| **OBS** | Addy Osmani: review duration / churn / volume outrunning humans — verification bottleneck. · same Finding 2 |
| **CLAIM** | High for objection cluster; medium for “still true of Devin 2026 specifically” (product may have matured; objections persist at category level). Cluster: **unpredictable task fit**, **interactive feels safer**, **setup/integration tax**, **metered cost fear**, **review bandwidth**, **green PR ≠ correct intent**. |
| **INT** | Pre-empt in copy: scoped chores only; human owns merge; show receipt artifacts; cost as *per outcome / per ticket* — never invented $ figures. If Answer.AI appears in discourse, label **Jan 2025 trust-debt**. |

---

### Finding 5 — “Good async work” vocabulary is specific (delegable backlog nouns)

| Field | Content |
|-------|---------|
| **OBS** | AI/TLDR good async tasks: dependency bump, small CRUD + tests, coverage on one module, reproducible bugfix, migrate deprecated API, missing docs. Bad: redesign auth, “why is it slow,” “make UI nicer.” Heuristic: well-scoped, verifiable, self-contained. · Finding 1 URL |
| **OBS** | BuildMVPFast: flaky test, dependency bump, missing null check; skill that appreciates = **scoping and reviewing**, not prompting. · Finding 1 URL |
| **OBS** | Codegen / Fastio / Builder comparisons repeatedly list migrations, dependency updates, test coverage, ticket-driven backlog for Devin-shaped work (mixed independence). |
| **CLAIM** | High for category; medium for Devin exclusivity — Practitioners already name the **delegable backlog slice**. Meta can mirror those nouns without claiming Devin-only capability. |
| **INT** | Phrase bank: *dependency bump*, *flaky test*, *well-scoped ticket*, *migration step*, *definition of done*, *verifiable chore*. |

---

### Finding 6 — DeepWiki / “understand before changing” is Cognition-native (vendor-strong; independent thin; X adds freshness nuance)

| Field | Content |
|-------|---------|
| **OBS** | Cognition DeepWiki launch: “It shouldn't take hours to get up to speed on a new codebase”; public DeepWiki via deepwiki.com. · https://cognition.com/blog/deepwiki · vendor · access 2026-09-15 |
| **OBS** | Devin docs gallery: investigate with DeepWiki + search → map files → hand off to Devin session with inherited context → PR; “from ‘I don't know this codebase’ to ‘here's a PR.’” · https://cognitionai.mintlify.app/use-cases/gallery/investigate-codebase-ask-devin · vendor docs · access 2026-09-15 |
| **OBS** | Builder.io comparison lists “Org knowledge / repo indexing — DeepWiki” as Devin differentiator vs Claude Code. · competitor-adjacent |
| **OBS (X)** | Kinopee: DeepWiki cache / freshness pitfalls; “The agent doesn't answer from the wiki, it uses the outline to decide where to look and then verifies against the code. A week-old map still beats no map when the codebase is large.” · https://x.com/kinopee_ai/status/2099876503832121448 · X browser pass 2026-09-15 |
| **CLAIM** | Medium — Strong product story; independent buyer praise for DeepWiki thin vs vendor. X adds a useful trust nuance: **code-grounded verification + stale map still useful**, freshness as concern. |
| **INT** | Safe Meta angle: *map the repo, then open the PR* / *wiki → plan → PR* / *outline then verify against code* — workflow claim, not accuracy metrics. |

---

### Finding 7 — Brand trust-debt still live in 2026 (“Remember Devin?”)

| Field | Content |
|-------|---------|
| **OBS** | HN on Cognition SWE-2 (~5 days before access): skepticism referencing early Upwork-demo controversy; SF ads recalled as “Remember Devin? It’s good now”; mixed — some say cloud matured / team-managed UX strong; others trash CLI / Desktop-as-reskinned-Windsurf / lock-in. · https://news.ycombinator.com/item?id=49647006 · HN · access 2026-09-15 |
| **OBS** | Answer.AI Jan 2025 remains the most-cited **independent failure narrative** (dated trust-debt). |
| **CLAIM** | Medium–high — Awareness includes **prior hype hangover**. Credible creative must look like proof culture (receipts), not 2024 autonomy theater — matches seed “don’t trust demo—inspect proof.” |
| **INT** | Lean *inspectable sessions / recordings / PRs / review*, not “AI software engineer replaces your team.” |

---

### Finding 8 — Cost language = predictable subscription vs metered autonomy (figures carefully)

| Field | Content |
|-------|---------|
| **OBS** | 2026 comparison posts contrast Cursor-like flat seats vs Devin **ACU / metered** agent work; AIToolPick and amux discuss entry points and overage/metering narratives. · e.g. https://aitoolpick.org/blog/devin-vs-cursor-pricing-2026/ · SEO blog · access 2026-09-15 · **do not treat prices as verified for ads without first-party confirmation** |
| **OBS** | BuildMVPFast FAQ: “Devin charges by agent-compute units”; “A simple fix is cheap; a large refactor… adds up fast.” |
| **OBS** | HN Ask: “way too expensive” for private/side use. · Finding 4 URL |
| **OBS (X)** | Prasenjit Sarkar: evaluation infrastructure includes “cost dashboard across all backends.” · https://x.com/stretchcloud/status/2099952895924019514 · X browser pass 2026-09-15 |
| **CLAIM** | Medium on *language pattern*; low on exact prices — Buyers talk **cost predictability** and **cost per task / per PR**, not seat vanity. |
| **INT** | Speak *cost of a scoped ticket* conceptually; **do not invent ACU rates or ROI**. |

---

### Finding 9 — X: trust is operational (permissions, audit, bounded autonomy) — enterprise control layer

| Field | Content |
|-------|---------|
| **OBS (X)** | Dylan Normandin on Claude Code Mods: control layer between agent and commands; inspect activity, block dangerous commands, redact sensitive output, require approval, audit trail; “The agent can still work autonomously, but it no longer has unlimited authority by default” — valuable when agents touch real systems. · https://x.com/DNormandin1234/status/2099981644216062048 · X browser pass 2026-09-15 |
| **OBS (X)** | Prasenjit Sarkar: eng teams want to evaluate Claude Code vs Factory Droid vs Codex vs Goose before committing; “Setting that up safely, with proper permission controls and isolated working environments, is painful”; agent races in isolated git worktrees; permission voting; session replay; side-by-side diff; cost dashboard; “real data instead of demos”; “No lock-in.” · https://x.com/stretchcloud/status/2099952895924019514 · X browser pass 2026-09-15 |
| **OBS (X)** | Thomas Gauvin: typical vibe-coding / cloud-agent envs run a dev server per container — constrained; infrastructure comparison on unlimited envs/forks. · https://x.com/thomasgauvin/status/2099981140434080173 · X browser pass 2026-09-15 |
| **CLAIM** | High for category buyer language on X — Trust = **permissioning, approvals, redaction, audit trails, isolated envs, bounded authority, compare-before-commit**. Complements seeded receipt language with enterprise control nouns. |
| **INT** | Meta territories for eng-lead / security-adjacent: *permission controls*, *isolated sandbox*, *audit trail*, *bounded autonomy*, *evaluate with real data not demos*, *no lock-in*. Do not invent Devin-specific security certifications. |

---

### Finding 10 — X: async UX boundaries + review capacity as adoption bottleneck

| Field | Content |
|-------|---------|
| **OBS (X)** | cv usk: “Is your agent making users stare at a loading spinner, or are they getting notified when the work is done?” Sync vs async execution models; timeout hell vs slow chatbot; response-time expectations shape architecture. · https://x.com/cv_usk/status/2099647131921592650 · X browser pass 2026-09-15 |
| **OBS (X)** | Trylions: bounded execution (docs cite 59-min max for Copilot cloud agent); GitHub-hosted scope; not multi-repo rewrite by default. · Finding 1 X URL |
| **OBS (X)** | Mikanrico (ZH visible card, summarized): AI coding-agent capability rising, but cannot read every AI-generated diff — thinking frequency / architecture sensitivity declining. · https://x.com/Mikanrico/status/2099968043409658114 · X browser pass 2026-09-15 |
| **OBS (X)** | Adam Gold (amplification): “CI runners scaled for concurrent agent jobs… out-of-band verification before human review.” · https://x.com/AdamGolds/status/2099958755676791155 · adjacent enterprise architecture · X browser pass 2026-09-15 |
| **OBS (X)** | Karl Weinmeister: agents burning tokens on wrong CLI commands; skills / syntax check / destructive-command confirmation matter. · https://x.com/kweinmeister/status/2099962972798153194 · X browser pass 2026-09-15 |
| **CLAIM** | High for category — Async needs **explicit product boundaries** (notifications, time limits, repo scope); **reviewability / verification capacity** is the bottleneck, not raw generation. |
| **INT** | Phrases: *notified when the PR is ready*, *morning batch review*, *bounded session*, *out-of-band verification*, *don’t rubber-stamp every diff*. |

---


### Finding 11 — Reddit: review-loop fork + interactive steer vs hand off well-defined work

| Field | Content |
|-------|---------|
| **OBS (Reddit)** | r/windsurf (2mo): firsthand Devin vs Claude Code Pro compare — “For me the fork wasn’t the model, it was the review loop: Devin hands you a finished diff to check, Claude Code lets you watch and interrupt… I pick by how verifiable the task is, not the plan tier.” · https://www.reddit.com/r/windsurf/comments/1v0vrnw/my_experience_comparing_the_pro_plans_devin_vs/ · Reddit browser pass 2026-09-15 |
| **OBS (Reddit)** | r/vibecoding (3mo): “Cursor is great when I want tight feedback while coding. Devin is better for handing off well-defined work. The bigger issue I’ve run into is context, not model quality.” · https://www.reddit.com/r/vibecoding/comments/1ty9aac/cursor_pro_vs_devin_vs_other_ai_coding_tools/ · Reddit browser pass 2026-09-15 |
| **OBS (Reddit)** | r/ChatGPTCoding (8mo): “The promise was full autonomy, but the reality still involves a lot of babysitting… it goes off the rails, you correct it, it sort of gets back on track.” · https://www.reddit.com/r/ChatGPTCoding/comments/1qp82lr/where_did_devin_go_what_does_it_say_about_the/ · Reddit browser pass 2026-09-15 |
| **CLAIM** | High for category language — Buyers choose by **control surface / review loop / verifiability**, not model brand: finished-diff handoff vs watch-and-interrupt. Full-autonomy memory = babysitting. |
| **INT** | Phrases: *finished diff to check*, *watch and interrupt*, *hand off well-defined work*, *tight feedback vs delegate*, *babysitting not autonomy*, *pick by how verifiable*. |

---

### Finding 12 — Reddit: quota burn, invisible async spend, runaway production ops

| Field | Content |
|-------|---------|
| **OBS (Reddit)** | r/cursor (9h): cloud agent lacked service-role secret on production Supabase import; “missing credential → agent refuses to stop → invents increasingly complicated workaround → burns money → corrupts data”; “If a task requires a secret that’s not available, the agent should stop.” · https://www.reddit.com/r/cursor/comments/1wh07hl/my_cursor_cloud_agent_burned_through_my_monthly/ · Reddit browser pass 2026-09-15 |
| **OBS (Reddit)** | r/ClaudeCode (19m): unused session still burned credits — completed online PRs “CONTINUOUSLY POLLING FOR PR CHANGES” until “Out of usage credits”; “I never authorized it to do this.” · https://www.reddit.com/r/ClaudeCode/comments/1whegs9/claude_code_used_up_all_my_tokens_automatically/ · Reddit browser pass 2026-09-15 |
| **OBS (Reddit)** | r/windsurf (3mo): Devin/Windsurf quota complaints — weekly quota spent fast on planning loops; migration language to Claude/Codex/Cursor. · https://www.reddit.com/r/windsurf/comments/1uiq070/what_the_heck_is_happening_with_devin/ · Reddit browser pass 2026-09-15 |
| **OBS (Reddit)** | r/cursor (3mo): hidden cloud-agent billing / opaque metering narrative (“ate 30%… in 10 minutes”). · https://www.reddit.com/r/cursor/comments/1ua9nfx/cursors_hidden_billing_on_cloud_agent/ · anecdotal · Reddit browser pass 2026-09-15 |
| **CLAIM** | High for objection cluster — Async trust fails when spend is **invisible**, authority is **standing**, or agents **won’t halt on missing secret**. Stopping behavior + spend caps are buyer trust features. |
| **INT** | Phrases: *halt on missing secret*, *standing authority*, *invisible async spend*, *hard spend cap*, *no repair-agent cascade*, *cautious on production ops*. Anecdotal; don’t invent $ figures. |

---

## Voices (FIT)

FIT = workflow relevance for Devin / async-agent buyer language (not follower count).

| # | Voice | FIT | Evidence | Caution |
|---|-------|-----|----------|---------|
| 1 | **Addy Osmani** — *Agentic Code Review* (2026-06-15) | Exact buyer problem: trust, review bottleneck, agent PR intent gap, evidence-required intake | Primary blog | Uses Faros/CodeRabbit vendor data — label as such |
| 2 | **Simon Willison** — “code you have proven to work” | Receipt / accountability vocabulary; agent must prove; human owns merge | Primary post 2025-12-18 | Broader agents, not Devin-specific |
| 3 | **Sean Kim** — Copilot coding agent 3-month review | Live async-PR practitioner; polish-vs-intent; junior-with-rules | Competitor tool, transferable objections | Not Devin user |
| 4 | **HN cloud-agent practitioners** (Ask HN #47862274; Ramp #46589842; Cognition #49647006) | Raw objections + occasional Devin cloud praise (recording+PR; team-managed) | Primary comments | Anecdotal; bias/disclosure vary |
| 5 | **Umapathy A / BuildMVPFast** — async PR workflow guide | Dispatcher / junior-PR / test-rewrite language matching Meta nouns | Agency blog with SEO intent | Not independent buyer diary |
| 6 | **X practitioners (2026-09-15 pass)** — Normandin, Sarkar, Trylions, Kinopee, decipherx | Operational trust, evaluate-before-commit, async worker definition, DeepWiki freshness, review-survival metric | Transcribed X posts | First-page visible cards only; not exhaustive; some competitor/adjacent tools |
| 7 | **Reddit practitioners (2026-09-15 browser pass)** — r/ChatGPTCoding, r/windsurf, r/cursor, r/vibecoding, r/ClaudeCode | Review-loop fork; hand off well-defined work; babysitting autonomy; quota/invisible spend; halt-on-missing-secret | Visible post/comment bodies | Signed-out UI; anecdotal; not ScrapeCreators API |

**Not FIT as primary buyer voice (use only with labels):** Snowman Labs (Cognition partner); amux (orchestration vendor); Builder.io (competitor); Cognition case-study pages (vendor); Answer.AI (**dated trust-debt only**); X amplification / GTM enthusiasm posts.

---

## Open items / contradictions

| Tension | Side A | Side B | Creative implication |
|---------|--------|--------|----------------------|
| Is Devin “good now”? | HN: matured cloud / team UX | HN: CLI/Desktop weak; early hype scar | Lead with **proof artifacts**, not “trust us again” |
| Autonomy vs control | Category celebrates fire-and-forget | Practitioners: interactive fails cheaper; X wants permission gates | Sell **bounded delegation + human merge**, not max autonomy |
| Who wins Cursor vs Devin? | Partner: org throughput → Devin | Practitioners: stay in editor → Cursor/Claude | Frame as **job-to-be-done**, not winner-take-all |
| Green CI | Agents chase green | Test-rewrite / wrong-intent / review-survival | Copy must say **read the tests / inspect receipt** |
| Dated Answer.AI vs 2026 product | Still cited as failure story | Category + Cognition claim progress | If referenced: label **Jan 2025 trust-debt**, never as current benchmark |
| Price entry narratives | SEO posts: accessible sticker | Metered ACU / overage anxiety; HN “too expensive” | Don’t use sticker price as the promise |
| DeepWiki value | Vendor: get up to speed fast | X: freshness pitfalls; verify against code | *Map then verify* — not “wiki is truth” |
| Lock-in | Org-owned agent pitch | X: “No lock-in… real data instead of demos” | Prefer *evaluate same task side-by-side* over exclusive claims |
| Review loop | Devin-shaped finished diff | Claude/Cursor watch-and-interrupt | Sell *verifiable handoff*, not “smarter model” |
| Async spend | Fire-and-forget promise | Reddit: invisible polling / runaway repair / missing-secret burn | Copy: *halt on missing secret*, *bounded standing authority*, *visible spend* |

---

## Access limitations

1. **Public only** — no private customer interviews, CRM, or paid research panels this pass.
2. **Reddit browser done; ScrapeCreators API still 402** — Signed-out Reddit web UI pass completed 2026-09-15 (no captcha); visible posts/comments from supplied searches + follow-links. Composio / ScrapeCreators API still **402 credits required** — no API bulk pull.
3. **Independent last-90-day Devin customer diaries** scarce vs category “async agent” content; HN + partner blogs + X dominate Devin-named talk.
4. **DeepWiki** buyer praise thin outside Cognition properties + one X developer investigation (Kinopee).
5. **Quantified merge-rate / ACU / ROI** appears in academic/SEO/partner pieces — treated as discourse, **not facts for ads**.
6. **Enterprise security buyer language** (VPC, FedRAMP, audit) mostly partner/vendor; X adds permission/audit nouns at category level, limited independent Devin security-blog confirmation.
7. **X pass scope** — signed-in Chrome, supplied queries with Latest/`f=live`, visible first-page cards only; counts are cards reviewed, not full index. No ScrapeCreators.
8. **Reddit pass scope** — signed-out box browser; sort `new`; first-page + followed threads; quotes verbatim from visible UI. Broad searches noisy — signal via subreddit-restricted / exact-title follow-ups.
9. **Students / hobbyists** appear mainly as “too expensive / too much setup” — keep separate from eng-lead buyers.

---

## Bottom line

Buyers already speak a shared category: **async / background / cloud agent = ticket → PR, not autocomplete**. Trust is operational — **receipts, diffs, CI, recordings, review-survival, permissions, audit trails** — not autonomy theater. The credible Devin frame for Meta statics is **delegate bounded, verifiable chores; human owns the merge; inspect the proof**. Contrast Cursor/Claude Code as *operate* vs Devin as *delegate / org backlog* without invented win rates. Answer.AI Jan 2025 is **dated trust-debt** that still shapes hangover (“Remember Devin?”) — answer it with proof culture, never as a current benchmark. Independent Devin-named diaries are thinner than category language: ads that speak **category + receipt** travel farther than ads that assume Devin lore. X reinforces: evaluate with real data not demos, bounded autonomy with control layers, async UX as notify-not-spinner, and DeepWiki as outline-then-verify-against-code. Reddit adds the **review-loop fork** (finished diff vs watch-and-interrupt), **hand off well-defined work** vs interactive steer, autonomy-as-babysitting memory, and vivid failures: **halt on missing secret**, invisible async spend, quota burn.

---

## Meta static phrase territories

Buyer nouns / short phrases for Meta static copy tests (Scout message territories) — **not full ad scripts**:

1. **Async PR / ticket → PR** — *background coding agent*, *async PR agent*, *ticket → tested PR*, *assign and walk away*, *dispatcher not coder*, *overnight PRs / morning batch review*
2. **Inspect the receipt** — *prove it works*, *diffs + CI + recording*, *review like a sharp intern*, *merged PR ≠ good PR*, *green CI ≠ correct intent*, *lines that survive review*, *human owns the merge*
3. **Operate vs delegate** — *you operate / it executes*, *pair programmer vs ticket-taker*, *developer-owned agent vs org-owned agent*, *org backlog not just your editor*
4. **Delegable chore nouns** — *dependency bump*, *flaky test*, *well-scoped ticket*, *migration step*, *coverage gap*, *verifiable chore*, *definition of done*, *bounded work*
5. **Understand before changing** — *map the repo then open the PR*, *wiki → plan → PR*, *outline then verify against code*, *DeepWiki* (careful; thin independent proof)
6. **Operational trust / control** — *permission controls*, *isolated sandbox*, *audit trail*, *bounded autonomy*, *approval before dangerous commands*, *session replay*, *real data not demos*, *no lock-in*
7. **Cost predictability (acknowledge, don’t invent $)** — *cost per ticket / per PR*, *metered agent compute*, *setup tax*, *interactive feels safer*, *quota burn*, *opaque metering*
8. **Review loop / control surface (Reddit)** — *finished diff to check*, *watch and interrupt*, *hand off well-defined work*, *tight feedback vs delegate*, *babysitting not autonomy*, *pick by how verifiable*
9. **Halt / standing authority (Reddit)** — *halt on missing secret*, *standing authority*, *invisible async spend*, *hard spend cap*, *no repair-agent cascade*, *cautious on production ops*
10. **Trust-debt framing (label only)** — *Answer.AI Jan 2025 (dated)*, *“Remember Devin?” hangover*, *demo ≠ production proof* — use only to justify receipt-forward creative, never as a product score

---

*End of artifact. Access date 2026-09-15. Cognition / Devin only. Public sources. No invented benchmarks.*
