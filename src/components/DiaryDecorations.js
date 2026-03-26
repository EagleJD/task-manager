'use client';

const CHARACTERS = [
  {
    id: 'cinnamoroll',
    src: 'https://media.giphy.com/media/JQAxGWgPNy5uCzFkHU/giphy.gif',
    alt: '시나모롤',
    style: { top: '200px', left: '-20px', '--rotate': '-10deg' },
    size: 125,
  },
  {
    id: 'pompompurin',
    src: 'https://media.giphy.com/media/kd92rDAkBsxH3U9DgK/giphy.gif',
    alt: '폼폼푸린',
    style: { top: '510px', left: '-14px', '--rotate': '8deg' },
    size: 110,
  },
  {
    id: 'mymelody',
    src: 'https://media.giphy.com/media/U7VI2RFA6VcH2Gm7H9/giphy.gif',
    alt: '마이멜로디',
    style: { top: '170px', right: '-18px', '--rotate': '12deg' },
    size: 118,
  },
  {
    id: 'kuromi',
    src: 'https://media.giphy.com/media/wEQBUOHFNmdYXK9DxY/giphy.gif',
    alt: '쿠로미',
    style: { top: '460px', right: '-12px', '--rotate': '-9deg' },
    size: 108,
  },
  {
    id: 'hellokitty',
    src: 'https://media.giphy.com/media/MB0NUNjpzCYMCZejHZ/giphy.gif',
    alt: '헬로키티',
    style: { top: '740px', right: '-22px', '--rotate': '6deg' },
    size: 115,
  },
];

export default function DiaryDecorations() {
  return (
    <div aria-hidden="true">
      {CHARACTERS.map(({ id, src, alt, style, size }) => (
        <div key={id} className="diary-char-wrapper" style={style}>
          <img
            src={src}
            alt={alt}
            className="diary-char-img"
            width={size}
            height={size}
            loading="lazy"
          />
        </div>
      ))}
    </div>
  );
}
