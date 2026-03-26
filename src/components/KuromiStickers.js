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

const CLUSTER_POINTS = [
  [4, 5], [14, 5], [24, 5], [34, 5], [44, 5], [54, 5], [64, 5], [74, 5], [84, 5], [94, 5],
  [8, 18], [19, 18], [30, 18], [41, 18], [52, 18], [63, 18], [74, 18], [85, 18], [96, 18],
  [4, 31], [15, 31], [26, 31], [37, 31], [48, 31], [59, 31], [70, 31], [81, 31], [92, 31],
  [9, 44], [20, 44], [31, 44], [42, 44], [53, 44], [64, 44], [75, 44], [86, 44], [97, 44],
  [4, 57], [15, 57], [26, 57], [37, 57], [48, 57], [59, 57], [70, 57], [81, 57], [92, 57],
  [8, 70], [19, 70], [30, 70], [41, 70], [52, 70], [63, 70], [74, 70], [85, 70], [96, 70],
  [4, 83], [14, 83], [24, 83], [34, 83], [44, 83], [54, 83], [64, 83], [74, 83], [84, 83], [94, 83],
  [8, 95], [19, 95], [30, 95], [41, 95], [52, 95], [63, 95], [74, 95], [85, 95], [96, 95],
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
  const random = createRandom(52);

  return CLUSTER_POINTS.flatMap(([x, y], clusterIndex) => {
    const count = 4 + (clusterIndex % 3);

    return Array.from({ length: count }, (_, itemIndex) => {
      const left = clamp(x + (random() - 0.5) * 9.5, -2, 102);
      const top = clamp(y + (random() - 0.5) * 9.5, -2, 102);
      const size = 114 + Math.round((random() - 0.5) * 18);
      const rotation = Math.round((random() - 0.5) * 30);

      return {
        src: SOURCES[(clusterIndex * 5 + itemIndex * 7 + Math.floor(random() * 11)) % SOURCES.length],
        left: `${left}%`,
        top: `${top}%`,
        size,
        rotation: `${rotation}deg`,
      };
    });
  });
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
            opacity: 0.64,
            zIndex: 1 + (index % 4),
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
