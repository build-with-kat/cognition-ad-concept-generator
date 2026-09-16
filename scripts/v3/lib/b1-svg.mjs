// B1 "The feature shipped. The cleanup didn't." — exact SVG per Astra's production spec
// (data/stages/v3-3-astra-refine.json -> b1.canvas_1080x1350). All text is typeset here, never generated.
const GROUND = "#F7F6F5";
const INK = "#191919";
const ACCENT = "#317CFF";

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Astra's boxes are top-left layout boxes; convert to a baseline inside the line box.
const baseline = (y, size, lh) => y + lh / 2 + size * 0.355;

function text({ content, x, y, size, lh = size * 1.2, weight = 500, color = INK, tracking = 0, anchor = "start" }) {
  return content
    .split("\n")
    .map(
      (line, i) =>
        `<text x="${x}" y="${baseline(y + i * lh, size, lh)}" font-family="Inter" font-weight="${weight}" font-size="${size}" fill="${color}" letter-spacing="${tracking}" text-anchor="${anchor}" xml:space="preserve">${esc(line)}</text>`,
    )
    .join("\n");
}

const translate = (x, y, body) => `<g transform="translate(${x} ${y})">${body}</g>`;

export function b1Svg(v) {
  const {
    W, H,
    sig, cat, head, headSize, headLh, headTrack,
    illLabel, illLabelSize,
    featY, featH, featPath,
    featLabelY, featLabelSize, shippedY, shippedSize,
    leafFarY, leafNearY, leafH,
    sheetY, sheetH, sheetPath,
    repoLabelY, migY, depY, depLh, covY, nounSize,
    support, supportY, supportSize, supportLh,
    accentY, accentH, capability, capabilityY, capabilitySize, capabilityLh,
    ctaX, ctaY, ctaW, ctaH, ctaSize,
  } = v;

  const cols = [72, 392, 712];
  const labelX = cols.map((c) => c + 20);

  const parts = [];
  parts.push(`<rect width="${W}" height="${H}" fill="${GROUND}"/>`);

  parts.push(text({ content: "Devin", x: 72, y: sig.y, size: sig.size, lh: sig.lh, weight: 500, tracking: -0.5 }));
  parts.push(text({ content: "The AI software engineer", x: cat.x, y: cat.y, size: cat.size, lh: cat.lh, weight: 400 }));

  parts.push(
    text({ content: head, x: 72, y: v.headY, size: headSize, lh: headLh, weight: 500, tracking: headTrack }),
  );
  parts.push(
    text({
      content: "ILLUSTRATIVE REPOSITORY WORKLOADS",
      x: 72,
      y: v.illLabelY,
      size: illLabelSize,
      lh: illLabelSize * 1.26,
      weight: 500,
      color: "#6B6B6B",
      tracking: 1.4,
    }),
  );
  void illLabel;

  // backing leaves (painted first)
  for (const c of cols) {
    parts.push(`<rect x="${c + 12}" y="${leafFarY}" width="272" height="${leafH}" fill="#FFFFFF" stroke="${INK}" stroke-width="2"/>`);
    parts.push(`<rect x="${c + 6}" y="${leafNearY}" width="284" height="${leafH}" fill="#FFFFFF" stroke="${INK}" stroke-width="2"/>`);
  }

  // remaining repository sheets (torn top)
  for (const c of cols) {
    parts.push(translate(c, sheetY, `<path d="${sheetPath}" fill="#FFFFFF" stroke="${INK}" stroke-width="2"/>`));
  }
  // detached feature sections (torn bottom)
  for (const c of cols) {
    parts.push(translate(c, featY, `<path d="${featPath}" fill="#FFFFFF" stroke="${INK}" stroke-width="2"/>`));
  }
  void featH;
  void sheetH;

  for (const x of labelX) {
    parts.push(text({ content: "FEATURE WORK", x, y: featLabelY, size: featLabelSize, lh: featLabelSize * 1.26, weight: 500, color: "#6B6B6B", tracking: 1.2 }));
    parts.push(text({ content: "SHIPPED", x, y: shippedY, size: shippedSize, lh: shippedSize * 1.2, weight: 600, tracking: 0.6 }));
    parts.push(text({ content: "REPOSITORY", x, y: repoLabelY, size: featLabelSize, lh: featLabelSize * 1.26, weight: 500, color: "#6B6B6B", tracking: 1.2 }));
    parts.push(text({ content: "Migrations", x, y: migY, size: nounSize, lh: nounSize * 1.24, weight: 500 }));
    parts.push(text({ content: "Dependency\nupgrades", x, y: depY, size: nounSize, lh: depLh, weight: 500 }));
    parts.push(text({ content: "Coverage gaps", x, y: covY, size: nounSize, lh: nounSize * 1.24, weight: 500 }));
  }

  parts.push(text({ content: support, x: 72, y: supportY, size: supportSize, lh: supportLh, weight: 400 }));

  parts.push(`<rect x="72" y="${accentY}" width="6" height="${accentH}" fill="${ACCENT}"/>`);
  parts.push(
    text({ content: capability, x: 96, y: capabilityY, size: capabilitySize, lh: capabilityLh, weight: 500 }),
  );

  parts.push(`<rect x="${ctaX}" y="${ctaY}" width="${ctaW}" height="${ctaH}" rx="8" fill="#000000"/>`);
  parts.push(
    text({
      content: "Contact sales",
      x: ctaX + ctaW / 2,
      y: ctaY + (ctaH - ctaSize * 1.24) / 2,
      size: ctaSize,
      lh: ctaSize * 1.24,
      weight: 500,
      color: "#FFFFFF",
      anchor: "middle",
    }),
  );

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${parts.join("\n")}</svg>`;
}

export const PORTRAIT = {
  W: 1080,
  H: 1350,
  sig: { y: 140, size: 44, lh: 52 },
  cat: { x: 284, y: 150, size: 30, lh: 38 },
  head: "The feature shipped.\nThe cleanup didn't.",
  headY: 240,
  headSize: 76,
  headLh: 82,
  headTrack: -1.5,
  illLabel: true,
  illLabelY: 422,
  illLabelSize: 27,
  featY: 474,
  featH: 108,
  featPath:
    "M0 0 H296 V100 L270 108 L244 99 L218 107 L192 100 L166 108 L140 99 L114 107 L88 100 L62 108 L36 99 L0 106 Z",
  featLabelY: 487,
  featLabelSize: 30,
  shippedY: 530,
  shippedSize: 32,
  leafFarY: 642,
  leafNearY: 630,
  leafH: 324,
  sheetY: 619,
  sheetH: 324,
  sheetPath:
    "M0 6 L36 -1 L62 8 L88 0 L114 7 L140 -1 L166 8 L192 0 L218 7 L244 -1 L270 8 L296 0 V324 H0 Z",
  repoLabelY: 646,
  migY: 710,
  depY: 772,
  depLh: 40,
  covY: 872,
  nounSize: 34,
  support: "Migrations, dependency upgrades,\ncoverage gaps — across every repo.",
  supportY: 986,
  supportSize: 36,
  supportLh: 44,
  accentY: 1096,
  accentH: 32,
  capability: "Devin playbooks for recurring maintenance.",
  capabilityY: 1092,
  capabilitySize: 32,
  capabilityLh: 40,
  ctaX: 72,
  ctaY: 1140,
  ctaW: 336,
  ctaH: 72,
  ctaSize: 34,
};
