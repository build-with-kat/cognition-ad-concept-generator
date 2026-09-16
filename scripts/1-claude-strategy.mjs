// Stage 1 — Claude (Anthropic) writes research + 5 distinct messaging angles + Meta copy.
import { readInput, writeStage, extractJson, requireEnv } from "./lib/io.mjs";

const API_KEY = requireEnv("ANTHROPIC_API_KEY");
const MODEL = process.env.CLAUDE_MODEL ?? "claude-opus-5";

const brandKit = readInput("cognition-brand-kit.md");
const marketTruth = readInput("market-truth.md");

const prompt = `You are the strategist on a paid-social creative engine for Cognition (makers of Devin).
You have two source documents. Everything you write must be traceable to them.

<brand-kit>
${brandKit}
</brand-kit>

<market-truth>
${marketTruth}
</market-truth>

Produce ONE JSON object, no prose outside it, matching exactly this shape:

{
  "research": [
    {
      "bullet": "<= 28 words, declarative, engineering-literate",
      "citation": "<verbatim quote copied character-for-character from market-truth.md>",
      "section": "<section of market-truth.md the quote lives in, e.g. '§3 Recurring problems'>"
    }
  ],                                  // exactly 5 items
  "angles": [
    {
      "id": "kebab-case-id",
      "name": "Short angle name",
      "track": "self-serve" | "enterprise",
      "icp": "Free / Pro $20 / Max $200 IC developer" | "VP Eng" | "CTO" (be specific),
      "jtbd": "The job to be done, in the buyer's words, one sentence",
      "insight": "Why this angle wins with this ICP, one sentence",
      "proof": "The proof artifact this angle leans on (diff/CI/recording/backlog/workload pricing...)",
      "cta": "Start free" | "Sign up" | "Download Desktop" | "Book demo" | "Get started",
      "copy": {
        "primary": "Meta primary text, 1-3 short lines, scannable, no emoji, no exclamation points",
        "headline": "<= 40 characters",
        "description": "<= 30 characters"
      },
      "kill_metric": {
        "metric": "The single metric that kills this angle if it misses",
        "threshold": "Concrete numeric threshold with window, e.g. 'CTR < 0.9% after 12k impressions'",
        "rationale": "One sentence: why this metric is the honest kill signal for this angle"
      },
      "citation": "<verbatim quote copied character-for-character from market-truth.md that licenses this angle>",
      "citation_section": "<section pointer, e.g. '§5 Rank 1'>",
      "avoid": ["claims this angle must never make"]
    }
  ]                                   // exactly 5 items: 3 with track "self-serve", 2 with track "enterprise"
}

Hard rules:
- DISTINCT means different JTBD, different ICP sub-segment, different proof artifact, and different structural hook. Not palette swaps or reworded hooks.
- Self-serve angles must reflect the Free -> Pro $20 -> Max $200 ladder; at most one may be price-led.
- Enterprise angles: workload/ACU pricing, fleets, governance. Never seats, never invented ROI, never unverified logos.
- Every citation must be a substring that exists verbatim in market-truth.md. Do not paraphrase citations.
- Never claim: Answer.AI as a current benchmark, invented $ / % / latency / merge rates, competitor claims as Cognition facts, "replaces engineers".
- Voice: short, declarative, concrete work nouns. No emoji, no exclamation points, no "AI coworker".`;

const res = await fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: {
    "x-api-key": API_KEY,
    "anthropic-version": "2023-06-01",
    "content-type": "application/json",
  },
  body: JSON.stringify({
    model: MODEL,
    max_tokens: 20000,
    messages: [{ role: "user", content: prompt }],
  }),
});

if (!res.ok) throw new Error(`Anthropic ${res.status}: ${await res.text()}`);
const body = await res.json();
console.log(`stop_reason=${body.stop_reason} blocks=${body.content.map((b) => b.type).join(",")}`);
const text = body.content
  .filter((b) => b.type === "text")
  .map((b) => b.text)
  .join("\n");
const parsed = extractJson(text);

// Verify every citation is verbatim in market-truth.md.
const norm = (s) => s.replace(/[\u2018\u2019]/g, "'").replace(/[\u201c\u201d]/g, '"').replace(/\s+/g, " ").trim();
const truth = norm(marketTruth);
const bad = [];
for (const r of parsed.research) if (!truth.includes(norm(r.citation))) bad.push(`research: ${r.citation}`);
for (const a of parsed.angles) if (!truth.includes(norm(a.citation))) bad.push(`${a.id}: ${a.citation}`);
if (bad.length) throw new Error(`citations not verbatim in market-truth.md:\n- ${bad.join("\n- ")}`);

const selfServe = parsed.angles.filter((a) => a.track === "self-serve").length;
const enterprise = parsed.angles.filter((a) => a.track === "enterprise").length;
if (parsed.research.length !== 5 || selfServe !== 3 || enterprise !== 2) {
  throw new Error(`shape violation: research=${parsed.research.length} self-serve=${selfServe} enterprise=${enterprise}`);
}

writeStage("1-claude-strategy.json", {
  model: MODEL,
  provider: "anthropic",
  generated_at: new Date().toISOString(),
  usage: body.usage,
  ...parsed,
});
