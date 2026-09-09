/**
 * Buck and Bacon — Phase 1 recipes.
 *
 * Seasonings are stored as grams per kilogram of TOTAL meat (venison + pork),
 * which is how Duncan Henry / DH Custom Sausage formulates shop recipes.
 *
 * Cure is NEVER stored here. The UI/engine always computes Cure #1 at
 * 2.5 g/kg (1 oz / 25 lb). See js/math.js and README sources.
 */

export const CURE_ASSUMPTION = {
  name: "Cure #1 (Prague Powder #1 / Instacure #1)",
  gramsPerKg: 2.5,
  ouncesPer25Lb: 1,
  nitritePercent: 6.25,
  targetPpm: 156,
  labelWarning:
    "Confirm this amount against your cure product’s own label. Concentrations differ (some “pink salts” are not 6.25% nitrite). Do not use Cure #2 for these cooked/smoked sausages. Weigh on a gram scale — teaspoons are approximate only.",
};

export const WORKFLOW_TIPS = [
  {
    id: "hang",
    title: "Hang sausage in the smoker",
    body: "Smoke links hanging from hooks or smoke sticks so heat and smoke circulate. Do not lay stuffed sausage on the grates if you can hang it.",
  },
  {
    id: "fan-dry",
    title: "Dry casings in front of a fan — not in the smoker",
    body: "After stuffing, hang or rack the sausage in front of a fan until the casings are dry and tacky to the touch. Putting wet casings in the smoker makes fat grease out and smoke color blotchy.",
  },
];

const HOG_32 = {
  id: "hog-32-35",
  name: "Hog casings 32–35 mm",
  feetPerLb: 2.7,
  note: "Natural hog. ~2.7 ft per lb stuffed (NZ Casings 32–35 mm).",
};

const HOG_35 = {
  id: "hog-35-38",
  name: "Hog casings 35–38 mm",
  feetPerLb: 2.4,
  note: "Slightly fatter rope. ~2.4 ft per lb stuffed.",
};

const SHEEP_21 = {
  id: "sheep-20-22",
  name: "Sheep casings 20–22 mm",
  feetPerLb: 4.7,
  note: "Breakfast links. ~4.7 ft per lb (sheep 24–26 mm is similar; 20–22 mm runs a bit more footage).",
};

const COLLAGEN_19 = {
  id: "collagen-19",
  name: "Smoked collagen 19 mm",
  feetPerLb: 3.125,
  note: "Snack sticks. ~50 ft stuffs ~16 lb (3.125 ft/lb). Sheep 19–21 mm needs more footage.",
};

const FIBROUS_25 = {
  id: "fibrous-2-5",
  name: "Fibrous casings 2½ × 20 in",
  feetPerLb: 0.56,
  lbPerPiece: 3,
  pieceLabel: "2½ × 20 in chubs",
  note: "Summer sausage. Each 20 in chub holds ~3 lb (LEM / butcher-supply). ~0.56 ft/lb.",
};

function ing(id, name, gPerKg, extra = {}) {
  return { id, name, gPerKg, optional: false, ...extra };
}

export const RECIPES = [
  {
    id: "smoked-sausage",
    name: "Smoked sausage",
    kind: "sausage",
    tagline: "Garlic-forward everyday smoked rope.",
    requiresCure: true,
    cureMode: "required",
    fatHint: "Aim for about 20–30% pork (or pork fat) with venison so the sausage isn’t dry.",
    casings: [HOG_32],
    ingredients: [
      ing("salt", "Non-iodized salt", 18, { role: "base" }),
      ing("dextrose", "Dextrose (or sugar)", 4, { role: "base" }),
      ing("garlic", "Garlic powder", 5, { role: "spice" }),
      ing("onion", "Onion powder", 2, { role: "spice" }),
      ing("white-pepper", "White pepper", 2, { role: "spice" }),
      ing("mustard", "Ground mustard", 3, { role: "spice" }),
      ing("paprika", "Paprika", 4, { role: "spice" }),
      ing("black-pepper", "Black pepper", 1, { role: "spice" }),
      ing("nfdm", "Nonfat dry milk (binder)", 20, { role: "binder", optional: true }),
      ing("ice-water", "Ice-cold water", 80, { role: "process", displayUnit: "ml" }),
    ],
    processNotes: [
      "Grind cold. Mix until the mince is tacky, stuff, fan-dry casings, then hang and smoke to 160°F internal.",
    ],
    sources: [
      "DH Custom Sausage g/kg method (Duncan Henry).",
      "Salt ~18 g/kg smoked-sausage band (Wurstcircle / DH-style).",
      "Garlic–mustard–paprika smoked profile consistent with 2 Guys & A Cooler roasted-garlic smoked sausage (spices only; cure recomputed).",
    ],
  },
  {
    id: "kielbasa",
    name: "Kielbasa",
    kind: "sausage",
    tagline: "Polish smoked sausage — garlic, marjoram, white pepper.",
    requiresCure: true,
    cureMode: "required",
    fatHint: "Classic kielbasa is roughly 70/30 lean-to-fat. With venison, 25–30% pork is a good start.",
    casings: [HOG_32, HOG_35],
    ingredients: [
      ing("salt", "Non-iodized salt", 18, { role: "base" }),
      ing("dextrose", "Dextrose (or sugar)", 2.5, { role: "base" }),
      ing("garlic", "Garlic powder", 5, { role: "spice" }),
      ing("marjoram", "Marjoram", 1.2, { role: "spice" }),
      ing("white-pepper", "White pepper", 5, { role: "spice" }),
      ing("nfdm", "Nonfat dry milk (binder)", 20, { role: "binder", optional: true }),
      ing("ice-water", "Ice-cold water", 100, { role: "process", displayUnit: "ml" }),
    ],
    processNotes: [
      "Stuff into hog casings, twist into 12–18 in horseshoes if you hang them. Fan-dry, then hang-smoke.",
    ],
    sources: [
      "Spice profile adapted from 2 Guys & A Cooler smoked Polish kielbasa (public g/kg list). Salt raised from their 15 g/kg to 18 g/kg to sit in the DH / Wurstcircle smoked band. Cure ignored from that recipe and computed at 2.5 g/kg.",
    ],
  },
  {
    id: "breakfast",
    name: "Breakfast sausage",
    kind: "sausage",
    tagline: "Sage-forward fresh sausage. Patties or small links.",
    requiresCure: false,
    cureMode: "if-smoked",
    fatHint: "Fresh breakfast sausage likes ~25% fat. Venison needs pork or pork fat.",
    casings: [
      { ...SHEEP_21, optional: true },
      {
        id: "patties",
        name: "Patties (no casing)",
        feetPerLb: 0,
        note: "Shape 2 oz patties. No casing needed.",
      },
    ],
    ingredients: [
      ing("salt", "Non-iodized salt", 17, { role: "base" }),
      ing("sage", "Rubbed sage", 4, { role: "spice" }),
      ing("black-pepper", "Black pepper", 2.5, { role: "spice" }),
      ing("white-pepper", "White pepper", 1, { role: "spice" }),
      ing("thyme", "Dried thyme", 0.5, { role: "spice" }),
      ing("nutmeg", "Nutmeg", 0.5, { role: "spice" }),
      ing("ginger", "Ginger", 0.5, { role: "spice" }),
      ing("brown-sugar", "Brown sugar (or maple syrup*)", 5, { role: "base" }),
      ing("ice-water", "Ice-cold water", 80, { role: "process", displayUnit: "ml" }),
    ],
    processNotes: [
      "Fresh sausage: pan-fry or bake to 160°F. Cure is not required unless you smoke it or cook it low and slow.",
      "*If swapping maple syrup for brown sugar, use the same grams; it adds a little extra moisture.",
    ],
    sources: [
      "Salt 17 g/kg and sage/thyme/nutmeg/ginger band from High Caliber Home Processor breakfast formula and curingchamber.com breakfast sausage (g/kg).",
    ],
  },
  {
    id: "snack-sticks",
    name: "Snack / meat sticks",
    kind: "sausage",
    tagline: "Slim smoked sticks. Tang optional via encapsulated citric acid.",
    requiresCure: true,
    cureMode: "required",
    fatHint: "Snack sticks usually run 20–30% fat. Lean venison needs pork fat.",
    casings: [COLLAGEN_19],
    ingredients: [
      ing("salt", "Non-iodized salt", 18, { role: "base" }),
      ing("dextrose", "Dextrose", 8, { role: "base" }),
      ing("paprika", "Paprika", 6, { role: "spice" }),
      ing("mustard", "Ground mustard", 3, { role: "spice" }),
      ing("garlic", "Garlic powder", 3, { role: "spice" }),
      ing("black-pepper", "Black pepper", 2, { role: "spice" }),
      ing("cayenne", "Cayenne", 1.5, { role: "spice" }),
      ing("coriander", "Coriander", 1, { role: "spice" }),
      ing("white-pepper", "White pepper", 1, { role: "spice" }),
      ing("eca", "Encapsulated citric acid (tang)", 3, {
        role: "process",
        optional: true,
        note: "Fold in last. Do not grind or let it sit in a warm mixer — the coating will rupture.",
      }),
      ing("ice-water", "Ice-cold water", 70, { role: "process", displayUnit: "ml" }),
    ],
    processNotes: [
      "Stuff 19 mm smoked collagen. Fan-dry until the surface is tacky. Hang-smoke; snack sticks like even spacing so they don’t touch.",
    ],
    sources: [
      "Seasoning shape from Len Poli snack-stick formula and Walton’s snack-stick process notes (paprika / mustard / garlic / cayenne). Rates converted to g/kg of meat. Cure recomputed.",
    ],
  },
  {
    id: "summer-sausage",
    name: "Summer sausage",
    kind: "sausage",
    tagline: "Mustard seed, coriander, garlic. Fibrous chubs.",
    requiresCure: true,
    cureMode: "required",
    fatHint: "Summer sausage is often 20–25% fat. Venison + pork shoulder or trim.",
    casings: [FIBROUS_25],
    ingredients: [
      ing("salt", "Non-iodized salt", 22, { role: "base" }),
      ing("dextrose", "Dextrose", 10, { role: "base" }),
      ing("sugar", "Sugar", 5, { role: "base" }),
      ing("black-pepper", "Black pepper", 3, { role: "spice" }),
      ing("coriander", "Coriander", 2, { role: "spice" }),
      ing("mustard-seed", "Whole mustard seed", 4, { role: "spice" }),
      ing("allspice", "Allspice", 1.5, { role: "spice" }),
      ing("garlic", "Garlic powder", 3.5, { role: "spice" }),
      ing("fermento", "Fermento (tang, optional)", 20, {
        role: "binder",
        optional: true,
        note: "Or use a commercial starter culture per the packet — do not guess culture dose.",
      }),
      ing("ice-water", "Ice-cold water", 50, { role: "process", displayUnit: "ml" }),
    ],
    processNotes: [
      "Soak fibrous casings 25–30 min. Stuff firmly, no air pockets. Fan-dry the surface, then hang-smoke to 160°F internal. Shower or ice-bath, then bloom.",
    ],
    sources: [
      "Marianski / Mari Recipes summer-sausage spice pattern (mustard seed, coriander, allspice, dextrose) expressed as g/kg. Salt at 22 g/kg for a semi-dry profile. Cure recomputed.",
    ],
  },
  {
    id: "jalapeno-smoked",
    name: "Jalapeño smoked sausage",
    kind: "sausage",
    tagline: "Fresh jalapeños in a garlic smoked sausage.",
    requiresCure: true,
    cureMode: "required",
    fatHint: "Peppers add water. Keep pork around 25–30% and don’t overdo ice water.",
    casings: [HOG_32],
    ingredients: [
      ing("salt", "Non-iodized salt", 18, { role: "base" }),
      ing("dextrose", "Dextrose", 4, { role: "base" }),
      ing("garlic", "Garlic powder", 5, { role: "spice" }),
      ing("onion", "Onion powder", 2, { role: "spice" }),
      ing("white-pepper", "White pepper", 2, { role: "spice" }),
      ing("paprika", "Paprika", 3, { role: "spice" }),
      ing("jalapeno", "Fresh jalapeños, seeded & minced", 60, {
        role: "fresh",
        note: "Weigh after seeding. Heat varies by pepper — 60 g/kg is a medium batch. Smoking Meat Forums pickled-jalapeño shop rates run ~70 g/kg.",
      }),
      ing("ht-cheese", "High-temp cheddar (optional)", 100, { role: "fresh", optional: true }),
      ing("ice-water", "Ice-cold water", 60, { role: "process", displayUnit: "ml" }),
    ],
    processNotes: [
      "Fold minced jalapeños (and cheese, if using) in after the bind develops so they stay in pieces. Fan-dry, hang-smoke.",
    ],
    sources: [
      "Base smoked-sausage g/kg mix (DH-style) plus fresh jalapeño rate in the 60–70 g/kg shop range discussed on Smoking Meat Forums. Cure recomputed.",
    ],
  },
  {
    id: "andouille",
    name: "Andouille",
    kind: "sausage",
    tagline: "Louisiana smoked sausage — paprika, cayenne, thyme, garlic.",
    requiresCure: true,
    cureMode: "required",
    fatHint: "Coarse grind, ~25–30% fat. Traditional andouille is pork; venison blend still wants pork fat.",
    casings: [HOG_35, HOG_32],
    ingredients: [
      ing("salt", "Non-iodized salt", 18, { role: "base" }),
      ing("garlic", "Garlic powder", 6, { role: "spice" }),
      ing("onion", "Onion powder", 4, { role: "spice" }),
      ing("smoked-paprika", "Smoked paprika", 8, { role: "spice" }),
      ing("cayenne", "Cayenne", 4, { role: "spice" }),
      ing("black-pepper", "Black pepper", 3, { role: "spice" }),
      ing("white-pepper", "White pepper", 2, { role: "spice" }),
      ing("thyme", "Dried thyme", 1.5, { role: "spice" }),
      ing("oregano", "Dried oregano", 1, { role: "spice" }),
      ing("mustard", "Ground mustard", 1.5, { role: "spice" }),
      ing("bay", "Ground bay leaf", 0.3, { role: "spice" }),
      ing("ice-water", "Ice-cold water", 80, { role: "process", displayUnit: "ml" }),
    ],
    processNotes: [
      "Coarse grind (or ⅔ coarse / ⅓ chunk). Fan-dry, hang-smoke to 160°F. This is a cooked smoked andouille, not a raw ferment.",
    ],
    sources: [
      "Cajun andouille seasoning shape (paprika, cayenne, thyme, oregano, mustard, bay, garlic) from public blends such as SpiceRally and AmazingRibs andouille notes, converted to g/kg. Cure recomputed — do not copy teaspoon cure from those recipes.",
    ],
  },
  {
    id: "double-d",
    name: "Double D (Bogalusa, LA) style",
    kind: "sausage",
    tagline: "Unofficial mild Louisiana smoked-sausage copycat.",
    requiresCure: true,
    cureMode: "required",
    fatHint: "Mild smokehouse sausage. 25–30% pork with venison.",
    casings: [HOG_32],
    copycat: true,
    copycatNote:
      "Not affiliated with Double D Meat Company (Bogalusa, LA). There is no public official formula. This is a mild, slightly sweet smoked-sausage copycat inspired by their sugar-cured ham heritage and mild Cajun smoked sausage — not a reverse-engineered trade secret.",
    ingredients: [
      ing("salt", "Non-iodized salt", 18, { role: "base" }),
      ing("dextrose", "Dextrose (slight extra sweetness)", 6, { role: "base" }),
      ing("garlic", "Garlic powder", 4, { role: "spice" }),
      ing("onion", "Onion powder", 2.5, { role: "spice" }),
      ing("black-pepper", "Black pepper", 2.2, { role: "spice" }),
      ing("paprika", "Paprika", 4, { role: "spice" }),
      ing("mustard", "Ground mustard", 2, { role: "spice" }),
      ing("white-pepper", "White pepper", 1, { role: "spice" }),
      ing("cayenne", "Cayenne (mild)", 0.6, { role: "spice" }),
      ing("ice-water", "Ice-cold water", 80, { role: "process", displayUnit: "ml" }),
    ],
    processNotes: [
      "Mild heat on purpose — Double D’s well-known links are not a scorching Cajun sausage. Hang-smoke over hickory if you have it.",
    ],
    sources: [
      "Product descriptions of Double D mild Cajun / hickory smoked sausage (family smokehouse, sugar-cured ham & bacon heritage, mild seasoning). Spice rates are a DH-style g/kg smoked sausage with extra dextrose and low cayenne. Cure computed, not copied.",
    ],
  },
  {
    id: "hamburger",
    name: "Hamburger fat-ratio",
    kind: "hamburger",
    tagline: "Grind blend for burgers — not a sausage.",
    requiresCure: false,
    cureMode: "none",
    fatHint: "Venison is typically ~2–8% fat. Burgers usually want 15–20%.",
    casings: [],
    ingredients: [],
    processNotes: [
      "This mode only tells you how much pork fat or fatty pork to grind with venison. No cure, no casing, no sausage seasoning.",
    ],
    sources: [
      "Standard lean/fat blend algebra. USDA-style burger labels (90/10, 85/15, 80/20, 70/30) are target fat percentages, not recipes.",
    ],
  },
];

export const FAT_SOURCES = [
  { id: "pork-fat", name: "Pork fat / fatback", fatPct: 95, hint: "Hard pork fat. Cleanest way to hit a number." },
  { id: "trim-50", name: "Pork trim ~50/50", fatPct: 50, hint: "Typical fatty pork trim." },
  { id: "shoulder-30", name: "Pork shoulder ~30% fat", fatPct: 30, hint: "Boston butt / picnic average." },
  { id: "belly-40", name: "Pork belly ~40% fat", fatPct: 40, hint: "Belly is meaty; you will add more pounds." },
];

export const TARGET_BLENDS = [
  { id: "90-10", label: "90/10", fatPct: 10 },
  { id: "85-15", label: "85/15", fatPct: 15 },
  { id: "80-20", label: "80/20", fatPct: 20 },
  { id: "75-25", label: "75/25", fatPct: 25 },
  { id: "70-30", label: "70/30", fatPct: 30 },
];

export function getRecipe(id) {
  return RECIPES.find((r) => r.id === id) ?? null;
}

export function sausageRecipes() {
  return RECIPES.filter((r) => r.kind === "sausage");
}
