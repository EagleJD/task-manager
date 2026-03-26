'use client';

// seed → 고유 찢김 패턴 / color → 캐릭터별 아웃라인 색상
const TORN_FILTERS = [
  { id: 'torn-0', seed: 3, color: '#c084fc' }, // 쿠로미 — 바이올렛
  { id: 'torn-1', seed: 7, color: '#fb7185' }, // 마이멜로디 — 코랄 핑크
  { id: 'torn-2', seed: 13, color: '#fbbf24' }, // 폼폼푸린 — 앰버 골드
  { id: 'torn-3', seed: 19, color: '#38bdf8' }, // 시나모롤 — 스카이 블루
  { id: 'torn-4', seed: 29, color: '#f472b6' }, // 쿠로미b  — 핫 핑크
];

// 모든 스티커 480×480 또는 세로형 (정사각/세로형 확인된 ID만 사용)
const CHARACTERS = [
  {
    id: 'kuromi-tl',
    src: 'https://media.giphy.com/media/oVeUzLxNPkAtxJ5IZ9/giphy_s.gif', // 480×480
    alt: '쿠로미',
    filterId: 'torn-0',
    style: { top: '-35px', left: '-50px', '--rotate': '-16deg' },
    size: 310,
  },
  {
    id: 'mymelody-tr',
    src: 'https://media.giphy.com/media/TyLGHKVMSZXZKRGJ8H/giphy_s.gif', // 480×480
    alt: '마이멜로디',
    filterId: 'torn-1',
    style: { top: '-25px', right: '-55px', '--rotate': '18deg' },
    size: 330,
  },
  {
    id: 'pompompurin-bl',
    src: 'https://media.giphy.com/media/kyRDodDhqXcG2ro6GV/giphy_s.gif', // 480×480
    alt: '폼폼푸린',
    filterId: 'torn-2',
    style: { bottom: '-490px', left: '-310px', '--rotate': '13deg' },
    size: 790,
  },
  {
    id: 'cinnamoroll-br',
    src: 'https://media.giphy.com/media/lTY8pVIs76YOMDaDjY/giphy_s.gif', // 407×480 세로형
    alt: '시나모롤',
    filterId: 'torn-3',
    style: { bottom: '-470px', right: '-295px', '--rotate': '-14deg' },
    size: 770,
  },
  {
    id: 'kuromi-rm',
    src: 'https://media.giphy.com/media/Qtvvgwbl1svKYcUGIT/giphy_s.gif', // 481×481
    alt: '쿠로미b',
    filterId: 'torn-4',
    style: { top: '40%', right: '-75px', '--rotate': '22deg' },
    size: 270,
  },
];

export default function DiaryDecorations() {
  return (
    <div aria-hidden="true" style={{ pointerEvents: 'none' }}>

      {/* SVG 필터 — 캐릭터 알파 외곽선 기반 찢긴 종이 아웃라인 */}
      <svg
        style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
        focusable="false"
      >
        <defs>
          {TORN_FILTERS.map(({ id, seed, color }) => (
            <filter
              key={id}
              id={id}
              x="-22%" y="-22%"
              width="144%" height="144%"
              colorInterpolationFilters="sRGB"
            >
              {/* 난수 노이즈 — seed 마다 고유한 찢김 형태 */}
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.032 0.076"
                numOctaves="3"
                seed={seed}
                result="noise"
              />

              {/* 캐릭터 알파 팽창 → 적당한 두께의 테두리 생성 */}
              <feMorphology
                operator="dilate"
                radius="5"
                in="SourceAlpha"
                result="expanded"
              />

              {/* 변위량을 테두리 두께와 비슷하게 유지 → 자연스러운 찢김 */}
              <feDisplacementMap
                in="expanded"
                in2="noise"
                scale="7"
                xChannelSelector="R"
                yChannelSelector="G"
                result="tornEdge"
              />

              {/* 테두리 가장자리 미세 블러 → 딱딱한 디지털 느낌 제거 */}
              <feGaussianBlur in="tornEdge" stdDeviation="0.6" result="softEdge" />

              {/* 캐릭터별 아웃라인 색상 */}
              <feFlood floodColor={color} result="borderColor" />
              <feComposite
                in="borderColor"
                in2="softEdge"
                operator="in"
                result="coloredBorder"
              />

              {/* 종이 grain — 자연스러운 저주파 노이즈 */}
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.65"
                numOctaves="3"
                seed={seed + 5}
                result="grain"
              />
              <feColorMatrix type="saturate" values="0" in="grain" result="grayGrain" />
              <feComposite in="grayGrain" in2="softEdge" operator="in" result="grainMask" />
              <feBlend in="coloredBorder" in2="grainMask" mode="soft-light" result="texturedBorder" />

              {/* 최종: 찢긴 테두리 뒤 + 원본 캐릭터 앞 */}
              <feMerge>
                <feMergeNode in="texturedBorder" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          ))}
        </defs>
      </svg>

      {CHARACTERS.map(({ id, src, alt, filterId, style, size }) => (
        <div key={id} className="diary-char-wrapper" style={style}>
          <img
            src={src}
            alt={alt}
            className="diary-char-img"
            width={size}
            height={size}
            style={{
              filter: `url(#${filterId}) drop-shadow(2px 4px 10px rgba(0,0,0,0.22)) sepia(18%) contrast(90%) brightness(108%)`,
            }}
            loading="lazy"
            draggable={false}
          />
        </div>
      ))}
    </div>
  );
}
