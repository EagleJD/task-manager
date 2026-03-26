'use client';

// 산리오 공식 Giphy 스티커 — 캐릭터 단독 컷 위주로 선별
const CHARACTERS = [
  {
    id: 'cinnamoroll-a',
    src: 'https://media.giphy.com/media/JQAxGWgPNy5uCzFkHU/giphy.gif',
    alt: '시나모롤',
    style: { top: '180px', left: '-22px', '--rotate': '-11deg' },
    size: 130,
  },
  {
    id: 'pompompurin-a',
    src: 'https://media.giphy.com/media/kyRDodDhqXcG2ro6GV/giphy.gif',
    alt: '폼폼푸린',
    style: { top: '520px', left: '-16px', '--rotate': '9deg' },
    size: 112,
  },
  {
    id: 'mymelody-a',
    src: 'https://media.giphy.com/media/U7VI2RFA6VcH2Gm7H9/giphy.gif',
    alt: '마이멜로디',
    style: { top: '160px', right: '-20px', '--rotate': '13deg' },
    size: 120,
  },
  {
    id: 'kuromi-a',
    src: 'https://media.giphy.com/media/oVeUzLxNPkAtxJ5IZ9/giphy.gif',
    alt: '쿠로미',
    style: { top: '470px', right: '-14px', '--rotate': '-10deg' },
    size: 110,
  },
  {
    id: 'cinnamoroll-b',
    src: 'https://media.giphy.com/media/lTY8pVIs76YOMDaDjY/giphy.gif',
    alt: '시나모롤2',
    style: { top: '760px', right: '-18px', '--rotate': '7deg' },
    size: 116,
  },
];

export default function DiaryDecorations() {
  return (
    <div aria-hidden="true" style={{ pointerEvents: 'none' }}>
      {CHARACTERS.map(({ id, src, alt, style, size }) => (
        <div key={id} className="diary-char-wrapper" style={style}>
          <img
            src={src}
            alt={alt}
            className="diary-char-img"
            width={size}
            height={size}
            loading="lazy"
            draggable={false}
          />
        </div>
      ))}
    </div>
  );
}
