/**
 * Home-processor cut charts for Buck and Bacon.
 * Names follow common US shop / hunter usage, not a packing-house spec.
 */

const LINK_SAUSAGE = { href: "#/sausage", label: "Sausage recipes" };
const LINK_JERKY = { href: "#/jerky", label: "Jerky" };
const LINK_CURE = { href: "#/cure", label: "Curing & preserving" };

function cut(partial) {
  return {
    aka: "",
    howTo: [],
    uses: [],
    links: [],
    tools: ["Boning knife", "Steel"],
    ...partial,
  };
}

export const TOOLS = [
  {
    id: "boning-knife",
    name: "Boning knife",
    kind: "knife",
    summary: "Flexible 5–6 in blade for seaming meat off bone.",
    howTo: [
      "Keep it sharp enough to shave hair on your arm. A dull knife slips — that’s how you get cut.",
      "Work with the tip and the first third of the blade along natural seams. Don’t hack through bone with a boning knife.",
      "Wipe fat and silver skin off the blade often so you can see what you’re doing.",
    ],
  },
  {
    id: "breaking-knife",
    name: "Breaking / butcher knife",
    kind: "knife",
    summary: "Stiffer 8–10 in blade for opening a carcass and portioning big muscles.",
    howTo: [
      "Use it to start long cuts (backstraps, splitting a pork side) then switch to the boning knife at the joints.",
      "Not a pry bar. If you hit bone, stop and go around it or pick up the saw.",
    ],
  },
  {
    id: "steel",
    name: "Steel (honing rod)",
    kind: "knife",
    summary: "Realigns the edge between stones.",
    howTo: [
      "A few light passes each quarter keeps the knife from rolling. Honing is not sharpening.",
      "When the steel stops helping, hit a stone or a guided sharpener before you keep working.",
    ],
  },
  {
    id: "saw",
    name: "Bone saw or clean reciprocating blade",
    kind: "saw",
    summary: "For splitting a hog or beef, not for everyday deer boning.",
    howTo: [
      "Most deer work is knife-only if you bone along seams. Sawing a deer spine throws bone dust into the meat and is a CWD-hygiene concern.",
      "On hog and beef, saw between vertebrae or through the brisket only when you mean to. Rinse bone dust off the cut face.",
      "Dedicated butcher blade — don’t borrow the shop wood blade.",
    ],
  },
  {
    id: "gambrel",
    name: "Gambrel and hoist",
    kind: "hang",
    summary: "Hang by the Achilles tendons, hind legs spread.",
    howTo: [
      "A hanging carcass is easier to skin and to pull shoulders and hams. Keep the hide off the meat as it peels.",
      "Work at a height where your elbows are slightly bent. Fatigue makes sloppy cuts.",
    ],
  },
  {
    id: "table",
    name: "Cold table and pans",
    kind: "shop",
    summary: "Once quarters come off, finish on a clean, cold surface.",
    howTo: [
      "Chill the carcass before you get picky with steaks. Warm meat smears and is harder to seam.",
      "Pans for steaks, grind, dog bones, and trash. Don’t mix them.",
      "Keep a rinse bucket and clean towels. Hair on a steak is a wrapping problem, not a flavor.",
    ],
  },
  {
    id: "temp",
    name: "Cold chain",
    kind: "shop",
    summary: "Butchering is a race against heat, not a race against the clock.",
    howTo: [
      "Get the hide off and the body cavity open so heat can leave. Then get meat into a fridge or iced cooler.",
      "If the shop is hot, break to quarters fast and pack them on ice. Finish boning the next morning.",
      "Ground meat and sausage trim go to the coldest spot. They spoil first.",
    ],
  },
];

const DEER_CUTS = [
  cut({
    id: "neck",
    num: 1,
    name: "Neck",
    aka: "Neck roast, collar",
    description:
      "Heavily worked muscle with lots of connective tissue. On a deer it is a thick cylinder around the spine from the skull to the shoulders. Not a pretty steak — it is some of the best stew and grind on the animal if you treat it slow.",
    howTo: [
      "On a hanging carcass, knife around the base of the skull, then follow the spine down to the point of the shoulder.",
      "You can leave it bone-in as a neck roast, or bone it out in sheets for grind. Don’t saw the neck if you are avoiding spinal cord (CWD hygiene).",
      "Trim dried edges, bloodshot, and excess silver skin. A little fat can stay for a braise.",
    ],
    uses: ["Neck roast / pot roast", "Stew and chili", "Sausage and burger trim"],
    links: [LINK_SAUSAGE, LINK_CURE],
    tools: ["Boning knife"],
  }),
  cut({
    id: "shoulder",
    num: 2,
    name: "Shoulder",
    aka: "Chuck, blade, front quarter",
    description:
      "The whole front quarter minus the shank. Scapula (shoulder blade) sits in the middle. More connective tissue than the hind, so it shines as a roast, stew, or sausage — not as a thick grilled steak unless you seam out individual muscles.",
    howTo: [
      "There is no ball-and-socket holding the shoulder to the ribs. Lift the front leg and knife the seam between the scapula and the rib cage, up over the withers.",
      "Lay the shoulder on the table, skin-side down. Follow the blade bone: you can pull a boneless blade roast, smaller arm muscles, and plenty of trim.",
      "If you want bone-in “shoulder steaks,” slice across the blade with a saw. Most home processors bone it and skip the saw.",
    ],
    uses: ["Pot roast", "Blade steaks (thin)", "Chili and stew", "Sausage grind"],
    links: [LINK_SAUSAGE, LINK_JERKY],
    tools: ["Boning knife", "Gambrel"],
  }),
  cut({
    id: "front-shank",
    num: 3,
    name: "Front shank",
    aka: "Foreshank, shin",
    description:
      "Lower front leg below the elbow. Lots of tendon and collagen. Makes silky broth or goes in the grind pile. Not a steak.",
    howTo: [
      "On the whole shoulder, cut through the joint at the elbow (or saw if you prefer a clean bone-in osso-style round).",
      "For grind: bone out the meat and toss heavy tendon. For braise: leave the bone in and cut 1½–2 in rounds.",
    ],
    uses: ["Osso buco / slow braise", "Stock", "Sausage trim"],
    links: [LINK_SAUSAGE],
    tools: ["Boning knife", "Saw (optional)"],
  }),
  cut({
    id: "brisket",
    num: 4,
    name: "Brisket / breast",
    aka: "Plate, dewlap meat",
    description:
      "Thin meat over the sternum and between the front legs. On a deer it is a small piece compared with beef. Easy to overlook — it is good grind and can be a small slow-cook.",
    howTo: [
      "After the shoulders are off, knife the thin sheet off the brisket bone and the lower rib cartilages.",
      "Trim hair, membrane, and dried blood. Most of it is grind; a thicker chunk can go in the crock with the neck.",
    ],
    uses: ["Grind", "Small braise", "Trim for sausage"],
    links: [LINK_SAUSAGE],
    tools: ["Boning knife"],
  }),
  cut({
    id: "ribs",
    num: 5,
    name: "Ribs",
    aka: "Rib rack, riblets",
    description:
      "Meat between and over the rib bones once the shoulder and loin are gone. Deer ribs are thinner than hog spare ribs. Some folks grill them; a lot of shop meat from here is stripped for grind.",
    howTo: [
      "With the backstraps already off, you can pull the remaining rib meat in sheets with a boning knife, or saw a rack if you like bone-in riblets.",
      "Flank meat hanging off the bottom of the ribs is not rib — treat that as flank (jerky or grind).",
      "Don’t chew through the spine. Leave vertebrae on the carcass if you are boning for CWD caution.",
    ],
    uses: ["Grilled riblets", "Strip for grind", "Stock bones after trimming"],
    links: [LINK_SAUSAGE],
    tools: ["Boning knife", "Saw (optional)"],
  }),
  cut({
    id: "loin",
    num: 6,
    name: "Loin (backstrap)",
    aka: "Backstrap, loin chops, longissimus",
    description:
      "The prize along the top of the back, from the shoulder to the hip. Two straps, one on each side of the spine. Tender enough for chops or a whole roast. This is not the tenderloin — tenderloins hide inside the body cavity.",
    howTo: [
      "Start at the hip or the shoulder. Run a boning knife along the spine, then down along the rib bones, peeling the whole strap in one piece.",
      "Silver skin on the outside peels with a shallow knife, blade up, like skinning a fish fillet. Get it off or the chop curls and chews.",
      "Cut 1–1¼ in chops across the grain, or leave a roast. Small chops can be butterflied.",
    ],
    uses: ["Chops", "Loin roast", "Medallions", "Fast skillet or grill"],
    links: [LINK_JERKY],
    tools: ["Boning knife", "Breaking knife"],
  }),
  cut({
    id: "tenderloin",
    num: 7,
    name: "Tenderloin",
    aka: "Filet, inner loin, psoas",
    description:
      "The most tender muscle, inside the body cavity along the underside of the spine, from about the last ribs to the pelvis. Two small tenderloins. Easy to miss if you quarter first without looking inside.",
    howTo: [
      "Best pulled while the carcass is still whole and hanging, before you take the hinds off. Reach inside along the backbone.",
      "Peel with your fingers and a short knife. There is a natural seam. Don’t leave them on the gut pile.",
      "Trim the chain and silver skin. Cook whole or as medallions — they overcook fast.",
    ],
    uses: ["Medallions", "Whole tenderloin roast", "Special-night skillet"],
    links: [],
    tools: ["Boning knife"],
  }),
  cut({
    id: "flank",
    num: 8,
    name: "Flank",
    aka: "Belly, skirt-adjacent",
    description:
      "Thin side meat behind the ribs, toward the hind. Coarse grain. On a deer it is a natural jerky and grind cut — not a thick steak unless you like it sliced very thin across the grain.",
    howTo: [
      "Knife the thin sheet off the abdominal wall after the insides are out. Keep it as clean as you can — this area gets dirty in the field.",
      "For jerky: square it up, slice with or across the grain depending on how chewy you like it. For sausage: it’s trim.",
    ],
    uses: ["Jerky", "Fajita-style thin slices", "Grind"],
    links: [LINK_JERKY, LINK_SAUSAGE],
    tools: ["Boning knife"],
  }),
  cut({
    id: "hind-quarter",
    num: 9,
    name: "Hind quarter",
    aka: "Round, ham, back leg",
    description:
      "The big rear leg above the hock. This is most of your steaks and roasts: top round, bottom round, eye of round, and sirloin tip (knuckle) once you seam them. Treat it like a boneless ham, not like a beef round steak with a bone in the middle.",
    howTo: [
      "On a hanging deer, cut to the hip joint, pop the ball out of the socket, and take the whole leg. You do not need a saw.",
      "On the table, find the natural seams. Separate top round, bottom round, eye, and sirloin tip. Each muscle can be steaks, a roast, or jerky.",
      "Cut steaks across the grain, on the thin side (about ¼–½ in) except loin-style thicknesses from the biggest, most tender faces.",
    ],
    uses: ["Steaks", "Roasts", "Jerky (top round is a favorite)", "Some grind from ragged edges"],
    links: [LINK_JERKY, LINK_SAUSAGE, LINK_CURE],
    tools: ["Boning knife", "Gambrel"],
  }),
  cut({
    id: "rear-shank",
    num: 10,
    name: "Rear shank",
    aka: "Hind shank, hock meat",
    description:
      "Lower hind leg below the knee/hock joint. Same story as the front shank: collagen, flavor, not steaks.",
    howTo: [
      "Separate at the joint where the round becomes shank. Bone-in rounds for the pot, or strip the meat for grind and save the bone for stock.",
    ],
    uses: ["Braise", "Stock", "Sausage trim"],
    links: [LINK_SAUSAGE],
    tools: ["Boning knife"],
  }),
];

const HOG_CUTS = [
  cut({
    id: "jowl",
    num: 1,
    name: "Jowl",
    aka: "Cheek, jowl bacon",
    description:
      "Fatty meat from the jaw and cheek. Cures and smokes like a small bacon, or goes into sausage for fat and flavor.",
    howTo: [
      "When the head is off, square the cheek/jowl into a flat rectangle. Skin it if you don’t want rind.",
      "For sausage, cube it into the fat pile. For jowl bacon, see Curing — same Cure #1 math as belly.",
    ],
    uses: ["Jowl bacon", "Sausage fat", "Seasoning meat for beans"],
    links: [LINK_CURE, LINK_SAUSAGE],
    tools: ["Boning knife"],
  }),
  cut({
    id: "boston-butt",
    num: 2,
    name: "Boston butt",
    aka: "Upper shoulder, blade roast, pork butt",
    description:
      "Upper half of the pork shoulder, above the picnic. Marbled, blade bone inside. This is pulled pork, sausage, and country-style ribs — not a lean chop.",
    howTo: [
      "On a side, the shoulder is separated from the loin roughly between the 2nd and 3rd ribs (shops vary). Then split that shoulder horizontally: upper piece is the Boston butt.",
      "You can bone the blade out for sausage or leave it in for a smoker roast. Country-style “ribs” are cut from this muscle, not from the belly ribs.",
    ],
    uses: ["Pulled pork", "Sausage", "Country-style ribs", "Shoulder steaks"],
    links: [LINK_SAUSAGE, LINK_CURE],
    tools: ["Breaking knife", "Boning knife", "Saw"],
  }),
  cut({
    id: "picnic",
    num: 3,
    name: "Picnic shoulder",
    aka: "Lower shoulder, arm roast",
    description:
      "Lower shoulder including the arm bone, down to the hock. Tougher and more skin/shank than the butt. Fine smoked, braised, or boned for sausage.",
    howTo: [
      "After the Boston butt comes off, what remains of the front quarter (minus the hock if you take it separately) is the picnic.",
      "Skin-on picnics are common for smoking. For sausage, bone it out and be honest about sinew — some of it is grind, some is stock.",
    ],
    uses: ["Smoked picnic", "Braise", "Sausage", "Roast"],
    links: [LINK_SAUSAGE, LINK_CURE],
    tools: ["Boning knife", "Saw"],
  }),
  cut({
    id: "front-hock",
    num: 4,
    name: "Front hock",
    aka: "Pork hock, knuckle",
    description:
      "The joint below the picnic. Skin, bone, and collagen. Seasoning meat for beans, kraut, and stock.",
    howTo: [
      "Saw or knife the joint at the picnic/hock line. Leave skin on if you want that classic hock look in the pot.",
    ],
    uses: ["Pot of beans", "Stock", "Smoked hocks"],
    links: [LINK_CURE],
    tools: ["Saw", "Boning knife"],
  }),
  cut({
    id: "loin",
    num: 5,
    name: "Loin",
    aka: "Chops, loin roast, tenderloin sits under this",
    description:
      "Top of the back from shoulder to ham. Center-cut chops, loin roast, and baby-back ribs on the underside of this primal. The pork tenderloin is the small muscle under the rear loin — pull it before you cut chops if you want it whole.",
    howTo: [
      "Separate loin from belly with a long cut, roughly where the extra-fatty side meat starts (a few inches down from the chine).",
      "Chin the backbone (remove chine) if you want easy chops. Cut chops ¾–1 in, or leave a roast. Baby backs stay on the loin unless you peel them off as a rack.",
      "Slide the tenderloin out from the inside of the ham-end of the loin before you portion.",
    ],
    uses: ["Pork chops", "Loin roast", "Baby-back ribs", "Tenderloin"],
    links: [LINK_CURE, LINK_JERKY],
    tools: ["Breaking knife", "Saw", "Boning knife"],
  }),
  cut({
    id: "belly",
    num: 6,
    name: "Belly / side",
    aka: "Bacon, side pork, pancetta-style",
    description:
      "The side below the loin. This is bacon if you cure and smoke it, or fresh side pork if you don’t. Streaky fat and lean. Spare ribs are on the inside of this primal until you peel them off.",
    howTo: [
      "After the loin is off, square the belly: straight edges make bacon easier to slice later.",
      "Peel the spare-rib rack from the inside if it is still attached. Leave or take the skin depending on how you like bacon.",
      "Don’t guess cure amounts — use the Cure #1 calculator in Curing & preserving.",
    ],
    uses: ["Bacon", "Fresh side pork", "Sausage fat and meat", "Burnt ends / cubed belly"],
    links: [LINK_CURE, LINK_SAUSAGE],
    tools: ["Breaking knife", "Boning knife"],
  }),
  cut({
    id: "spare-ribs",
    num: 7,
    name: "Spare ribs",
    aka: "Side ribs, St. Louis-style when squared",
    description:
      "The rib bones from the belly side (not baby backs). Meat between bones, plus the breastbone cartilages until you trim St. Louis style.",
    howTo: [
      "From the inside of the belly, start at the sternum edge and peel the rack off in one sheet, knife tight to bone.",
      "St. Louis-style: square the rack, take off the rib tips/cartilage strip. Save tips for the smoker.",
    ],
    uses: ["Smoked ribs", "Braised ribs", "Rib tips"],
    links: [LINK_CURE],
    tools: ["Boning knife"],
  }),
  cut({
    id: "fatback",
    num: 8,
    name: "Fatback",
    aka: "Back fat, hard fat",
    description:
      "Thick fat over the loin. This is your sausage fat if you are mixing venison. Harder and cleaner than belly fat for a lot of shop mixes.",
    howTo: [
      "When skinning or when the loin comes off, take the fat in a sheet. Skin it. Cube and chill hard before you grind.",
      "The hamburger and sausage tools in this app assume you know how much fat you are adding — weigh it.",
    ],
    uses: ["Venison sausage fat", "Lard", "Sausage mix"],
    links: [LINK_SAUSAGE],
    tools: ["Boning knife"],
  }),
  cut({
    id: "ham",
    num: 9,
    name: "Ham",
    aka: "Rear leg, fresh ham",
    description:
      "The whole hind leg above the hock. Fresh ham is a roast; cured ham is a project (Phase 2 still parks a full country-ham schedule). You can also seam it like a deer hind for steaks and roasts, or grind the ragged bits.",
    howTo: [
      "Separate from the loin at the pelvic end — saw through the aitch bone / hip, or bone the leg off the pelvis.",
      "Skin and trim. Leave whole for curing, or seam into inside/outside/knuckle like a round.",
    ],
    uses: ["Fresh ham roast", "Cured ham (see Curing)", "Steaks from seamed muscles", "Sausage"],
    links: [LINK_CURE, LINK_SAUSAGE],
    tools: ["Saw", "Boning knife"],
  }),
  cut({
    id: "rear-hock",
    num: 10,
    name: "Rear hock",
    aka: "Ham hock",
    description:
      "Below the ham. Same use as the front hock — smoke it or throw it in beans.",
    howTo: [
      "Saw just above the hock joint so you leave a meaty ham and a usable hock. Don’t split it into mystery cubes unless you like picking bone in the pot.",
    ],
    uses: ["Smoked hocks", "Beans and greens", "Stock"],
    links: [LINK_CURE],
    tools: ["Saw"],
  }),
];

const BEEF_CUTS = [
  cut({
    id: "chuck",
    num: 1,
    name: "Chuck",
    aka: "Shoulder, chuck roast, blade",
    description:
      "Shoulder primal from the neck through about the 5th rib. Flavorful, worked muscle. Roasts, chuck steaks, stew, and a lot of honest hamburger.",
    howTo: [
      "On a side of beef this is a saw cut: about between the 5th and 6th ribs, square to the back.",
      "At home, bone out a chuck roast, or cut blade roasts that still have the scapula. Neck meat on the front of the chuck is stew or grind.",
      "Chuck makes good grind because it already carries fat compared with round.",
    ],
    uses: ["Pot roast", "Chuck steak", "Stew", "Burger and sausage"],
    links: [LINK_SAUSAGE, LINK_CURE],
    tools: ["Saw", "Breaking knife", "Boning knife"],
  }),
  cut({
    id: "rib",
    num: 2,
    name: "Rib",
    aka: "Ribeye, prime rib, back ribs",
    description:
      "Rib primal, roughly 6th through 12th ribs. Ribeye steaks or a standing rib roast. Back ribs stay on if you don’t bone it.",
    howTo: [
      "Wholesale cut is from the chuck cut back to the loin cut (about the 12th/13th rib).",
      "For steaks: saw or knife between ribs, 1–1½ in. For a roast: leave 2–7 bones. You can bone a ribeye roll and cut boneless steaks.",
    ],
    uses: ["Ribeye steaks", "Prime rib roast", "Beef back ribs"],
    links: [],
    tools: ["Saw", "Breaking knife"],
  }),
  cut({
    id: "short-loin",
    num: 3,
    name: "Short loin",
    aka: "Strip, T-bone, porterhouse",
    description:
      "Behind the rib, in front of the sirloin. T-bone and porterhouse are bone-in steaks from here (tenderloin on one side of the T, strip on the other). Boneless, it’s the strip loin.",
    howTo: [
      "The porterhouse is the end with the bigger tenderloin; T-bone has a smaller filet wing.",
      "If you pull the tenderloin whole (see Tenderloin), this primal becomes strip steaks instead of T-bones. That’s a choice, not a mistake.",
    ],
    uses: ["T-bone", "Porterhouse", "New York strip"],
    links: [],
    tools: ["Saw", "Breaking knife"],
  }),
  cut({
    id: "sirloin",
    num: 4,
    name: "Sirloin",
    aka: "Top sirloin, hip",
    description:
      "Between the short loin and the round. Top sirloin steaks and tri-tip (on the bottom sirloin, depending how you cut). Good steaks, a little more work than strip.",
    howTo: [
      "Separate from the round roughly in front of the femur head / aitch bone. Shops vary on the exact line.",
      "Seam top sirloin off the bone. Tri-tip is a triangular muscle on the bottom sirloin — worth finding instead of grinding.",
    ],
    uses: ["Top sirloin steaks", "Tri-tip", "Kabobs", "Some jerky"],
    links: [LINK_JERKY],
    tools: ["Boning knife", "Saw"],
  }),
  cut({
    id: "tenderloin",
    num: 5,
    name: "Tenderloin",
    aka: "Filet mignon, PSMO if you buy it boxed",
    description:
      "Under the short loin and into the sirloin, inside the carcass. Most tender beef muscle. Small compared with the rest of the animal — don’t hide it in the grind.",
    howTo: [
      "Pull it as a whole muscle before you saw T-bones, or leave it in for porterhouses. You don’t get both from the same inches.",
      "Peel the chain, silver skin, and the wing. Center-cut filets; the tail can be medallions or stir-fry.",
    ],
    uses: ["Filet steaks", "Tenderloin roast", "Medallions"],
    links: [],
    tools: ["Boning knife"],
  }),
  cut({
    id: "round",
    num: 6,
    name: "Round",
    aka: "Hind leg, top/bottom/eye of round",
    description:
      "Rear leg primal. Lean. Top round and eye of round are classic jerky and roast-beef cuts. Bottom round is a rump roast or more jerky. Not the juiciest steak unless you slice thin.",
    howTo: [
      "Take the round off the sirloin at the hip. Bone out femur and seam the muscles: top, bottom, eye, knuckle (sirloin tip).",
      "Cut roasts with the grain running the long way so you slice against the grain at the table. For jerky, the top round is the easy win.",
    ],
    uses: ["Roast beef", "Jerky", "Cube steak", "Lean grind (add fat)"],
    links: [LINK_JERKY, LINK_SAUSAGE, LINK_CURE],
    tools: ["Boning knife", "Saw"],
  }),
  cut({
    id: "flank",
    num: 7,
    name: "Flank",
    aka: "Flank steak",
    description:
      "The well-known flank steak on the belly behind the plate. Obvious grain. Marinates and slices thin across the grain.",
    howTo: [
      "Peel the flank as a single oval muscle off the abdominal wall. Trim heavy membrane. Don’t confuse it with skirt (from the plate/diaphragm).",
    ],
    uses: ["Grilled flank", "Fajitas", "Jerky"],
    links: [LINK_JERKY],
    tools: ["Boning knife"],
  }),
  cut({
    id: "plate",
    num: 8,
    name: "Plate",
    aka: "Short ribs, skirt",
    description:
      "Belly primal under the rib. Short ribs, inside and outside skirt. Fatty and beefy. Not a lean roast.",
    howTo: [
      "Short ribs are cut across or along the rib bones from this primal. Skirt steaks are the diaphragm muscles — peel and skin the membrane.",
      "A lot of plate also becomes grind. That’s fine if the steaks you wanted already came off.",
    ],
    uses: ["Short ribs", "Skirt steak", "Grind"],
    links: [LINK_SAUSAGE, LINK_CURE],
    tools: ["Boning knife", "Saw"],
  }),
  cut({
    id: "brisket",
    num: 9,
    name: "Brisket",
    aka: "Point and flat",
    description:
      "The chest. Two muscles: the leaner flat and the fattier point. Trim, smoke, or corn. A whole packer is both pieces still together.",
    howTo: [
      "On a side, the brisket sits ahead of the plate, over the breastbone. Square it, leave the fat cap on if you will smoke it.",
      "You can separate point from flat along the seam. Don’t cut it into steaks and expect chuck-roast behavior — it wants low and slow or a cure.",
    ],
    uses: ["Smoked brisket", "Corned beef", "Burnt ends (point)", "Pastrami-style"],
    links: [LINK_CURE],
    tools: ["Boning knife", "Breaking knife"],
  }),
  cut({
    id: "shank",
    num: 10,
    name: "Shank",
    aka: "Foreshank, cross-cut shank",
    description:
      "Front (and sometimes hind) shin. Cross-cut, it is osso buco. Whole, it is soup bone with meat.",
    howTo: [
      "Saw 1½–2 in rounds, or bone out for grind after you take the good stew meat. Lots of tendon — that’s the point for a braise.",
    ],
    uses: ["Osso buco", "Beef barley soup", "Grind"],
    links: [LINK_SAUSAGE],
    tools: ["Saw", "Boning knife"],
  }),
];

const CHICKEN_CUTS = [
  cut({
    id: "neck",
    num: 1,
    name: "Neck",
    aka: "Neck skin, soup neck",
    description:
      "Small, bony, lots of collagen. Rarely a “cut” people plate — it is stock and gravy gold, plus extra skin for the roasting pan.",
    howTo: [
      "Cut off at the shoulders. Save necks in a freezer bag until you have enough for a pot of stock.",
    ],
    uses: ["Stock", "Gravy", "Cooked-pick meat for dressing"],
    links: [],
    tools: ["Boning knife", "Kitchen shears"],
  }),
  cut({
    id: "breast",
    num: 2,
    name: "Breast",
    aka: "Pectoral, boneless skin-on or skinless",
    description:
      "The large white meat on the chest. Easy to dry out. Bone-in split breasts still have rib bones; boneless is knifed off the keel.",
    howTo: [
      "With the bird on its back, pop the wing out of the way. Cut along one side of the keel bone and peel the breast off the carcass, then repeat.",
      "Leave skin on for roasting. For jerky-style chicken strips, slice the boneless breast with the grain into even strips — poultry needs 165°F.",
    ],
    uses: ["Roast", "Cutlets", "Grilled breast", "Poultry jerky (cooked to 165°F)"],
    links: [LINK_JERKY],
    tools: ["Boning knife"],
  }),
  cut({
    id: "tenderloin",
    num: 3,
    name: "Tenderloin",
    aka: "Chicken tender, inner pectoral",
    description:
      "The small strip under each breast. Peels off with a finger. That’s a “tender,” not a beef tenderloin.",
    howTo: [
      "After the breast is off, the tender often stays on the bone or hangs on the breast. Pull it. Trim the white tendon.",
    ],
    uses: ["Tenders", "Stir-fry", "Kids’ pieces"],
    links: [],
    tools: ["Boning knife"],
  }),
  cut({
    id: "wing",
    num: 4,
    name: "Wing",
    aka: "Drumette, flat, tip",
    description:
      "Three sections: drumette (looks like a mini drumstick), flat (two bones), and tip (mostly cartilage — stock).",
    howTo: [
      "Pull the wing away from the breast and cut through the shoulder joint. Don’t take breast meat with it unless you want “airline” style.",
      "Joint into drumette/flat/tip at the obvious wrinkles. Tips go in the stock bag.",
    ],
    uses: ["Wings", "Stock (tips)", "Grill or fry"],
    links: [],
    tools: ["Boning knife", "Kitchen shears"],
  }),
  cut({
    id: "back",
    num: 5,
    name: "Back / carcass",
    aka: "Spine, oyster meat",
    description:
      "What’s left after breasts, wings, and legs. Not a steak. There are two “oysters” of dark meat along the back in front of the hips — worth popping out.",
    howTo: [
      "After the other pieces are off, split or leave whole for stock. Scrape residual meat for sausage-style grind if you are making chicken sausage.",
    ],
    uses: ["Stock", "Oyster nibble", "Trim for chicken sausage"],
    links: [LINK_SAUSAGE],
    tools: ["Kitchen shears", "Boning knife"],
  }),
  cut({
    id: "thigh",
    num: 6,
    name: "Thigh",
    aka: "Upper joint, boneless thigh",
    description:
      "Dark meat above the knee. Forgiving on the grill. Bone-in or boneless; skin-on keeps moisture.",
    howTo: [
      "Quarter the bird: cut the skin between breast and thigh, pop the hip joint, and take the whole leg quarter. Then separate thigh from drumstick at the knee.",
      "To bone: knife along the femur and peel. Thighs are the usual choice for chicken sausage because they have more fat than breast.",
    ],
    uses: ["Grill", "Braise", "Chicken sausage", "Debone for cutlets"],
    links: [LINK_SAUSAGE],
    tools: ["Boning knife"],
  }),
  cut({
    id: "drumstick",
    num: 7,
    name: "Drumstick",
    aka: "Lower joint, chicken leg",
    description:
      "Lower leg. One bone, lots of connective tissue near the ankle. Classic fried or baked piece.",
    howTo: [
      "Find the knee joint between thigh and drum. Cut through the joint, not through the femur. Trim the ankle end if you want a cleaner look.",
    ],
    uses: ["Fried / baked legs", "Stock after eating", "Grill"],
    links: [],
    tools: ["Boning knife"],
  }),
];

export const ANIMALS = [
  {
    id: "deer",
    name: "Deer / venison",
    shortName: "Deer",
    tagline: "Whitetail, mule deer, and similar-size cervids",
    blurb:
      "Home processors usually bone along seams — knife, not saw. Hang it, pull tenderloins, take shoulders and hinds, then the backstraps. Keep meat cold and keep the spine intact if you are being careful about CWD.",
    breakOrder: [
      "Chill the carcass. Hang by the gambrel if you can.",
      "Pull both tenderloins from inside the cavity.",
      "Knife off the shoulders (they lift off the rib cage).",
      "Take the hind quarters at the hip joints.",
      "Peel the backstraps along the spine.",
      "Strip rib, brisket, neck, flank, and shanks for roasts, jerky, or grind.",
    ],
    sources: [
      {
        label: "NDSU Extension — Field to Freezer (muscle-boning deer)",
        href: "https://www.ndsu.edu/agriculture/extension/publications/wild-side-menu-no-2-field-freezer",
      },
      {
        label: "NMSU Extension — Processing your deer at home",
        href: "https://pubs.nmsu.edu/_circulars/CR508/index.html",
      },
    ],
    diagram: {
      viewBox: "0 0 440 300",
      caption: "Side chart, head to the left. Tap a numbered cut.",
    },
    cuts: DEER_CUTS,
  },
  {
    id: "hog",
    name: "Hog / pork",
    shortName: "Hog",
    tagline: "Farm hog or similar wild hog, split as a side",
    blurb:
      "A hog is a saw-and-knife job: shoulder, loin, belly, ham. Fatback and belly are how venison sausage gets juicy. Hocks and jowl are old-time seasoning meat.",
    breakOrder: [
      "Split the carcass down the backbone (or start from a side).",
      "Take the shoulder off (about the 2nd–3rd rib) and split Boston butt from picnic.",
      "Separate loin from belly with a long cut.",
      "Peel spare ribs from the belly; square the belly for bacon.",
      "Take the ham off the hip; saw hocks if you want them separate.",
      "Save jowl, fatback, and clean trim for sausage.",
    ],
    sources: [
      {
        label: "Meats and Sausages — home sausage and pork cutting notes",
        href: "https://www.meatsandsausages.com/",
      },
    ],
    diagram: {
      viewBox: "0 0 440 300",
      caption: "Side chart, snout to the left. Tap a numbered cut.",
    },
    cuts: HOG_CUTS,
  },
  {
    id: "beef",
    name: "Beef / cattle",
    shortName: "Beef",
    tagline: "A side of beef, or the same names on a quarter",
    blurb:
      "US primals: chuck, rib, loin, round, plus flank, plate, brisket, and shank. A home shop usually starts from quarters already split by a locker. Names below match the grocery counter so you know what you wrapped.",
    breakOrder: [
      "Know which quarter you have (chuck + rib vs round + loin).",
      "On a forequarter: brisket and shank off, then chuck from rib.",
      "On a hind: round from sirloin, short loin from rib end, flank off the belly.",
      "Decide early: whole tenderloin, or T-bones with the filet left in.",
      "Trim fat to the style you eat. Beef fat belongs on some cuts; thick waste fat can still go to grind.",
    ],
    sources: [
      {
        label: "Meats and Sausages — beef cutting overview",
        href: "https://www.meatsandsausages.com/",
      },
    ],
    diagram: {
      viewBox: "0 0 440 300",
      caption: "Side chart, head to the left. Tap a numbered cut.",
    },
    cuts: BEEF_CUTS,
  },
  {
    id: "chicken",
    name: "Chicken",
    shortName: "Chicken",
    tagline: "Whole bird breakdown on the cutting board",
    blurb:
      "Not a deer, but the same habit: named pieces, bone vs boneless, save the carcass for stock. Poultry is done at 165°F — including jerky.",
    breakOrder: [
      "Wings off at the shoulder.",
      "Leg quarters off at the hip; split thigh and drumstick at the knee.",
      "Breasts off the keel; pull the tenders.",
      "Pop the back oysters. Carcass and tips go in the stock bag.",
    ],
    sources: [
      {
        label: "USDA FSIS — jerky and poultry temperatures",
        href: "https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/meat/jerky",
      },
    ],
    diagram: {
      viewBox: "0 0 400 320",
      caption: "Whole bird, breast up. Tap a numbered cut.",
    },
    cuts: CHICKEN_CUTS,
  },
];

export function getAnimal(id) {
  return ANIMALS.find((a) => a.id === id) || null;
}

export function getCut(animalId, cutId) {
  const animal = getAnimal(animalId);
  if (!animal) return null;
  const found = animal.cuts.find((c) => c.id === cutId);
  if (!found) return null;
  return { animal, cut: found };
}

export function getTool(id) {
  return TOOLS.find((t) => t.id === id) || null;
}
