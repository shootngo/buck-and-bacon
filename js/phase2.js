import { ANIMALS, TOOLS } from "./cuts.js";
import { diagramSvg } from "./diagrams.js";
import { JERKY_TOPICS } from "./jerky.js";

function esc(s) {
  return String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function list(items) {
  return `<ol class="how-list">${items.map((i) => `<li>${esc(i)}</li>`).join("")}</ol>`;
}

function pills(items) {
  return `<div class="use-pills">${items.map((i) => `<span class="use-pill">${esc(i)}</span>`).join("")}</div>`;
}

function linksHtml(links) {
  if (!links || !links.length) return "";
  return `<div class="link-row">${links
    .map((l) => {
      const ext = l.external
        ? ` target="_blank" rel="noopener noreferrer"`
        : "";
      return `<a class="ghost-link" href="${esc(l.href)}"${ext}>${esc(l.label)}</a>`;
    })
    .join("")}</div>`;
}

export function stayOnToggleHtml({ enabled, label, prominent }) {
  const on = enabled ? "is-on" : "";
  const size = prominent ? "is-prominent" : "is-compact";
  return `<button type="button" class="stay-on-btn ${on} ${size}" data-action="stay-on" aria-pressed="${enabled ? "true" : "false"}">
    <span class="stay-switch" aria-hidden="true"><span class="stay-knob"></span></span>
    <span class="stay-copy">
      <strong>Screen stay-on</strong>
      <span class="stay-label">${esc(label)}</span>
    </span>
  </button>`;
}

export function butcheringHomeHtml() {
  const cards = ANIMALS.map(
    (a) => `<a class="animal-card" href="#/butchering/${esc(a.id)}">
      <span class="kicker">${esc(a.shortName)}</span>
      <span class="name">${esc(a.name)}</span>
      <span class="tag">${esc(a.tagline)}</span>
    </a>`,
  ).join("");
  return `
    <p class="kicker">Butchering</p>
    <h2 class="recipe-title">Pick the animal</h2>
    <p class="lede">Select an animal, tap a cut on the chart, and get shop notes — how to take it off, what it’s for, and where sausage, jerky, or cure fits.</p>
    <div class="animal-grid">${cards}</div>
    <a class="recipe-card tools-card" href="#/butchering/tools">
      <span class="name">Shop tools &amp; techniques</span>
      <span class="tag">Knives, saw, gambrel, cold chain — diagrams and written steps</span>
    </a>
    <p class="lede shop-note">Work cold. Sharp knife. This is a home-processor chart, not locker inspection.</p>
  `;
}

export function animalPageHtml(animal) {
  const svg = diagramSvg(animal);
  const cuts = animal.cuts
    .map(
      (c) => `<a class="cut-card" href="#/butchering/${esc(animal.id)}/${esc(c.id)}">
        <span class="cut-num-badge">${c.num}</span>
        <span>
          <span class="name">${esc(c.name)}</span>
          <span class="tag">${esc(c.aka || c.uses[0] || "")}</span>
        </span>
      </a>`,
    )
    .join("");
  const sources = linksHtml(animal.sources.map((s) => ({ ...s, external: true })));
  return `
    <p class="kicker">${esc(animal.shortName)}</p>
    <h2 class="recipe-title">${esc(animal.name)}</h2>
    <p class="lede">${esc(animal.blurb)}</p>
    <div class="cut-map">
      ${svg}
      <p class="cut-map-hint">${esc(animal.diagram.caption)}</p>
    </div>
    <h3 class="section-label">Cuts</h3>
    <div class="cut-list">${cuts}</div>
    <h3 class="section-label">Typical breakdown order</h3>
    ${list(animal.breakOrder)}
    <h3 class="section-label">Read more</h3>
    ${sources}
  `;
}

export function cutPageHtml(animal, cut) {
  const svg = diagramSvg(animal, { selectedId: cut.id });
  return `
    <p class="kicker">${esc(animal.shortName)} · cut ${cut.num}</p>
    <h2 class="recipe-title">${esc(cut.name)}</h2>
    ${cut.aka ? `<p class="lede aka">Also called: ${esc(cut.aka)}</p>` : ""}
    <div class="cut-map cut-map-detail">
      ${svg}
    </div>
    <p class="lede">${esc(cut.description)}</p>
    <h3 class="section-label">How to cut / break it down</h3>
    ${list(cut.howTo)}
    <h3 class="section-label">Typical uses</h3>
    ${pills(cut.uses)}
    <h3 class="section-label">Tools</h3>
    ${pills(cut.tools)}
    ${
      cut.links.length
        ? `<h3 class="section-label">Next in this app</h3>${linksHtml(cut.links)}`
        : ""
    }
  `;
}

export function toolsPageHtml() {
  const items = TOOLS.map(
    (t) => `<article class="tool-card">
      <div class="tool-diagram" aria-hidden="true">${toolGlyph(t.kind)}</div>
      <h3>${esc(t.name)}</h3>
      <p class="lede">${esc(t.summary)}</p>
      ${list(t.howTo)}
    </article>`,
  ).join("");
  return `
    <p class="kicker">Butchering</p>
    <h2 class="recipe-title">Tools &amp; techniques</h2>
    <p class="lede">Shop kit for a hanging deer or a hog on the table. No video packed in V 1.2 — use the extension links on each animal if you want a walkthrough. Paste your own shop URL later if you want.</p>
    ${items}
  `;
}

function toolGlyph(kind) {
  if (kind === "saw") {
    return `<svg viewBox="0 0 80 40"><rect x="6" y="16" width="68" height="8" rx="2" fill="#c8c4b8"/><path d="M10 24 L16 34 L22 24 L28 34 L34 24 L40 34 L46 24 L52 34 L58 24 L64 34 L70 24" fill="none" stroke="#e65100" stroke-width="3"/></svg>`;
  }
  if (kind === "hang") {
    return `<svg viewBox="0 0 80 40"><path d="M16 8 H64 M40 8 V16 M24 16 H56 L50 34 H30 Z" fill="none" stroke="#ffcc80" stroke-width="3" stroke-linejoin="round"/></svg>`;
  }
  if (kind === "shop") {
    return `<svg viewBox="0 0 80 40"><rect x="10" y="18" width="60" height="14" rx="2" fill="#2e2e2e" stroke="#e65100"/><path d="M10 18 L20 8 H60 L70 18" fill="none" stroke="#c8c4b8" stroke-width="3"/></svg>`;
  }
  return `<svg viewBox="0 0 80 40"><path d="M12 28 L52 8 L58 14 L18 34 Z" fill="#c8c4b8"/><rect x="50" y="6" width="18" height="10" rx="2" fill="#e65100"/></svg>`;
}

export function jerkyHomeHtml() {
  const cards = JERKY_TOPICS.map(
    (t) => `<a class="recipe-card" href="#/jerky/${esc(t.id)}">
      <span class="name">${esc(t.name)}</span>
      <span class="tag">${esc(t.tagline)}</span>
    </a>`,
  ).join("");
  return `
    <p class="kicker">Jerky</p>
    <h2 class="recipe-title">Dry it right</h2>
    <p class="lede">Lean cuts, even slices, heat first, then dry. This is a starter — not a locker schedule. USDA wants 160°F on red meat and 165°F on poultry before the dehydrator does the drying.</p>
    <div class="recipe-list">${cards}</div>
  `;
}

export function jerkyTopicHtml(topic) {
  const body = topic.body.map((p) => `<p>${esc(p)}</p>`).join("");
  const marinades = (topic.marinades || [])
    .map(
      (m) => `<div class="banner note">
        <h3>${esc(m.name)}</h3>
        <ul>${m.items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>
      </div>`,
    )
    .join("");
  return `
    <p class="kicker">Jerky</p>
    <h2 class="recipe-title">${esc(topic.name)}</h2>
    <p class="lede">${esc(topic.tagline)}</p>
    <div class="prose">${body}</div>
    ${marinades}
    ${linksHtml(topic.links)}
  `;
}

export function cureExtrasHtml() {
  return `
    <h3 class="section-label">Old-time techniques (starter)</h3>
    <div class="banner note">
      <h3>Equilibrium salt</h3>
      <p>Weigh the meat. Salt at about 2–2.5% of that green weight (20–25 g salt per kg). Mix, bag, refrigerate until the salt is in. This is how a lot of modern bacon/ham shops stay consistent. Cure #1 is separate math — use the calculator above, don’t teaspoon it.</p>
    </div>
    <div class="banner note">
      <h3>Bacon from belly</h3>
      <p>Square a hog belly, apply salt + optional sugar + the computed Cure #1 for that belly’s weight, rest cold, then smoke. Full smoke schedule is still parked. Belly cut notes live under Hog.</p>
      <p><a href="#/butchering/hog/belly">Hog belly cut</a></p>
    </div>
    <div class="banner note">
      <h3>Salt pork / seasoning meat</h3>
      <p>Jowls and hocks take a dry salt pack and cold rest. Use them in beans and greens. This is preservation plus flavor, not a steak.</p>
      <p><a href="#/butchering/hog/jowl">Hog jowl</a> · <a href="#/butchering/hog/rear-hock">Ham hock</a></p>
    </div>
    <div class="banner note">
      <h3>Coming later</h3>
      <p>Canned / pressed ham, country-ham calendar, and a saved-batch log are still on the Phase 2 parking list.</p>
    </div>
  `;
}
