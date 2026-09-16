"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Concept } from "@/lib/batch";

type Decision = { state: "approved" | "rejected"; at: string; note?: string };
type Memory = Record<string, Decision>;

const MEMORY_KEY = "cognition-lab.taste-memory.v1";
const RATIOS = ["1080x1080", "1080x1350"] as const;

function loadMemory(): Memory {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(MEMORY_KEY) ?? "{}") as Memory;
  } catch {
    return {};
  }
}

export function Statics({ concepts, pushNote }: { concepts: Concept[]; pushNote: string }) {
  const [memory, setMemory] = useState<Memory>({});
  const [toast, setToast] = useState<string | null>(null);
  const [rejecting, setRejecting] = useState<string | null>(null);
  const [ratio, setRatio] = useState<(typeof RATIOS)[number]>("1080x1350");

  useEffect(() => setMemory(loadMemory()), []);

  const persist = useCallback((next: Memory) => {
    setMemory(next);
    window.localStorage.setItem(MEMORY_KEY, JSON.stringify(next));
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  const approve = (ids: string[]) => {
    const at = new Date().toISOString();
    const next = { ...memory };
    ids.forEach((id) => (next[id] = { state: "approved", at }));
    persist(next);
    setToast(
      ids.length === 1
        ? `${concepts.find((c) => c.id === ids[0])?.name} — Queued in Meta · Paused · $50 daily cap`
        : `${ids.length} concepts — Queued in Meta · Paused · $50 daily cap`,
    );
  };

  const reject = (id: string, note: string) => {
    persist({ ...memory, [id]: { state: "rejected", at: new Date().toISOString(), note: note.trim() } });
    setRejecting(null);
    setToast("Rejected — one line written to taste memory");
  };

  const shipped = concepts.filter((c) => c.status === "passed");
  const pending = shipped.filter((c) => !memory[c.id]);
  const rejected = useMemo(
    () => Object.entries(memory).filter(([, d]) => d.state === "rejected"),
    [memory],
  );

  return (
    <div className="mt-8">
      <div className="flex flex-wrap items-center justify-between gap-4 border-y border-line py-3">
        <div className="mono flex items-center gap-4 text-[10px] uppercase tracking-[0.16em] text-muted">
          <span>{shipped.length} concepts</span>
          <span className="text-accent">{pending.length} undecided</span>
          <span>{Object.values(memory).filter((d) => d.state === "approved").length} approved</span>
          <span>{rejected.length} rejected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="mono flex border border-line text-[10px] uppercase tracking-[0.16em]">
            {RATIOS.map((r) => (
              <button
                key={r}
                onClick={() => setRatio(r)}
                className={`px-3 py-1.5 ${ratio === r ? "bg-ink text-ground" : "text-muted hover:text-ink"}`}
              >
                {r.replace("1080x", "1080 × ")}
              </button>
            ))}
          </div>
          <button
            onClick={() => approve(pending.map((c) => c.id))}
            disabled={pending.length === 0}
            className="mono border border-accent px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] text-accent transition hover:bg-accent hover:text-ground disabled:border-line disabled:text-muted disabled:hover:bg-transparent disabled:hover:text-muted"
          >
            Approve all
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {concepts.map((concept) => {
          const render = concept.renders.find((r) => r.ratio === ratio) ?? concept.renders[0];
          const decision = memory[concept.id];
          return (
            <article
              key={concept.id}
              className={`flex flex-col border bg-panel ${
                decision?.state === "approved"
                  ? "border-accent/60"
                  : decision?.state === "rejected"
                    ? "border-line opacity-60"
                    : "border-line"
              }`}
            >
              <div className="mono flex items-center justify-between border-b border-line px-4 py-2.5 text-[10px] uppercase tracking-[0.16em] text-muted">
                <span>{concept.id}</span>
                <span className="flex items-center gap-3">
                  <span>{render.image_model}</span>
                  <span className={render.brand_lock.pass ? "text-accent" : "text-ink"}>
                    brand lock {render.brand_lock.pass ? "pass" : "fail"}
                    {render.attempts > 1 ? ` · regen ×${render.attempts - 1}` : ""}
                  </span>
                </span>
              </div>

              {/* Meta-style feed preview */}
              <div className="border-b border-line bg-[#101214] p-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-[11px] font-medium text-ground">
                    C
                  </div>
                  <div className="leading-tight">
                    <div className="text-[12px]">Cognition</div>
                    <div className="mono text-[9px] uppercase tracking-[0.14em] text-muted">Sponsored · Paused</div>
                  </div>
                </div>
                <p className="mt-3 whitespace-pre-line text-[12.5px] leading-relaxed text-ink/90">
                  {concept.copy.primary}
                </p>
                {render.src ? (
                  <div className="mt-3 border border-line">
                    <Image
                      src={render.src}
                      alt={`${concept.name} — ${render.ratio}`}
                      width={ratio === "1080x1080" ? 1080 : 1080}
                      height={ratio === "1080x1080" ? 1080 : 1350}
                      className="h-auto w-full"
                      priority={false}
                    />
                  </div>
                ) : (
                  <div className="mono mt-3 border border-dashed border-line p-6 text-center text-[11px] uppercase tracking-[0.16em] text-muted">
                    failed brand lock — no static shipped
                  </div>
                )}
                <div className="flex items-center justify-between gap-4 border border-t-0 border-line bg-[#0b0d0e] px-3 py-2.5">
                  <div className="min-w-0">
                    <div className="truncate text-[12.5px]">{concept.copy.headline}</div>
                    <div className="mono truncate text-[10px] uppercase tracking-[0.12em] text-muted">
                      devin.ai · {concept.copy.description}
                    </div>
                  </div>
                  <span className="mono shrink-0 border border-line px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-ink">
                    {concept.cta}
                  </span>
                </div>
              </div>

              <div className="grow px-4 py-3">
                <p className="text-[12px] leading-relaxed text-muted">{concept.visual.concept_line}</p>
                <div className="mono mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[10px] uppercase tracking-[0.14em] text-muted">
                  <span>{concept.track}</span>
                  <span>ground {concept.visual.ground}</span>
                  <span>negative space {concept.visual.negative_space_pct}%</span>
                  <span>kill: {concept.kill_metric.threshold}</span>
                </div>
              </div>

              {rejecting === concept.id ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const input = new FormData(e.currentTarget).get("note");
                    reject(concept.id, typeof input === "string" ? input : "");
                  }}
                  className="flex items-center gap-2 border-t border-line px-4 py-3"
                >
                  <input
                    name="note"
                    autoFocus
                    maxLength={120}
                    placeholder="One line: what made this wrong?"
                    className="mono w-full bg-transparent text-[11px] text-ink outline-none placeholder:text-muted"
                  />
                  <button
                    type="submit"
                    className="mono shrink-0 border border-line px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-ink hover:border-ink"
                  >
                    Save
                  </button>
                </form>
              ) : (
                <div className="flex items-stretch border-t border-line">
                  {decision ? (
                    <div className="mono flex w-full items-center justify-between px-4 py-3 text-[10px] uppercase tracking-[0.16em]">
                      <span className={decision.state === "approved" ? "text-accent" : "text-muted"}>
                        {decision.state === "approved"
                          ? "Queued in Meta · Paused · $50 daily cap"
                          : `Rejected${decision.note ? ` · ${decision.note}` : ""}`}
                      </span>
                      <button
                        onClick={() => {
                          const next = { ...memory };
                          delete next[concept.id];
                          persist(next);
                        }}
                        className="text-muted hover:text-ink"
                      >
                        Undo
                      </button>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => approve([concept.id])}
                        disabled={!render.src}
                        className="mono grow border-r border-line py-3 text-[11px] uppercase tracking-[0.16em] text-ink transition hover:bg-accent hover:text-ground disabled:text-muted disabled:hover:bg-transparent"
                      >
                        ✓ Approve
                      </button>
                      <button
                        onClick={() => setRejecting(concept.id)}
                        className="mono grow py-3 text-[11px] uppercase tracking-[0.16em] text-muted transition hover:bg-ink hover:text-ground"
                      >
                        ✗ Reject
                      </button>
                    </>
                  )}
                </div>
              )}
            </article>
          );
        })}
      </div>

      <div className="mt-10 border border-line bg-panel px-5 py-4">
        <div className="mono flex items-center justify-between text-[10px] uppercase tracking-[0.16em] text-muted">
          <span>Taste memory · localStorage</span>
          {rejected.length > 0 && (
            <button
              onClick={() => persist({})}
              className="text-muted hover:text-ink"
            >
              Clear
            </button>
          )}
        </div>
        {rejected.length === 0 ? (
          <p className="mt-3 text-[12px] text-muted">
            Empty. Rejections and their one-line reason land here and steer the next batch.
          </p>
        ) : (
          <ul className="mt-3 space-y-2">
            {rejected.map(([id, d]) => (
              <li key={id} className="mono text-[11px] text-muted">
                <span className="text-ink">{id}</span> — {d.note || "no reason given"}{" "}
                <span className="text-[10px]">{d.at.slice(0, 16).replace("T", " ")}Z</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="mono mt-4 text-[10px] uppercase tracking-[0.14em] text-muted">{pushNote}</p>

      {toast && (
        <div
          role="status"
          className="mono fixed bottom-6 left-1/2 z-50 -translate-x-1/2 border border-accent bg-panel px-5 py-3 text-[11px] uppercase tracking-[0.16em] text-ink shadow-[0_0_40px_rgba(0,0,0,0.6)]"
        >
          {toast}
        </div>
      )}
    </div>
  );
}
