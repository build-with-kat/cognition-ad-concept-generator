// v2 stage 1 — Claude writes copy for the two locked angles, two executions each.
import { readInput, writeStage, extractJson, requireEnv } from "../lib/io.mjs";

const API_KEY = requireEnv("ANTHROPIC_API_KEY");
const MODEL = process.env.CLAUDE_MODEL ?? "claude-opus-5";

const brandKit = readInput("cognition-brand-kit.md");
const marketTruth = readInput("market-truth.md");

const prompt = `You write paid-social copy for Devin (Cognition). Two angles are already locked by the marketer. Your job is the copy and the evidence mapping, not the angle selection.

<brand-kit>
${brandKit}
</brand-kit>

<market-truth>
${marketTruth}
</market-truth>

Locked angles:
1. id "self-serve-handoff" — SELF-SERVE — "Hand off the ticket. Review the PR."
   Audience: developers delegating well-scoped engineering tasks.
   Research basis: bounded work, ticket-to-PR delegation, inspectable results, human ownership of the merge.
   CTA: "Get started" -> https://app.devin.ai/
2. id "enterprise-playbook" — ENTERPRISE — "One playbook. Many repos."
   Audience: engineering leaders responsible for repeatable maintenance across repositories.
   Research basis: migrations, dependency updates, flaky tests, backlog parallelism, review capacity.
   CTA: "Book a demo" -> https://cognition.ai/contact

Each angle gets exactly two executions that share the proposition and CTA and differ only in visual treatment:
- execution "a" — typography-led: headline carries everything.
- execution "b" — workflow-led: the same proposition explained by a simple illustrative work artifact (self-serve: a well-scoped ticket becoming a pull request awaiting human review; enterprise: one maintenance task applied across several repositories with review retained).

Return ONE JSON object, no prose outside it:

{
  "angles": [
    {
      "id": "self-serve-handoff" | "enterprise-playbook",
      "title": "<the locked angle line>",
      "audience": "<the locked audience>",
      "insight": "<one sentence, MAXIMUM 20 words, the buyer insight>",
      "hypothesis": "<one sentence: what we believe this angle will do, phrased as a hypothesis to test>",
      "evidence": {
        "section": "<exact section heading in market-truth.md, e.g. '§3 Recurring problems / objections / phrases'>",
        "quote": "<short verbatim quote copied character-for-character from market-truth.md>",
        "label": "<one of: 'observed buyer language (OBS)', 'synthesis / interpretation (INT)', 'source claim (CLAIM)'> — be accurate to how market-truth labels it",
        "reading": "<one sentence on what the quote does and does not prove; research about what buyers want is not proof that Devin does it>"
      },
      "success_metric": "<'Cost per activated signup' for self-serve, 'Cost per qualified meeting' for enterprise>",
      "metric_note": "<one sentence: the definition that must be agreed before launch. No numbers, no thresholds.>",
      "executions": [
        {
          "id": "<angle id>-a" | "<angle id>-b",
          "treatment": "typography-led" | "workflow-led",
          "ad": {
            "headline": "<the in-image headline; <= 48 characters; deliberate line breaks expressed with \\n; may be the angle line itself>",
            "support": "<at most one short supporting sentence for the image; <= 60 characters; may be empty string>",
            "cta": "Get started" | "Book a demo"
          },
          "meta": {
            "primary": "<Meta primary text, 2-3 short lines, no emoji, no exclamation points>",
            "headline": "<= 40 characters>",
            "description": "<= 30 characters>"
          },
          "artifact": {
            "kind": "none" | "illustration",
            "content": {
              "ticket_id": "<short fake-looking-but-generic ticket key, e.g. 'ENG-2214', or empty>",
              "ticket_title": "<short, plausible, boring engineering chore, or empty>",
              "steps": ["3-4 very short stage labels for the illustration, e.g. 'Ticket', 'Devin runs', 'Diff + tests', 'You review'"],
              "repos": ["3-4 short generic repo names, only for the enterprise workflow execution, else empty array"],
              "note": "Illustration. Not a screenshot and not execution evidence."
            }
          }
        }
      ]
    }
  ]
}

Hard rules:
- No pricing, no quota or rationing claims, no ACU figures.
- No governance guarantees: do not say sessions are always recorded, that secrets always halt a run, or name certifications.
- No invented customer outcomes, savings, percentages, latencies or merge rates. No customer logos.
- Never "replaces engineers". The human owns the merge.
- Quotes must exist verbatim in market-truth.md.
- Voice: short, declarative, engineering-literate. Concrete work nouns. No emoji, no exclamation points.`;

const res = await fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: { "x-api-key": API_KEY, "anthropic-version": "2023-06-01", "content-type": "application/json" },
  body: JSON.stringify({ model: MODEL, max_tokens: 20000, messages: [{ role: "user", content: prompt }] }),
});
if (!res.ok) throw new Error(`Anthropic ${res.status}: ${await res.text()}`);
const body = await res.json();
const text = body.content.filter((b) => b.type === "text").map((b) => b.text).join("\n");
const parsed = extractJson(text);

const norm = (s) => s.replace(/[\u2018\u2019]/g, "'").replace(/[\u201c\u201d]/g, '"').replace(/\s+/g, " ").trim();
const truth = norm(marketTruth);
for (const a of parsed.angles) {
  if (!truth.includes(norm(a.evidence.quote))) throw new Error(`quote not verbatim in market-truth.md: ${a.evidence.quote}`);
  if (a.insight.split(/\s+/).length > 20) throw new Error(`insight over 20 words: ${a.id}`);
  if (a.executions.length !== 2) throw new Error(`${a.id} needs exactly 2 executions`);
}
if (parsed.angles.length !== 2) throw new Error("expected exactly 2 angles");

writeStage("v2-1-claude-copy.json", {
  model: MODEL,
  provider: "anthropic",
  generated_at: new Date().toISOString(),
  usage: body.usage,
  prompt,
  ...parsed,
});
