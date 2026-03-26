'use client';

// 각 캐릭터마다 다른 seed → 서로 다른 찢김 패턴 생성
const TORN_FILTERS = [
  { id: 'torn-0', seed: 3  },
  { id: 'torn-1', seed: 7  },
  { id: 'torn-2', seed: 13 },
  { id: 'torn-3', seed: 19 },
  { id: 'torn-4', seed: 29 },
];

// 4 모서리 + 오른쪽 중간 배치
// 크게 키워서 뷰포트 밖으로 삐져나오게 → 일부분만 보이도록
const CHARACTERS = [
  {
    id: 'kuromi-tl',
    src: 'https://media.giphy.com/media/wEQBUOHFNmdYXK9DxY/giphy_s.gif',
    alt: '쿠로미',
    filterId: 'torn-0',
    style: { top: '-35px', left: '-50px', '--rotate': '-16deg' },
    size: 310,
  },
  {
    id: 'mymelody-tr',
    src: 'https://media.giphy.com/media/U7VI2RFA6VcH2Gm7H9/giphy_s.gif',
    alt: '마이멜로디',
    filterId: 'torn-1',
    style: { top: '-25px', right: '-55px', '--rotate': '18deg' },
    size: 330,
  },
  {
    id: 'pompompurin-bl',
    src: 'https://media.giphy.com/media/kd92rDAkBsxH3U9DgK/giphy_s.gif',
    alt: '폼폼푸린',
    filterId: 'torn-2',
    style: { bottom: '-50px', left: '-45px', '--rotate': '13deg' },
    size: 290,
  },
  {
    id: 'cinnamoroll-br',
    src: 'https://media.giphy.com/media/lTY8pVIs76YOMDaDjY/giphy_s.gif',
    alt: '시나모롤',
    filterId: 'torn-3',
    style: { bottom: '-35px', right: '-65px', '--rotate': '-14deg' },
    size: 370,
  },
  {
    id: 'kuromi-rm',
    src: 'https://media.giphy.com/media/oVeUzLxNPkAtxJ5IZ9/giphy_s.gif',
    alt: '쿠로미b',
    filterId: 'torn-4',
    style: { top: '40%', right: '-75px', '--rotate': '22deg' },
    size: 270,
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
