// v3 stage 1a — ONE consolidated Claude call: two angles, two concepts each, with source pointers.
import { readInput, writeStage, extractJson, requireEnv } from "../lib/io.mjs";

const API_KEY = requireEnv("ANTHROPIC_API_KEY");
const MODEL = process.env.CLAUDE_MODEL ?? "claude-opus-5";

const sources = {
  "cognition-brand-kit.md": readInput("cognition-brand-kit.md"),
  "cognition-company-context.md": readInput("cognition-company-context.md"),
  "buyer-creator-signals-2026-09-15.md": readInput("buyer-creator-signals-2026-09-15.md"),
  "competitive-campaign-signals-2026-09-15.md": readInput("competitive-campaign-signals-2026-09-15.md"),
  "market-truth.md": readInput("market-truth.md"),
  "customer-stories-2026-09.md": readInput("customer-stories-2026-09.md"),
};

const sourceBlock = Object.entries(sources)
  .map(([name, body]) => `<source name="${name}">\n${body}\n</source>`)
  .join("\n\n");

const prompt = `You are the strategist on an independent portfolio project: four Meta static ad concepts for Devin (Cognition). A marketer will review your concept board before anything is rendered. Be rigorous about evidence; this work is judged on research-to-creative connection, not on adjectives.

${sourceBlock}

SOURCE HIERARCHY — respect it and label it.
1. Buyer research files (buyer-creator-signals, competitive-campaign-signals, market-truth): evidence of problems, objections, vocabulary and workflow preferences. NOT proof that Devin solves anything.
2. cognition-company-context.md: product positioning from the company.
3. customer-stories-2026-09.md: official, attributed customer implementations and reported outcomes. This is the only place you may take numbers from.
4. Your own creative interpretation: hypotheses to test, never stated as fact.
The research files share a seeded positioning frame; do NOT describe agreement between them as independent corroboration. Category complaints or competitor experiences do not prove Devin solves those problems.

LOCKED ANGLES (two), each with two concepts that must test genuinely different persuasive approaches:

A. SELF-SERVE — "Hand off the ticket. Review the PR."
   Audience: individual developers working in existing repositories, considering delegating defined engineering tasks.
   Tension: they want work taken off their hands but worry about supervision, task fit, and whether the change is correct.
   Concept a1 — TASK-LED: make one recognisable, well-supported chore concrete (dependency update, flaky test, or similar).
   Concept a2 — OBJECTION-LED: show why the developer can inspect the resulting work and keeps the merge decision. It must STILL make clear that Devin did the work — do not accidentally advertise a code-review tool.
   Copy territories to start from (not mandatory finals): "Hand off the dependency update. Keep the final review." / "What changed? Show me the diff."
   CTA: "Get started" -> https://app.devin.ai/
   Avoid: "no coding required"; guaranteed autonomy or correctness; claims that other agents cannot delegate; "Devin eliminates supervision"; strategy jargon like "bounded work" used as consumer-facing filler.

B. ENTERPRISE — "One playbook. Many repos."
   Audience: VP Engineering, Heads of Platform, leaders responsible for maintenance and modernization across many repositories.
   Tension: recurring maintenance competes with product delivery, and coordinating it across a large codebase creates more work.
   Concept b1 — PAIN-LED: the cleanup that remains after product work ships. Starting territory: "The feature shipped. The cleanup didn't."
   Concept b2 — PROOF-LED: one concrete, named customer implementation or result from customer-stories-2026-09.md. Choose on FIT with this angle, not on the biggest number. Preserve scope, timeframe and attribution exactly; keep reported outcomes separate from projections and estimated counterfactuals; never merge two customers' results.
   CTA: proof-led customer-story creative uses "See how <Customer> did it" pointing at that customer story URL; the sales-led creative uses "Contact sales" -> https://cognition.ai/contact.
   Factual customer-name attribution only. No logos, no implied endorsement of this independent project.

No pricing in any concept. No invented numbers anywhere.

Return ONE JSON object and nothing else:

{
  "angles": [
    {
      "id": "self-serve-handoff" | "enterprise-playbook",
      "icp": "Self-serve developers" | "Enterprise engineering leaders",
      "title": "Hand off the ticket. Review the PR." | "One playbook. Many repos.",
      "audience": "<one sentence>",
      "insight": "<buyer insight, MAXIMUM 20 words>",
      "hypothesis": "<one sentence, phrased as a hypothesis to test>",
      "evidence": {
        "source_file": "<file name from the sources above>",
        "section": "<exact heading or finding number in that file>",
        "quote": "<short VERBATIM quote, character-for-character from that file>",
        "label": "OBS | CLAIM | INT",
        "source_url": "<the public URL cited next to that quote in the file, or null>",
        "reading": "<one sentence on what it does and does not prove>"
      },
      "success_metric": "<'Cost per activated signup' | 'Cost per qualified meeting' | 'Engaged case-study visits, with qualified sales outcomes tracked downstream'>",
      "metric_note": "<one sentence: the definition to agree before launch. No numbers, no thresholds.>",
      "concepts": [
        {
          "id": "<angle id>-<task|objection|pain|proof>",
          "name": "<2-4 word concept name for the board, e.g. 'The dependency update'>",
          "approach": "task-led" | "objection-led" | "pain-led" | "proof-led",
          "buyer_situation": "<one specific sentence: where this buyer is when they see it>",
          "research_observation": {
            "source_file": "<file>",
            "section": "<exact heading / finding>",
            "quote": "<short VERBATIM quote from that file>",
            "source_url": "<URL or null>"
          },
          "objection_or_motivation": "<the single objection or motivation this concept works on>",
          "messaging_hypothesis": "<one sentence>",
          "ad": {
            "headline": "<in-image headline, <= 52 characters, line breaks as \\n>",
            "support": "<at most one short in-image sentence, <= 70 characters, or empty string>",
            "cta": "Get started" | "Contact sales" | "See how Ramp did it" | "See how FE fundinfo did it" | "See how AngelList did it"
          },
          "destination": "<URL>",
          "meta": { "primary": "<Meta primary text, 2-4 short lines>", "headline": "<Meta headline, <= 40 chars>", "description": "<Meta description, <= 30 chars>" },
          "proof": {
            "type": "product-capability" | "customer-result" | "buyer-language",
            "statement": "<the exact substantiation this concept rests on>",
            "source_file": "<file>",
            "source_url": "<URL or null>",
            "attribution": "<named customer + timeframe + scope, or 'none — product capability' >",
            "status": "reported outcome" | "projection" | "estimated counterfactual" | "product capability" | "buyer observation"
          },
          "claims_to_avoid": ["<specific claim this concept must never make>", "..."]
        }
      ]
    }
  ],
  "gaps": ["<any missing product proof or asset you could not substantiate>"]
}

Hard rules: every "quote" must be copied verbatim from the named file. Insights are <= 20 words. Numbers appear only in the proof-led concept and only exactly as customer-stories-2026-09.md states them, with attribution.`;

const res = await fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: { "content-type": "application/json", "x-api-key": API_KEY, "anthropic-version": "2023-06-01" },
  body: JSON.stringify({ model: MODEL, max_tokens: 20000, messages: [{ role: "user", content: prompt }] }),
});
if (!res.ok) throw new Error(`Anthropic ${res.status}: ${await res.text()}`);
const json = await res.json();
const text = json.content.map((c) => c.text ?? "").join("");
const parsed = extractJson(text);

// validation
const norm = (s) => s.replace(/[\u2018\u2019]/g, "'").replace(/[\u201c\u201d]/g, '"').replace(/\s+/g, " ").trim();
const corpus = Object.fromEntries(Object.entries(sources).map(([k, v]) => [k, norm(v)]));
const problems = [];
if (parsed.angles?.length !== 2) problems.push(`expected 2 angles, got ${parsed.angles?.length}`);
for (const a of parsed.angles ?? []) {
  if (a.insight.split(/\s+/).length > 20) problems.push(`${a.id}: insight over 20 words`);
  if (a.concepts?.length !== 2) problems.push(`${a.id}: expected 2 concepts, got ${a.concepts?.length}`);
  const quotes = [[a.evidence.source_file, a.evidence.quote, `${a.id} angle evidence`]];
  for (const c of a.concepts ?? []) quotes.push([c.research_observation.source_file, c.research_observation.quote, c.id]);
  for (const [file, quote, where] of quotes) {
    if (!corpus[file]) problems.push(`${where}: unknown source file ${file}`);
    else if (!corpus[file].includes(norm(quote))) problems.push(`${where}: quote not verbatim in ${file}: "${quote.slice(0, 70)}"`);
  }
}

writeStage("v3-1-claude-strategy.json", {
  stage: "strategy",
  model: json.model,
  ran_at: new Date().toISOString(),
  sources: Object.keys(sources).map((f) => `inputs/${f}`),
  usage: json.usage,
  validation: { problems },
  ...parsed,
});

if (problems.length) {
  console.error("VALIDATION PROBLEMS:");
  for (const p of problems) console.error(" -", p);
  process.exitCode = 2;
} else {
  console.log("validation clean");
}
