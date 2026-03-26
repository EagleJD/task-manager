'use client';

// 각 캐릭터마다 다른 seed → 서로 다른 찢김 패턴 생성
const TORN_FILTERS = [
  { id: 'torn-0', seed: 3  },
  { id: 'torn-1', seed: 7  },
  { id: 'torn-2', seed: 13 },
  { id: 'torn-3', seed: 19 },
  { id: 'torn-4', seed: 29 },
];

// giphy_s.gif = 정적 프레임 (애니메이션 없음)
// 상단 헤더/폼 옆에 배치 → 칸반보드 영역과 겹치지 않음
const CHARACTERS = [
  {
    id: 'cinnamoroll',
    src: 'https://media.giphy.com/media/JQAxGWgPNy5uCzFkHU/giphy_s.gif',
    alt: '시나모롤',
    filterId: 'torn-0',
    style: { top: '70px',  left: '-6px',  '--rotate': '-8deg'  },
    size: 100,
  },
  {
    id: 'pompompurin',
    src: 'https://media.giphy.com/media/kyRDodDhqXcG2ro6GV/giphy_s.gif',
    alt: '폼폼푸린',
    filterId: 'torn-1',
    style: { top: '310px', left: '-8px',  '--rotate': '12deg'  },
    size: 92,
  },
  {
    id: 'mymelody',
    src: 'https://media.giphy.com/media/U7VI2RFA6VcH2Gm7H9/giphy_s.gif',
    alt: '마이멜로디',
    filterId: 'torn-2',
    style: { top: '55px',  right: '-5px', '--rotate': '10deg'  },
    size: 105,
  },
  {
    id: 'kuromi',
    src: 'https://media.giphy.com/media/oVeUzLxNPkAtxJ5IZ9/giphy_s.gif',
    alt: '쿠로미',
    filterId: 'torn-3',
    style: { top: '310px', right: '-7px', '--rotate': '-9deg'  },
    size: 96,
  },
  {
    id: 'cinnamoroll-b',
    src: 'https://media.giphy.com/media/lTY8pVIs76YOMDaDjY/giphy_s.gif',
    alt: '시나모롤b',
    filterId: 'torn-4',
    style: { top: '560px', right: '-6px', '--rotate': '7deg'   },
    size: 98,
  },
];

export default function DiaryDecorations() {
  return (
    <div aria-hidden="true" style={{ pointerEvents: 'none' }}>

      {/* SVG 필터 정의 — 캐릭터 알파 외곽선을 따라 찢긴 종이 테두리 생성 */}
      <svg
        style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
        focusable="false"
      >
        <defs>
          {TORN_FILTERS.map(({ id, seed }) => (
            <filter
              key={id}
              id={id}
              x="-22%" y="-22%"
              width="144%" height="144%"
              colorInterpolationFilters="sRGB"
            >
              {/* 난수 노이즈 — seed마다 다른 찢김 패턴 */}
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.032 0.076"
                numOctaves="3"
                seed={seed}
                result="noise"
              />

              {/* 캐릭터 알파를 팽창시켜 테두리 영역 생성 */}
              <feMorphology
                operator="dilate"
                radius="7"
                in="SourceAlpha"
                result="expanded"
              />

              {/* 팽창된 테두리 외곽에 노이즈로 불규칙 변위 → 찢긴 자국 */}
              <feDisplacementMap
                in="expanded"
                in2="noise"
                scale="10"
                xChannelSelector="R"
                yChannelSelector="G"
                result="tornEdge"
              />

              {/* 낡은 종이 색 채우기 */}
              <feFlood floodColor="#d5c398" result="paperColor" />
              <feComposite
                in="paperColor"
                in2="tornEdge"
                operator="in"
                result="paperBorder"
              />

              {/* 종이 테두리 위에 grain 레이어 */}
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.7"
                numOctaves="4"
                seed={seed + 5}
                result="grain"
              />
              <feColorMatrix type="saturate" values="0" in="grain" result="grayGrain" />
              <feComposite in="grayGrain" in2="tornEdge" operator="in" result="grainedBorder" />
              <feBlend in="paperBorder" in2="grainedBorder" mode="multiply" result="texturedBorder" />

              {/* 최종 합성: 찢긴 종이 테두리 뒤 + 원본 캐릭터 앞 */}
              <feMerge>
                <feMergeNode in="texturedBorder" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          ))}
        </defs>
      </svg>

      {CHARACTERS.map(({ id, src, alt, filterId, style, size }) => (
        <div
          key={id}
          className="diary-char-wrapper"
          style={style}
        >
          <img
            src={src}
            alt={alt}
            className="diary-char-img"
            width={size}
            height={size}
            style={{
              filter: `url(#${filterId}) drop-shadow(2px 4px 10px rgba(0,0,0,0.22)) sepia(22%) contrast(88%) brightness(106%)`,
            }}
            loading="lazy"
            draggable={false}
          />
        </div>
      ))}
    </div>
  );
}
