'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

// Kuromi only — consistent with the app theme.
// Original + mirror pairs give natural left/right variety without visual clutter.
// Glow/soft duplicates and guest characters (Badtz-Maru, Gudetama) removed:
// they broke Gestalt similarity (thematic inconsistency) and added noise.
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
    // Mobile: 4 corner zones, dense enough to read as a sticker diary
    return [
      { cx: width * 0.13, cy: 190,            count: 5, spread: 64, sizeMin: 72, sizeMax: 96  },
      { cx: width * 0.87, cy: 190,            count: 5, spread: 64, sizeMin: 72, sizeMax: 96  },
      { cx: width * 0.13, cy: height * 0.80,  count: 4, spread: 60, sizeMin: 70, sizeMax: 90  },
      { cx: width * 0.87, cy: height * 0.80,  count: 4, spread: 60, sizeMin: 70, sizeMax: 90  },
    ];
  }

  if (width < 1100) {
    // Tablet: 6 edge clusters — generous overlap encouraged
    return [
      { cx: width * 0.07, cy: 200,            count: 6, spread: 72, sizeMin: 80, sizeMax: 108 },
      { cx: width * 0.93, cy: 200,            count: 6, spread: 72, sizeMin: 80, sizeMax: 108 },
      { cx: width * 0.05, cy: height * 0.44,  count: 6, spread: 68, sizeMin: 80, sizeMax: 106 },
      { cx: width * 0.95, cy: height * 0.44,  count: 6, spread: 68, sizeMin: 80, sizeMax: 106 },
      { cx: width * 0.10, cy: height * 0.80,  count: 5, spread: 70, sizeMin: 78, sizeMax: 100 },
      { cx: width * 0.90, cy: height * 0.80,  count: 5, spread: 70, sizeMin: 78, sizeMax: 100 },
    ];
  }

  // Desktop: 10 clusters, 7–8 stickers each → ~74 total.
  // Bold density makes the diary-sticker aesthetic unmistakable.
  // Bilateral symmetry (Gestalt balance) keeps it feeling orderly despite density.
  return [
    // Top corners — large anchors
    { cx: width * 0.07,  cy: 170,            count: 8, spread: 80, sizeMin: 88, sizeMax: 128 },
    { cx: width * 0.93,  cy: 170,            count: 8, spread: 80, sizeMin: 88, sizeMax: 128 },
    // Upper flanks (flanking the hero)
    { cx: width * 0.15,  cy: 380,            count: 7, spread: 74, sizeMin: 84, sizeMax: 116 },
    { cx: width * 0.85,  cy: 380,            count: 7, spread: 74, sizeMin: 84, sizeMax: 116 },
    // Mid flanks (flanking the kanban board)
    { cx: width * 0.06,  cy: height * 0.42,  count: 8, spread: 76, sizeMin: 90, sizeMax: 124 },
    { cx: width * 0.94,  cy: height * 0.42,  count: 8, spread: 76, sizeMin: 90, sizeMax: 124 },
    // Lower flanks
    { cx: width * 0.11,  cy: height * 0.72,  count: 7, spread: 72, sizeMin: 84, sizeMax: 116 },
    { cx: width * 0.89,  cy: height * 0.72,  count: 7, spread: 72, sizeMin: 84, sizeMax: 116 },
    // Bottom edge
    { cx: width * 0.22,  cy: height * 0.93,  count: 6, spread: 78, sizeMin: 80, sizeMax: 108 },
    { cx: width * 0.78,  cy: height * 0.93,  count: 6, spread: 78, sizeMin: 80, sizeMax: 108 },
  ];
}

function buildStickers(width, height) {
  const safeW = Math.max(width, 360);
  const safeH = Math.max(height, 1400);
  const random = createRandom(Math.round(safeW * 3 + safeH * 7 + 42));
  const zones  = getZones(safeW, safeH);
  const stickers = [];

  zones.forEach((zone, zoneIdx) => {
    for (let i = 0; i < zone.count; i++) {
      const size     = zone.sizeMin + Math.round(random() * (zone.sizeMax - zone.sizeMin));
      const rotation = Math.round((random() - 0.5) * 28); // ±14°
      const left     = Math.max(size * 0.5, Math.min(safeW - size * 0.5,
                         zone.cx + (random() - 0.5) * zone.spread * 2));
      const top      = Math.max(size * 0.5, Math.min(safeH - size * 0.3,
                         zone.cy + (random() - 0.5) * zone.spread * 2));
      // Cycle through all 14 sources evenly across zones
      const source   = SOURCES[Math.floor(random() * SOURCES.length)];
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
