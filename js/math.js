/**
 * Buck and Bacon — Phase 1 calculation engine.
 *
 * Cure is computed from the USDA-style comminuted-product rate for
 * Cure #1 (Prague Powder #1 / Instacure #1, 6.25% sodium nitrite):
 *   2.5 g per kg total meat  ≈  1 oz per 25 lb  ≈  156 ppm ingoing nitrite.
 * Seasoning rates live in recipes.js and are independent of cure.
 */

export const LB_TO_KG = 0.45359237;
export const KG_TO_LB = 1 / LB_TO_KG;
export const G_PER_OZ = 28.349523125;
export const OZ_PER_LB = 16;
export const G_PER_LB = LB_TO_KG * 1000;

/** Grams of Cure #1 per kilogram of total meat (156 ppm at 6.25% NaNO2). */
export const CURE1_G_PER_KG = 2.5;

/** Ounces of Cure #1 per 25 lb of total meat (same rate as 2.5 g/kg). */
export const CURE1_OZ_PER_25_LB = 1;

/**
 * Approximate grams per level teaspoon of Cure #1.
 * Volume is NOT a safety measurement — crystal size varies. Display only.
 */
export const CURE1_G_PER_TSP_APPROX = 5.7;

export const UNITS = Object.freeze(["g", "kg", "oz", "lb"]);

const GRAMS_PER_UNIT = Object.freeze({
  g: 1,
  kg: 1000,
  oz: G_PER_OZ,
  lb: G_PER_LB,
});

export class CalcError extends Error {
  constructor(code, message) {
    super(message);
    this.name = "CalcError";
    this.code = code;
  }
}

function assertFiniteNonNegative(name, value) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new CalcError("invalid", `${name} must be a finite number.`);
  }
  if (value < 0) {
    throw new CalcError("negative", `${name} cannot be negative.`);
  }
}

function assertFinite(name, value) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new CalcError("invalid", `${name} must be a finite number.`);
  }
}

export function poundsToKg(lb) {
  assertFiniteNonNegative("pounds", lb);
  return lb * LB_TO_KG;
}

export function kgToPounds(kg) {
  assertFiniteNonNegative("kilograms", kg);
  return kg * KG_TO_LB;
}

export function gramsToOunces(g) {
  assertFiniteNonNegative("grams", g);
  return g / G_PER_OZ;
}

export function ouncesToGrams(oz) {
  assertFiniteNonNegative("ounces", oz);
  return oz * G_PER_OZ;
}

export function totalMeatLb(venisonLb, porkLb) {
  assertFiniteNonNegative("venison lb", venisonLb);
  assertFiniteNonNegative("pork lb", porkLb);
  return venisonLb + porkLb;
}

export function totalMeatKg(venisonLb, porkLb) {
  return poundsToKg(totalMeatLb(venisonLb, porkLb));
}

export function porkPercent(venisonLb, porkLb) {
  const total = totalMeatLb(venisonLb, porkLb);
  if (total === 0) return 0;
  return (porkLb / total) * 100;
}

/** Canonical Cure #1 grams from kilograms of total meat. */
export function cure1GramsFromKg(meatKg) {
  assertFiniteNonNegative("meat kg", meatKg);
  return meatKg * CURE1_G_PER_KG;
}

/** Canonical Cure #1 grams from pounds of total meat (via kg × 2.5). */
export function cure1GramsFromLb(meatLb) {
  assertFiniteNonNegative("meat lb", meatLb);
  return cure1GramsFromKg(poundsToKg(meatLb));
}

/** 1 oz per 25 lb — must agree with 2.5 g/kg. */
export function cure1OuncesFromLb(meatLb) {
  assertFiniteNonNegative("meat lb", meatLb);
  return (meatLb / 25) * CURE1_OZ_PER_25_LB;
}

export function cure1TeaspoonsApprox(grams) {
  assertFiniteNonNegative("grams", grams);
  return grams / CURE1_G_PER_TSP_APPROX;
}

export function computeCure(totalMeatLbValue) {
  assertFiniteNonNegative("total meat lb", totalMeatLbValue);
  const grams = cure1GramsFromLb(totalMeatLbValue);
  const ouncesFromGrams = gramsToOunces(grams);
  const ouncesFromRule = cure1OuncesFromLb(totalMeatLbValue);
  return {
    assumedProduct: "Cure #1 (Prague Powder #1 / Instacure #1)",
    assumedNitritePercent: 6.25,
    gramsPerKg: CURE1_G_PER_KG,
    ouncesPer25Lb: CURE1_OZ_PER_25_LB,
    grams,
    ounces: ouncesFromGrams,
    ouncesFrom25LbRule: ouncesFromRule,
    teaspoonsApprox: cure1TeaspoonsApprox(grams),
    targetPpm: 156,
  };
}

export function scaleGPerKg(gPerKg, meatKg) {
  assertFiniteNonNegative("g/kg", gPerKg);
  assertFiniteNonNegative("meat kg", meatKg);
  return gPerKg * meatKg;
}

export function gPerKgToGPerLb(gPerKg) {
  assertFiniteNonNegative("g/kg", gPerKg);
  return gPerKg * LB_TO_KG;
}

export function toGrams(value, unit) {
  assertFinite("value", value);
  const factor = GRAMS_PER_UNIT[unit];
  if (!factor) {
    throw new CalcError("unit", `Unknown unit "${unit}". Use g, kg, oz, or lb.`);
  }
  return value * factor;
}

export function fromGrams(grams, unit) {
  assertFinite("grams", grams);
  const factor = GRAMS_PER_UNIT[unit];
  if (!factor) {
    throw new CalcError("unit", `Unknown unit "${unit}". Use g, kg, oz, or lb.`);
  }
  return grams / factor;
}

export function convert(value, fromUnit, toUnit) {
  return fromGrams(toGrams(value, fromUnit), toUnit);
}

/**
 * Casing footage estimate.
 * @param {number} meatLb total stuffed meat
 * @param {number} feetPerLb stuffed yield (without waste)
 * @param {number} [wasteFactor=1.1] extra for blowouts / tying
 */
export function estimateCasingFeet(meatLb, feetPerLb, wasteFactor = 1.1) {
  assertFiniteNonNegative("meat lb", meatLb);
  assertFiniteNonNegative("feet per lb", feetPerLb);
  assertFiniteNonNegative("waste factor", wasteFactor);
  return meatLb * feetPerLb * wasteFactor;
}

export function estimateCasingPieces(meatLb, lbPerPiece, extraFactor = 1.05) {
  assertFiniteNonNegative("meat lb", meatLb);
  if (!(lbPerPiece > 0)) {
    throw new CalcError("invalid", "lb per piece must be greater than zero.");
  }
  assertFiniteNonNegative("extra factor", extraFactor);
  return Math.ceil(meatLb * extraFactor / lbPerPiece);
}

/**
 * How much of a fat source to add to lean meat to hit a target fat %.
 * All percents are 0–100.
 *
 * F = L * (T - fl) / (ff - T)
 */
export function fatToAdd({ leanLb, leanFatPct, targetFatPct, sourceFatPct }) {
  assertFiniteNonNegative("lean lb", leanLb);
  assertFiniteNonNegative("lean fat %", leanFatPct);
  assertFiniteNonNegative("target fat %", targetFatPct);
  assertFiniteNonNegative("source fat %", sourceFatPct);
  if (leanFatPct > 100 || targetFatPct > 100 || sourceFatPct > 100) {
    throw new CalcError("range", "Fat percentages must be between 0 and 100.");
  }
  const fl = leanFatPct / 100;
  const T = targetFatPct / 100;
  const ff = sourceFatPct / 100;

  if (leanLb === 0) {
    return {
      addLb: 0,
      totalLb: 0,
      fatLb: 0,
      leanOnlyLb: 0,
      possible: true,
      alreadyAtOrAbove: false,
      reason: "no-lean",
    };
  }

  if (T <= fl) {
    const totalLb = leanLb;
    const fatLb = leanLb * fl;
    return {
      addLb: 0,
      totalLb,
      fatLb,
      leanOnlyLb: totalLb - fatLb,
      possible: true,
      alreadyAtOrAbove: true,
      reason: "lean-already-fattier",
    };
  }

  if (ff <= T) {
    return {
      addLb: null,
      totalLb: null,
      fatLb: null,
      leanOnlyLb: null,
      possible: false,
      alreadyAtOrAbove: false,
      reason: "source-too-lean",
    };
  }

  const addLb = leanLb * (T - fl) / (ff - T);
  const totalLb = leanLb + addLb;
  const fatLb = leanLb * fl + addLb * ff;
  return {
    addLb,
    totalLb,
    fatLb,
    leanOnlyLb: totalLb - fatLb,
    possible: true,
    alreadyAtOrAbove: false,
    reason: "ok",
  };
}

/** Resulting fat % of an existing venison + pork grind. */
export function blendFatPercent({ venisonLb, venisonFatPct, porkLb, porkFatPct }) {
  const total = totalMeatLb(venisonLb, porkLb);
  if (total === 0) return 0;
  assertFiniteNonNegative("venison fat %", venisonFatPct);
  assertFiniteNonNegative("pork fat %", porkFatPct);
  if (venisonFatPct > 100 || porkFatPct > 100) {
    throw new CalcError("range", "Fat percentages must be between 0 and 100.");
  }
  const fatLb = venisonLb * (venisonFatPct / 100) + porkLb * (porkFatPct / 100);
  return (fatLb / total) * 100;
}

export function formatMassGrams(g) {
  if (!Number.isFinite(g)) return "—";
  const abs = Math.abs(g);
  if (abs === 0) return "0";
  if (abs < 1) return g.toFixed(2);
  if (abs < 20) return g.toFixed(1);
  return g.toFixed(1);
}

export function formatOunces(oz) {
  if (!Number.isFinite(oz)) return "—";
  const abs = Math.abs(oz);
  if (abs === 0) return "0";
  if (abs < 0.1) return oz.toFixed(3);
  if (abs < 2) return oz.toFixed(2);
  return oz.toFixed(2);
}

export function formatPounds(lb) {
  if (!Number.isFinite(lb)) return "—";
  if (Math.abs(lb) === 0) return "0";
  return lb.toFixed(2);
}

export function formatFeet(ft) {
  if (!Number.isFinite(ft)) return "—";
  if (Math.abs(ft) === 0) return "0";
  return ft.toFixed(1);
}

export function formatTsp(tsp) {
  if (!Number.isFinite(tsp)) return "—";
  if (Math.abs(tsp) === 0) return "0";
  return tsp.toFixed(1);
}

export function round(value, digits = 4) {
  const f = 10 ** digits;
  return Math.round(value * f) / f;
}
