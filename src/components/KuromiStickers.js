'use client';

import Image from 'next/image';

const SOURCES = [
  'https://media.giphy.com/media/oVeUzLxNPkAtxJ5IZ9/giphy_s.gif',
  'https://media.giphy.com/media/vWogB2TzWRruIQzRBt/giphy_s.gif',
  'https://media.giphy.com/media/KERiMXasn55GDu9AYI/giphy_s.gif',
  'https://media.giphy.com/media/JNxq0xOWfidCDzqUH3/giphy_s.gif',
  'https://media.giphy.com/media/l2FSi4zPU5dnLyd7Q4/giphy_s.gif',
  'https://media.giphy.com/media/dCRVRbdbZUlNt1sRPd/giphy_s.gif',
  'https://media.giphy.com/media/Qtvvgwbl1svKYcUGIT/giphy_s.gif',
];

const FILTERS = [
  'saturate(1.05)',
  'saturate(0.95) hue-rotate(-6deg)',
  'brightness(1.03)',
  'contrast(1.04)',
];

const EDGE_STICKERS = [
  { src: 0, size: 220, top: '-1.8%', left: '-3%', rotate: '-18deg', opacity: 0.95 },
  { src: 1, size: 180, top: '1.5%', right: '-1.5%', rotate: '14deg', opacity: 0.9 },
  { src: 2, size: 180, top: '16%', left: '-3.2%', rotate: '-16deg', opacity: 0.82 },
  { src: 3, size: 168, top: '19%', right: '-2.5%', rotate: '18deg', opacity: 0.8 },
  { src: 4, size: 170, top: '39%', left: '-2.5%', rotate: '-22deg', opacity: 0.84 },
  { src: 5, size: 170, top: '42%', right: '-2.2%', rotate: '21deg', opacity: 0.8 },
  { src: 6, size: 188, top: '66%', left: '-3%', rotate: '16deg', opacity: 0.84 },
  { src: 0, size: 186, top: '71%', right: '-2.5%', rotate: '-14deg', opacity: 0.82 },
  { src: 3, size: 190, bottom: '-2%', left: '-2.5%', rotate: '12deg', opacity: 0.85 },
  { src: 4, size: 205, bottom: '-2.2%', right: '-3%', rotate: '-17deg', opacity: 0.88 },
];

const GRID_STICKERS = Array.from({ length: 48 }, (_, index) => {
  const row = Math.floor(index / 6);
  const col = index % 6;
  const left = 8 + col * 16 + [0, -2.5, 2, -1, 1.5, -2][col];
  const top = 6 + row * 12.5 + [0, 1.8, -1.2, 1.2, -1.6, 1, -0.8, 1.6][row];
  const edgeFactor = col === 0 || col === 5 ? 1 : col === 1 || col === 4 ? 0.72 : 0.58;
  const size = 82 + ((row + col) % 4) * 12 + (col === 0 || col === 5 ? 18 : 0);
  const opacity = 0.2 + edgeFactor * 0.16;

  return {
    src: (index + row) % SOURCES.length,
    size,
    top: `${top}%`,
    left: `${left}%`,
    rotate: `${[-18, -10, -4, 8, 14, 20][(index + col) % 6]}deg`,
    opacity,
    filter: FILTERS[index % FILTERS.length],
  };
});

const STICKERS = [...EDGE_STICKERS, ...GRID_STICKERS];

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

      {STICKERS.map((sticker, index) => {
        const src = SOURCES[sticker.src];

        return (
          <div
            key={`${src}-${index}`}
            className="sticker-cloud"
            style={{
              top: sticker.top,
              right: sticker.right,
              bottom: sticker.bottom,
              left: sticker.left,
              opacity: sticker.opacity,
              transform: `rotate(${sticker.rotate})`,
            }}
          >
            <Image
              src={src}
              alt=""
              width={sticker.size}
              height={sticker.size}
              sizes={`${sticker.size}px`}
              unoptimized
              draggable={false}
              style={{
                display: 'block',
                width: sticker.size,
                height: sticker.size,
                filter: `url(#ks-white) drop-shadow(2px 4px 8px rgba(0,0,0,0.15)) ${sticker.filter ?? ''}`.trim(),
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
