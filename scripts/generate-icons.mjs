// Generates Cyprus outline SVG assets from district paths in CyprusMap.svelte
// then rasterizes PWA icons + OG image via rsvg-convert.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { dirname } from 'node:path';

import { fileURLToPath } from 'node:url';
const REPO = dirname(dirname(fileURLToPath(import.meta.url)));
const SRC = `${REPO}/src/lib/components/map/CyprusMap.svelte`;
const STATIC = `${REPO}/static`;
const ICONS = `${STATIC}/icons`;
mkdirSync(ICONS, { recursive: true });

// Cyprus flag silhouette: Pantone 1385C → approximated as warm copper-orange.
const COPPER = '#D57900';

// Extract the six districts as { id, path } pairs from the geometry table.
const src = readFileSync(SRC, 'utf8');
const re = /id:\s*'([A-Z]{3})'\s*,\s*path:\s*'(M[^']+Z)'/g;
const districts = [];
let m;
while ((m = re.exec(src))) districts.push({ id: m[1], path: m[2] });
if (districts.length !== 6) throw new Error(`Expected 6 district paths, got ${districts.length}`);
const paths = districts.map((d) => d.path);

// Ballot colours per district, mirroring the end state of the landing
// page's `district-colorize` animation (rgba @ 0.4 over warm paper).
const BALLOT = {
  NIC: 'rgba(245, 245, 245, 0.4)',
  LIM: 'rgba(255, 235, 59, 0.4)',
  FAM: 'rgba(33, 150, 243, 0.4)',
  LAR: 'rgba(244, 143, 177, 0.4)',
  PAF: 'rgba(76, 175, 80, 0.4)',
  KYR: 'rgba(255, 152, 0, 0.4)'
};

// Compute combined bbox of all paths so we can trim/center to the island.
// Quick & dirty: parse all numeric pairs.
const nums = paths.join(' ').match(/-?\d+(?:\.\d+)?/g).map(Number);
const xs = [], ys = [];
for (let i = 0; i + 1 < nums.length; i += 2) { xs.push(nums[i]); ys.push(nums[i + 1]); }
const minX = Math.min(...xs), maxX = Math.max(...xs);
const minY = Math.min(...ys), maxY = Math.max(...ys);
const bx = minX - 8, by = minY - 8;
const bw = (maxX - minX) + 16;
const bh = (maxY - minY) + 16;

// Build an SVG that renders ONLY the outline of the union of all districts.
// Trick: feMorphology erodes the source; feComposite operator="out" returns
// (source ∩ ¬eroded) = ring outline. Width of the ring ≈ erosion radius.
function outlineSvg({ size, padding = 0, bg = 'none', radius = 4 }) {
  // Square viewBox centered on the island. Padding is added beyond the
  // longer dimension so the icon stays visually centered when rasterized.
  const cx = bx + bw / 2;
  const cy = by + bh / 2;
  const side = Math.max(bw, bh) + 2 * padding;
  const vbx = cx - side / 2;
  const vby = cy - side / 2;
  const vbw = side;
  const vbh = side;
  const bgRect = bg === 'none'
    ? ''
    : `<rect x="${vbx}" y="${vby}" width="${vbw}" height="${vbh}" fill="${bg}"/>`;
  // Paint each district with both fill AND a thin stroke (same colour) so any
  // sub-pixel gaps between adjacent district paths are sealed in the source
  // alpha. Then erode the union to get the ring.
  const seam = Math.max(1, Math.round(radius * 0.25));
  const pathEls = paths
    .map(
      (d) =>
        `<path d="${d}" fill="${COPPER}" stroke="${COPPER}" stroke-width="${seam}" stroke-linejoin="round"/>`
    )
    .join('');
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vbx} ${vby} ${vbw} ${vbh}" width="${size}" height="${size}">
  <defs>
    <filter id="outline" x="-10%" y="-10%" width="120%" height="120%" color-interpolation-filters="sRGB">
      <feMorphology in="SourceAlpha" operator="dilate" radius="${seam}" result="closed"/>
      <feMorphology in="closed" operator="erode" radius="${radius + seam}" result="inner"/>
      <feComposite in="closed" in2="inner" operator="out" result="ring"/>
      <feFlood flood-color="${COPPER}" result="copper"/>
      <feComposite in="copper" in2="ring" operator="in"/>
    </filter>
  </defs>
  ${bgRect}
  <g filter="url(#outline)">${pathEls}</g>
</svg>`;
}

// OG poster — mirrors the language-picker landing page: warm paper, Cyprus
// outline as a filled accent-soft wash with a thin copper stroke (not the
// heavy ring used elsewhere), a giant italic 2026 watermark behind, and a
// three-line Fraunces-style title with the middle line italic in the
// olive-bronze accent. Fonts fall back to Georgia/Helvetica because Fraunces
// and Inter are not installed system-wide for rsvg-convert.
function ogPosterSvg({ width, height }) {
  // Design tokens, mirrored from src/lib/styles/tokens.css.
  const PAPER = '#fbf9f5';
  const PAPER_3 = '#ece8df';
  const INK = '#14181f';
  const INK_3 = '#5b6373';
  const ACCENT = '#5d4a1e';
  const ACCENT_SOFT = '#efe9d8';
  const RULE = '#dcd6c8';
  const COPPER_STROKE = '#d57800';

  // Place the island scaled into a target sub-area of the canvas, mirroring
  // the landing's "outline behind hero" composition. Height-bound: ~92% of
  // canvas height, horizontally pushed right so the title block on the left
  // has breathing room over the lighter NW corner of the island.
  const targetH = height * 0.95;
  const s = targetH / bh;
  const tx = width * 0.56 - (bx + bw / 2) * s;
  const ty = height * 0.50 - (by + bh / 2) * s;

  const islandPaths = districts
    .map(
      ({ id, path: d }) =>
        `<path d="${d}" fill="${BALLOT[id] ?? ACCENT_SOFT}" stroke="${COPPER_STROKE}" stroke-width="1.25" vector-effect="non-scaling-stroke" stroke-linejoin="round"/>`
    )
    .join('');

  // Type scale for 1200×630 canvas.
  const padX = 72;
  const folioSize = 18;
  const folioTrack = folioSize * 0.12; // eyebrow tracking
  const titleSize = 104;
  const titleLead = titleSize * 1.02;
  const ruleW = 56;
  const metaSize = 17;

  // Vertical rhythm — anchored so the three-line title sits in the upper-mid.
  const yFolio = 132;
  const yFolioRule = yFolio + 22;
  const yTitle1 = 250;
  const yTitle2 = yTitle1 + titleLead;
  const yTitle3 = yTitle2 + titleLead;
  const yRule = yTitle3 + 44;
  const yMeta = yRule + 36;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <rect width="${width}" height="${height}" fill="${PAPER}"/>

  <!-- Watermark 2026, bottom-right, bleeds off-canvas. Mirrors .watermark on the landing. -->
  <text x="${width + 40}" y="${height + 110}"
        text-anchor="end"
        font-family="Georgia, 'Times New Roman', serif"
        font-style="italic" font-weight="700"
        font-size="560"
        letter-spacing="-39"
        fill="${PAPER_3}">2026</text>

  <!-- Cyprus outline: filled accent-soft wash with the landing's thin copper stroke. -->
  <g transform="translate(${tx} ${ty}) scale(${s})">
    ${islandPaths}
  </g>

  <!-- Folio eyebrow + thin rule. -->
  <text x="${padX}" y="${yFolio}"
        font-family="Helvetica Neue, Helvetica, Arial, sans-serif"
        font-weight="500"
        font-size="${folioSize}"
        letter-spacing="${folioTrack}"
        fill="${INK_3}">24 · 05 · 2026  ·  56 SEATS / 6 DISTRICTS</text>
  <line x1="${padX}" y1="${yFolioRule}" x2="${padX + 420}" y2="${yFolioRule}"
        stroke="${RULE}" stroke-width="1"/>

  <!-- Three-line title in display serif, middle line italic in accent. -->
  <g font-family="Georgia, 'Times New Roman', serif" font-weight="600"
     font-size="${titleSize}" letter-spacing="-2">
    <text x="${padX}" y="${yTitle1}" fill="${INK}">Cyprus</text>
    <text x="${padX}" y="${yTitle2}" fill="${ACCENT}" font-style="italic">Parliamentary</text>
    <text x="${padX}" y="${yTitle3}" fill="${INK}">Elections</text>
  </g>

  <!-- Short accent rule. -->
  <line x1="${padX}" y1="${yRule}" x2="${padX + ruleW}" y2="${yRule}"
        stroke="${ACCENT}" stroke-width="1.5"/>

  <!-- Tagline. -->
  <text x="${padX}" y="${yMeta}"
        font-family="Helvetica Neue, Helvetica, Arial, sans-serif"
        font-weight="400"
        font-size="${metaSize}"
        fill="${INK_3}">An independent explainer &amp; seat simulator.</text>
</svg>`;
}

// (Legacy) Editorial OG image with title inside the outline. Kept for reference.
function ogPosterInsideSvg({ width, height, bg = '#fbf9f5', radius = 4 }) {
  const aspect = bw / bh;
  const targetAspect = width / height;
  let vbw, vbh;
  if (targetAspect > aspect) {
    vbh = bh * 1.15;
    vbw = vbh * targetAspect;
  } else {
    vbw = bw * 1.15;
    vbh = vbw / targetAspect;
  }
  const vbx = bx + bw / 2 - vbw / 2;
  const vby = by + bh / 2 - vbh / 2;
  const seam = Math.max(1, Math.round(radius * 0.25));

  const ringPaths = paths
    .map(
      (d) =>
        `<path d="${d}" fill="${COPPER}" stroke="${COPPER}" stroke-width="${seam}" stroke-linejoin="round"/>`
    )
    .join('');
  const clipPaths = paths.map((d) => `<path d="${d}"/>`).join('');

  // Cyprus's geometric centre sits high and right because of the Karpas
  // peninsula. Anchor the block on the visually-dense south-west body instead.
  const cx = bx + bw * 0.40;
  const cy = by + bh * 0.62;

  // Type scale tuned for a CyprusMap viewBox of ~1000×600.
  const eyebrowSize = bh * 0.042;
  const titleSize = bh * 0.068;
  const yearSize = bh * 0.20;
  const ruleW = bw * 0.22;
  const ruleY = cy - yearSize * 0.05;

  const yEyebrow = cy - yearSize * 0.62;
  const yTitle = cy - yearSize * 0.25;
  const yYear = cy + yearSize * 0.58;
  const yDate = cy + yearSize * 0.92;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vbx} ${vby} ${vbw} ${vbh}" width="${width}" height="${height}" preserveAspectRatio="xMidYMid slice">
  <defs>
    <pattern id="hatch" patternUnits="userSpaceOnUse" width="7" height="7" patternTransform="rotate(45)">
      <line x1="0" y1="0" x2="0" y2="7" stroke="${COPPER}" stroke-width="0.9" stroke-opacity="0.10"/>
    </pattern>
    <pattern id="dots" patternUnits="userSpaceOnUse" width="14" height="14">
      <circle cx="1" cy="1" r="0.6" fill="${COPPER}" fill-opacity="0.08"/>
    </pattern>
    <clipPath id="island">${clipPaths}</clipPath>
    <filter id="outline" x="-10%" y="-10%" width="120%" height="120%" color-interpolation-filters="sRGB">
      <feMorphology in="SourceAlpha" operator="dilate" radius="${seam}" result="closed"/>
      <feMorphology in="closed" operator="erode" radius="${radius + seam}" result="inner"/>
      <feComposite in="closed" in2="inner" operator="out" result="ring"/>
      <feFlood flood-color="${COPPER}" result="copper"/>
      <feComposite in="copper" in2="ring" operator="in"/>
    </filter>
  </defs>
  <rect x="${vbx}" y="${vby}" width="${vbw}" height="${vbh}" fill="${bg}"/>
  <rect x="${vbx}" y="${vby}" width="${vbw}" height="${vbh}" fill="url(#dots)"/>
  <g clip-path="url(#island)">
    <rect x="${vbx}" y="${vby}" width="${vbw}" height="${vbh}" fill="url(#hatch)"/>
  </g>
  <g filter="url(#outline)">${ringPaths}</g>
  <g text-anchor="middle" fill="${COPPER}">
    <text x="${cx}" y="${yEyebrow}"
          font-family="Helvetica Neue, Helvetica, Arial, sans-serif"
          font-weight="700"
          font-size="${eyebrowSize}"
          letter-spacing="${eyebrowSize * 0.45}"
          fill-opacity="0.85">CYPRUS</text>
    <text x="${cx}" y="${yTitle}"
          font-family="Georgia, 'Times New Roman', serif"
          font-style="italic"
          font-size="${titleSize}"
          fill-opacity="0.92">Parliamentary Elections</text>
    <line x1="${cx - ruleW / 2}" y1="${ruleY}" x2="${cx + ruleW / 2}" y2="${ruleY}"
          stroke="${COPPER}" stroke-width="${Math.max(1, seam * 1.4)}" stroke-opacity="0.55"/>
    <text x="${cx}" y="${yYear}"
          font-family="Georgia, 'Times New Roman', serif"
          font-weight="700"
          font-size="${yearSize}"
          letter-spacing="${yearSize * 0.02}">2026</text>
    <text x="${cx}" y="${yDate}"
          font-family="Helvetica Neue, Helvetica, Arial, sans-serif"
          font-weight="500"
          font-size="${eyebrowSize * 0.78}"
          letter-spacing="${eyebrowSize * 0.18}"
          fill-opacity="0.75">24 MAY  ·  56 SEATS</text>
  </g>
</svg>`;
}

// Same construction but with explicit width/height (for rectangular OG image).
function outlineSvgWH({ width, height, bg, radius = 4 }) {
  const aspect = bw / bh;
  const targetAspect = width / height;
  // Letterbox-fit the island inside the viewport, centered.
  let vbw, vbh, vbx, vby;
  if (targetAspect > aspect) {
    vbh = bh * 1.15;
    vbw = vbh * targetAspect;
  } else {
    vbw = bw * 1.15;
    vbh = vbw / targetAspect;
  }
  vbx = bx + bw / 2 - vbw / 2;
  vby = by + bh / 2 - vbh / 2;
  const seam = Math.max(1, Math.round(radius * 0.25));
  const pathEls = paths
    .map(
      (d) =>
        `<path d="${d}" fill="${COPPER}" stroke="${COPPER}" stroke-width="${seam}" stroke-linejoin="round"/>`
    )
    .join('');
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vbx} ${vby} ${vbw} ${vbh}" width="${width}" height="${height}" preserveAspectRatio="xMidYMid slice">
  <defs>
    <filter id="outline" x="-10%" y="-10%" width="120%" height="120%" color-interpolation-filters="sRGB">
      <feMorphology in="SourceAlpha" operator="dilate" radius="${seam}" result="closed"/>
      <feMorphology in="closed" operator="erode" radius="${radius + seam}" result="inner"/>
      <feComposite in="closed" in2="inner" operator="out" result="ring"/>
      <feFlood flood-color="${COPPER}" result="copper"/>
      <feComposite in="copper" in2="ring" operator="in"/>
    </filter>
  </defs>
  <rect x="${vbx}" y="${vby}" width="${vbw}" height="${vbh}" fill="${bg}"/>
  <g filter="url(#outline)">${pathEls}</g>
</svg>`;
}

function rasterize(svgText, outPath, { width, height }) {
  const tmpSvg = `/tmp/cyprus-assets/_tmp.svg`;
  writeFileSync(tmpSvg, svgText);
  mkdirSync(dirname(outPath), { recursive: true });
  execSync(
    `rsvg-convert -w ${width} -h ${height} -f png -o "${outPath}" "${tmpSvg}"`,
    { stdio: 'inherit' }
  );
}

// Outline thickness is in source-path units (the CyprusMap viewBox is roughly
// 1000 × 600). A radius of 16 ≈ ~2% of the island's width - bold enough to
// read at 16/32 px in browser tabs and at PWA-icon scale.
const STROKE = 16;

// 1) New favicon - transparent background, thick outline so it reads small.
const faviconSvg = outlineSvg({ size: 64, padding: 18, bg: 'none', radius: STROKE });
writeFileSync(`${STATIC}/favicon.svg`, faviconSvg);

// 2) PWA icons - transparent background, "any" purpose.
const icon192 = outlineSvg({ size: 192, padding: 28, bg: 'none', radius: STROKE });
const icon512 = outlineSvg({ size: 512, padding: 48, bg: 'none', radius: STROKE });
rasterize(icon192, `${ICONS}/icon-192.png`, { width: 192, height: 192 });
rasterize(icon512, `${ICONS}/icon-512.png`, { width: 512, height: 512 });

// 3) Maskable icons - Android crops to a safe zone (40% radius circle).
//    So pad heavily AND include an opaque background so the mask works.
const maskable192 = outlineSvg({ size: 192, padding: 80, bg: '#fbf9f5', radius: STROKE });
const maskable512 = outlineSvg({ size: 512, padding: 220, bg: '#fbf9f5', radius: STROKE });
rasterize(maskable192, `${ICONS}/icon-maskable-192.png`, { width: 192, height: 192 });
rasterize(maskable512, `${ICONS}/icon-maskable-512.png`, { width: 512, height: 512 });

// 4) iOS apple-touch-icon - 180x180, opaque bg (iOS used to add a glossy
//    overlay for transparent icons), warm paper bg.
const apple = outlineSvg({ size: 180, padding: 40, bg: '#fbf9f5', radius: STROKE });
rasterize(apple, `${ICONS}/apple-touch-icon.png`, { width: 180, height: 180 });

// 5) OG share image - 1200×630, editorial poster matching the landing page.
const og = ogPosterSvg({ width: 1200, height: 630 });
rasterize(og, `${STATIC}/og-image.png`, { width: 1200, height: 630 });

console.log('done');
