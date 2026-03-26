import TaskManager from '@/components/TaskManager';
import KuromiStickers from '@/components/KuromiStickers';

export const metadata = {
  title: '✨ My Task Diary 🌸',
  description: '今日もがんばろう！かわいいタスク管理',
};

export default function Home() {
  return (
    <>
      {/* 스티커는 .container 밖 → root stacking context z-index:1 (container z-index:5 아래) */}
      <KuromiStickers />

      <div className="container animate-in">
        <header className="pinned-panel" style={{ textAlign: 'center', marginBottom: '3rem', padding: '2.5rem', maxWidth: '500px', margin: '0 auto 3rem auto' }}>
          <div className="pin pink" style={{ top: '-9px', left: '42%' }}></div>
          <div className="pin blue" style={{ top: '-9px', right: '42%' }}></div>

          <h1 style={{ fontSize: '2.8rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.01em', marginBottom: '0.5rem' }}>
            🌸 My Task Diary
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', fontWeight: 500, letterSpacing: '0.1em' }}>
            ✨ 今日もいっしょにがんばろ ✨
          </p>
        </header>
        <main>
          <TaskManager />
        </main>
      </div>
    </>
  );
}
