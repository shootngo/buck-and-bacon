import {
  blendFatPercent,
  computeCure,
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
import { backRoute, hashFor, isButcheringRoute, parseRoute } from "./routes.js";
import { createStayOnController } from "./wakelock.js";
import { getAnimal, getCut } from "./cuts.js";
import { getJerkyTopic } from "./jerky.js";
import {
  animalPageHtml,
  butcheringHomeHtml,
  cureExtrasHtml,
  cutPageHtml,
  jerkyHomeHtml,
  jerkyTopicHtml,
  stayOnToggleHtml,
  toolsPageHtml,
} from "./phase2.js";

const STORAGE = "bnb-v1";
const $ = (id) => document.getElementById(id);

const stayOn = createStayOnController();

const state = {
  route: { name: "butchering" },
  recipeId: null,
  venison: 8,
  pork: 2,
  includeOptional: {},
  hTarget: 20,
  hSource: "pork-fat",
  cureMeatLb: 10,
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
      cureMeatLb: state.cureMeatLb,
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
  applyStayOn();
}

function setupSplash() {
  if (sessionStorage.getItem("bnb-splash")) {
    $("splash").classList.add("hidden");
    return;
  }
  $("splash-enter").addEventListener("click", hideSplash);
  setTimeout(hideSplash, 2200);
}

function go(route) {
  if (typeof route === "string") route = { name: route };
  $("menu").classList.add("hidden");
  const next = hashFor(route);
  if (location.hash === next || (next === "#/butchering" && !location.hash)) {
    state.route = route;
    render({ hydrate: true });
  } else {
    location.hash = next;
  }
}

function parseHash() {
  const route = parseRoute(location.hash);
  if (route.name === "recipe") {
    const recipe = getRecipe(route.recipeId);
    if (!recipe) {
      go({ name: "sausage" });
      return;
    }
    state.recipeId = route.recipeId;
    state.route =
      recipe.kind === "hamburger"
        ? { name: "hamburger", recipeId: recipe.id }
        : { name: "batch", recipeId: recipe.id };
  } else if (route.name === "animal") {
    if (!getAnimal(route.animalId)) {
      go({ name: "butchering" });
      return;
    }
    state.route = route;
  } else if (route.name === "cut") {
    if (!getCut(route.animalId, route.cutId)) {
      go({ name: "animal", animalId: route.animalId });
      return;
    }
    state.route = route;
  } else if (route.name === "jerky-topic") {
    if (!getJerkyTopic(route.topicId)) {
      go({ name: "jerky" });
      return;
    }
    state.route = route;
  } else {
    state.route = route;
  }
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

function renderSausage() {
  showView("view-home");
  $("btn-back").classList.remove("hidden");
  $("header-title").textContent = "Sausage recipes";
  $("header-sub").textContent = "Scale a batch";
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
    go({ name: "recipe", recipeId: btn.dataset.recipe });
  };
}

function renderBatch(opts = {}) {
  const recipe = getRecipe(state.recipeId);
  if (!recipe || recipe.kind === "hamburger") return renderSausage();
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
  $("header-sub").textContent = "Safety · DH notes · V 1.2";
}

function bindCutMap(root) {
  const svg = root.querySelector(".cut-svg");
  if (!svg) return;
  const animalId = state.route.animalId;
  const open = (cutId) => {
    if (!cutId || !animalId) return;
    go({ name: "cut", animalId, cutId });
  };
  svg.addEventListener("click", (e) => {
    const region = e.target.closest("[data-cut]");
    if (region) open(region.dataset.cut);
  });
  svg.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const region = e.target.closest("[data-cut]");
    if (!region) return;
    e.preventDefault();
    open(region.dataset.cut);
  });
}

function paintStayOn() {
  const inButchering = isButcheringRoute(state.route);
  const slot = $("stay-on-slot");
  if (!slot) return;
  const enabled = stayOn.enabled;
  if (!inButchering && !enabled) {
    slot.innerHTML = "";
    slot.classList.add("hidden");
    return;
  }
  slot.classList.remove("hidden");
  slot.innerHTML = stayOnToggleHtml({
    enabled,
    label: stayOn.label(),
    prominent: inButchering,
  });
}

function applyStayOn() {
  stayOn.syncForView(isButcheringRoute(state.route));
  paintStayOn();
  if (stayOn.enabled) stayOn.acquire();
  else stayOn.release();
}

async function toggleStayOn() {
  const next = !stayOn.enabled;
  await stayOn.setEnabled(next);
  paintStayOn();
  showToast(next ? stayOn.label() : "Screen stay-on off");
}

function renderButchering() {
  showView("view-butchering");
  const root = $("butchering-root");
  const route = state.route;
  if (route.name === "butch-tools") {
    $("btn-back").classList.remove("hidden");
    $("header-title").textContent = "Tools";
    $("header-sub").textContent = "Shop kit";
    root.innerHTML = toolsPageHtml();
    return;
  }
  if (route.name === "animal") {
    const animal = getAnimal(route.animalId);
    $("btn-back").classList.remove("hidden");
    $("header-title").textContent = animal.shortName;
    $("header-sub").textContent = "Tap a cut";
    root.innerHTML = animalPageHtml(animal);
    bindCutMap(root);
    return;
  }
  if (route.name === "cut") {
    const found = getCut(route.animalId, route.cutId);
    $("btn-back").classList.remove("hidden");
    $("header-title").textContent = found.cut.name.replace(/\s*\([^)]*\)/g, "").trim();
    $("header-sub").textContent = found.animal.shortName;
    root.innerHTML = cutPageHtml(found.animal, found.cut);
    bindCutMap(root);
    return;
  }
  $("btn-back").classList.add("hidden");
  $("header-title").textContent = "Butchering";
  $("header-sub").textContent = "Cuts of meat";
  root.innerHTML = butcheringHomeHtml();
}

function renderJerky() {
  showView("view-jerky");
  $("btn-back").classList.remove("hidden");
  const root = $("jerky-root");
  if (state.route.name === "jerky-topic") {
    const topic = getJerkyTopic(state.route.topicId);
    $("header-title").textContent = topic.name;
    $("header-sub").textContent = "Jerky";
    root.innerHTML = jerkyTopicHtml(topic);
    return;
  }
  $("header-title").textContent = "Jerky";
  $("header-sub").textContent = "Cuts · process · marinades";
  root.innerHTML = jerkyHomeHtml();
}

function renderCure(opts = {}) {
  showView("view-cure");
  $("btn-back").classList.remove("hidden");
  $("header-title").textContent = "Curing";
  $("header-sub").textContent = "Cure #1 · old-time notes";
  if (opts.hydrate) {
    $("cure-meat-lb").value = state.cureMeatLb || "";
  }
  $("cure-extras").innerHTML = cureExtrasHtml();
  const lb = parseNum($("cure-meat-lb"), 0);
  state.cureMeatLb = lb;
  saveState();
  if (lb <= 0) {
    $("cure-results").innerHTML = `<p class="empty">Enter meat pounds to compute Cure #1.</p>`;
    return;
  }
  const cure = computeCure(lb);
  $("cure-results").innerHTML = `
    <div class="banner cure-yes">
      <h3>Cure #1 for ${formatPounds(lb)} lb meat</h3>
      <div class="cure-amount">${formatMassGrams(cure.grams)} g</div>
      <div class="cure-sub">${formatOunces(cure.ounces)} oz
        · ~${formatTsp(cure.teaspoonsApprox)} tsp (approx)</div>
      <p class="warn-copy"><strong>Assumes ${CURE_ASSUMPTION.name}</strong> at ${CURE_ASSUMPTION.gramsPerKg} g/kg
      (${CURE_ASSUMPTION.ouncesPer25Lb} oz per 25 lb), targeting ~${CURE_ASSUMPTION.targetPpm} ppm sodium nitrite
      when the product is ${CURE_ASSUMPTION.nitritePercent}% nitrite.
      ${CURE_ASSUMPTION.labelWarning}</p>
    </div>`;
}

function render(opts = {}) {
  if (opts.hydrate) window.scrollTo(0, 0);
  const name = state.route.name;
  if (name === "sausage") renderSausage();
  else if (name === "batch") renderBatch(opts);
  else if (name === "hamburger") renderHamburger(opts);
  else if (name === "tools") renderTools();
  else if (name === "about") renderAbout();
  else if (name === "jerky" || name === "jerky-topic") renderJerky();
  else if (name === "cure") renderCure(opts);
  else renderButchering();
  applyStayOn();
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
  $("btn-back").addEventListener("click", () => go(backRoute(state.route)));
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
    if (goTo) go({ name: goTo });
  });
  $("stay-on-slot").addEventListener("click", (e) => {
    if (!e.target.closest("[data-action='stay-on']")) return;
    e.stopPropagation();
    toggleStayOn();
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
  $("cure-meat-lb").addEventListener("input", () => renderCure({}));
  if (typeof document !== "undefined") {
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible" && stayOn.enabled) stayOn.acquire();
    });
  }
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
