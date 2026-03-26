import TaskManager from '@/components/TaskManager';
import DiaryDecorations from '@/components/DiaryDecorations';
import DiaryBackground from '@/components/DiaryBackground';

export const metadata = {
  title: '✨ My Task Diary 🌸',
  description: '今日もがんばろう！かわいいタスク管理',
};

export default function Home() {
  return (
    <div className="container animate-in">
      <header className="pinned-panel" style={{ textAlign: 'center', marginBottom: '3rem', padding: '2.5rem', maxWidth: '500px', margin: '0 auto 3rem auto' }}>
        <div className="pin pink" style={{ top: '-9px', left: '42%' }}></div>
        <div className="pin blue" style={{ top: '-9px', right: '42%' }}></div>

        <h1 style={{ fontSize: '2.8rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.01em', marginBottom: '0.5rem' }}>
          🌸 My Task Diary
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', fontWeight: 500, letterSpacing: '0.1em' }}>
          ✨ 오늘도 같이 힘내보자 ✨
        </p>
      </header>
      <main>
        <TaskManager />
      </main>
      <DiaryDecorations />
      <DiaryBackground />
    </div>
  );
}
