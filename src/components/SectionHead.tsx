export function SectionHead({ index, title, note }: { index: string; title: string; note: string }) {
  return (
    <div className="grid gap-3 sm:grid-cols-[1fr_1.4fr] sm:gap-10">
      <div className="flex items-baseline gap-4">
        <span className="mono text-[11px] tracking-[0.18em] text-accent">{index}</span>
        <h2 className="text-[22px] tracking-tight">{title}</h2>
      </div>
      <p className="text-[13px] leading-relaxed text-muted">{note}</p>
    </div>
  );
}
