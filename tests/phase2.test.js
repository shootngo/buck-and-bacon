import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { ANIMALS, TOOLS, getAnimal, getCut } from "../js/cuts.js";
import { regionsFor } from "../js/diagrams.js";
import { JERKY_TOPICS, getJerkyTopic } from "../js/jerky.js";
import { backRoute, hashFor, isButcheringRoute, parseRoute } from "../js/routes.js";
import {
  prefFromStorage,
  shouldStayOn,
  stayOnLabel,
  createStayOnController,
} from "../js/wakelock.js";
import { computeCure } from "../js/math.js";
import { APP_VERSION } from "../js/version.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (name) => readFileSync(join(root, name), "utf8");

describe("hamburger still has the four shop sections plus Check for update", () => {
  it("lists Butchering, Sausage recipes, Jerky, Curing, and Check for update", () => {
    const html = read("index.html");
    assert.match(html, /data-go="butchering">Butchering</);
    assert.match(html, /data-go="sausage">Sausage recipes</);
    assert.match(html, /data-go="jerky">Jerky</);
    assert.match(html, /data-go="cure">Curing/);
    assert.match(html, /data-action="check-update">Check for update</);
    assert.match(html, /id="stay-on-slot"/);
    assert.match(html, /id="cure-meat-lb"/);
  });
});

describe("routes", () => {
  it("lands empty hash and /butchering on the cut charts", () => {
    assert.deepEqual(parseRoute(""), { name: "butchering" });
    assert.deepEqual(parseRoute("#/"), { name: "butchering" });
    assert.deepEqual(parseRoute("#/butchering"), { name: "butchering" });
    assert.equal(hashFor({ name: "butchering" }), "#/butchering");
  });

  it("opens animal and cut detail hashes", () => {
    assert.deepEqual(parseRoute("#/butchering/deer"), {
      name: "animal",
      animalId: "deer",
    });
    assert.deepEqual(parseRoute("#/butchering/deer/loin"), {
      name: "cut",
      animalId: "deer",
      cutId: "loin",
    });
    assert.equal(hashFor({ name: "cut", animalId: "deer", cutId: "loin" }), "#/butchering/deer/loin");
  });

  it("keeps sausage recipe deep links", () => {
    assert.deepEqual(parseRoute("#/sausage"), { name: "sausage" });
    assert.deepEqual(parseRoute("#/recipe/kielbasa"), {
      name: "recipe",
      recipeId: "kielbasa",
    });
    assert.equal(hashFor({ name: "recipe", recipeId: "hamburger" }), "#/recipe/hamburger");
  });

  it("backs cut → animal → butchering, and recipe → sausage", () => {
    assert.deepEqual(backRoute({ name: "cut", animalId: "hog", cutId: "belly" }), {
      name: "animal",
      animalId: "hog",
    });
    assert.deepEqual(backRoute({ name: "animal", animalId: "hog" }), { name: "butchering" });
    assert.deepEqual(backRoute({ name: "batch", recipeId: "kielbasa" }), { name: "sausage" });
    assert.deepEqual(backRoute({ name: "hamburger" }), { name: "sausage" });
  });

  it("flags butchering routes for stay-on default", () => {
    assert.equal(isButcheringRoute({ name: "butchering" }), true);
    assert.equal(isButcheringRoute({ name: "cut", animalId: "deer", cutId: "neck" }), true);
    assert.equal(isButcheringRoute({ name: "sausage" }), false);
  });
});

describe("cut catalog", () => {
  it("includes deer, hog, beef, and chicken", () => {
    assert.deepEqual(
      ANIMALS.map((a) => a.id),
      ["deer", "hog", "beef", "chicken"],
    );
  });

  it("gives every cut a name, how-to, uses, and a numbered chart region", () => {
    for (const animal of ANIMALS) {
      assert.ok(animal.cuts.length >= 6, animal.id);
      const regions = regionsFor(animal.id);
      const regionIds = new Set(regions.map((r) => r.cutId));
      for (const cut of animal.cuts) {
        assert.ok(cut.name);
        assert.ok(cut.description.length > 40, cut.id);
        assert.ok(cut.howTo.length >= 1, `${animal.id}/${cut.id}`);
        assert.ok(cut.uses.length >= 1, cut.id);
        assert.ok(regionIds.has(cut.id), `missing region ${animal.id}/${cut.id}`);
      }
      assert.equal(getAnimal(animal.id).id, animal.id);
    }
    const loin = getCut("deer", "loin");
    assert.equal(loin.cut.name, "Loin (backstrap)");
    assert.match(loin.cut.description, /tenderloin/i);
    assert.equal(getCut("deer", "nope"), null);
  });

  it("documents shop tools", () => {
    const ids = TOOLS.map((t) => t.id);
    assert.ok(ids.includes("boning-knife"));
    assert.ok(ids.includes("gambrel"));
    assert.ok(ids.includes("temp"));
  });
});

describe("jerky starter and cure calculator still use computed Cure #1", () => {
  it("has cuts, process, and marinade topics", () => {
    assert.deepEqual(
      JERKY_TOPICS.map((t) => t.id),
      ["cuts", "process", "marinades"],
    );
    assert.ok(getJerkyTopic("marinades").marinades.length >= 3);
  });

  it("10 lb meat is still 0.4 oz Cure #1", () => {
    const cure = computeCure(10);
    assert.equal(cure.ouncesFrom25LbRule, 0.4);
    assert.ok(Math.abs(cure.grams - 11.33980925) < 1e-6);
  });
});

describe("screen stay-on", () => {
  it("defaults ON in butchering until the user flips it", () => {
    assert.deepEqual(prefFromStorage(null), { enabled: false, userSet: false });
    assert.equal(shouldStayOn(prefFromStorage(null), { inButchering: true }), true);
    assert.equal(shouldStayOn(prefFromStorage(null), { inButchering: false }), false);
    assert.equal(shouldStayOn(prefFromStorage("0"), { inButchering: true }), false);
    assert.equal(shouldStayOn(prefFromStorage("1"), { inButchering: false }), true);
  });

  it("requests a screen wake lock when enabled", async () => {
    const calls = [];
    const storage = new Map();
    const sentinel = {
      released: false,
      addEventListener() {},
      async release() {
        this.released = true;
      },
    };
    const ctl = createStayOnController({
      storage: {
        getItem: (k) => (storage.has(k) ? storage.get(k) : null),
        setItem: (k, v) => storage.set(k, v),
        removeItem: (k) => storage.delete(k),
      },
      wakeLockApi: {
        async request(type) {
          calls.push(type);
          return sentinel;
        },
      },
      documentRef: { visibilityState: "visible" },
    });
    ctl.syncForView(true);
    assert.equal(ctl.enabled, true);
    await ctl.setEnabled(true);
    assert.deepEqual(calls, ["screen"]);
    assert.equal(ctl.held, true);
    assert.match(stayOnLabel(true, { held: true, supported: true }), /stay awake/i);
    await ctl.setEnabled(false);
    assert.equal(sentinel.released, true);
    assert.equal(ctl.enabled, false);
  });
});

describe("version lockstep is 1.2", () => {
  it("is V 1.2", () => {
    assert.equal(APP_VERSION, "1.2");
  });
});
