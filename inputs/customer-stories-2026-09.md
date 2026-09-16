# Official Devin customer stories — verbatim extracts

Fetched 2026-09-16 from devin.ai. Only text present on those pages is recorded here. Figures keep their
original scope, timeframe and attribution. Reported outcomes and projections are labelled separately.

---

## Ramp — https://devin.ai/customers/ramp

Company: financial operations platform; "over 30,000+ businesses".

Page headline stats (as displayed):
- "80 PRs — Merged each week"
- "10,000+ hrs — Saved each month on rote tasks"

Feature-flag workflow (REPORTED OUTCOME, one month, Ramp only):
- "Devin feature flag removal — 150 complex feature flags removed in a month, saving thousands of engineering hours"
- Quote — Rakesh Nori, Software Engineer, Ramp: "It can take several days to remove a single feature flag. We've tried
  scripting it in the past, but only Devin can comprehensively remove the feature flag PLUS fix any breaking tests or
  other dependencies. In the past month alone this has saved us over 1000 engineering hours."

Mechanics (product substantiation):
- "Ramp developed a primary playbook – a standardized prompt that can be programmatically attached to recurring tasks –
  that coordinates multiple 'worker' Devins to tackle different aspects of a feature flag removal in parallel."
- "A 'clean-up' Devin verifies that there are no conflicts in the 'worker' Devin outputs and consolidates the changes
  into a single, easily-reviewable PR."
- "they leveraged Devin's API to trigger multiple Devins in parallel to return completed PRs en masse."

Airflow workflow:
- "8 mins average Devin bug-to-PR time"
- Quote — Peyton McCullough, Staff Software Engineer, Ramp: "Having Devin be the first eyes on every Airflow error is a
  massive time-saver. Half of the time we can merge Devin's PR as-is, which saves hours of debugging."
- "Instead of a manual debugging process, Ramp's engineers now simply review and approve a Devin PR that already passes CI."

Slow tests / endpoints:
- "20 mins of dev time per engineer saved each day"
- Quote — Maxim Enis, Software Engineer, Ramp: "Devin helped automate the process of reducing our test suite local runtime
  by an entire minute. For every single engineer on the team, that's up to 20 minutes of dev time back every single day."
- Backlog described: "over 100 slow tests and over 500 legacy, undocumented endpoints".

---

## FE fundinfo — https://devin.ai/customers/fefundinfo

Company: financial data company; "over 1,200 employees across 16 countries"; "200+ expert engineers support 70 product
types across approximately 1,800 active code repositories".

Page headline stats (as displayed):
- "10% — immediate increase in engineering capacity from automated test generation, security fixes, and modernization work" (REPORTED)
- "2-4x — projected engineering capacity increase over the next 2-5 years as Devin expands across the full SDLC" (PROJECTION, not a result)
- "3 days — of manual QA work saved every two weeks through automated testing tools" (REPORTED)
- "1,800 — repositories managed with automated Devin playbooks via custom Replit apps" (REPORTED scope)

Mechanics (product substantiation):
- "the team built an automation system using Replit that runs Devin 'playbooks' across all 1,800 repositories. This system
  automatically: Finds repos needing updates / Triggers Devin sessions / Tracks progress and handles errors / Auto-merges
  pull requests for low-risk changes (like documentation updates) without human review."
- "Low-risk changes could pass straight to production; medium-complexity work would require human PR review; and
  high-complexity projects would involve humans in both planning and review."
- Quote — Richard Thorpe, Head of Engineering, FE fundinfo: "Devin's understanding of our codebases is substantially better
  than some other AI systems our teams use."
- Maintenance pressure described: "security updates, dependency upgrades, testing coverage gaps, and technical debt
  remediation. Over time, this work began to crowd out new feature development."

---

## AngelList — https://devin.ai/customers/angellist

Company: fund-administration platform; "$171B in assets on platform across 25,000 funds and syndicates".

Page headline stat (as displayed):
- "5.2x — faster Redshift → Snowflake migration" (REPORTED, against the team's own estimate)

Scope and counterfactual (must stay attached to the number):
- "migrating the BI layer. The data team needed to retarget, rewrite, and validate 14,000 Metabase cards ... across 40+
  collections, most of which used Redshift-specific SQL or Metabase's proprietary query language."
- "Without Devin, the Metabase migration was trending six months late, toward August or September, and would have required
  three or four additional engineers." (ESTIMATED COUNTERFACTUAL by the team, not a measured result)
- "With Devin, AngelList cut over to Snowflake on March 23, 2026 — 5.2× faster than the team estimated without Devin."
- Quote — Beau Rothrock, Data Engineer at AngelList: "I remember when I started. There was just kind of a brief moment of
  terror about how that was actually going to happen. I knew I couldn't do this all by myself."

---

## Usage rules for creative

- Attribute every figure to the named customer, with its timeframe and scope. Never generalise to "customers" or "teams".
- 2-4x (FE fundinfo) is a projection; 5.2x (AngelList) is measured against the team's own estimate, not an industry baseline.
- Do not merge figures from two customers into one implied outcome.
- Customer names may be stated as fact; logos and any implication of endorsement of this independent project may not.
