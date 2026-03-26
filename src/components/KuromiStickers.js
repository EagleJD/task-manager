'use client';

// 쿠로미 스티커 콜라주 — 배경 레이어 (z-index: 1)
// page.js에서 .container 밖에 렌더링해야 kanban이 앞으로 올라옴

const SRCS = [
  'https://media.giphy.com/media/oVeUzLxNPkAtxJ5IZ9/giphy_s.gif', // Heart Wink     480×480
  'https://media.giphy.com/media/vWogB2TzWRruIQzRBt/giphy_s.gif', // Expressions     480×480
  'https://media.giphy.com/media/KERiMXasn55GDu9AYI/giphy_s.gif', // Vote Kuromi     480×480
  'https://media.giphy.com/media/JNxq0xOWfidCDzqUH3/giphy_s.gif', // Bling           480×480
  'https://media.giphy.com/media/l2FSi4zPU5dnLyd7Q4/giphy_s.gif', // Charming A      481×481
  'https://media.giphy.com/media/dCRVRbdbZUlNt1sRPd/giphy_s.gif', // Charming B      481×481
  'https://media.giphy.com/media/Qtvvgwbl1svKYcUGIT/giphy_s.gif', // Kuromi-b        481×481
];

const S = SRCS; // 짧은 alias

// pos → fixed 좌표, size → px, rotate → deg, op → opacity
const STICKERS = [
  // ════ 왼쪽 위 클러스터 (7장 덕지덕지) ════
  { src: S[0], size: 220, pos: { top:  '-40px', left:  '-55px' }, rotate: '-18deg', op: 1.0 },
  { src: S[1], size: 165, pos: { top:   '30px', left:   '85px' }, rotate:  '11deg', op: 0.95 },
  { src: S[2], size: 140, pos: { top:  '-20px', left:  '155px' }, rotate:   '4deg', op: 0.9 },
  { src: S[3], size: 125, pos: { top:  '115px', left:   '10px' }, rotate: '-25deg', op: 1.0 },
  { src: S[4], size: 110, pos: { top:  '130px', left:  '105px' }, rotate:  '19deg', op: 0.85 },
  { src: S[5], size:  95, pos: { top:   '55px', left:  '-10px' }, rotate: '-8deg',  op: 0.9 },
  { src: S[6], size:  85, pos: { top:  '185px', left:   '60px' }, rotate:  '30deg', op: 0.8 },

  // ════ 오른쪽 위 클러스터 (6장) ════
  { src: S[1], size: 210, pos: { top:  '-35px', right: '-50px' }, rotate:  '16deg', op: 1.0 },
  { src: S[0], size: 155, pos: { top:   '20px', right:  '80px' }, rotate: '-14deg', op: 0.95 },
  { src: S[3], size: 130, pos: { top:  '-15px', right: '160px' }, rotate:   '7deg', op: 0.9 },
  { src: S[2], size: 115, pos: { top:  '105px', right:  '15px' }, rotate:  '22deg', op: 1.0 },
  { src: S[5], size: 100, pos: { top:  '120px', right:  '95px' }, rotate: '-20deg', op: 0.85 },
  { src: S[4], size:  80, pos: { top:  '175px', right:  '55px' }, rotate:  '-6deg', op: 0.8 },

  // ════ 왼쪽 중간 클러스터 (5장) ════
  { src: S[2], size: 175, pos: { top:  '34%', left:  '-50px' }, rotate: '-22deg', op: 0.95 },
  { src: S[6], size: 130, pos: { top:  '40%', left:   '50px' }, rotate:  '14deg', op: 0.9 },
  { src: S[3], size: 105, pos: { top:  '50%', left:  '-20px' }, rotate:  '-5deg', op: 0.85 },
  { src: S[1], size:  90, pos: { top:  '56%', left:   '65px' }, rotate:  '27deg', op: 0.8 },
  { src: S[0], size:  80, pos: { top:  '62%', left:   '-5px' }, rotate: '-15deg', op: 0.75 },

  // ════ 오른쪽 중간 클러스터 (5장) ════
  { src: S[4], size: 170, pos: { top:  '32%', right: '-45px' }, rotate:  '20deg', op: 0.95 },
  { src: S[0], size: 125, pos: { top:  '42%', right:  '55px' }, rotate: '-12deg', op: 0.9 },
  { src: S[5], size: 105, pos: { top:  '51%', right: '-15px' }, rotate:   '8deg', op: 0.85 },
  { src: S[2], size:  90, pos: { top:  '57%', right:  '65px' }, rotate: '-24deg', op: 0.8 },
  { src: S[6], size:  80, pos: { top:  '64%', right:   '5px' }, rotate:  '16deg', op: 0.75 },

  // ════ 왼쪽 아래 클러스터 (6장) ════
  { src: S[5], size: 200, pos: { bottom: '-40px', left:  '-50px' }, rotate:  '15deg', op: 1.0 },
  { src: S[3], size: 155, pos: { bottom:  '55px', left:   '70px' }, rotate: '-11deg', op: 0.95 },
  { src: S[0], size: 130, pos: { bottom: '130px', left:  '-20px' }, rotate:  '26deg', op: 0.9 },
  { src: S[1], size: 110, pos: { bottom:  '15px', left:  '140px' }, rotate:  '-8deg', op: 0.85 },
  { src: S[4], size:  95, pos: { bottom: '175px', left:   '50px' }, rotate: '-28deg', op: 0.8 },
  { src: S[6], size:  80, pos: { bottom:  '85px', left:   '-5px' }, rotate:   '9deg', op: 0.75 },

  // ════ 오른쪽 아래 클러스터 (6장) ════
  { src: S[6], size: 205, pos: { bottom: '-45px', right: '-45px' }, rotate: '-17deg', op: 1.0 },
  { src: S[4], size: 150, pos: { bottom:  '60px', right:  '75px' }, rotate:  '12deg', op: 0.95 },
  { src: S[1], size: 130, pos: { bottom: '140px', right: '-25px' }, rotate: '-23deg', op: 0.9 },
  { src: S[0], size: 110, pos: { bottom:   '5px', right: '145px' }, rotate:  '-5deg', op: 0.85 },
  { src: S[2], size:  95, pos: { bottom: '185px', right:  '60px' }, rotate:  '21deg', op: 0.8 },
  { src: S[3], size:  80, pos: { bottom:  '90px', right:   '0px' }, rotate: '-12deg', op: 0.75 },
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
            x="-28%" y="-28%"
            width="156%" height="156%"
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

      {STICKERS.map(({ src, size, pos, rotate, op }, i) => (
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
            opacity: op,
          }}
        >
          <img
            src={src}
            alt=""
            width={size}
            height={size}
            draggable={false}
            style={{
              display: 'block',
              overflow: 'visible',
              filter: 'url(#ks-white) drop-shadow(2px 4px 8px rgba(0,0,0,0.15))',
            }}
          />
        </div>
      ))}
    </div>
  );
}
