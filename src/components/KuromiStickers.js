'use client';

import Image from 'next/image';

const SOURCES = [
  '/kuromi-stickers/kuromi-01-01.png',
  '/kuromi-stickers/kuromi-01-01-glow.png',
  '/kuromi-stickers/kuromi-01-01-mirror.png',
  '/kuromi-stickers/kuromi-01-01-soft.png',
  '/kuromi-stickers/kuromi-02-01.png',
  '/kuromi-stickers/kuromi-02-01-glow.png',
  '/kuromi-stickers/kuromi-02-01-mirror.png',
  '/kuromi-stickers/kuromi-02-01-soft.png',
  '/kuromi-stickers/kuromi-03-01.png',
  '/kuromi-stickers/kuromi-03-01-glow.png',
  '/kuromi-stickers/kuromi-03-01-mirror.png',
  '/kuromi-stickers/kuromi-03-01-soft.png',
  '/kuromi-stickers/kuromi-04-01.png',
  '/kuromi-stickers/kuromi-04-01-glow.png',
  '/kuromi-stickers/kuromi-04-01-mirror.png',
  '/kuromi-stickers/kuromi-04-01-soft.png',
  '/kuromi-stickers/kuromi-05-01.png',
  '/kuromi-stickers/kuromi-05-01-glow.png',
  '/kuromi-stickers/kuromi-05-01-mirror.png',
  '/kuromi-stickers/kuromi-05-01-soft.png',
  '/kuromi-stickers/kuromi-06-01.png',
  '/kuromi-stickers/kuromi-06-01-glow.png',
  '/kuromi-stickers/kuromi-06-01-mirror.png',
  '/kuromi-stickers/kuromi-06-01-soft.png',
  '/kuromi-stickers/kuromi-07-01.png',
  '/kuromi-stickers/kuromi-07-01-glow.png',
  '/kuromi-stickers/kuromi-07-01-mirror.png',
  '/kuromi-stickers/kuromi-07-01-soft.png',
];

const CLUSTERS = [
  { x: 7, y: 6, count: 14, spreadX: 10, spreadY: 9, sizeMin: 92, sizeMax: 170, opacity: [0.82, 0.98] },
  { x: 24, y: 8, count: 12, spreadX: 12, spreadY: 9, sizeMin: 78, sizeMax: 148, opacity: [0.58, 0.88] },
  { x: 46, y: 9, count: 12, spreadX: 13, spreadY: 10, sizeMin: 78, sizeMax: 144, opacity: [0.52, 0.82] },
  { x: 70, y: 7, count: 12, spreadX: 13, spreadY: 10, sizeMin: 82, sizeMax: 150, opacity: [0.58, 0.86] },
  { x: 92, y: 8, count: 14, spreadX: 10, spreadY: 9, sizeMin: 94, sizeMax: 172, opacity: [0.82, 0.98] },
  { x: 13, y: 26, count: 10, spreadX: 11, spreadY: 10, sizeMin: 76, sizeMax: 142, opacity: [0.6, 0.9] },
  { x: 35, y: 25, count: 12, spreadX: 13, spreadY: 10, sizeMin: 74, sizeMax: 132, opacity: [0.46, 0.78] },
  { x: 56, y: 28, count: 13, spreadX: 13, spreadY: 11, sizeMin: 74, sizeMax: 136, opacity: [0.44, 0.76] },
  { x: 78, y: 26, count: 11, spreadX: 12, spreadY: 10, sizeMin: 76, sizeMax: 140, opacity: [0.58, 0.86] },
  { x: 6, y: 48, count: 14, spreadX: 10, spreadY: 11, sizeMin: 88, sizeMax: 166, opacity: [0.76, 0.95] },
  { x: 28, y: 48, count: 11, spreadX: 12, spreadY: 10, sizeMin: 76, sizeMax: 136, opacity: [0.48, 0.76] },
  { x: 50, y: 50, count: 12, spreadX: 12, spreadY: 11, sizeMin: 76, sizeMax: 136, opacity: [0.4, 0.68] },
  { x: 72, y: 48, count: 11, spreadX: 12, spreadY: 10, sizeMin: 76, sizeMax: 136, opacity: [0.5, 0.8] },
  { x: 94, y: 48, count: 14, spreadX: 10, spreadY: 11, sizeMin: 88, sizeMax: 166, opacity: [0.76, 0.95] },
  { x: 16, y: 72, count: 11, spreadX: 11, spreadY: 11, sizeMin: 76, sizeMax: 142, opacity: [0.58, 0.88] },
  { x: 39, y: 73, count: 12, spreadX: 12, spreadY: 11, sizeMin: 76, sizeMax: 138, opacity: [0.46, 0.74] },
  { x: 61, y: 74, count: 12, spreadX: 12, spreadY: 11, sizeMin: 76, sizeMax: 138, opacity: [0.44, 0.72] },
  { x: 84, y: 72, count: 11, spreadX: 11, spreadY: 11, sizeMin: 78, sizeMax: 144, opacity: [0.58, 0.88] },
  { x: 8, y: 92, count: 14, spreadX: 10, spreadY: 8, sizeMin: 96, sizeMax: 176, opacity: [0.82, 0.98] },
  { x: 30, y: 92, count: 11, spreadX: 12, spreadY: 8, sizeMin: 80, sizeMax: 146, opacity: [0.54, 0.82] },
  { x: 52, y: 93, count: 12, spreadX: 12, spreadY: 8, sizeMin: 78, sizeMax: 142, opacity: [0.46, 0.74] },
  { x: 74, y: 92, count: 11, spreadX: 12, spreadY: 8, sizeMin: 80, sizeMax: 146, opacity: [0.54, 0.82] },
  { x: 94, y: 92, count: 14, spreadX: 10, spreadY: 8, sizeMin: 98, sizeMax: 178, opacity: [0.82, 0.98] },
];

function createRandom(seed) {
  let state = seed % 2147483647;
  if (state <= 0) state += 2147483646;

  return () => {
    state = (state * 16807) % 2147483647;
    return (state - 1) / 2147483646;
  };
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function buildStickers() {
  const placements = [];

  CLUSTERS.forEach((cluster, clusterIndex) => {
    const random = createRandom(clusterIndex + 11);

    for (let i = 0; i < cluster.count; i += 1) {
      const size =
        cluster.sizeMin + Math.round((cluster.sizeMax - cluster.sizeMin) * random());
      const offsetX = (random() - 0.5) * 2 * cluster.spreadX;
      const offsetY = (random() - 0.5) * 2 * cluster.spreadY;
      const top = clamp(cluster.y + offsetY, -3, 101);
      const left = clamp(cluster.x + offsetX, -4, 104);
      const opacity =
        cluster.opacity[0] +
        (cluster.opacity[1] - cluster.opacity[0]) * random();

      placements.push({
        src: SOURCES[(clusterIndex * 7 + i * 3 + Math.floor(random() * SOURCES.length)) % SOURCES.length],
        size,
        top: `${top}%`,
        left: `${left}%`,
        rotation: `${Math.round((random() - 0.5) * 50)}deg`,
        opacity: Number(opacity.toFixed(3)),
        zIndex: 1 + Math.floor(random() * 6),
      });
    }
  });

  return placements;
}

const STICKERS = buildStickers();

export default function KuromiStickers() {
  return (
    <div aria-hidden="true" className="sticker-field">
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

      {STICKERS.map((sticker, index) => (
        <div
          key={`${sticker.src}-${index}`}
          className="sticker-cloud"
          style={{
            top: sticker.top,
            left: sticker.left,
            opacity: sticker.opacity,
            zIndex: sticker.zIndex,
            transform: `translate(-50%, -50%) rotate(${sticker.rotation})`,
          }}
        >
          <Image
            src={sticker.src}
            alt=""
            width={sticker.size}
            height={sticker.size}
            sizes={`${sticker.size}px`}
            draggable={false}
            style={{
              display: 'block',
              width: sticker.size,
              height: sticker.size,
              filter: 'url(#ks-white) drop-shadow(0 10px 18px rgba(78, 46, 96, 0.18))',
            }}
          />
        </div>
      ))}
    </div>
  );
}
