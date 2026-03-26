import TaskManager from '@/components/TaskManager';

export const metadata = {
  title: 'SyncTasks - Global Shared Task Manager',
  description: 'A beautiful collaborative task manager powered by Next.js and Vercel Postgres.',
};

export default function Home() {
  return (
    <div className="container animate-in">
      <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>
          SyncTasks ✨
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
          Collaborative Database Task Manager
        </p>
      </header>
      <main>
        <TaskManager />
      </main>
    </div>
  );
}
