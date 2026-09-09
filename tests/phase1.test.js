import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  CURE1_G_PER_KG,
  G_PER_OZ,
  LB_TO_KG,
  blendFatPercent,
  convert,
  cure1GramsFromKg,
  cure1GramsFromLb,
  cure1OuncesFromLb,
  estimateCasingFeet,
  estimateCasingPieces,
  fatToAdd,
  gramsToOunces,
  porkPercent,
  poundsToKg,
  scaleGPerKg,
  totalMeatKg,
  totalMeatLb,
} from "../js/math.js";
import { scaleBatch } from "../js/scale.js";
import { RECIPES, getRecipe, sausageRecipes } from "../js/recipes.js";

describe("cure math (computed, not copied)", () => {
  it("uses 2.5 g Cure #1 per kg of meat", () => {
    assert.equal(CURE1_G_PER_KG, 2.5);
    assert.equal(cure1GramsFromKg(1), 2.5);
    assert.equal(cure1GramsFromKg(4), 10);
  });

  it("matches 1 oz per 25 lb within weighing tolerance", () => {
    const grams = cure1GramsFromLb(25);
    const ouncesFromGrams = gramsToOunces(grams);
    const ouncesFromRule = cure1OuncesFromLb(25);
    assert.equal(ouncesFromRule, 1);
    assert.ok(Math.abs(ouncesFromGrams - 1) < 1e-9, `got ${ouncesFromGrams}`);
    assert.ok(Math.abs(grams - G_PER_OZ) < 1e-9, `got ${grams}`);
  });

  it("scales linearly with total meat (venison + pork)", () => {
    const totalLb = totalMeatLb(20, 5);
    assert.equal(totalLb, 25);
    const grams = cure1GramsFromLb(totalLb);
    assert.ok(Math.abs(grams - G_PER_OZ) < 1e-9);
  });

  it("10 lb batch is 0.4 oz / ~11.34 g", () => {
    const grams = cure1GramsFromLb(10);
    const oz = cure1OuncesFromLb(10);
    assert.equal(oz, 0.4);
    assert.ok(Math.abs(grams - 10 * LB_TO_KG * 2.5) < 1e-9);
  });

  it("rejects negative meat", () => {
    assert.throws(() => cure1GramsFromLb(-1), /cannot be negative/);
    assert.throws(() => totalMeatLb(1, -2), /cannot be negative/);
  });
});

describe("recipe scaling", () => {
  it("scales g/kg against total meat kilograms", () => {
    assert.equal(scaleGPerKg(18, 5), 90);
    assert.equal(scaleGPerKg(2.5, 1), 2.5);
  });

  it("kielbasa 10 lb batch: salt = 18 g/kg × 10 lb", () => {
    const recipe = getRecipe("kielbasa");
    const batch = scaleBatch(recipe, 8, 2);
    assert.equal(batch.totalLb, 10);
    const salt = batch.ingredients.find((i) => i.id === "salt");
    const expected = 18 * poundsToKg(10);
    assert.ok(Math.abs(salt.grams - expected) < 1e-9);
    assert.equal(batch.requiresCure, true);
    assert.ok(Math.abs(batch.cure.grams - cure1GramsFromLb(10)) < 1e-9);
  });

  it("does not copy a baked-in cure from any sausage recipe", () => {
    for (const recipe of sausageRecipes()) {
      const hasCureIngredient = recipe.ingredients.some((i) =>
        /prague|instacure|pink salt|\bcure #?\s*[12]\b|\bcure\b/i.test(`${i.id} ${i.name}`),
      );
      assert.equal(hasCureIngredient, false, `${recipe.id} must not store cure`);
    }
  });

  it("flags cure required vs not for each sausage", () => {
    const breakfast = getRecipe("breakfast");
    const smoked = getRecipe("smoked-sausage");
    assert.equal(breakfast.requiresCure, false);
    assert.equal(breakfast.cureMode, "if-smoked");
    assert.equal(smoked.requiresCure, true);
    const smokedBatch = scaleBatch(smoked, 5, 5);
    const breakfastBatch = scaleBatch(breakfast, 5, 5);
    assert.equal(smokedBatch.requiresCure, true);
    assert.equal(breakfastBatch.requiresCure, false);
    assert.ok(breakfastBatch.cure.grams > 0);
  });

  it("includes all nine Phase 1 recipes", () => {
    const ids = RECIPES.map((r) => r.id);
    assert.deepEqual(ids, [
      "smoked-sausage",
      "kielbasa",
      "breakfast",
      "snack-sticks",
      "summer-sausage",
      "jalapeno-smoked",
      "andouille",
      "double-d",
      "hamburger",
    ]);
  });

  it("jalapeño recipe uses fresh peppers by weight, not dried flake as the primary", () => {
    const j = getRecipe("jalapeno-smoked");
    const peppers = j.ingredients.find((i) => i.id === "jalapeno");
    assert.ok(peppers);
    assert.match(peppers.name, /fresh jalapeño/i);
    assert.equal(peppers.gPerKg, 60);
  });

  it("hamburger mode is not a sausage", () => {
    const h = getRecipe("hamburger");
    assert.equal(h.kind, "hamburger");
    assert.equal(h.requiresCure, false);
    assert.equal(h.casings.length, 0);
    assert.equal(h.ingredients.length, 0);
  });
});

describe("unit converter", () => {
  it("converts g, kg, lb, oz both directions", () => {
    assert.equal(convert(1, "kg", "g"), 1000);
    assert.equal(convert(1000, "g", "kg"), 1);
    assert.ok(Math.abs(convert(1, "lb", "oz") - 16) < 1e-9);
    assert.ok(Math.abs(convert(16, "oz", "lb") - 1) < 1e-9);
    assert.ok(Math.abs(convert(1, "lb", "g") - 453.59237) < 1e-6);
    assert.ok(Math.abs(convert(453.59237, "g", "lb") - 1) < 1e-9);
  });

  it("metric-to-pounds helper: 18 g/kg on 4.5359 kg (~10 lb)", () => {
    const meatKg = poundsToKg(10);
    const grams = scaleGPerKg(18, meatKg);
    assert.ok(Math.abs(grams - 81.6466266) < 1e-6);
  });

  it("rejects unknown units", () => {
    assert.throws(() => convert(1, "stone", "lb"), /Unknown unit/);
  });
});

describe("casing estimate sanity", () => {
  it("hog 32–35 mm ~2.7 ft/lb plus 10% waste", () => {
    const feet = estimateCasingFeet(10, 2.7, 1.1);
    assert.ok(Math.abs(feet - 29.7) < 1e-9, `got ${feet}`);
  });

  it("19 mm collagen ~3.125 ft/lb (50 ft / 16 lb)", () => {
    const feet = estimateCasingFeet(16, 3.125, 1);
    assert.equal(feet, 50);
  });

  it("2½×20 fibrous ~3 lb/chub, rounds up with a little extra", () => {
    const pieces = estimateCasingPieces(10, 3, 1.05);
    assert.equal(pieces, 4);
    const piecesExact = estimateCasingPieces(9, 3, 1);
    assert.equal(piecesExact, 3);
  });

  it("summer sausage 10 lb reports footage and chub count", () => {
    const batch = scaleBatch(getRecipe("summer-sausage"), 7, 3);
    const casing = batch.casings[0];
    assert.ok(casing.feet > 5 && casing.feet < 8, `feet ${casing.feet}`);
    assert.ok(casing.pieces >= 4);
  });

  it("snack sticks footage is much higher than hog rope for the same meat", () => {
    const sticks = scaleBatch(getRecipe("snack-sticks"), 8, 2);
    const smoked = scaleBatch(getRecipe("smoked-sausage"), 8, 2);
    assert.ok(sticks.casings[0].feet > smoked.casings[0].feet);
  });

  it("breakfast patties have zero casing footage", () => {
    const batch = scaleBatch(getRecipe("breakfast"), 3, 1);
    const patties = batch.casings.find((c) => c.id === "patties");
    assert.equal(patties.feet, 0);
  });
});

describe("hamburger fat-ratio blender", () => {
  it("10 lb venison at 5% to 20% with 95% pork fat needs 2 lb fat", () => {
    const result = fatToAdd({
      leanLb: 10,
      leanFatPct: 5,
      targetFatPct: 20,
      sourceFatPct: 95,
    });
    assert.equal(result.possible, true);
    assert.ok(Math.abs(result.addLb - 2) < 1e-9);
    assert.ok(Math.abs(result.totalLb - 12) < 1e-9);
    assert.ok(Math.abs(result.fatLb / result.totalLb - 0.2) < 1e-9);
  });

  it("50/50 trim to 20% from 5% lean: 5 lb trim per 10 lb venison", () => {
    const result = fatToAdd({
      leanLb: 10,
      leanFatPct: 5,
      targetFatPct: 20,
      sourceFatPct: 50,
    });
    assert.ok(Math.abs(result.addLb - 5) < 1e-9);
  });

  it("reports impossible when the fat source is leaner than the target", () => {
    const result = fatToAdd({
      leanLb: 10,
      leanFatPct: 5,
      targetFatPct: 25,
      sourceFatPct: 20,
    });
    assert.equal(result.possible, false);
    assert.equal(result.reason, "source-too-lean");
  });

  it("already-fattier lean adds zero", () => {
    const result = fatToAdd({
      leanLb: 10,
      leanFatPct: 25,
      targetFatPct: 20,
      sourceFatPct: 95,
    });
    assert.equal(result.addLb, 0);
    assert.equal(result.alreadyAtOrAbove, true);
  });

  it("existing blend fat % is a weighted average", () => {
    const pct = blendFatPercent({
      venisonLb: 8,
      venisonFatPct: 5,
      porkLb: 2,
      porkFatPct: 30,
    });
    assert.ok(Math.abs(pct - 10) < 1e-9);
  });

  it("pork percent of a sausage batch", () => {
    assert.equal(porkPercent(8, 2), 20);
    assert.equal(porkPercent(0, 0), 0);
  });
});

describe("total meat kg helper", () => {
  it("sums venison and pork then converts", () => {
    const kg = totalMeatKg(10, 0);
    assert.ok(Math.abs(kg - 4.5359237) < 1e-9);
  });
});
