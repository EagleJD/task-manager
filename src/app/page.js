import TaskManager from '@/components/TaskManager';

export const metadata = {
  title: 'NeonTasks - Global Cyberpunk Task Matrix',
  description: 'A beautiful collaborative task manager powered by Next.js and Neon Postgres.',
};

export default function Home() {
  return (
    <div className="container animate-in">
      <header style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <h1 className="gradient-text glow-text" style={{ fontSize: '4rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
          NEON TASKS ⚡
        </h1>
        <p style={{ color: 'var(--neon-primary)', fontSize: '1.2rem', letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.8, fontWeight: 500 }}>
          Cyberpunk Collaborative Matrix
        </p>
      </header>
      <main>
        <TaskManager />
      </main>
    </div>
  );
}
