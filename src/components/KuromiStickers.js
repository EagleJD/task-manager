'use client';

// 쿠로미 스티커 콜라주 — 배경 레이어 (z-index: 1)
// 흰색 컷아웃 테두리 + 덕지덕지 겹치기

const SRC_A = 'https://media.giphy.com/media/oVeUzLxNPkAtxJ5IZ9/giphy_s.gif'; // 480×480
const SRC_B = 'https://media.giphy.com/media/Qtvvgwbl1svKYcUGIT/giphy_s.gif'; // 481×481

// top / left / right / bottom — viewport 기준
// rotate — 살짝씩 기울여서 손으로 붙인 느낌
// size — px 단위 (img width/height)
// filter — SVG 필터 ID
const STICKERS = [
  // ── 왼쪽 위 클러스터 (덕지덕지 겹침) ─────────────────
  { src: SRC_A, size: 200, pos: { top: '-30px',  left: '-45px'  }, rotate: '-18deg', filter: 'ks-white' },
  { src: SRC_B, size: 150, pos: { top:  '30px',  left:  '70px'  }, rotate:  '12deg', filter: 'ks-white' },
  { src: SRC_A, size: 120, pos: { top: '-15px',  left: '140px'  }, rotate:   '5deg', filter: 'ks-white' },
  { src: SRC_B, size: 110, pos: { top:  '95px',  left:  '10px'  }, rotate: '-22deg', filter: 'ks-white' },
  { src: SRC_A, size:  90, pos: { top: '130px',  left: '100px'  }, rotate:  '17deg', filter: 'ks-white' },

  // ── 오른쪽 아래 클러스터 ──────────────────────────────
  { src: SRC_B, size: 190, pos: { bottom: '-35px', right: '-40px' }, rotate:  '14deg', filter: 'ks-white' },
  { src: SRC_A, size: 145, pos: { bottom:  '60px', right:  '55px' }, rotate: '-10deg', filter: 'ks-white' },
  { src: SRC_B, size: 120, pos: { bottom: '130px', right: '-20px' }, rotate:  '25deg', filter: 'ks-white' },
  { src: SRC_A, size: 105, pos: { bottom:  '10px', right: '130px' }, rotate:  '-7deg', filter: 'ks-white' },

  // ── 왼쪽 중간 한 장 ──────────────────────────────────
  { src: SRC_B, size: 115, pos: { top: '42%', left: '-25px' }, rotate: '-28deg', filter: 'ks-white' },

  // ── 오른쪽 중간 한 장 ────────────────────────────────
  { src: SRC_A, size: 100, pos: { top: '55%', right: '-20px' }, rotate:  '20deg', filter: 'ks-white' },
];

export default function KuromiStickers() {
  return (
    <div aria-hidden="true" style={{ pointerEvents: 'none' }}>

      {/* SVG 필터 — 흰색 컷아웃 스티커 테두리 */}
      <svg
        style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
        focusable="false"
      >
        <defs>
          <filter
            id="ks-white"
            x="-25%" y="-25%"
            width="150%" height="150%"
            colorInterpolationFilters="sRGB"
          >
            {/* 캐릭터 실루엣을 바깥으로 팽창 → 테두리 두께 */}
            <feMorphology
              operator="dilate"
              radius="6"
              in="SourceAlpha"
              result="expanded"
            />
            {/* 흰색으로 채우기 */}
            <feFlood floodColor="#ffffff" result="white" />
            <feComposite in="white" in2="expanded" operator="in" result="whiteBorder" />
            {/* 테두리 가장자리 미세 블러 — 손으로 오린 느낌 */}
            <feGaussianBlur in="whiteBorder" stdDeviation="0.4" result="softBorder" />
            {/* 흰 테두리 위에 원본 이미지 */}
            <feMerge>
              <feMergeNode in="softBorder" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      {STICKERS.map(({ src, size, pos, rotate, filter }, i) => (
        <div
          key={i}
          style={{
            position: 'fixed',
            ...pos,
            transform: `rotate(${rotate})`,
            zIndex: 1,
            pointerEvents: 'none',
            userSelect: 'none',
            overflow: 'visible',
          }}
        >
          <img
            src={src}
            alt="쿠로미 스티커"
            width={size}
            height={size}
            draggable={false}
            style={{
              display: 'block',
              overflow: 'visible',
              filter: `url(#${filter}) drop-shadow(2px 4px 8px rgba(0,0,0,0.18))`,
            }}
          />
        </div>
      ))}
    </div>
  );
}
