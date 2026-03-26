import TaskManager from '@/components/TaskManager';

export const metadata = {
  title: 'Task Manager - Pinned Paper Board',
  description: 'A clean, aesthetic collaborative task manager.',
};

export default function Home() {
  return (
    <div className="container animate-in">
      <header className="pinned-panel" style={{ textAlign: 'center', marginBottom: '3rem', padding: '2.5rem', maxWidth: '500px', margin: '0 auto 3rem auto' }}>
        {/* Soft Pastel Pins */}
        <div className="pin pink" style={{ top: '-8px', left: '42%' }}></div>
        <div className="pin blue" style={{ top: '-8px', right: '42%' }}></div>
        
        <h1 style={{ fontSize: '3.2rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>
          Task Manager
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', fontWeight: 500, letterSpacing: '0.05em' }}>
          Shared Collaborative Workspace
        </p>
      </header>
      <main>
        <TaskManager />
      </main>
    </div>
  );
}
