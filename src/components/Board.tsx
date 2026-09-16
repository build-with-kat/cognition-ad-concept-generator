"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Angle, Batch, Execution, Finding, FormatKey } from "@/lib/batch";

type Decision = { state: "approved" | "rejected"; note?: string; at: string };
type Decisions = Record<string, Decision>;

const STORE = "devin-creative-lab/decisions/v3";

function useDecisions() {
  const [decisions, setDecisions] = useState<Decisions>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORE);
      if (raw) setDecisions(JSON.parse(raw) as Decisions);
    } catch {
      // ignore unreadable storage
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(STORE, JSON.stringify(decisions));
    } catch {
      // ignore unwritable storage
    }
  }, [decisions, loaded]);

  return { decisions, setDecisions, loaded };
}

export default function Board({ batch }: { batch: Batch }) {
  const executions = useMemo(() => batch.angles.flatMap((a) => a.executions), [batch]);
  const { decisions, setDecisions, loaded } = useDecisions();
  const [toast, setToast] = useState<string | null>(null);
  const [detail, setDetail] = useState<{ execution: Execution; angle: Angle } | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const say = useCallback((message: string) => {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3200);
  }, []);

  const approve = useCallback(
    (id: string) => {
      setDecisions((d) => ({ ...d, [id]: { state: "approved", at: new Date().toISOString() } }));
      say("Approved for demo queue — nothing published.");
    },
    [say, setDecisions],
  );

  const reject = useCallback(
    (id: string, note: string) => {
      setDecisions((d) => ({ ...d, [id]: { state: "rejected", note, at: new Date().toISOString() } }));
      say("Rejected. Feedback saved in this browser.");
    },
    [say, setDecisions],
  );

  const undo = useCallback(
    (id: string) => {
      setDecisions((d) => {
        const next = { ...d };
        delete next[id];
        return next;
      });
    },
    [setDecisions],
  );

  const pending = executions.filter((e) => !decisions[e.id]);

  const approveAll = () => {
    if (!pending.length) return;
    const at = new Date().toISOString();
    setDecisions((d) => {
      const next = { ...d };
      for (const e of executions) if (!next[e.id]) next[e.id] = { state: "approved", at };
      return next;
    });
    say("Approved for demo queue — nothing published.");
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-line bg-ground/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1180px] items-center justify-between gap-6 px-6 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <Image src="/brand/devin-logo.png" alt="Devin" width={1988} height={529} priority className="h-5 w-auto shrink-0" />
            <div className="min-w-0 border-l border-line pl-3">
              <h1 className="truncate text-[17px] font-semibold tracking-[-0.01em]">{batch.product.title}</h1>
              <p className="truncate text-[12px] text-muted">{batch.product.subtitle}</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <span className="hidden text-[11px] uppercase tracking-[0.14em] text-muted sm:inline">Demo only</span>
            <button
              type="button"
              onClick={approveAll}
              disabled={!loaded || pending.length === 0}
              className="h-11 rounded-full bg-ink px-5 text-[14px] font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-35"
            >
              Approve all ({loaded ? pending.length : executions.length})
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1180px] px-6 pb-24">
        <Research findings={batch.research} />

        {batch.angles.map((angle) => (
          <section key={angle.id} className="pt-10">
            <AngleIntro angle={angle} />
            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
              {angle.executions.map((execution) => (
                <CreativeCard
                  key={execution.id}
                  execution={execution}
                  decision={decisions[execution.id]}
                  loaded={loaded}
                  onApprove={() => approve(execution.id)}
                  onReject={(note) => reject(execution.id, note)}
                  onUndo={() => undo(execution.id)}
                  onOpen={() => setDetail({ execution, angle })}
                />
              ))}
            </div>
          </section>
        ))}

        <HowItWasBuilt batch={batch} />
      </main>

      {toast && (
        <div
          role="status"
          className="fixed inset-x-0 bottom-6 z-40 mx-auto w-fit rounded-full bg-ink px-5 py-3 text-[13px] text-white shadow-lg"
        >
          {toast}
        </div>
      )}

      {detail && <DetailView execution={detail.execution} angle={detail.angle} onClose={() => setDetail(null)} />}
    </div>
  );
}

function Research({ findings }: { findings: Finding[] }) {
  return (
    <section className="pt-6">
      <h2 className="text-[11px] uppercase tracking-[0.14em] text-muted">Research</h2>
      <div className="mt-3 grid gap-3 md:grid-cols-3">
        {findings.map((f) => (
          <div key={f.id} className="rounded-xl border border-line bg-card p-4 text-[13px] leading-relaxed">
            <div className="text-[11px] uppercase tracking-[0.12em] text-muted">{f.kind}</div>
            <p className="mt-1.5 font-medium">{f.finding}</p>
            <p className="mt-2 text-muted">Implication: {f.implication}</p>
            <p className="mt-2 text-[12px] text-muted">
              Source:{" "}
              {f.citation.segments ? (
                f.citation.segments.map((s, i) =>
                  s.url ? (
                    <a
                      key={i}
                      className="text-accent underline underline-offset-2"
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {s.text}
                    </a>
                  ) : (
                    <span key={i}>{s.text}</span>
                  ),
                )
              ) : f.citation.url ? (
                <a
                  className="text-accent underline underline-offset-2"
                  href={f.citation.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {f.citation.label}
                </a>
              ) : (
                f.citation.label
              )}
            </p>
            {f.citation.note && <p className="mt-1 text-[12px] text-muted">{f.citation.note}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}

function AngleIntro({ angle }: { angle: Angle }) {
  return (
    <div>
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="text-[11px] uppercase tracking-[0.14em] text-muted">
          {angle.track === "self-serve" ? "Self-serve" : "Enterprise"}
        </span>
        <h2 className="text-[22px] font-semibold tracking-[-0.02em]">{angle.title}</h2>
      </div>
      <p className="mt-1 max-w-3xl text-[13px] text-muted">ICP: {angle.audience}</p>
      <p className="mt-2 max-w-3xl text-[14px] leading-relaxed">Insight: {angle.insight}</p>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-[0.12em] text-muted">{label}</div>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

function CreativeCard({
  execution,
  decision,
  loaded,
  onApprove,
  onReject,
  onUndo,
  onOpen,
}: {
  execution: Execution;
  decision?: Decision;
  loaded: boolean;
  onApprove: () => void;
  onReject: (note: string) => void;
  onUndo: () => void;
  onOpen: () => void;
}) {
  const [format, setFormat] = useState<FormatKey>("4:5");
  const [feedback, setFeedback] = useState(false);
  const [note, setNote] = useState("");
  const render = execution.formats[format];

  return (
    <article className="overflow-hidden rounded-2xl border border-line bg-card">
      <div className="flex items-center justify-between gap-3 px-4 pt-3">
        <span className="text-[11px] uppercase tracking-[0.12em] text-muted">{execution.short_label}</span>
        <div className="flex items-center gap-1 rounded-full border border-line p-0.5">
          {(["4:5", "1:1"] as FormatKey[]).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFormat(f)}
              aria-pressed={format === f}
              className={`min-h-10 rounded-full px-4 text-[12px] font-medium transition ${
                format === f ? "bg-ink text-white" : "text-muted hover:text-ink"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={onOpen}
        className="mt-2 flex w-full cursor-zoom-in justify-center px-4"
        aria-label="Open full creative detail"
      >
        <Image
          src={render.src}
          alt={`${execution.short_label} — ${execution.ad.headline.replace(/\n/g, " ")}`}
          width={render.width}
          height={render.height}
          priority
          className="h-auto max-h-[min(52vh,520px)] w-auto max-w-full rounded-lg border border-line object-contain"
        />
      </button>

      <div className="p-4 pt-3">
        {decision?.state === "approved" ? (
          <Resolved
            tone="approved"
            label="Approved for demo queue"
            detail="Applies to both 4:5 and 1:1. Nothing published."
            onUndo={onUndo}
          />
        ) : decision?.state === "rejected" ? (
          <Resolved
            tone="rejected"
            label="Rejected"
            detail={decision.note ? `Saved feedback: “${decision.note}”` : "Saved in this browser."}
            onUndo={onUndo}
          />
        ) : (
          <>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onApprove}
                disabled={!loaded}
                className="h-12 flex-[2] rounded-lg bg-ink text-[15px] font-medium text-white transition hover:opacity-90 disabled:opacity-40"
              >
                ✓ Approve
              </button>
              <button
                type="button"
                onClick={() => setFeedback((v) => !v)}
                aria-expanded={feedback}
                className="h-12 flex-1 rounded-lg border border-line text-[15px] font-medium text-ink transition hover:border-ink"
              >
                Reject
              </button>
            </div>
            {feedback && (
              <form
                className="mt-2 flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  onReject(note.trim());
                }}
              >
                <input
                  autoFocus
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="One line: what is wrong with it?"
                  className="h-11 min-w-0 flex-1 rounded-lg border border-line bg-ground px-3 text-[14px] outline-none focus:border-ink"
                />
                <button type="submit" className="h-11 shrink-0 rounded-lg border border-ink px-4 text-[14px] font-medium">
                  Save
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </article>
  );
}

function Resolved({
  tone,
  label,
  detail,
  onUndo,
}: {
  tone: "approved" | "rejected";
  label: string;
  detail: string;
  onUndo: () => void;
}) {
  return (
    <div className="flex min-h-12 items-center justify-between gap-3 rounded-lg border border-line bg-ground px-4 py-2.5">
      <div className="min-w-0">
        <div className="flex items-center gap-2 text-[14px] font-medium">
          <span aria-hidden className={tone === "approved" ? "text-accent" : "text-muted"}>
            {tone === "approved" ? "✓" : "✕"}
          </span>
          {label}
        </div>
        <p className="text-[12px] text-muted">{detail}</p>
      </div>
      <button type="button" onClick={onUndo} className="h-11 shrink-0 rounded-lg border border-line px-4 text-[13px] font-medium hover:border-ink">
        Undo
      </button>
    </div>
  );
}

function DetailView({ execution, angle, onClose }: { execution: Execution; angle: Angle; onClose: () => void }) {
  const [format, setFormat] = useState<FormatKey>("4:5");
  const render = execution.formats[format];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div role="dialog" aria-modal className="fixed inset-0 z-50 overflow-y-auto bg-ink/45 p-4 sm:p-8" onClick={onClose}>
      <div
        className="mx-auto grid max-w-[1000px] gap-8 rounded-2xl border border-line bg-card p-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-1 rounded-full border border-line p-0.5">
              {(["4:5", "1:1"] as FormatKey[]).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFormat(f)}
                  aria-pressed={format === f}
                  className={`min-h-10 rounded-full px-4 text-[12px] font-medium ${format === f ? "bg-ink text-white" : "text-muted"}`}
                >
                  {f}
                </button>
              ))}
            </div>
            <span className="text-[12px] text-muted">
              {render.width}×{render.height}
            </span>
          </div>
          <Image
            src={render.src}
            alt={execution.ad.headline.replace(/\n/g, " ")}
            width={render.width}
            height={render.height}
            className="h-auto w-full rounded-lg border border-line"
          />
          <div className="mt-3 flex flex-wrap gap-2">
            {(["4:5", "1:1"] as FormatKey[]).map((f) => (
              <a
                key={f}
                href={execution.formats[f].src}
                download
                className="rounded-lg border border-line px-3 py-2 text-[13px] font-medium hover:border-ink"
              >
                Download {f} PNG
              </a>
            ))}
          </div>
        </div>

        <div className="text-[13px] leading-relaxed">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-[11px] uppercase tracking-[0.12em] text-muted">{execution.short_label}</div>
              <h3 className="mt-1 text-[20px] font-semibold tracking-[-0.02em]">{angle.title}</h3>
            </div>
            <button type="button" onClick={onClose} aria-label="Close" className="h-9 rounded-lg border border-line px-3 text-[13px]">
              Close
            </button>
          </div>

          <div className="mt-5 grid gap-4">
            <Field label="On-image copy">
              <p className="whitespace-pre-line font-medium">{execution.ad.headline}</p>
              <p className="mt-1">{execution.ad.support}</p>
              {execution.ad.qualifier && <p className="mt-1 text-muted">{execution.ad.qualifier}</p>}
              <p className="mt-1 text-muted">CTA: {execution.ad.cta}</p>
            </Field>
            <Field label="Meta primary text">
              <p className="whitespace-pre-line">{execution.meta.primary}</p>
            </Field>
            <Field label="Headline">{execution.meta.headline}</Field>
            <Field label="Description">{execution.meta.description}</Field>
            <Field label="Destination">
              <a className="text-accent underline underline-offset-2" href={execution.ad.destination.url} target="_blank" rel="noreferrer">
                {execution.ad.destination.url}
              </a>
              <p className="mt-1 text-muted">
                {execution.ad.destination.note} Checked {execution.ad.destination.checked_at} · HTTP {execution.ad.destination.http_status}.
              </p>
            </Field>
            <Field label="Source evidence for this claim">
              <p>{execution.proof.statement}</p>
              <p className="mt-1 text-muted">
                {execution.proof.attribution}
                {execution.proof.source_url && (
                  <>
                    {" · "}
                    <a className="text-accent underline underline-offset-2" href={execution.proof.source_url} target="_blank" rel="noreferrer">
                      customer story
                    </a>
                  </>
                )}
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-muted">
                {execution.claims_avoided.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </Field>
            <Field label="Why this angle">
              <blockquote className="border-l-2 border-line pl-3 italic">“{angle.evidence.quote}”</blockquote>
              <p className="mt-1 text-muted">
                Source: {angle.evidence.citation.label}
                {angle.evidence.citation.url ? ` · ${angle.evidence.citation.url}` : ""}
              </p>
              <p className="mt-2">{angle.hypothesis}</p>
              <p className="mt-2 text-muted">
                Reading (synthesis, not independently verified): {angle.evidence.reading}
              </p>
              <p className="mt-2 text-muted">
                Proposed success metric: {angle.measurement.metric}. {angle.measurement.definition_note}
              </p>
            </Field>
            <details className="rounded-lg border border-line bg-ground p-3">
              <summary className="cursor-pointer text-[13px] font-medium">Meta feed preview</summary>
              <div className="mt-3 rounded-lg border border-line bg-card p-3">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-ink" />
                  <div>
                    <div className="text-[12px] font-medium">Cognition</div>
                    <div className="text-[11px] text-muted">Sponsored</div>
                  </div>
                </div>
                <p className="mt-2 whitespace-pre-line text-[12px]">{execution.meta.primary}</p>
                <Image
                  src={execution.formats["1:1"].src}
                  alt=""
                  width={1080}
                  height={1080}
                  className="mt-2 h-auto w-full rounded"
                />
                <div className="mt-2 flex items-center justify-between gap-3 rounded bg-ground px-3 py-2">
                  <div className="min-w-0">
                    <div className="truncate text-[12px] font-medium">{execution.meta.headline}</div>
                    <div className="truncate text-[11px] text-muted">{execution.meta.description}</div>
                  </div>
                  <span className="shrink-0 rounded bg-ink px-2.5 py-1 text-[11px] text-white">{execution.ad.cta}</span>
                </div>
              </div>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}

const RESEARCH_FOLDER = "https://drive.google.com/drive/folders/1LSSCDx2hzmXfxMiRJCXm4HbBqXVgIh62?usp=sharing";

function HowItWasBuilt({ batch }: { batch: Batch }) {
  return (
    <footer className="mt-16 border-t border-line pt-8">
      <h2 className="text-[11px] uppercase tracking-[0.14em] text-muted">How it was built</h2>
      <ol className="mt-4 grid gap-4 text-[13px] leading-relaxed md:grid-cols-2">
        <li className="rounded-xl border border-line bg-card p-5">
          <div className="text-[11px] uppercase tracking-[0.12em] text-muted">Step 1</div>
          <p className="mt-1.5 font-medium">Research with Grok Bot</p>
          <p className="mt-2 text-muted">
            Used Grok Bot to research buyer language, competitor campaigns, and Devin’s positioning, then organize the findings into
            Markdown inputs.
          </p>
          <a
            className="mt-2 inline-block text-accent underline underline-offset-2"
            href={RESEARCH_FOLDER}
            target="_blank"
            rel="noopener noreferrer"
          >
            View research files
          </a>
        </li>
        <li className="rounded-xl border border-line bg-card p-5">
          <div className="text-[11px] uppercase tracking-[0.12em] text-muted">Step 2</div>
          <p className="mt-1.5 font-medium">Brief development with ChatGPT</p>
          <p className="mt-2 text-muted">
            Used ChatGPT to turn the research and review feedback into scoped instructions for Devin, with the goal of conserving Devin
            usage.
          </p>
        </li>
        <li className="rounded-xl border border-line bg-card p-5">
          <div className="text-[11px] uppercase tracking-[0.12em] text-muted">Step 3</div>
          <p className="mt-1.5 font-medium">Creative production orchestrated by Devin</p>
          <p className="mt-2 text-muted">
            Devin passed the research to Claude to develop messaging for self-serve developers and enterprise engineering buyers. Astra
            directed and critiqued the concepts, including an experiment with ChatGPT Images 2.5. The final selected statics were composed
            in code with the supplied Devin logo for precise typography and layout.
          </p>
        </li>
        <li className="rounded-xl border border-line bg-card p-5">
          <div className="text-[11px] uppercase tracking-[0.12em] text-muted">Step 4</div>
          <p className="mt-1.5 font-medium">Deployment through GitHub and Vercel</p>
          <p className="mt-2 text-muted">Committed the app to GitHub and deployed it to Vercel.</p>
        </li>
      </ol>
      <div className="mt-6 border-t border-line pt-4 text-[12px] text-muted">
        <p>
          Execution records: strategy {batch.pipeline[0].model}, direction and critique {batch.pipeline[1].model}, one rejected
          image-generation experiment on {batch.pipeline[3].model}, final composition with {batch.pipeline[4].engine} in{" "}
          {batch.pipeline[4].typeface} over the supplied Devin logo file — no generated pixels in the finished ads. Prompts and model
          outputs are recorded in data/stages.
        </p>
        <ul className="mt-3 list-disc space-y-1 pl-5">
          {batch.limitations.map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ul>
        <p className="mt-3">
          Generated {new Date(batch.generated_at).toISOString().slice(0, 10)}. Independent project, not affiliated with Cognition.
        </p>
      </div>
    </footer>
  );
}
