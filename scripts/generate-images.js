/* eslint-disable */
// Image generation script: SVG → PNG via Sharp
const sharp = require('sharp');
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'public');

// ── Font Fetch ──────────────────────────────────────────────────────────────
function fetchBuffer(url) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http;
    mod.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return fetchBuffer(res.headers.location).then(resolve).catch(reject);
      }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function fetchGoogleFontTTF(family, weight) {
  const css = await fetchBuffer(
    `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}&display=swap`
  );
  const cssText = css.toString();
  const match = cssText.match(/src: url\((https:\/\/fonts\.gstatic\.com\/[^)]+\.ttf)\)/);
  if (!match) throw new Error(`TTF URL not found for ${family}:${weight}`);
  return fetchBuffer(match[1]);
}

// ── Sparkle path (4-pointed star) ───────────────────────────────────────────
function sparklePath(cx, cy, r, color) {
  const d = `M${cx},${cy - r} C${cx + r * 0.15},${cy - r * 0.15} ${cx + r * 0.15},${cy - r * 0.15} ${cx + r},${cy} C${cx + r * 0.15},${cy + r * 0.15} ${cx + r * 0.15},${cy + r * 0.15} ${cx},${cy + r} C${cx - r * 0.15},${cy + r * 0.15} ${cx - r * 0.15},${cy + r * 0.15} ${cx - r},${cy} C${cx - r * 0.15},${cy - r * 0.15} ${cx - r * 0.15},${cy - r * 0.15} ${cx},${cy - r} Z`;
  return `<path d="${d}" fill="${color}"/>`;
}

// ── Ring bindings ────────────────────────────────────────────────────────────
function ringBindings(xs, cy, outerR, innerR) {
  return xs.map(cx => `
    <circle cx="${cx}" cy="${cy}" r="${outerR}" fill="#e4e4ea" stroke="#9898a8" stroke-width="2.5"/>
    <circle cx="${cx}" cy="${cy}" r="${innerR}" fill="#f5f5f8"/>
  `).join('');
}

// ── Diary lines ──────────────────────────────────────────────────────────────
function diaryLines(width, startY, endY, step, color, opacity) {
  let s = '';
  for (let y = startY; y < endY; y += step) {
    s += `<line x1="0" y1="${y}" x2="${width}" y2="${y}" stroke="${color}" stroke-width="1.5" opacity="${opacity}"/>`;
  }
  return s;
}

// ── Washi tape ───────────────────────────────────────────────────────────────
function washiTape(width, height, c1, c2, sw) {
  let s = '';
  for (let i = 0; i * sw < width + sw; i++) {
    s += `<rect x="${i * sw}" y="0" width="${sw}" height="${height}" fill="${i % 2 === 0 ? c1 : c2}" opacity="0.65"/>`;
  }
  return s;
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. HERO BANNER  1520 × 360
// ─────────────────────────────────────────────────────────────────────────────
function heroSvg(gaeguB64) {
  const fontFace = gaeguB64
    ? `<style>@font-face{font-family:'Gaegu';src:url('data:font/truetype;base64,${gaeguB64}') format('truetype');font-weight:700;}</style>`
    : '';

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1520" height="360">
  <defs>${fontFace}
    <clipPath id="frame"><rect width="1520" height="360"/></clipPath>
  </defs>
  <g clip-path="url(#frame)">
    <!-- Background -->
    <rect width="1520" height="360" fill="#fff5f8"/>
    <!-- Diary lines -->
    ${diaryLines(1520, 41, 360, 21, '#d4b0c0', 0.38)}
    <!-- Washi tape top -->
    ${washiTape(1520, 26, '#ffb3c6', '#b8d4f5', 10)}
    <!-- Ring bindings -->
    ${ringBindings([253, 507, 760, 1013, 1267], 20, 19, 9)}
    <!-- Yellow highlighter -->
    <rect x="340" y="202" width="840" height="60" fill="#ffe8a0" opacity="0.70" rx="6"/>
    <!-- Sparkles -->
    ${sparklePath(218, 234, 34, '#ffb3c6')}
    ${sparklePath(1302, 234, 34, '#ffb3c6')}
    <!-- Title -->
    <text x="760" y="252"
      font-family="Gaegu, 'Patrick Hand', Georgia, serif"
      font-size="108" font-weight="700"
      fill="#5d3f6a" text-anchor="middle"
      dominant-baseline="middle">My Task Diary</text>
  </g>
</svg>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. OG IMAGE  1200 × 630
// ─────────────────────────────────────────────────────────────────────────────
function ogSvg(gaeguB64, mplusB64) {
  const fontFace = [
    gaeguB64 ? `@font-face{font-family:'Gaegu';src:url('data:font/truetype;base64,${gaeguB64}') format('truetype');font-weight:700;}` : '',
    mplusB64 ? `@font-face{font-family:'MPlus';src:url('data:font/truetype;base64,${mplusB64}') format('truetype');font-weight:400;}` : '',
  ].join('');

  // Diary notebook on left: x=70 y=115 w=420 h=400
  const nbX = 70, nbY = 115, nbW = 420, nbH = 400;
  const checkboxes = [
    { y: nbY + 80 },
    { y: nbY + 160 },
    { y: nbY + 240 },
  ];

  const noteLines = () => {
    let s = '';
    for (let y = nbY + 60; y < nbY + nbH - 20; y += 40) {
      s += `<line x1="${nbX + 30}" y1="${y}" x2="${nbX + nbW - 20}" y2="${y}" stroke="#d4b0c0" stroke-width="1.5" opacity="0.5"/>`;
    }
    return s;
  };

  const checkboxSvg = checkboxes.map((cb, i) => `
    <rect x="${nbX + 28}" y="${cb.y - 16}" width="28" height="28" rx="5"
      fill="none" stroke="#d4b8e8" stroke-width="2.5"/>
    ${i === 0 ? `<polyline points="${nbX + 33},${cb.y - 4} ${nbX + 38},${cb.y + 3} ${nbX + 50},${cb.y - 9}" stroke="#5d3f6a" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` : ''}
    <rect x="${nbX + 68}" y="${cb.y - 8}" width="${140 + (i * 20)}" height="10" rx="5" fill="#d4b8e8" opacity="0.6"/>
  `).join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs>
    <style>${fontFace}</style>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#fff5f8"/>
      <stop offset="100%" stop-color="#ffe8f0"/>
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="4" dy="6" stdDeviation="10" flood-color="#d4b8e8" flood-opacity="0.35"/>
    </filter>
    <clipPath id="nbClip">
      <rect x="${nbX}" y="${nbY}" width="${nbW}" height="${nbH}" rx="16"/>
    </clipPath>
  </defs>
  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)"/>
  <!-- Dot pattern -->
  ${Array.from({length: 12}, (_, r) => Array.from({length: 20}, (_, c) =>
    `<circle cx="${50 + c * 60}" cy="${30 + r * 55}" r="2.5" fill="#ffb3c6" opacity="0.18"/>`
  ).join('')).join('')}
  <!-- Notebook shadow -->
  <rect x="${nbX}" y="${nbY}" width="${nbW}" height="${nbH}" rx="16" fill="#e8d0e0" filter="url(#shadow)"/>
  <!-- Notebook body -->
  <rect x="${nbX}" y="${nbY}" width="${nbW}" height="${nbH}" rx="16" fill="#fff8fa"/>
  <!-- Notebook lines -->
  ${noteLines()}
  <!-- Checkboxes -->
  ${checkboxSvg}
  <!-- Notebook top washi tape -->
  ${washiTape(nbW, 20, '#ffb3c6', '#b8d4f5', 12).replace(/x="(\d+)"/g, (m, n) => `x="${nbX + parseInt(n)}"`)
    .replace(/y="0"/g, `y="${nbY - 10}"`)}
  <!-- Ring bindings on left of notebook -->
  ${ringBindings([nbX + 15], nbY + 70, 12, 6)}
  ${ringBindings([nbX + 15], nbY + 180, 12, 6)}
  ${ringBindings([nbX + 15], nbY + 290, 12, 6)}
  <!-- Right side: Title area -->
  <!-- Decorative band top right -->
  <rect x="560" y="0" width="640" height="8" fill="#ffb3c6" opacity="0.5"/>
  <!-- Title block -->
  <rect x="580" y="160" width="560" height="120" fill="#fff5f8" rx="16" opacity="0.8"/>
  <!-- Highlighter under title -->
  <rect x="600" y="230" width="520" height="42" fill="#ffe8a0" opacity="0.65" rx="6"/>
  ${sparklePath(605, 255, 22, '#ffb3c6')}
  ${sparklePath(1155, 255, 22, '#ffb3c6')}
  <text x="880" y="265"
    font-family="Gaegu, Georgia, serif" font-size="72" font-weight="700"
    fill="#5d3f6a" text-anchor="middle" dominant-baseline="middle">My Task Diary</text>
  <!-- Subtitle -->
  <text x="880" y="350"
    font-family="MPlus, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif" font-size="26"
    fill="#7a5070" text-anchor="middle" dominant-baseline="middle">쿠로미와 함께하는 다이어리 태스크 매니저</text>
  <!-- Accent dots bottom right -->
  ${sparklePath(1060, 460, 14, '#d4b8e8')}
  ${sparklePath(1110, 490, 10, '#b8d4f5')}
  ${sparklePath(980, 490, 10, '#ffe8a0')}
  <!-- Bottom washi tape hint -->
  <rect x="580" y="540" width="560" height="12" fill="#b5e0d0" rx="6" opacity="0.5"/>
</svg>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. FAVICON  512 × 512
// ─────────────────────────────────────────────────────────────────────────────
function faviconSvg() {
  const cx = 256, cy = 280;
  const bW = 260, bH = 320;
  const bX = cx - bW / 2, bY = cy - bH / 2;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512">
  <defs>
    <filter id="bookShadow" x="-15%" y="-15%" width="130%" height="130%">
      <feDropShadow dx="6" dy="8" stdDeviation="14" flood-color="#d4b8e8" flood-opacity="0.4"/>
    </filter>
    <linearGradient id="coverGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ffd0de"/>
      <stop offset="100%" stop-color="#ffb3c6"/>
    </linearGradient>
    <linearGradient id="spineGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#ff8fab"/>
      <stop offset="100%" stop-color="#ffb3c6"/>
    </linearGradient>
  </defs>
  <!-- Background (transparent-ish light) -->
  <rect width="512" height="512" fill="#fff5f8" rx="80"/>
  <!-- Book shadow -->
  <rect x="${bX}" y="${bY}" width="${bW}" height="${bH}" rx="18" fill="#e8c0d0" filter="url(#bookShadow)"/>
  <!-- Book pages (right edge visible) -->
  <rect x="${bX + bW - 12}" y="${bY + 16}" width="16" height="${bH - 24}" rx="4" fill="#f5f0f8" opacity="0.9"/>
  <rect x="${bX + bW - 8}" y="${bY + 20}" width="12" height="${bH - 32}" rx="3" fill="#ede5f0" opacity="0.8"/>
  <!-- Book cover -->
  <rect x="${bX}" y="${bY}" width="${bW - 10}" height="${bH}" rx="16" fill="url(#coverGrad)"/>
  <!-- Book spine -->
  <rect x="${bX}" y="${bY}" width="26" height="${bH}" rx="16 0 0 16" fill="url(#spineGrad)"/>
  <!-- Ring bindings at top -->
  ${ringBindings([bX + 52, bX + 130, bX + 208], bY - 5, 14, 7)}
  <!-- Cover decoration: inner border -->
  <rect x="${bX + 32}" y="${bY + 28}" width="${bW - 54}" height="${bH - 50}" rx="10"
    fill="none" stroke="#fff0f4" stroke-width="3" opacity="0.7"/>
  <!-- Star sparkle (large, center of cover) -->
  ${sparklePath(bX + 125, bY + 155, 42, '#5d3f6a')}
  ${sparklePath(bX + 185, bY + 108, 16, '#fff0f4')}
  ${sparklePath(bX + 75, bY + 210, 12, '#fff0f4')}
  <!-- Lines on cover (subtle) -->
  <line x1="${bX + 40}" y1="${bY + 220}" x2="${bX + bW - 22}" y2="${bY + 220}" stroke="#f8d8e4" stroke-width="2" opacity="0.6"/>
  <line x1="${bX + 40}" y1="${bY + 245}" x2="${bX + bW - 22}" y2="${bY + 245}" stroke="#f8d8e4" stroke-width="2" opacity="0.6"/>
</svg>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────
async function main() {
  console.log('Fetching fonts...');
  let gaeguB64 = '', mplusB64 = '';

  try {
    const buf = await fetchGoogleFontTTF('Gaegu', 700);
    gaeguB64 = buf.toString('base64');
    console.log('  ✓ Gaegu Bold loaded');
  } catch (e) {
    console.warn('  ✗ Gaegu Bold failed:', e.message);
  }

  try {
    const buf = await fetchGoogleFontTTF('M+PLUS+Rounded+1c', 400);
    mplusB64 = buf.toString('base64');
    console.log('  ✓ M PLUS Rounded 1c loaded');
  } catch (e) {
    console.warn('  ✗ M PLUS Rounded 1c failed:', e.message);
  }

  console.log('\nGenerating images...');

  // 1. Hero Banner
  const h = heroSvg(gaeguB64);
  await sharp(Buffer.from(h))
    .resize(1520, 360)
    .png()
    .toFile(path.join(OUT, 'hero-title.png'));
  console.log('  ✓ hero-title.png  (1520×360)');

  // 2. OG Image
  const o = ogSvg(gaeguB64, mplusB64);
  await sharp(Buffer.from(o))
    .resize(1200, 630)
    .png()
    .toFile(path.join(OUT, 'opengraph-image.png'));
  console.log('  ✓ opengraph-image.png  (1200×630)');

  // 3. Favicon
  const f = faviconSvg();
  const favicon = await sharp(Buffer.from(f))
    .resize(512, 512)
    .png()
    .toBuffer();
  fs.writeFileSync(path.join(OUT, 'icon.png'), favicon);
  fs.writeFileSync(path.join(__dirname, '..', 'src', 'app', 'icon.png'), favicon);
  console.log('  ✓ icon.png  (512×512) → public/ + src/app/');

  console.log('\nDone!');
}

main().catch(e => { console.error(e); process.exit(1); });
