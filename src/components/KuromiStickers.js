'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

// Sticker sources — currently Kuromi original + mirror pairs.
// To add characters: save PNG to public/stickers/ and append { src, w, h } below.
// Recommended additions for pastel pink/purple background:
//   My Melody    — pink, same Sanrio world as Kuromi
//   Cinnamoroll  — white/sky blue, high contrast on pastel
//   Little Twin Stars (Kiki & Lala) — pastel purple/pink, direct palette match
//   Pompompurin  — yellow, accent color in pastel palette
const SOURCES = [
  { src: '/stickers/kuromi-01-01.png',        w: 560, h: 560 },
  { src: '/stickers/kuromi-01-01-mirror.png', w: 560, h: 560 },
  { src: '/stickers/kuromi-02-01.png',        w: 560, h: 560 },
  { src: '/stickers/kuromi-02-01-mirror.png', w: 560, h: 560 },
  { src: '/stickers/kuromi-03-01.png',        w: 560, h: 560 },
  { src: '/stickers/kuromi-03-01-mirror.png', w: 560, h: 560 },
  { src: '/stickers/kuromi-04-01.png',        w: 560, h: 560 },
  { src: '/stickers/kuromi-04-01-mirror.png', w: 560, h: 560 },
  { src: '/stickers/kuromi-05-01.png',        w: 560, h: 560 },
  { src: '/stickers/kuromi-05-01-mirror.png', w: 560, h: 560 },
  { src: '/stickers/kuromi-06-01.png',        w: 560, h: 560 },
  { src: '/stickers/kuromi-06-01-mirror.png', w: 560, h: 560 },
  { src: '/stickers/kuromi-07-01.png',        w: 560, h: 560 },
  { src: '/stickers/kuromi-07-01-mirror.png', w: 560, h: 560 },
];

const DEFAULT_WIDTH  = 1440;
const DEFAULT_HEIGHT = 1900;

function createRandom(seed) {
  let state = seed % 2147483647;
  if (state <= 0) state += 2147483646;
  return () => {
    state = (state * 16807) % 2147483647;
    return (state - 1) / 2147483646;
  };
}

// Zone-based layout: stickers anchor to the decorative margins and edges,
// leaving the central content area (hero + kanban) unobstructed.
// This mirrors how real diary stickers are placed — corners and edges,
// not scattered uniformly across the page.
//
// Each zone: { cx, cy, count, spread, sizeMin, sizeMax }
//   cx/cy    — cluster anchor point
//   count    — stickers per cluster
//   spread   — scatter radius (px)
//   sizeMin/Max — rendered pixel size range
function getZones(width, height) {
  if (width < 768) {
    // Mobile: 4 corner zones — spread increased so stickers breathe
    return [
      { cx: width * 0.13, cy: 190,            count: 3, spread: 110, sizeMin: 72, sizeMax: 92  },
      { cx: width * 0.87, cy: 190,            count: 3, spread: 110, sizeMin: 72, sizeMax: 92  },
      { cx: width * 0.13, cy: height * 0.80,  count: 2, spread: 100, sizeMin: 70, sizeMax: 88  },
      { cx: width * 0.87, cy: height * 0.80,  count: 2, spread: 100, sizeMin: 70, sizeMax: 88  },
    ];
  }

  if (width < 1100) {
    // Tablet: 6 edge clusters — spread widened for 70%+ non-overlap
    return [
      { cx: width * 0.07, cy: 200,            count: 4, spread: 150, sizeMin: 80, sizeMax: 104 },
      { cx: width * 0.93, cy: 200,            count: 4, spread: 150, sizeMin: 80, sizeMax: 104 },
      { cx: width * 0.05, cy: height * 0.44,  count: 4, spread: 145, sizeMin: 80, sizeMax: 102 },
      { cx: width * 0.95, cy: height * 0.44,  count: 4, spread: 145, sizeMin: 80, sizeMax: 102 },
      { cx: width * 0.10, cy: height * 0.80,  count: 3, spread: 140, sizeMin: 78, sizeMax: 98  },
      { cx: width * 0.90, cy: height * 0.80,  count: 3, spread: 140, sizeMin: 78, sizeMax: 98  },
    ];
  }

  // Desktop: 10 clusters, 4–5 stickers each → ~45 total.
  // Spread doubled vs previous so stickers are clearly distinct.
  // Bilateral symmetry (Gestalt balance) keeps it orderly while feeling playful.
  return [
    // Top corners — large anchors
    { cx: width * 0.07,  cy: 170,            count: 5, spread: 200, sizeMin: 88, sizeMax: 124 },
    { cx: width * 0.93,  cy: 170,            count: 5, spread: 200, sizeMin: 88, sizeMax: 124 },
    // Upper flanks (flanking the hero)
    { cx: width * 0.15,  cy: 380,            count: 4, spread: 180, sizeMin: 84, sizeMax: 112 },
    { cx: width * 0.85,  cy: 380,            count: 4, spread: 180, sizeMin: 84, sizeMax: 112 },
    // Mid flanks (flanking the kanban board)
    { cx: width * 0.06,  cy: height * 0.42,  count: 5, spread: 200, sizeMin: 88, sizeMax: 120 },
    { cx: width * 0.94,  cy: height * 0.42,  count: 5, spread: 200, sizeMin: 88, sizeMax: 120 },
    // Lower flanks
    { cx: width * 0.11,  cy: height * 0.72,  count: 4, spread: 185, sizeMin: 84, sizeMax: 112 },
    { cx: width * 0.89,  cy: height * 0.72,  count: 4, spread: 185, sizeMin: 84, sizeMax: 112 },
    // Bottom edge
    { cx: width * 0.22,  cy: height * 0.93,  count: 4, spread: 190, sizeMin: 80, sizeMax: 104 },
    { cx: width * 0.78,  cy: height * 0.93,  count: 4, spread: 190, sizeMin: 80, sizeMax: 104 },
  ];
}

// Fisher-Yates shuffle using the seeded PRNG — preserves SSR/CSR consistency.
function shuffleSources(arr, random) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildStickers(width, height) {
  const safeW = Math.max(width, 360);
  const safeH = Math.max(height, 1400);
  const random = createRandom(Math.round(safeW * 3 + safeH * 7 + 42));
  const zones  = getZones(safeW, safeH);
  const stickers = [];

  zones.forEach((zone) => {
    // Shuffle sources per zone so no image repeats within a cluster.
    // If count > SOURCES.length, the cycle restarts from a new shuffle.
    const pool = shuffleSources(SOURCES, random);

    for (let i = 0; i < zone.count; i++) {
      const size     = zone.sizeMin + Math.round(random() * (zone.sizeMax - zone.sizeMin));
      const rotation = Math.round((random() - 0.5) * 28); // ±14°
      const left     = Math.max(size * 0.5, Math.min(safeW - size * 0.5,
                         zone.cx + (random() - 0.5) * zone.spread * 2));
      const top      = Math.max(size * 0.5, Math.min(safeH - size * 0.3,
                         zone.cy + (random() - 0.5) * zone.spread * 2));
      const source   = pool[i % pool.length];
      // Opacity variation (0.55–0.80): enough presence to read as decorative
      // diary stickers, still receding behind main content.
      const opacity  = 0.55 + random() * 0.25;

      stickers.push({ ...source, left, top, size, rotation: `${rotation}deg`, opacity });
    }
  });

  return stickers;
}

export default function KuromiStickers() {
  const fieldRef = useRef(null);
  const [stickers, setStickers] = useState(() => buildStickers(DEFAULT_WIDTH, DEFAULT_HEIGHT));

  useEffect(() => {
    const field   = fieldRef.current;
    const surface = field?.closest('.diary-surface');

    if (!field || !surface) return undefined;

    const update = () => {
      const rect   = surface.getBoundingClientRect();
      const width  = rect.width || window.innerWidth || DEFAULT_WIDTH;
      const height = Math.max(surface.scrollHeight, rect.height, window.innerHeight, DEFAULT_HEIGHT);
      setStickers(buildStickers(width, height));
    };

    update();

    const ro = new ResizeObserver(update);
    ro.observe(surface);
    ro.observe(document.body);
    window.addEventListener('resize', update);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <div aria-hidden="true" className="sticker-field" ref={fieldRef}>
      <svg
        style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
        focusable="false"
      >
        <defs>
          <filter
            id="ks-white"
            x="-28%"
            y="-28%"
            width="156%"
            height="156%"
            colorInterpolationFilters="sRGB"
          >
            <feMorphology operator="dilate" radius="7" in="SourceAlpha" result="expanded" />
            <feFlood floodColor="#ffffff" result="white" />
            <feComposite in="white" in2="expanded" operator="in" result="whiteBorder" />
            <feGaussianBlur in="whiteBorder" stdDeviation="0.5" result="softBorder" />
            <feMerge>
              <feMergeNode in="softBorder" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      {stickers.map((sticker, index) => (
        <div
          key={`${sticker.src}-${index}`}
          className="sticker-cloud"
          style={{
            top:       `${sticker.top}px`,
            left:      `${sticker.left}px`,
            opacity:   sticker.opacity,
            zIndex:    1,
            transform: `translate(-50%, -50%) rotate(${sticker.rotation})`,
          }}
        >
          <Image
            src={sticker.src}
            alt=""
            width={sticker.w}
            height={sticker.h}
            sizes={`${sticker.size}px`}
            draggable={false}
            style={{ display: 'block', width: sticker.size, height: 'auto', filter: 'url(#ks-white)' }}
          />
        </div>
      ))}
    </div>
  );
}
