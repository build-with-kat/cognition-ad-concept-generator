# competitive-campaign-signals-2026-09-15.md — Cognition (Devin)

**Prepared:** 2026-09-15  
**Source brief:** `cognition-company-context.md` (rewritten Drive copy in `cognition-market-radar`)  
**Objective:** Deepen competitor ads + LPs for Devin Creative Testing Lab / Paid Media Marketer artifact — Meta statics-first.  
**Rules:** OBS = verified observation; CLAIM = source claim; INT = interpretation. Ads ≠ performance. Public only. No outreach.

---

## Method

| Layer | Detail |
|---|---|
| **Meta** | Browser-rendered Ad Library (US, Active, All). Cognition / Grok / Viktor seed page IDs + Meta own-search for Replit, Cursor, Claude, OpenAI/Codex, GitHub Copilot. Artifact: `/workspace/cognition-adlib-meta.md` |
| **Landing pages** | WebFetch + Chrome where curl hit Vercel wall. Artifact: `/workspace/cognition-research-lps.md` |
| **Google ATC** | Browser-rendered ATC. Cognition `AR16078142091833638913` (~300); Replit `AR15350349850482835457` (~2k); xAI `AR16634246030593884161` (~200). Artifact: `/workspace/cognition-adlib-google.md` |
| **Out of scope this file** | Buyer/creator language (Freddy’s `buyer-creator-signals-2026-09-15.md`); full LinkedIn census |

**Canonical Cognition ad URLs (company-context):**  
Meta page `627575257116750` · Google ATC https://adstransparency.google.com/advertiser/AR16078142091833638913?region=US · LinkedIn `accountOwner=cognition&payer=cognition` · X https://x.com/cognition

---

## Standalone creative-scale contrast (Meta statics-first)

| Advertiser | ~Active (UI) | Surfaced format | Dominant CTA | Proof style |
|---|---:|---|---|---|
| **Cognition** | ~110 | Video/Reels/creator (13/13 sampled had video controls; statics scarce in sample) | Comment-to-DM (“Comment Devin/AI…”) + some Download → devin.ai | Creator UGC / workflow demo; thin quantified enterprise proof in sample |
| **Grok (xAI)** | ~98 | Video/creator-heavy (15/15 sampled video); some official Sign Up | Comment-to-DM + **Sign Up** → x.ai/bot | Lifestyle “team of Bots” UGC; anecdotal |
| **Viktor** | ~650 | **Static/copy-led dominant** in 16-card sample; smaller video subset | **Sign Up** → viktor.com (/business, /enterprise) | Templated claim volume: 45k+ teams, $87M, % stats, price compares — high permutation density |
| **GitHub (Copilot)** | Official under GitHub | Static/copy-led workflow cards + some video | Learn More → github.com | Command/feature-specific developer proof |
| **Claude (Anthropic)** | Official Claude page | Mix static + video | Sign Up / Download → claude.com product URLs | Launch + proof stories |
| **Cursor / Anysphere** | — | **No official Meta advertiser found** (US active search) | — | Null/unverified official presence |
| **Replit** | Official Replit page in Meta search | Video-forward official cards; keyword noise from third-party .replit.app | Learn more → replit.com | Idea-to-app / start free |

**INT (for Lab v1):** Largest Meta whitespace vs Viktor’s static system and GitHub’s developer-static density: **artifact-based statics + direct Sign up/Start free CTAs** (and optional carousel storyboard), not more comment-to-DM Reels.

---

## Findings (9)

### 1. Cognition Meta is Reels/creator + comment-to-DM — static DR is the gap vs Viktor

**OBS:** Cognition ~110 active; sampled cards overwhelmingly video with comment-to-DM; Download→devin.ai present but minority.  
**OBS:** Viktor ~650 active; static/templated claim cards dominate; Sign Up to viktor.com — no comment-to-DM in sample.  
**INT:** Meta statics-first Lab should treat Viktor as the **format/CTA benchmark** (not the product message to copy).

### 2. Grok Meta mirrors Cognition’s video+comment system, with a cleaner Sign Up path to x.ai/bot

**OBS:** Grok ~98; video/comment “Bots/TEAM/Grok” + official Sign Up cards to https://x.ai/bot.  
**INT:** Grok shows comment automation can coexist with direct Sign Up — Cognition can test both without abandoning creator inventory.

### 3. Site CTAs are Sign up / Demo / Download — Meta comment bridge is the biggest CTA mismatch

**OBS (LPs):** Devin/cognition surfaces use Get Started / Try / Demo / Download / Let’s talk (see LP table in research file).  
**OBS (Meta):** Comment-to-DM dominates Cognition sample.  
**OBS (Viktor):** Meta Sign Up aligns with site Get Started Free / Contact Sales.  
**INT:** First static tests should pair artifact proof with **Start free / Sign up / Book demo** buttons to match site, A/B vs comment variants.


### 4b. Google ATC confirms Replit static/search scale vs Cognition video/visual footprint

**OBS:** Cognition ATC ~**300** ads; mix of video/visual tiles **and** readable search/static creatives (Desktop, Code Review, Get Started) when grid is fully rendered — Kat-assisted view 2026-09-15.  
**OBS:** Replit ATC ~**2k** ads; static/search text ads with “All-in-One App Builder,” “Create Apps Using AI,” “Get Started Free” / “Pricing” → www.replit.com.  
**OBS:** xAI ATC ~**200** ads; Grok “Managed AI Team…” → www.x.ai.  
**INT:** Channel-format split is clear — Replit owns Google static/search volume; Cognition Meta is Reels/comment; Lab v1 Meta statics don’t replace the need for a later Google static/search pack modeled on Replit’s structure (different ICP).

### 4. Replit owns blank-page / “Cursor alternative” / start-free static-search territory on Google (seed) — Devin LPs should not absorb that creative

**CLAIM/OBS (seed + LP):** Replit Google ~2K inventory static/search-heavy (“Cursor alternative,” “no coding,” “start free”); LP “What will you build?” free→paid.  
**OBS (Devin LP):** AI software engineer in existing codebases / PR workflows — not blank-page app builder.  
**INT:** Do not land Replit-style blank-page hooks on Devin home; keep Devin creative in repo/PR/agent-fleet territories.

### 5. Cursor official Meta presence null in this US-active search — competitors still use “Cursor killer” framing in creator copy

**OBS:** No official Cursor/Anysphere Meta advertiser found.  
**OBS:** Cognition creator sample included “Devin Desktop is the cursor killer…” third-party/creator framing.  
**INT:** Competitor-conquest language exists in UGC; official Cursor Meta statics aren’t a live benchmark here — GitHub/Claude statics are better format peers.

### 6. GitHub Copilot Meta statics are the cleanest developer-workflow static benchmark

**OBS:** Official GitHub cards: Shift+Tab autopilot, multi-model test, Copilot agent/CLI, /delegate, /fleet — Learn More → github.com; mostly static/copy-led.  
**INT:** Cognition statics can mirror **one-job-to-be-done + artifact** structure without copying GitHub’s product nouns.

### 7. Claude / Codex Meta show product-specific destinations — Cognition often collapses to generic comment or devin.ai

**OBS:** Claude → claude.com/product/claude-code, cowork, fable; Codex → chatgpt.com/codex.  
**OBS:** Cognition sample often comment-DM or generic https://devin.ai/.  
**INT:** Static tests should split Desktop vs cloud agent vs DeepWiki→PR destinations when public URLs exist (app.devin.ai, docs, pricing).

### 8. Enterprise proof is thin in Cognition Meta sample vs Viktor’s quantified static claims

**OBS:** Viktor statics recycle 45,000+ teams, $87M, percentages, price compares.  
**OBS:** Cognition sample lean creator/demo; company-context logos (Mercedes, Goldman, etc.) are CLAIMs to re-verify — not seen as Meta static proof in this sample.  
**INT:** Enterprise statics need **governed-fleet / measurable modernization** territory from company-context message list — only with substantiated public claims; don’t invent ROI.

---

## Promise → LP gaps (selected)

| Ad promise pattern | Typical LP | Gap |
|---|---|---|
| Comment Devin / AI (Meta) | Get Started / Demo on site | High friction vs site intent |
| Creator “cursor killer” / Desktop | Devin Desktop / docs | May over-claim vs “inspect the receipt” trust frame |
| Viktor “hire / AI employee” | viktor.com Sign Up | Aligned Meta↔site; wrong product metaphor for Devin |
| Replit idea-to-app | replit.com free | Wrong ICP for Devin core |

---



---

## Cognition live creative inventory → what to test next (Meta + Google)

**Access:** 2026-09-15 · Meta Ad Library (Cognition AI, US, Active) and Google ATC advertiser AR16078142091833638913 (US) rendered in-browser with Kat. Ads ≠ performance.

### What Cognition is already running

| Platform | Creative type (OBS) | Messaging / claims (OBS) | CTA pattern (OBS) |
|---|---|---|---|
| **Meta** | Creator/influencer **video/Reels**; multi-version packs (e.g. 7–8 ads per creative); statics scarce in surfaced inventory | “AI software engineer”; **Devin Desktop / command center**; “cursor killer”; remote coding (“from anywhere”); shipping proof (API/MCP “in record time”); workflow/demo UGC | Dominantly **comment-to-DM** (“Comment DEVIN/AI…”); some Download → devin.ai |
| **Google ATC** | Mix of **search/static text** + **video** tiles (~300 ads total in UI) | **Devin Desktop** — “A Team for Every Engineer,” fleets of local + cloud agents, plan/delegate/review/ship; **Agent Command Center** video; **Code Review** — catch bugs / quality; **Get Started** — “AI Coding Agent / Super Engineers,” backlog + modernize codebase | Grid-visible: **Pricing Plans**, **Download Devin Desktop**, **Get Started**; Desktop path `devin.ai/desktop` |

### Competitive format contrast (why it matters for tests)

- **Viktor (Meta):** high-volume **static/templated** claim cards + direct **Sign Up** — Cognition does *not* currently mirror this format density.
- **Replit (Google):** large **static/search** “app builder / start free” inventory — different ICP (blank-page) than Devin’s repo/PR engineer story; don’t copy that message onto Devin home.
- **GitHub Copilot (Meta):** static developer-workflow headlines — closest **format** peer for engineer-specific statics.

### Implications for creatives to test next (INT — Lab v1 / Meta statics-first)

1. **Keep the message territories Cognition already buys** (Desktop command center; agent fleets; code review; backlog/modernize; ship from Slack/editor) — but **port them into static** (and optional carousel), not only Reels.
2. **Test direct CTAs** (Start free / Sign up / Download Desktop / Get a demo) against comment-to-DM on the same creative concept — site already uses Get Started/Demo/Download.
3. **Split hooks by product surface** (Desktop vs cloud agent vs Code Review) with matching destinations — Google already does this; Meta often collapses to comment or generic Devin.
4. **Replace “cursor killer” conquest UGC with proof-led statics** for brand/Lab tests (diff, CI, reviewed PR) — conquest language exists in Meta UGC but fights trust frame (“inspect the receipt”).
5. **Add one enterprise-safe static** only if claim is public (governed fleet / security / measurable modernization) — Meta sample is thin here vs Viktor’s quantified statics.
6. **Do not** lead Meta statics with Replit-style “no code / idea to app” — wrong buyer for Devin core ICP.

### Suggested first static concepts (from live inventory, not new invented claims)

| # | Hook (from live ads) | Format | Primary CTA to test |
|---|----------------------|--------|---------------------|
| A | Agent command center — fleets of local + cloud agents | 1080×1080 UI static | Download Desktop / Start free |
| B | Plan → delegate → review → ship without leaving editor | 3–5 frame carousel | Start free |
| C | AI-powered code review — catch bugs before merge | Static | Get Started / Learn more |
| D | Clear the backlog / modernize the codebase (one job) | Static | Get a demo (Teams/ENT) vs Start free (SS) |
| E | Same Desktop story as Meta UGC, minus “cursor killer” | Static + optional comment variant | A/B Sign up vs Comment DEVIN |

## Access / deepen notes

1. Google ATC: earlier automated detail clicks blank/CSP; **grid-level** Desktop/Review/Get Started copy confirmed with Kat in-browser 2026-09-15. Replit copy also readable.  
2. LinkedIn Ad Library for Cognition not fully censused in this pass (URL canonical in company-context).  
3. Meta/Google counts are UI approximations; samples ≠ full inventory.  
4. No login/captcha on Meta; ATC searches returned nulls for confirmed Cursor IDE, Claude-branded, Codex, GitHub Copilot, Viktor/Zeta Labs advertisers.

---

## Three open questions (for paid / Lab)

1. Can Meta statics with **Sign up / Start free** beat comment-to-DM on the same artifact creative — without killing creator UGC volume?  
2. Should conquest statics target **Cursor alternative** language (noisy, Replit-owned) or **inspect-the-receipt / PR proof** language (trust-aligned)?  
3. Which single enterprise static claim is public and legal to ship in week-1 (logo + outcome) without inventing benchmarks?

---

## Appendix — LP CTA snapshot (OBS 2026-09-15)

| Product | Site CTAs | SS vs ENT |
|---|---|---|
| Devin | Get Started / Try / Demo / Download / Let’s talk | Free→Teams SS; ENT sales |
| Replit | Free → paid → ENT custom | Strong SS |
| Viktor | Get Started Free / Contact Sales / Book Demo | Free + sales |
| Cursor | Download / pricing / ENT | Hobby→Teams |
| Claude Code | Plan-gated Get started | Pro/Max/Team/ENT |
| Grok/xAI | Open Grok / Sign in / Console | Chat+API |

---

*Research only. Deepens company-context seed; does not redo buyer-creator file. For Bella `cognition-market-truth.md` synthesis.*