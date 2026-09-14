/** SVG butcher charts — numbered, tappable regions. */

const DEER_REGIONS = [
  {
    cutId: "neck",
    fill: "#6d4c41",
    d: "M 72 86 L 118 74 L 128 128 L 86 136 L 68 112 Z",
    label: { x: 92, y: 108, text: "1" },
  },
  {
    cutId: "shoulder",
    fill: "#e65100",
    d: "M 118 74 L 178 64 L 190 138 L 128 128 Z",
    label: { x: 150, y: 104, text: "2" },
  },
  {
    cutId: "front-shank",
    fill: "#bf360c",
    d: "M 128 128 L 164 132 L 158 268 L 132 270 L 118 170 Z",
    label: { x: 142, y: 210, text: "3" },
  },
  {
    cutId: "brisket",
    fill: "#8d6e63",
    d: "M 108 136 L 188 142 L 184 172 L 104 164 Z",
    label: { x: 146, y: 158, text: "4" },
  },
  {
    cutId: "ribs",
    fill: "#ff8a50",
    d: "M 178 88 L 248 86 L 246 150 L 190 138 Z",
    label: { x: 214, y: 118, text: "5" },
  },
  {
    cutId: "loin",
    fill: "#ffcc80",
    d: "M 178 58 L 292 54 L 296 88 L 178 88 Z",
    label: { x: 234, y: 74, text: "6" },
  },
  {
    cutId: "tenderloin",
    fill: "#ffe0b2",
    d: "M 200 90 L 268 88 L 266 104 L 202 106 Z",
    label: { x: 234, y: 100, text: "7" },
  },
  {
    cutId: "flank",
    fill: "#a1887f",
    d: "M 190 138 L 246 150 L 268 176 L 188 172 Z",
    label: { x: 222, y: 160, text: "8" },
  },
  {
    cutId: "hind-quarter",
    fill: "#ef6c00",
    d: "M 248 56 L 352 72 L 358 148 L 268 176 L 246 86 Z",
    label: { x: 300, y: 112, text: "9" },
  },
  {
    cutId: "rear-shank",
    fill: "#5d4037",
    d: "M 268 176 L 328 150 L 340 268 L 308 272 L 286 188 Z",
    label: { x: 312, y: 218, text: "10" },
  },
];

const HOG_REGIONS = [
  {
    cutId: "jowl",
    fill: "#8d6e63",
    d: "M 40 96 L 92 84 L 98 148 L 48 150 C 28 140, 24 110, 40 96 Z",
    label: { x: 64, y: 118, text: "1" },
  },
  {
    cutId: "boston-butt",
    fill: "#e65100",
    d: "M 92 70 L 168 62 L 172 120 L 98 128 Z",
    label: { x: 130, y: 96, text: "2" },
  },
  {
    cutId: "picnic",
    fill: "#ff8a50",
    d: "M 98 128 L 172 120 L 176 168 L 104 172 Z",
    label: { x: 136, y: 148, text: "3" },
  },
  {
    cutId: "front-hock",
    fill: "#5d4037",
    d: "M 104 172 L 148 168 L 146 268 L 116 270 Z",
    label: { x: 128, y: 220, text: "4" },
  },
  {
    cutId: "loin",
    fill: "#ffcc80",
    d: "M 168 58 L 300 56 L 304 108 L 168 112 Z",
    label: { x: 234, y: 84, text: "5" },
  },
  {
    cutId: "belly",
    fill: "#ef9a9a",
    d: "M 176 168 L 304 158 L 308 210 L 180 214 Z",
    label: { x: 242, y: 190, text: "6" },
  },
  {
    cutId: "spare-ribs",
    fill: "#ce93d8",
    d: "M 172 120 L 304 108 L 304 158 L 176 168 Z",
    label: { x: 238, y: 138, text: "7" },
  },
  {
    cutId: "fatback",
    fill: "#fff3e0",
    d: "M 168 48 L 300 46 L 300 58 L 168 60 Z",
    label: { x: 234, y: 56, text: "8" },
  },
  {
    cutId: "ham",
    fill: "#ef6c00",
    d: "M 300 56 L 390 78 L 396 168 L 308 210 L 304 108 Z",
    label: { x: 346, y: 128, text: "9" },
  },
  {
    cutId: "rear-hock",
    fill: "#4e342e",
    d: "M 330 188 L 378 168 L 386 268 L 348 272 Z",
    label: { x: 360, y: 224, text: "10" },
  },
];

const BEEF_REGIONS = [
  {
    cutId: "chuck",
    fill: "#e65100",
    d: "M 70 70 L 168 58 L 176 150 L 78 158 L 62 110 Z",
    label: { x: 118, y: 108, text: "1" },
  },
  {
    cutId: "rib",
    fill: "#ff8a50",
    d: "M 168 58 L 236 56 L 240 128 L 176 150 Z",
    label: { x: 204, y: 96, text: "2" },
  },
  {
    cutId: "short-loin",
    fill: "#ffcc80",
    d: "M 236 56 L 292 58 L 294 120 L 240 128 Z",
    label: { x: 264, y: 92, text: "3" },
  },
  {
    cutId: "sirloin",
    fill: "#ffb74d",
    d: "M 292 58 L 338 70 L 340 140 L 294 120 Z",
    label: { x: 316, y: 100, text: "4" },
  },
  {
    cutId: "tenderloin",
    fill: "#ffe0b2",
    d: "M 242 122 L 300 118 L 298 136 L 244 138 Z",
    label: { x: 272, y: 132, text: "5" },
  },
  {
    cutId: "round",
    fill: "#ef6c00",
    d: "M 338 70 L 410 88 L 408 170 L 340 140 Z",
    label: { x: 372, y: 118, text: "6" },
  },
  {
    cutId: "flank",
    fill: "#a1887f",
    d: "M 240 150 L 320 148 L 318 178 L 236 176 Z",
    label: { x: 276, y: 166, text: "7" },
  },
  {
    cutId: "plate",
    fill: "#ce93d8",
    d: "M 176 150 L 240 128 L 240 150 L 236 176 L 180 178 Z",
    label: { x: 208, y: 158, text: "8" },
  },
  {
    cutId: "brisket",
    fill: "#8d6e63",
    d: "M 78 158 L 176 150 L 180 178 L 86 188 Z",
    label: { x: 128, y: 170, text: "9" },
  },
  {
    cutId: "shank",
    fill: "#5d4037",
    d: "M 88 188 L 130 178 L 128 272 L 96 274 Z",
    label: { x: 112, y: 230, text: "10" },
  },
];

const CHICKEN_REGIONS = [
  {
    cutId: "neck",
    fill: "#8d6e63",
    d: "M 176 36 L 224 36 L 228 78 L 172 78 Z",
    label: { x: 200, y: 60, text: "1" },
  },
  {
    cutId: "breast",
    fill: "#ffcc80",
    d: "M 150 88 L 250 88 L 258 170 L 142 170 Z",
    label: { x: 200, y: 128, text: "2" },
  },
  {
    cutId: "tenderloin",
    fill: "#ffe0b2",
    d: "M 184 150 L 216 150 L 216 168 L 184 168 Z",
    label: { x: 200, y: 162, text: "3" },
  },
  {
    cutId: "wing",
    fill: "#ff8a50",
    d: "M 250 96 L 330 78 L 348 110 L 258 128 Z",
    label: { x: 300, y: 104, text: "4" },
  },
  {
    cutId: "back",
    fill: "#a1887f",
    d: "M 160 170 L 240 170 L 236 210 L 164 210 Z",
    label: { x: 200, y: 192, text: "5" },
  },
  {
    cutId: "thigh",
    fill: "#ef6c00",
    d: "M 148 200 L 200 210 L 196 268 L 132 250 Z",
    label: { x: 168, y: 234, text: "6" },
  },
  {
    cutId: "drumstick",
    fill: "#bf360c",
    d: "M 196 250 L 220 214 L 248 268 L 210 292 Z",
    label: { x: 220, y: 258, text: "7" },
  },
];

const HEAD_DEER =
  "M 28 92 C 18 88, 16 108, 32 114 L 68 112 L 72 86 L 58 70 L 64 58 L 78 70 L 92 74 Z";
const EAR_DEER = "M 70 52 L 88 70 L 76 74 Z";
const HEAD_HOG =
  "M 12 118 C 8 108, 18 92, 40 96 L 48 150 L 22 152 C 8 140, 6 126, 12 118 Z";
const HEAD_BEEF =
  "M 18 96 C 10 90, 12 120, 28 126 L 62 110 L 70 70 L 48 62 L 36 78 Z";
const HEAD_CHICKEN =
  "M 186 12 L 214 12 L 220 36 L 180 36 Z M 214 16 L 236 22 L 220 30 Z";

const REGIONS = {
  deer: DEER_REGIONS,
  hog: HOG_REGIONS,
  beef: BEEF_REGIONS,
  chicken: CHICKEN_REGIONS,
};

const HEADS = {
  deer: [
    { d: HEAD_DEER, fill: "#4e342e" },
    { d: EAR_DEER, fill: "#3e2723" },
  ],
  hog: [{ d: HEAD_HOG, fill: "#4e342e" }],
  beef: [{ d: HEAD_BEEF, fill: "#4e342e" }],
  chicken: [{ d: HEAD_CHICKEN, fill: "#4e342e" }],
};

export function regionsFor(animalId) {
  return REGIONS[animalId] || [];
}

export function diagramSvg(animal, { selectedId = "" } = {}) {
  const regions = regionsFor(animal.id);
  const heads = HEADS[animal.id] || [];
  const headPaths = heads
    .map((h) => `<path d="${h.d}" fill="${h.fill}" opacity="0.95"></path>`)
    .join("");
  const regionPaths = regions
    .map((r) => {
      const on = selectedId === r.cutId ? " is-on" : "";
      return `<path class="cut-region${on}" data-cut="${r.cutId}" d="${r.d}" fill="${r.fill}" role="button" tabindex="0" aria-label="${r.label.text}"></path>
      <text class="cut-num" x="${r.label.x}" y="${r.label.y}" text-anchor="middle" dominant-baseline="middle">${r.label.text}</text>`;
    })
    .join("");
  return `<svg class="cut-svg" viewBox="${animal.diagram.viewBox}" xmlns="http://www.w3.org/2000/svg" aria-label="${animal.shortName} cut chart">
    ${headPaths}
    ${regionPaths}
  </svg>`;
}
