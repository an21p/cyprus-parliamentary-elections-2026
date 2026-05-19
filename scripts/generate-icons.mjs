// Generates Cyprus outline SVG assets from district paths in CyprusMap.svelte
// then rasterizes PWA icons + OG image via rsvg-convert.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { dirname } from 'node:path';

const REPO = '/Users/pishias/code/elections';
const SRC = `${REPO}/src/lib/components/map/CyprusMap.svelte`;
const STATIC = `${REPO}/static`;
const ICONS = `${STATIC}/icons`;
mkdirSync(ICONS, { recursive: true });

// Cyprus flag silhouette: Pantone 1385C → approximated as warm copper-orange.
const COPPER = '#D57900';

// Extract the six district path strings (six matches of `path: 'M ... Z',`)
const src = readFileSync(SRC, 'utf8');
const re = /path:\s*'(M[^']+Z)'/g;
const paths = [];
let m;
while ((m = re.exec(src))) paths.push(m[1]);
if (paths.length !== 6) throw new Error(`Expected 6 district paths, got ${paths.length}`);

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

// 5) OG share image - 1200×630, opaque cream bg, outline centered.
const og = outlineSvgWH({ width: 1200, height: 630, bg: '#fbf9f5', radius: STROKE });
rasterize(og, `${STATIC}/og-image.png`, { width: 1200, height: 630 });

console.log('done');
