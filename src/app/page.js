import TaskManager from '@/components/TaskManager';
import KuromiStickers from '@/components/KuromiStickers';

export const metadata = {
  title: 'My Task Diary',
  description: '쿠로미 스티커가 가득한 다이어리 스타일 태스크 매니저',
};

const bookmarks = [
  { label: 'TODAY', sublabel: 'March Notes', colorClass: 'pink', tilt: '-4deg' },
  { label: 'WORK', sublabel: 'Priority Set', colorClass: 'blue', tilt: '2deg' },
  { label: 'FOCUS', sublabel: 'Deep Session', colorClass: 'yellow', tilt: '5deg' },
];

export default function Home() {
  return (
    <div className="page-wrapper">
      <KuromiStickers />

      <div className="top-bookmarks" aria-hidden="true">
        {bookmarks.map((bookmark) => (
          <div
            key={bookmark.label}
            className={`bookmark ${bookmark.colorClass}`}
            style={{ transform: `translateY(0) rotate(${bookmark.tilt})` }}
          >
            <span className="bookmark-cap"></span>
            <span className="bookmark-eyelet"></span>
            <span className="bookmark-label">{bookmark.label}</span>
            <span className="bookmark-sublabel">{bookmark.sublabel}</span>
          </div>
        ))}
      </div>

      <div className="container animate-in">
        <section className="hero-diary pinned-panel">
          <div className="hero-rings" aria-hidden="true">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>

          <div className="pin pink" style={{ top: '-10px', left: '14%' }}></div>
          <div className="pin blue" style={{ top: '-10px', right: '14%' }}></div>

          <p className="hero-kicker">Diary board for the day</p>
          <h1>My Task Diary</h1>
          <p className="hero-description">
            촘촘하게 깔린 쿠로미 스티커 배경 위에서 오늘의 태스크를 다이어리처럼 정리해보세요.
          </p>
        </section>

        <main>
          <TaskManager />
        </main>
      </div>
    </div>
  );
}
