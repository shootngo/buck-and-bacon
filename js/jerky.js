/** Jerky starter — process + marinade structure, not a USDA process schedule. */

export const JERKY_TOPICS = [
  {
    id: "cuts",
    name: "Best cuts",
    tagline: "Lean muscles that slice into even strips",
    body: [
      "Jerky wants lean, low-connective-tissue meat. Fat goes rancid in the jar.",
      "Deer: top round from the hind quarter is the usual shop favorite. Eye of round and clean flank work too. Loin will make jerky but that’s a spendy way to treat a backstrap.",
      "Beef: top round, eye of round, flank, and sirloin tip. Pork loin can be dried but trim fat hard.",
      "Chicken: breast strips only if you are following poultry rules — cook to 165°F. Dark meat is fattier and messier to dry.",
    ],
    links: [
      { href: "#/butchering/deer/hind-quarter", label: "Deer hind quarter" },
      { href: "#/butchering/beef/round", label: "Beef round" },
      { href: "#/butchering/deer/flank", label: "Deer flank" },
    ],
  },
  {
    id: "process",
    name: "How to make it",
    tagline: "Slice, flavor, heat, then dry",
    body: [
      "Partial-freeze the roast so you can slice even ⅛–¼ in strips. With-the-grain is chewier; across-the-grain is easier to eat.",
      "USDA FSIS: heat beef, pork, and venison to 160°F and poultry to 165°F before dehydrating so wet heat kills pathogens. A dehydrator alone at 130–140°F is not that step.",
      "Then dry until the strip cracks but does not snap, and no wet spots remain. Home jerky is not locker snack-stick — keep finished bags cold if you can, and don’t treat this as canned-shelf forever.",
      "Don’t reuse a marinade that touched raw meat unless you boil it hard first. When in doubt, throw it out.",
    ],
    links: [
      {
        href: "https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/meat/jerky",
        label: "USDA FSIS — Jerky and food safety",
        external: true,
      },
      {
        href: "https://www.ndsu.edu/agriculture/extension/publications/wild-side-menu-no-3-preservation-game-meats-and-fish",
        label: "NDSU — Preservation of game meats",
        external: true,
      },
    ],
  },
  {
    id: "marinades",
    name: "Marinades",
    tagline: "Flavor starters for about 2 lb sliced meat",
    body: [
      "These are shop-style starting points, not safety. Salt and soy already season; you can add Cure #1 if you want a cured snack (use the Curing calculator — don’t guess).",
      "Marinate in the fridge, not on the counter. 4–12 hours is plenty for thin slices.",
    ],
    marinades: [
      {
        id: "peppered",
        name: "Peppered",
        items: [
          "½ cup soy sauce",
          "¼ cup Worcestershire",
          "1 Tbsp coarse black pepper",
          "1 tsp garlic powder",
          "1 tsp onion powder",
        ],
      },
      {
        id: "sweet-heat",
        name: "Sweet heat",
        items: [
          "½ cup soy sauce",
          "¼ cup brown sugar or honey",
          "1 Tbsp hot sauce or chipotle",
          "1 tsp smoked paprika",
          "1 tsp black pepper",
        ],
      },
      {
        id: "teriyaki",
        name: "Teriyaki-style",
        items: [
          "½ cup soy sauce",
          "¼ cup pineapple juice or orange juice",
          "2 Tbsp brown sugar",
          "1 tsp ginger",
          "1 tsp garlic powder",
        ],
      },
    ],
    links: [{ href: "#/cure", label: "Cure #1 calculator (optional)" }],
  },
];

export function getJerkyTopic(id) {
  return JERKY_TOPICS.find((t) => t.id === id) || null;
}
