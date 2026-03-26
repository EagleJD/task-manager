import TaskManager from '@/components/TaskManager';
import KuromiStickers from '@/components/KuromiStickers';

export const metadata = {
  title: 'My Task Diary',
  description: '쿠로미 스티커로 꾸민 다이어리 스타일 태스크 매니저',
};

const bookmarks = [
  { label: 'Today', colorClass: 'pink' },
  { label: 'Work', colorClass: 'blue' },
  { label: 'Focus', colorClass: 'yellow' },
];

export default function Home() {
  return (
    <div className="page-wrapper">
      <KuromiStickers />

      <div className="container animate-in">
        <section className="hero-diary pinned-panel">
          <div className="hero-rings" aria-hidden="true">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>

          <div className="bookmark-strip" aria-hidden="true">
            {bookmarks.map((bookmark) => (
              <span key={bookmark.label} className={`bookmark ${bookmark.colorClass}`}>
                {bookmark.label}
              </span>
            ))}
          </div>

          <div className="pin pink" style={{ top: '-10px', left: '14%' }}></div>
          <div className="pin blue" style={{ top: '-10px', right: '14%' }}></div>

          <p className="hero-kicker">Diary board for the day</p>
          <h1>My Task Diary</h1>
          <p className="hero-description">
            빼곡한 쿠로미 스티커 배경 위에 오늘의 할 일과 마감 시간을 정리해보세요.
          </p>
        </section>

        <main>
          <TaskManager />
        </main>
      </div>
    </div>
  );
}
