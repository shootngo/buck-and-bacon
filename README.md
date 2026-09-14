# Buck and Bacon

Mobile-first PWA for **Frank Mulkey**: Phase 2 **Butchering** cut charts (select animal → view cuts → tap for how-to), plus the Phase 1 **venison + pork** sausage scaler (salt, computed Cure #1, casing footage), a jerky starter, and a standalone cure calculator.

Owner: **Frank Mulkey** ([shootngo](https://github.com/shootngo)). Same idea as Nickey / Stashr: static GitHub Pages, Add to Home Screen, large tap targets, no login.

**Current version: V 1.2.**

## Live URL

After Frank merges this branch to `main` and enables Pages (root of `main`):

**https://shootngo.github.io/buck-and-bacon/**

Until Pages is on, use the repo / PR. Local: `python3 -m http.server 8080` and open `http://localhost:8080/`.

### Enable GitHub Pages (from `main` / root)

1. Merge to `main`.
2. Repo **Settings → Pages**.
3. **Source:** Deploy from a branch.
4. **Branch:** `main` · **folder:** `/ (root)`.
5. Save. First publish takes a minute. The `404.html` + `.nojekyll` files are already in the root.

PWA `start_url` / `scope` are relative (`./`), so Add to Home Screen works on that Pages path. App `id` is `/buck-and-bacon/` so it will not collide with Nickey or Stashr.

## Hamburger ☰

1. **Butchering** — deer/venison, hog/pork, beef, chicken. Numbered cut chart, tap a cut for how-to, uses, and links into sausage / jerky / cure.
2. **Sausage recipes** — the Phase 1 scaler (including hamburger fat-ratio).
3. **Jerky** — best cuts, USDA heat-then-dry notes, marinade starters.
4. **Curing & preserving** — standalone Cure #1 calculator plus old-time starter notes (bacon belly, salt pork, equilibrium salt).
5. Converters · Safety & sources · **Check for update**

**Screen stay-on** sits under the header in Butchering (default **on**). It uses the Screen Wake Lock API so the phone doesn’t sleep on the cutting table. Turn it off anytime; while it is on it stays on in other sections too.

## What Phase 1 sausage still does

Enter **pounds of venison** and **pounds of pork**. Total meat = venison + pork. Every seasoning rate is **grams per kilogram of that total**.

| Recipe | Cure | Casing estimate |
| --- | --- | --- |
| Smoked sausage | Required | Hog 32–35 mm |
| Kielbasa | Required | Hog 32–35 mm (35–38 mm optional) |
| Breakfast sausage | **Not required** if fresh / pan-fried. Required **if smoked**. | Sheep 20–22 mm or patties |
| Snack / meat sticks | Required | 19 mm smoked collagen |
| Summer sausage | Required | 2½ × 20 in fibrous (~3 lb/chub) |
| Jalapeño smoked sausage | Required | Hog 32–35 mm · **fresh** jalapeños by weight |
| Andouille | Required | Hog 35–38 mm |
| Double D (Bogalusa, LA) style | Required | Hog 32–35 mm · unofficial copycat |
| Hamburger fat-ratio | None | Not a sausage — lean/fat blender only |

Plus:

- Always-available unit converter (**g, kg, lb, oz**) from the scale button.
- Metric helper: paste a **g/kg** shop rate and a meat weight.
- Workflow chips: **hang sausage in the smoker**; **dry casings in front of a fan, not in the smoker**.

## Food safety — read this

This app is a home scaler. It is **not** USDA inspection, not a substitute for your cure jar’s label, and not legal or medical advice. Weigh **cure and salt on a gram scale**. Mix thoroughly so nitrite is not sitting in a hot spot.

### Cure is computed, never copied

Do **not** trust teaspoon or “packet” cure numbers from recipes, YouTube transcripts, or shop videos. Concentrations differ.

Buck and Bacon always uses this rate for **Cure #1** (Prague Powder #1 / Instacure #1):

- **2.5 g per kg** of total meat  
- which is the same as **1 oz per 25 lb**  
- targeting about **156 ppm** ingoing sodium nitrite when the product is **6.25% sodium nitrite / 93.75% salt**

The UI shows grams and ounces (teaspoons as a rough extra only) and tells you to **confirm against the product in your hand**. Do **not** use Cure #2 for these cooked/smoked sausages.

Breakfast sausage is flagged **cure not required** when it stays fresh and is cooked to 160°F. If you smoke it, the same computed Cure #1 amount applies.

### DH Custom Sausage / Duncan Henry

Seasonings follow the public DH method: formulate in **g/kg of meat** because kilograms work in tenths and the math stays honest ([How to make YOUR OWN sausage recipe](https://www.dhcustomsausage.com/post/how-to-make-your-own-sausage-recipe)). Salt for smoked sausage sits in the common **18 g/kg** shop band; breakfast closer to **17 g/kg**. Spice *profiles* (kielbasa garlic/marjoram, snack-stick paprika, sage breakfast, mustard-seed summer sausage, Cajun andouille) come from public formulas listed below. **Nitrite never does.**

## Sources (public)

- Duncan Henry / DH Custom Sausage — g/kg method and shop-video style notes: https://www.dhcustomsausage.com/post/how-to-make-your-own-sausage-recipe
- Wurstcircle — salt ~18–20 g/kg, pepper ~2 g/kg as a sausage base: https://wurstcircle.com/sausage-spices-seasonings/
- 2 Guys & A Cooler — smoked Polish kielbasa spice list (g/kg). Their 15 g/kg salt was raised to 18 g/kg for the DH smoked band. **Their printed cure was ignored.** https://twoguysandacooler.com/smoked-polish-kielbasa/
- High Caliber Home Processor Guide — breakfast g/kg (sage, thyme, nutmeg, ginger, 17 g/kg salt)
- curingchamber.com — breakfast sausage g/kg and the “scale every spice from meat kg” rule
- Mari / Marianski-style summer sausage (mustard seed, coriander, allspice, dextrose)
- Len Poli snack-stick formula + Walton’s snack-stick process notes (collagen, fat band)
- Smoking Meat Forums — fresh/pickled jalapeño shop rates ~60–70 g/kg
- SpiceRally / AmazingRibs andouille seasoning *shape* (not their teaspoon cure)
- Double D Meat Company site / product copy (mild Cajun, sugar-cured ham heritage) — **no official recipe**; this is an unaffiliated mild smoked-sausage copycat
- NZ Casings — hog 32–35 mm ≈ 2.7 ft/lb; sheep ≈ 4.7 ft/lb: https://www.nzcasings.com/pages/casing-sizing
- LEM / butcher supply — 2½ × 20 in fibrous ≈ 3 lb per chub
- NDSU Extension — Wild Side of the Menu No. 2, Field to Freezer (muscle-boning deer): https://www.ndsu.edu/agriculture/extension/publications/wild-side-menu-no-2-field-freezer
- NMSU Extension — Processing your deer at home: https://pubs.nmsu.edu/_circulars/CR508/index.html
- USDA FSIS — Jerky and food safety (160°F red meat / 165°F poultry before drying): https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/meat/jerky
- Meats and Sausages / USDA comminuted-product nitrite — 2.5 g Cure #1 per kg ≈ 156 ppm: https://www.meatsandsausages.com/drying-preservation/preserving-meat/curing

Casing numbers include ~10% extra for waste. They are estimates, not a packing-house spec.

## Design

Charcoal black (`#121212`), ember orange (`#E65100`), cream (`#F5F5F5`). App icon is the buck riding the hog; splash is the buck kicked back with a cigar. Icons generated: `favicon.png`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`.

## Develop

```bash
npm test          # Node test runner — cure, scaling, converter, casing, fat blend
python3 -m http.server 8080
```

No build step. ES modules, service worker `buck-and-bacon-v1.2` (visible app version **V 1.2**).

Hamburger ☰ → **Check for update** asks the service worker / `version.json` for a newer deploy. If one is waiting, it activates and reloads. If you’re already current, you get a short toast: *You’re on the latest version (V 1.2).* The existing auto “new version” banner still appears when a worker installs in the background.

Butchering how-to is home-processor shop talk (NDSU Field to Freezer, NMSU deer circular, USDA FSIS jerky). No packed videos in V 1.2 — extension links are on the animal pages.

## Still parked (not in V 1.2)

- Canned / pressed ham
- Bologna
- Shopping list generator
- Smoking schedules
- Saved-batch log
