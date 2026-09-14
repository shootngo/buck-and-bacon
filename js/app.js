import {
  blendFatPercent,
  convert,
  fatToAdd,
  formatFeet,
  formatMassGrams,
  formatOunces,
  formatPounds,
  formatTsp,
  gramsToOunces,
  poundsToKg,
  scaleGPerKg,
  UNITS,
} from "./math.js";
import {
  CURE_ASSUMPTION,
  FAT_SOURCES,
  RECIPES,
  TARGET_BLENDS,
  WORKFLOW_TIPS,
  getRecipe,
} from "./recipes.js";
import { scaleBatch } from "./scale.js";
import {
  APP_VERSION,
  fetchRemoteVersion,
  latestVersionMessage,
  shouldActivateUpdate,
  updateFoundMessage,
} from "./update.js";

const STORAGE = "bnb-v1";
const $ = (id) => document.getElementById(id);

const state = {
  view: "home",
  recipeId: null,
  venison: 8,
  pork: 2,
  includeOptional: {},
  hTarget: 20,
  hSource: "pork-fat",
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE);
    if (!raw) return;
    Object.assign(state, JSON.parse(raw));
  } catch {
    /* ignore */
  }
}

function saveState() {
  localStorage.setItem(
    STORAGE,
    JSON.stringify({
      venison: state.venison,
      pork: state.pork,
      hTarget: state.hTarget,
      hSource: state.hSource,
    }),
  );
}

function parseNum(el, fallback = 0) {
  const n = parseFloat(el.value);
  if (!Number.isFinite(n) || n < 0) return fallback;
  return n;
}

function hideSplash() {
  const splash = $("splash");
  if (!splash || splash.classList.contains("hidden")) return;
  splash.classList.add("hidden");
  sessionStorage.setItem("bnb-splash", "1");
}

function setupSplash() {
  if (sessionStorage.getItem("bnb-splash")) {
    $("splash").classList.add("hidden");
    return;
  }
  $("splash-enter").addEventListener("click", hideSplash);
  setTimeout(hideSplash, 2200);
}

function hashFor(view, recipeId) {
  if (view === "tools") return "#/tools";
  if (view === "about") return "#/about";
  if (view === "hamburger") return "#/recipe/hamburger";
  if (view === "batch" && recipeId) return `#/recipe/${recipeId}`;
  return "#/";
}

function go(view, recipeId) {
  state.view = view;
  if (recipeId) state.recipeId = recipeId;
  $("menu").classList.add("hidden");
  const next = hashFor(view, state.recipeId);
  if (location.hash === next || (next === "#/" && !location.hash)) {
    render({ hydrate: true });
  } else {
    location.hash = next;
  }
}

function parseHash() {
  const h = (location.hash || "#/").replace(/^#/, "");
  if (h.startsWith("/recipe/")) {
    const id = h.slice("/recipe/".length);
    const recipe = getRecipe(id);
    if (!recipe) return go("home");
    state.recipeId = id;
    state.view = recipe.kind === "hamburger" ? "hamburger" : "batch";
  } else if (h.startsWith("/tools")) state.view = "tools";
  else if (h.startsWith("/about") ) state.view = "about";
  else state.view = "home";
  render({ hydrate: true });
}

function showView(id) {
  for (const el of document.querySelectorAll("main > .view")) el.classList.add("hidden");
  $(id).classList.remove("hidden");
}

function cureBadge(recipe) {
  if (recipe.kind === "hamburger") return `<span class="badge badge-burger">Not sausage</span>`;
  if (recipe.cureMode === "required") return `<span class="badge badge-cure">Cure required</span>`;
  if (recipe.cureMode === "if-smoked") return `<span class="badge badge-fresh">Cure not required (fresh)</span>`;
  return `<span class="badge badge-fresh">No cure</span>`;
}

function renderHome() {
  showView("view-home");
  $("btn-back").classList.add("hidden");
  $("header-title").textContent = "Buck and Bacon";
  $("header-sub").textContent = "Venison sausage scaler";
  $("recipe-list").innerHTML = RECIPES.map(
    (r) => `
    <button type="button" class="recipe-card" data-recipe="${r.id}">
      <span class="name">${r.name}</span>
      <span class="tag">${r.tagline}</span>
      <span class="badges">${cureBadge(r)}${r.copycat ? '<span class="badge badge-copy">Unofficial copycat</span>' : ""}</span>
    </button>`,
  ).join("");
  $("recipe-list").onclick = (e) => {
    const btn = e.target.closest("[data-recipe]");
    if (!btn) return;
    const recipe = getRecipe(btn.dataset.recipe);
    go(recipe.kind === "hamburger" ? "hamburger" : "batch", recipe.id);
  };
}

function renderBatch(opts = {}) {
  const recipe = getRecipe(state.recipeId);
  if (!recipe || recipe.kind === "hamburger") return renderHome();
  showView("view-batch");
  $("btn-back").classList.remove("hidden");
  $("header-title").textContent = recipe.name;
  $("header-sub").textContent = "Scale this batch";
  $("batch-kicker").textContent = recipe.kind === "sausage" ? "Sausage" : recipe.kind;
  $("batch-title").textContent = recipe.name;
  $("batch-tag").textContent = recipe.tagline;
  $("fat-hint").textContent = recipe.fatHint || "";
  const copy = $("batch-copycat");
  if (recipe.copycatNote) {
    copy.classList.remove("hidden");
    copy.textContent = recipe.copycatNote;
  } else {
    copy.classList.add("hidden");
  }

  if (opts.hydrate) {
    $("venison-lb").value = state.venison || "";
    $("pork-lb").value = state.pork || "";
  }

  const venison = parseNum($("venison-lb"), 0);
  const pork = parseNum($("pork-lb"), 0);
  state.venison = venison;
  state.pork = pork;
  saveState();

  const total = venison + pork;
  if (total <= 0) {
    $("batch-totals").innerHTML = "";
    $("batch-results").innerHTML = `<p class="empty">Enter venison and pork pounds to scale this recipe.</p>`;
    return;
  }

  const batch = scaleBatch(recipe, venison, pork);
  $("batch-totals").innerHTML = `
    <div class="stat"><div class="n">${formatPounds(batch.totalLb)}</div><div class="l">Total lb</div></div>
    <div class="stat"><div class="n">${batch.totalKg.toFixed(2)}</div><div class="l">Total kg</div></div>
    <div class="stat"><div class="n">${batch.porkPct.toFixed(0)}%</div><div class="l">Pork</div></div>`;

  const showOptional = (id) => state.includeOptional[`${recipe.id}:${id}`] !== false;
  const visibleIngs = batch.ingredients.filter((i) => !i.optional || showOptional(i.id));

  let cureHtml = "";
  if (recipe.cureMode === "required") {
    cureHtml = `
      <div class="banner cure-yes">
        <h3>Cure required</h3>
        <div class="cure-amount">${formatMassGrams(batch.cure.grams)} g</div>
        <div class="cure-sub">${formatOunces(batch.cure.ounces)} oz
          · ~${formatTsp(batch.cure.teaspoonsApprox)} tsp (approx)</div>
        <p class="warn-copy"><strong>Assumes ${CURE_ASSUMPTION.name}</strong> at ${CURE_ASSUMPTION.gramsPerKg} g/kg
        (${CURE_ASSUMPTION.ouncesPer25Lb} oz per 25 lb), targeting ~${CURE_ASSUMPTION.targetPpm} ppm sodium nitrite
        when the product is ${CURE_ASSUMPTION.nitritePercent}% nitrite.
        ${CURE_ASSUMPTION.labelWarning}</p>
      </div>`;
  } else if (recipe.cureMode === "if-smoked") {
    cureHtml = `
      <div class="banner cure-maybe">
        <h3>Cure not required for fresh breakfast sausage</h3>
        <p>Pan-fry or bake to 160°F. If you <strong>smoke</strong> this sausage or cook it low and slow, then Cure #1 <strong>is</strong> required. Computed amount for this batch:</p>
        <div class="cure-amount">${formatMassGrams(batch.cure.grams)} g</div>
        <div class="cure-sub">${formatOunces(batch.cure.ounces)} oz
          · ~${formatTsp(batch.cure.teaspoonsApprox)} tsp (approx)</div>
        <p class="warn-copy"><strong>Assumes ${CURE_ASSUMPTION.name}</strong> at ${CURE_ASSUMPTION.gramsPerKg} g/kg
        (${CURE_ASSUMPTION.ouncesPer25Lb} oz per 25 lb). ${CURE_ASSUMPTION.labelWarning}</p>
      </div>`;
  }

  const porkWarn =
    batch.porkPct < 15
      ? `<div class="banner note"><p>Pork is only ${batch.porkPct.toFixed(0)}% of this batch. Venison sausage this lean is often dry — ${recipe.fatHint}</p></div>`
      : "";

  const optionalToggles = batch.ingredients
    .filter((i) => i.optional)
    .map((i) => {
      const key = `${recipe.id}:${i.id}`;
      const on = state.includeOptional[key] !== false;
      return `<label class="opt-toggle"><input type="checkbox" data-opt="${i.id}" ${on ? "checked" : ""}> Include ${i.name}</label>`;
    })
    .join("");

  const ingHtml = visibleIngs
    .map((i) => {
      const unit = i.displayUnit === "ml" ? "ml" : "g";
      return `<div class="ing">
        <div>
          <div class="nm">${i.name}${i.optional ? " <span class='meta'>(optional)</span>" : ""}</div>
          <div class="meta">${i.gPerKg} g/kg${i.note ? " · " + i.note : ""}</div>
        </div>
        <div class="qty">
          <div class="g">${formatMassGrams(i.grams)} ${unit}</div>
          <div class="oz">${formatOunces(i.ounces)} oz</div>
        </div>
      </div>`;
    })
    .join("");

  const casingHtml = batch.casings
    .map((c) => {
      if (!c.feetPerLb) {
        return `<div class="ing"><div><div class="nm">${c.name}</div><div class="meta">${c.note || ""}</div></div><div class="qty"><div class="g">—</div></div></div>`;
      }
      const pieces = c.pieces
        ? `<div class="oz">~${c.pieces} ${c.pieceLabel || "pieces"} (incl. extra)</div>`
        : `<div class="oz">includes ~10% extra for waste</div>`;
      return `<div class="ing">
        <div>
          <div class="nm">${c.name}</div>
          <div class="meta">${c.note || ""}</div>
        </div>
        <div class="qty">
          <div class="g">${formatFeet(c.feet)} ft</div>
          ${pieces}
        </div>
      </div>`;
    })
    .join("");

  const tips = WORKFLOW_TIPS.map(
    (t) => `<div class="tip"><h4>${t.title}</h4><p>${t.body}</p></div>`,
  ).join("");

  const process = (recipe.processNotes || []).map((n) => `<p>${n}</p>`).join("");

  $("batch-results").innerHTML = `
    ${cureHtml}
    ${porkWarn}
    ${optionalToggles ? `<div>${optionalToggles}</div>` : ""}
    <h3 class="section-label">Seasonings (scaled)</h3>
    <div class="ing-list">${ingHtml}</div>
    <h3 class="section-label">Casing estimate</h3>
    <div class="ing-list">${casingHtml}</div>
    <h3 class="section-label">Shop notes</h3>
    <div class="tips">${tips}</div>
    <div class="banner note" style="margin-top:12px">${process}</div>
  `;

  $("batch-results").querySelectorAll("[data-opt]").forEach((box) => {
    box.addEventListener("change", () => {
      state.includeOptional[`${recipe.id}:${box.dataset.opt}`] = box.checked;
      renderBatch({});
    });
  });
}

function renderHamburger(opts = {}) {
  showView("view-hamburger");
  $("btn-back").classList.remove("hidden");
  $("header-title").textContent = "Hamburger blend";
  $("header-sub").textContent = "Fat-ratio mode";

  if (opts.hydrate) {
    $("h-venison").value = state.venison || "";
  }
  $("h-targets").innerHTML = TARGET_BLENDS.map(
    (t) => `<button type="button" class="chip ${state.hTarget === t.fatPct ? "active" : ""}" data-fat="${t.fatPct}">${t.label}</button>`,
  ).join("");
  $("h-source").innerHTML = FAT_SOURCES.map(
    (s) => `<option value="${s.id}" ${s.id === state.hSource ? "selected" : ""}>${s.name} (${s.fatPct}% fat)</option>`,
  ).join("");
  const source = FAT_SOURCES.find((s) => s.id === state.hSource) || FAT_SOURCES[0];
  $("h-source-hint").textContent = source.hint;

  const leanLb = parseNum($("h-venison"), 0);
  const leanFat = parseNum($("h-vfat"), 5);
  state.venison = leanLb;
  saveState();

  if (leanLb <= 0) {
    $("h-results").innerHTML = `<p class="empty">Enter venison pounds.</p>`;
  } else {
    const result = fatToAdd({
      leanLb,
      leanFatPct: leanFat,
      targetFatPct: state.hTarget,
      sourceFatPct: source.fatPct,
    });
    if (!result.possible) {
      $("h-results").innerHTML = `<p class="error">That fat source (${source.fatPct}%) is too lean to reach a ${state.hTarget}% blend. Pick a fattier source (fatback or 50/50 trim).</p>`;
    } else if (result.alreadyAtOrAbove) {
      $("h-results").innerHTML = `<div class="banner note"><h3>Already at or above target</h3><p>Your venison at ${leanFat}% fat is already ${leanFat >= state.hTarget ? "as fatty as" : "fattier than"} a ${100 - state.hTarget}/${state.hTarget} burger. Add 0 lb of ${source.name}.</p></div>`;
    } else {
      const fatPct = (result.fatLb / result.totalLb) * 100;
      $("h-results").innerHTML = `
        <div class="banner cure-yes">
          <h3>Add this much ${source.name}</h3>
          <div class="result-big">${formatPounds(result.addLb)} lb</div>
          <p>Total grind: <strong>${formatPounds(result.totalLb)} lb</strong>
          · ${formatPounds(result.leanOnlyLb)} lb lean + ${formatPounds(result.fatLb)} lb fat
          · ${Math.round(100 - fatPct)}/${Math.round(fatPct)} blend</p>
        </div>
        <div class="fat-bar"><span style="width:${fatPct}%"></span></div>`;
    }
  }

  const v2 = parseNum($("h2-venison"), 0);
  const p2 = parseNum($("h2-pork"), 0);
  if (v2 + p2 <= 0) {
    $("h2-results").innerHTML = "";
  } else {
    const pct = blendFatPercent({
      venisonLb: v2,
      venisonFatPct: parseNum($("h2-vfat"), 5),
      porkLb: p2,
      porkFatPct: parseNum($("h2-pfat"), 30),
    });
    $("h2-results").innerHTML = `
      <div class="banner note">
        <h3>Current grind</h3>
        <div class="result-big">${pct.toFixed(1)}% fat</div>
        <p>${formatPounds(v2 + p2)} lb total · about a ${Math.round(100 - pct)}/${Math.round(pct)} blend.</p>
      </div>
      <div class="fat-bar"><span style="width:${Math.min(pct, 100)}%"></span></div>`;
  }
}

function converterRows(value, fromUnit) {
  try {
    return UNITS.map((u) => {
      const n = convert(value, fromUnit, u);
      const label = { g: "grams", kg: "kilograms", lb: "pounds", oz: "ounces" }[u];
      const shown =
      Math.abs(n) === 0 ? "0" : Math.abs(n) < 1 ? n.toFixed(4) : n.toFixed(3);
    return `<div class="ing"><div class="nm">${label}</div><div class="qty"><div class="g">${shown} ${u}</div></div></div>`;
    }).join("");
  } catch (err) {
    return `<p class="error">${err.message}</p>`;
  }
}

function renderTools() {
  showView("view-tools");
  $("btn-back").classList.remove("hidden");
  $("header-title").textContent = "Converters";
  $("header-sub").textContent = "g · kg · lb · oz";
  updateConverters();
}

function updateConverters() {
  const fromVal = parseFloat($("c-from-val")?.value);
  const fromUnit = $("c-from-unit")?.value || "lb";
  if ($("c-results")) {
    $("c-results").innerHTML = Number.isFinite(fromVal)
      ? converterRows(fromVal, fromUnit)
      : `<p class="empty">Enter an amount.</p>`;
  }
  const rate = parseFloat($("m-rate")?.value);
  const meat = parseFloat($("m-meat")?.value);
  const unit = $("m-unit")?.value || "lb";
  if ($("m-results")) {
    if (!Number.isFinite(rate) || !Number.isFinite(meat) || rate < 0 || meat < 0) {
      $("m-results").innerHTML = `<p class="empty">Enter a g/kg rate and a meat weight.</p>`;
    } else {
      const kg = unit === "kg" ? meat : poundsToKg(meat);
      const grams = scaleGPerKg(rate, kg);
      $("m-results").innerHTML = `
        <div class="banner note">
          <h3>${rate} g/kg × ${kg.toFixed(3)} kg meat</h3>
          <div class="result-big">${formatMassGrams(grams)} g</div>
          <p>${formatOunces(gramsToOunces(grams))} oz</p>
        </div>`;
    }
  }
  const sVal = parseFloat($("s-val")?.value);
  const sUnit = $("s-unit")?.value || "lb";
  if ($("s-results")) {
    $("s-results").innerHTML = Number.isFinite(sVal)
      ? converterRows(sVal, sUnit)
      : `<p class="empty">Enter an amount.</p>`;
  }
}

function renderAbout() {
  showView("view-about");
  $("btn-back").classList.remove("hidden");
  $("header-title").textContent = "About";
  $("header-sub").textContent = "Safety · DH notes · Phase 2";
}

function render(opts = {}) {
  if (state.view === "home") renderHome();
  else if (state.view === "batch") renderBatch(opts);
  else if (state.view === "hamburger") renderHamburger(opts);
  else if (state.view === "tools") renderTools();
  else if (state.view === "about") renderAbout();
}

function paintVersion() {
  document.querySelectorAll("[data-app-version]").forEach((el) => {
    el.textContent = APP_VERSION;
  });
}

function showToast(message) {
  const el = $("toast");
  if (!el) return;
  el.textContent = message;
  el.classList.remove("hidden");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => el.classList.add("hidden"), 3400);
}

let checkingUpdate = false;
let pendingReload = false;

function reloadApp() {
  if (reloadApp._once) return;
  reloadApp._once = true;
  location.reload();
}

function activateAndReload(worker) {
  pendingReload = true;
  if (worker) worker.postMessage({ type: "SKIP_WAITING" });
  setTimeout(reloadApp, 500);
}

function showUpdateBanner(worker) {
  const banner = $("update-banner");
  if (!banner || checkingUpdate) return;
  banner.classList.remove("hidden");
  banner.onclick = () => {
    banner.textContent = "Updating…";
    showToast(updateFoundMessage());
    activateAndReload(worker);
  };
}

function watchRegistration(reg) {
  const onInstalled = (worker) => {
    if (!worker || worker.state !== "installed") return;
    if (!navigator.serviceWorker.controller) return;
    if (checkingUpdate) activateAndReload(worker);
    else showUpdateBanner(worker);
  };
  if (reg.waiting && navigator.serviceWorker.controller) {
    showUpdateBanner(reg.waiting);
  }
  if (reg.installing) {
    const installing = reg.installing;
    installing.addEventListener("statechange", () => onInstalled(installing));
  }
  reg.addEventListener("updatefound", () => {
    const worker = reg.installing;
    if (!worker) return;
    worker.addEventListener("statechange", () => onInstalled(worker));
  });
}

async function checkForUpdate() {
  $("menu").classList.add("hidden");
  if (checkingUpdate) return;
  checkingUpdate = true;
  showToast("Checking for update…");

  try {
    let remoteVersion = null;
    let remoteFetched = false;
    try {
      remoteVersion = await fetchRemoteVersion();
      remoteFetched = true;
    } catch {
      remoteVersion = null;
    }

    let swChecked = false;
    let worker = null;
    if ("serviceWorker" in navigator) {
      const reg = await navigator.serviceWorker.getRegistration();
      if (reg) {
        try {
          await reg.update();
          swChecked = true;
        } catch {
          swChecked = false;
        }
        worker = reg.waiting || reg.installing;
      }
    }

    const hasWaitingWorker = Boolean(worker);
    if (shouldActivateUpdate({ remoteVersion, hasWaitingWorker })) {
      showToast(updateFoundMessage(remoteVersion || APP_VERSION));
      if (!hasWaitingWorker && "caches" in window) {
        try {
          const keys = await caches.keys();
          await Promise.all(keys.map((k) => caches.delete(k)));
        } catch {
          /* ignore */
        }
      }
      activateAndReload(worker);
      return;
    }

    if (remoteFetched || swChecked) {
      showToast(latestVersionMessage());
    } else {
      showToast("Couldn't check for an update right now.");
    }
  } finally {
    checkingUpdate = false;
  }
}

function bind() {
  $("btn-back").addEventListener("click", () => go("home"));
  $("btn-menu").addEventListener("click", (e) => {
    e.stopPropagation();
    $("menu").classList.toggle("hidden");
  });
  document.addEventListener("click", () => $("menu").classList.add("hidden"));
  $("menu").addEventListener("click", (e) => {
    e.stopPropagation();
    const btn = e.target.closest("button");
    if (!btn) return;
    if (btn.dataset.action === "check-update") {
      checkForUpdate();
      return;
    }
    const goTo = btn.dataset.go;
    if (goTo) go(goTo);
  });
  $("btn-convert").addEventListener("click", (e) => {
    e.stopPropagation();
    $("sheet").classList.remove("hidden");
    $("sheet-backdrop").classList.remove("hidden");
    updateConverters();
  });
  const closeSheet = () => {
    $("sheet").classList.add("hidden");
    $("sheet-backdrop").classList.add("hidden");
  };
  $("sheet-close").addEventListener("click", closeSheet);
  $("sheet-backdrop").addEventListener("click", closeSheet);

  ["venison-lb", "pork-lb"].forEach((id) => {
    $(id).addEventListener("input", () => renderBatch({}));
  });
  ["h-venison", "h-vfat", "h2-venison", "h2-vfat", "h2-pork", "h2-pfat"].forEach((id) => {
    $(id).addEventListener("input", () => renderHamburger({}));
  });
  $("h-targets").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-fat]");
    if (!btn) return;
    state.hTarget = Number(btn.dataset.fat);
    saveState();
    renderHamburger({});
  });
  $("h-source").addEventListener("change", () => {
    state.hSource = $("h-source").value;
    saveState();
    renderHamburger({});
  });
  $("view-tools").addEventListener("input", updateConverters);
  $("view-tools").addEventListener("change", updateConverters);
  $("m-go").addEventListener("click", updateConverters);
  $("sheet").addEventListener("input", updateConverters);
  $("sheet").addEventListener("change", updateConverters);
  window.addEventListener("hashchange", parseHash);
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (pendingReload) reloadApp();
  });
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./sw.js")
      .then((reg) => {
        watchRegistration(reg);
        reg.update().catch(() => {});
      })
      .catch(() => {});
  });
}

loadState();
paintVersion();
setupSplash();
bind();
parseHash();
