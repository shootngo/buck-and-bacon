import {
  computeCure,
  estimateCasingFeet,
  estimateCasingPieces,
  porkPercent,
  scaleGPerKg,
  totalMeatKg,
  totalMeatLb,
  gramsToOunces,
} from "./math.js";

/**
 * Scale a sausage recipe from venison + pork pounds.
 * Cure is always computed, never read from the recipe.
 */
export function scaleBatch(recipe, venisonLb, porkLb) {
  const totalLb = totalMeatLb(venisonLb, porkLb);
  const totalKg = totalMeatKg(venisonLb, porkLb);
  const porkPct = porkPercent(venisonLb, porkLb);

  const ingredients = (recipe.ingredients || []).map((ing) => {
    const grams = scaleGPerKg(ing.gPerKg, totalKg);
    return {
      ...ing,
      grams,
      ounces: gramsToOunces(grams),
    };
  });

  const cure = computeCure(totalLb);

  const casings = (recipe.casings || []).map((casing) => {
    const feet = casing.feetPerLb
      ? estimateCasingFeet(totalLb, casing.feetPerLb, 1.1)
      : 0;
    const pieces =
      casing.lbPerPiece && totalLb > 0
        ? estimateCasingPieces(totalLb, casing.lbPerPiece, 1.05)
        : null;
    return {
      ...casing,
      feet,
      pieces,
    };
  });

  return {
    recipeId: recipe.id,
    kind: recipe.kind,
    requiresCure: Boolean(recipe.requiresCure),
    cureMode: recipe.cureMode,
    venisonLb,
    porkLb,
    totalLb,
    totalKg,
    porkPct,
    ingredients,
    cure,
    casings,
  };
}
