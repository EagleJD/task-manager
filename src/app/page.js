import TaskManager from '@/components/TaskManager';

export const metadata = {
  title: 'NeonTasks - Pinned Collaborative Matrix',
  description: 'A beautiful collaborative task manager powered by Next.js and Neon Postgres.',
};

export default function Home() {
  return (
    <div className="container animate-in">
      {/* Header Panel with Pins */}
      <header className="pinned-panel" style={{ textAlign: 'center', marginBottom: '4rem', padding: '1.5rem', maxWidth: '600px', margin: '0 auto 4rem auto' }}>
        {/* Pins */}
        <div className="pin cyan" style={{ top: '-10px', left: '40%' }}></div>
        <div className="pin purple" style={{ top: '-15px', right: '40%' }}></div>
        
        <h1 style={{ fontSize: '3.5rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.2rem', textTransform: 'uppercase' }}>
          <span style={{ color: 'var(--neon-cyan)', textShadow: '0 0 15px rgba(61, 234, 220, 0.5)' }}>NEON</span>
          <span style={{ color: 'var(--text-main)', opacity: 0.9 }}> TASKS </span>
          <span style={{ color: 'var(--neon-purple)', textShadow: '0 0 15px rgba(181, 111, 245, 0.5)' }}>⚡</span>
        </h1>
        <p style={{ color: 'var(--neon-cyan)', fontSize: '0.95rem', letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.9, fontWeight: 500 }}>
          Cyberpunk Collaborative Matrix
        </p>
      </header>
      <main>
        <TaskManager />
      </main>
    </div>
  );
}
