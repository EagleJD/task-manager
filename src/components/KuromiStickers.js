'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const SOURCES = [
  '/stickers/kuromi-01-01.png',
  '/stickers/kuromi-01-01-glow.png',
  '/stickers/kuromi-01-01-mirror.png',
  '/stickers/kuromi-01-01-soft.png',
  '/stickers/kuromi-02-01.png',
  '/stickers/kuromi-02-01-glow.png',
  '/stickers/kuromi-02-01-mirror.png',
  '/stickers/kuromi-02-01-soft.png',
  '/stickers/kuromi-03-01.png',
  '/stickers/kuromi-03-01-glow.png',
  '/stickers/kuromi-03-01-mirror.png',
  '/stickers/kuromi-03-01-soft.png',
  '/stickers/kuromi-04-01.png',
  '/stickers/kuromi-04-01-glow.png',
  '/stickers/kuromi-04-01-mirror.png',
  '/stickers/kuromi-04-01-soft.png',
  '/stickers/kuromi-05-01.png',
  '/stickers/kuromi-05-01-glow.png',
  '/stickers/kuromi-05-01-mirror.png',
  '/stickers/kuromi-05-01-soft.png',
  '/stickers/kuromi-06-01.png',
  '/stickers/kuromi-06-01-glow.png',
  '/stickers/kuromi-06-01-mirror.png',
  '/stickers/kuromi-06-01-soft.png',
  '/stickers/kuromi-07-01.png',
  '/stickers/kuromi-07-01-glow.png',
  '/stickers/kuromi-07-01-mirror.png',
  '/stickers/kuromi-07-01-soft.png',
  '/stickers/badtzmaru-01.webp',
  '/stickers/badtzmaru-02.png',
  '/stickers/gudetama-01.webp',
  '/stickers/gudetama-02.webp',
  '/stickers/gudetama-03.webp',
];

const DEFAULT_WIDTH = 1440;
const DEFAULT_HEIGHT = 1900;
const VERTICAL_OVERSCAN = 220;

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

function overlapsTooMuch(candidate, placed) {
  return placed.some((sticker) => {
    const overlapX =
      Math.min(candidate.left + candidate.size / 2, sticker.left + sticker.size / 2) -
      Math.max(candidate.left - candidate.size / 2, sticker.left - sticker.size / 2);
    const overlapY =
      Math.min(candidate.top + candidate.size / 2, sticker.top + sticker.size / 2) -
      Math.max(candidate.top - candidate.size / 2, sticker.top - sticker.size / 2);

    if (overlapX <= 0 || overlapY <= 0) {
      return false;
    }

    const overlapArea = overlapX * overlapY;
    const smallerArea = Math.min(candidate.size ** 2, sticker.size ** 2);

    return overlapArea > smallerArea * 0.46;
  });
}

function buildStickers(width, height) {
  const safeWidth = Math.max(width, 360);
  const safeHeight = Math.max(height + VERTICAL_OVERSCAN, 1400);
  const bandCount = Math.max(9, Math.ceil(safeHeight / 185));
  const random = createRandom(Math.round(safeWidth + safeHeight + 52));
  const stickers = [];

  for (let bandIndex = 0; bandIndex < bandCount; bandIndex += 1) {
    const bandProgress = (bandIndex + 0.35) / Math.max(1, bandCount - 0.15);
    const yBase = bandProgress * safeHeight;
    const clusterCount = Math.max(5, Math.round(safeWidth / 165) + (bandIndex % 3));

    for (let clusterIndex = 0; clusterIndex < clusterCount; clusterIndex += 1) {
      const centerX = ((clusterIndex + 0.5) / clusterCount) * safeWidth + (random() - 0.5) * 82;
      const centerY = yBase + (random() - 0.5) * 96;
      const stickerCount = 4 + Math.floor(random() * 3);

      for (let itemIndex = 0; itemIndex < stickerCount; itemIndex += 1) {
        const size = 110 + Math.round((random() - 0.5) * 16);
        const rotation = Math.round((random() - 0.5) * 30);
        let placedSticker = null;

        for (let attempt = 0; attempt < 32; attempt += 1) {
          const spread = 52 + random() * 16;
          const left = clamp(centerX + (random() - 0.5) * spread * 2.1, size * 0.42, safeWidth - size * 0.42);
          const top = clamp(centerY + (random() - 0.5) * spread * 2.1, size * 0.42, safeHeight - size * 0.16);
          const candidate = {
            src: SOURCES[
              (bandIndex * 13 + clusterIndex * 7 + itemIndex * 5 + Math.floor(random() * 17)) % SOURCES.length
            ],
            left,
            top,
            size,
            rotation: `${rotation}deg`,
          };

          if (!overlapsTooMuch(candidate, stickers)) {
            placedSticker = candidate;
            break;
          }

          if (attempt > 18) {
            const relaxedCandidate = { ...candidate, size: size - 3 };
            if (!overlapsTooMuch(relaxedCandidate, stickers)) {
              placedSticker = relaxedCandidate;
              break;
            }
          }
        }

        if (placedSticker) {
          stickers.push(placedSticker);
        }
      }
    }
  }

  return stickers;
}

export default function KuromiStickers() {
  const fieldRef = useRef(null);
  const [stickers, setStickers] = useState(() => buildStickers(DEFAULT_WIDTH, DEFAULT_HEIGHT));

  useEffect(() => {
    const field = fieldRef.current;
    const surface = field?.closest('.diary-surface');

    if (!field || !surface) {
      return undefined;
    }

    const updateStickers = () => {
      const surfaceRect = surface.getBoundingClientRect();
      const width = surfaceRect.width || window.innerWidth || DEFAULT_WIDTH;
      const height = Math.max(
        surface.scrollHeight,
        surfaceRect.height,
        window.innerHeight,
        DEFAULT_HEIGHT
      );
      setStickers(buildStickers(width, height));
    };

    updateStickers();

    const resizeObserver = new ResizeObserver(() => {
      updateStickers();
    });

    resizeObserver.observe(surface);
    resizeObserver.observe(document.body);
    window.addEventListener('resize', updateStickers);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateStickers);
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
            top: `${sticker.top}px`,
            left: `${sticker.left}px`,
            opacity: 1,
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
