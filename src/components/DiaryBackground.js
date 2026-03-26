'use client';

// 일본 오사카 여고생 다이어리 스타일 — 배경 장식 레이어
// z-index: 2 (태스크 컨텐츠 z-index:5 아래, 마우스 완전 차단)

const STICKERS = [
  // ── 왼쪽 열 ──────────────────────────────────────────
  { text: 'がんばろう！',  pos: { top: '130px', left: '10px' }, rotate: '-8deg',  color: '#fb7185', type: 's-bubble', size: '0.78rem' },
  { text: '🌸🌸🌸',        pos: { top: '228px', left: '24px' }, rotate: '3deg',   type: 's-plain',  size: '1.1rem'  },
  { text: '♡かわいい♡',  pos: { top: '318px', left: '8px'  }, rotate: '7deg',   color: '#c084fc', type: 's-bubble', size: '0.75rem' },
  { text: '✨✨',          pos: { top: '420px', left: '38px' }, rotate: '14deg',  type: 's-plain',  size: '1.2rem'  },
  { text: '楽しい♪',      pos: { top: '505px', left: '12px' }, rotate: '-10deg', color: '#38bdf8', type: 's-stamp',  size: '0.76rem' },
  { text: '💕',            pos: { top: '608px', left: '46px' }, rotate: '-4deg',  type: 's-plain',  size: '1.5rem'  },
  { text: '大好き！',      pos: { top: '695px', left: '9px'  }, rotate: '9deg',   color: '#fbbf24', type: 's-bubble', size: '0.78rem' },
  { text: '🌟🌟',          pos: { top: '798px', left: '32px' }, rotate: '-9deg',  type: 's-plain',  size: '1.1rem'  },
  { text: 'わくわく〜♪',  pos: { top: '885px', left: '11px' }, rotate: '5deg',   color: '#f472b6', type: 's-bubble', size: '0.73rem' },

  // ── 오른쪽 열 ────────────────────────────────────────
  { text: 'やばい！！',   pos: { top: '148px', right: '42px' }, rotate: '10deg',  color: '#f472b6', type: 's-bubble', size: '0.78rem' },
  { text: '⭐⭐',          pos: { top: '248px', right: '34px' }, rotate: '-6deg',  type: 's-plain',  size: '1.2rem'  },
  { text: '✨最高✨',     pos: { top: '348px', right: '44px' }, rotate: '-8deg',  color: '#c084fc', type: 's-stamp',  size: '0.76rem' },
  { text: '💖💖',          pos: { top: '448px', right: '38px' }, rotate: '11deg',  type: 's-plain',  size: '1.2rem'  },
  { text: 'ありがとう♡', pos: { top: '538px', right: '42px' }, rotate: '7deg',   color: '#fb7185', type: 's-bubble', size: '0.73rem' },
  { text: '🎀',            pos: { top: '645px', right: '48px' }, rotate: '-9deg',  type: 's-plain',  size: '1.5rem'  },
  { text: '今日もね♪',   pos: { top: '730px', right: '42px' }, rotate: '-8deg',  color: '#38bdf8', type: 's-bubble', size: '0.75rem' },
  { text: '🌺🌺',          pos: { top: '835px', right: '30px' }, rotate: '7deg',   type: 's-plain',  size: '1.1rem'  },
  { text: 'かっこいい！', pos: { top: '920px', right: '44px' }, rotate: '4deg',   color: '#fbbf24', type: 's-bubble', size: '0.73rem' },
];

// 오른쪽 다이어리 탭 — 노트북 분리 탭 효과
const TABS = [
  { emoji: '📌', color: '#ffb3c6', top: '108px' },
  { emoji: '🌸', color: '#ddb8ef', top: '230px' },
  { emoji: '⭐', color: '#fde68a', top: '352px' },
  { emoji: '💕', color: '#bae6fd', top: '474px' },
  { emoji: '✿',  color: '#bbf7d0', top: '596px' },
  { emoji: '🎀', color: '#fecdd3', top: '718px' },
  { emoji: '✨', color: '#e9d5ff', top: '840px' },
];

// 상단 코너 와시테이프
const WASHI = [
  {
    style: { top: 0, left: '-6px' },
    rotate: '-2deg', width: '150px',
    gradient: 'rgba(255,179,198,.65) 0px,rgba(255,218,232,.55) 10px,rgba(200,183,230,.55) 20px,rgba(255,229,175,.5) 30px,rgba(181,223,207,.5) 40px,rgba(255,179,198,.65) 50px',
  },
  {
    style: { top: 0, right: '-6px' },
    rotate: '2deg', width: '150px',
    gradient: 'rgba(200,183,230,.65) 0px,rgba(255,218,232,.55) 10px,rgba(255,179,198,.55) 20px,rgba(181,223,207,.5) 30px,rgba(255,229,175,.5) 40px,rgba(200,183,230,.65) 50px',
  },
];

export default function DiaryBackground() {
  return (
    <div aria-hidden="true" style={{ pointerEvents: 'none' }}>

      {/* 다이어리 바인딩 — 오른쪽 세로 핑크 스파인 */}
      <div className="diary-spine" />

      {/* 와시테이프 — 상단 양쪽 코너 */}
      {WASHI.map((w, i) => (
        <div
          key={`washi-${i}`}
          className="washi-tape"
          style={{
            ...w.style,
            width: w.width,
            transform: `rotate(${w.rotate})`,
            background: `repeating-linear-gradient(90deg, ${w.gradient})`,
          }}
        />
      ))}

      {/* 텍스트 스티커 + 이모지 스티커 */}
      {STICKERS.map((s, i) => (
        <div
          key={`sticker-${i}`}
          className={`diary-sticker ${s.type}`}
          style={{
            ...s.pos,
            '--rotate': s.rotate,
            '--color': s.color,
            '--size': s.size,
          }}
        >
          {s.text}
        </div>
      ))}

      {/* 노트북 탭 — 스파인 위에 배치 */}
      {TABS.map((tab, i) => (
        <div
          key={`tab-${i}`}
          className="notebook-tab"
          style={{ top: tab.top, background: tab.color }}
        >
          {tab.emoji}
        </div>
      ))}

      {/* 장식 펜 — 왼쪽 가장자리 */}
      <div className="diary-pen" style={{ left: '-4px', top: '58%' }}>
        <div className="diary-pen-charm">🌟</div>
        <div className="diary-pen-body" />
        <div className="diary-pen-tip" />
      </div>

    </div>
  );
}
