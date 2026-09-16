import { getBatch } from "@/lib/batch";
import { Statics } from "@/components/Statics";
import { SectionHead } from "@/components/SectionHead";

export default function Board() {
  const batch = getBatch();
  const passed = batch.concepts.filter((c) => c.status === "passed").length;
  const statics = batch.concepts.flatMap((c) => c.renders).filter((r) => r.src).length;

  return (
    <main className="mx-auto max-w-[1180px] px-6 pb-32 pt-10 sm:px-10">
      <header className="border-b border-line pb-8">
        <div className="mono flex flex-wrap items-baseline gap-x-6 gap-y-2 text-[11px] uppercase tracking-[0.18em] text-muted">
          <span className="text-ink">Cognition · Creative Testing Lab</span>
          <span>batch {batch.batch_id}</span>
          <span>{new Date(batch.generated_at).toISOString().replace("T", " ").slice(0, 16)}Z</span>
          <span className="text-accent">run complete</span>
        </div>
        <h1 className="mt-8 max-w-3xl text-[30px] leading-[1.15] tracking-tight sm:text-[38px]">
          Meta static batch — {batch.concepts.length} angles, {statics} renders, awaiting your review.
        </h1>
        <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted">{batch.batch_direction}</p>

        <dl className="mt-10 grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-4">
          {[
            ["Angles", `${batch.concepts.length} · 3 self-serve / 2 enterprise`],
            ["Statics", `${statics} · 1080×1080 + 1080×1350`],
            ["Brand Lock", `${passed}/${batch.concepts.length} concepts passed`],
            ["Push", "Simulated · no Meta API"],
          ].map(([k, v]) => (
            <div key={k} className="bg-panel px-5 py-4">
              <dt className="mono text-[10px] uppercase tracking-[0.18em] text-muted">{k}</dt>
              <dd className="mt-2 text-[13px] text-ink">{v}</dd>
            </div>
          ))}
        </dl>

        <ol className="mono mt-px grid gap-px border border-line border-t-0 bg-line text-[11px] sm:grid-cols-3">
          {batch.pipeline.map((s) => (
            <li key={s.stage} className="bg-panel px-5 py-4">
              <div className="flex items-baseline gap-2 text-muted">
                <span className="text-accent">0{s.stage}</span>
                <span className="uppercase tracking-[0.14em]">{s.name}</span>
              </div>
              <div className="mt-2 text-ink">{s.model ?? Object.values(s.models ?? {}).join(" · ")}</div>
              <div className="mt-1 leading-relaxed text-muted">{s.output}</div>
              <div className="mt-2 text-[10px] text-muted">{s.trace}</div>
            </li>
          ))}
        </ol>
      </header>

      <section className="pt-16">
        <SectionHead
          index="01"
          title="Research"
          note={`Synthesised by ${batch.pipeline[0].model} from ${batch.inputs[0].file} + ${batch.inputs[1].file}. Every bullet cites market-truth verbatim.`}
        />
        <ul className="mt-8 border-t border-line">
          {batch.research.map((r, i) => (
            <li key={i} className="grid gap-4 border-b border-line py-6 sm:grid-cols-[2.2fr_1.6fr] sm:gap-10">
              <p className="text-[15px] leading-relaxed">
                <span className="mono mr-3 text-[11px] text-accent">R{i + 1}</span>
                {r.bullet}
              </p>
              <figure className="border-l border-line pl-5">
                <blockquote className="text-[13px] leading-relaxed text-muted">“{r.citation}”</blockquote>
                <figcaption className="mono mt-2 text-[10px] uppercase tracking-[0.14em] text-muted">
                  {r.source} · {r.section}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </section>

      <section className="pt-16">
        <SectionHead
          index="02"
          title="New messaging angles"
          note="Five distinct angles — different JTBD, ICP and proof artifact. Each carries its kill metric and the market-truth line that licenses it."
        />
        <div className="mt-8 grid gap-px border border-line bg-line">
          {batch.concepts.map((c) => (
            <article key={c.id} className="bg-panel p-6 sm:p-7">
              <div className="mono flex flex-wrap items-center gap-3 text-[10px] uppercase tracking-[0.16em]">
                <span className={c.track === "enterprise" ? "text-accent" : "text-muted"}>{c.track}</span>
                <span className="text-muted">{c.tier}</span>
                <span className="text-muted">·</span>
                <span className="text-muted">{c.icp}</span>
              </div>
              <h3 className="mt-3 text-[20px] tracking-tight">{c.name}</h3>
              <p className="mt-2 max-w-3xl text-[14px] leading-relaxed text-muted">
                <span className="text-ink">JTBD.</span> {c.jtbd}
              </p>
              <p className="mt-1 max-w-3xl text-[14px] leading-relaxed text-muted">
                <span className="text-ink">Proof.</span> {c.proof}
              </p>

              <div className="mt-6 grid gap-px bg-line sm:grid-cols-3">
                <div className="bg-panel pt-4 sm:pr-5 sm:pt-0">
                  <div className="mono text-[10px] uppercase tracking-[0.16em] text-muted">Meta copy</div>
                  <p className="mt-2 whitespace-pre-line text-[13px] leading-relaxed">{c.copy.primary}</p>
                  <p className="mt-3 text-[13px]">
                    <span className="text-muted">Headline · </span>
                    {c.copy.headline}
                  </p>
                  <p className="text-[13px]">
                    <span className="text-muted">Description · </span>
                    {c.copy.description}
                  </p>
                </div>
                <div className="bg-panel pt-4 sm:px-5 sm:pt-0">
                  <div className="mono text-[10px] uppercase tracking-[0.16em] text-muted">Kill metric</div>
                  <p className="mt-2 text-[13px] leading-relaxed">{c.kill_metric.metric}</p>
                  <p className="mono mt-2 text-[12px] text-accent">{c.kill_metric.threshold}</p>
                  <p className="mt-2 text-[12px] leading-relaxed text-muted">{c.kill_metric.rationale}</p>
                </div>
                <div className="bg-panel pt-4 sm:pl-5 sm:pt-0">
                  <div className="mono text-[10px] uppercase tracking-[0.16em] text-muted">Citation</div>
                  <blockquote className="mt-2 text-[12px] leading-relaxed text-muted">“{c.citation.quote}”</blockquote>
                  <div className="mono mt-2 text-[10px] uppercase tracking-[0.14em] text-muted">
                    {c.citation.source} · {c.citation.section}
                  </div>
                  <div className="mono mt-4 text-[10px] uppercase tracking-[0.14em] text-muted">Never claim</div>
                  <ul className="mt-2 space-y-1 text-[12px] text-muted">
                    {c.avoid.map((a) => (
                      <li key={a}>— {a}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="pt-16">
        <SectionHead
          index="03"
          title="Statics"
          note="Rendered under a locked image spec, then reviewed against the Brand Lock checklist. Approve queues a simulated Meta push; reject writes one line into taste memory."
        />
        <Statics concepts={batch.concepts} pushNote={batch.push.note} />
      </section>

      <footer className="mono mt-20 border-t border-line pt-6 text-[10px] uppercase tracking-[0.16em] text-muted">
        <div>{batch.orchestrated_by}</div>
        <div className="mt-2">
          inputs: {batch.inputs.map((i) => `${i.file}@${i.sha256_16}`).join("  ·  ")}
        </div>
      </footer>
    </main>
  );
}
