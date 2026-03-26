'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle, Circle, Loader2 } from 'lucide-react';

export default function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState('');
  const [category, setCategory] = useState('Work');
  const [priority, setPriority] = useState('medium');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/tasks');
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch API tasks. Check Vercel Postgres DB Connection!');
      }
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch:', err);
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    
    setSubmitting(true);
    const tempId = Date.now();
    const newTask = { id: tempId, text, category, priority, completed: false };
    
    // Optimistic UI Update
    setTasks(prev => [newTask, ...prev]);

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, category, priority })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'API failed to save task');
      
      // Replace optimistic task with DB master record
      setTasks(prev => prev.map(t => t.id === tempId ? data : t));
      setText('');
      setErrorMsg(null);
    } catch (err) {
      console.error('Failed to add task:', err);
      setErrorMsg(err.message);
      // Revert optimistic update on failure
      setTasks(prev => prev.filter(t => t.id !== tempId));
    } finally {
      setSubmitting(false);
    }
  };

  const toggleTask = async (id, currentStatus) => {
    // Optimistic toggle
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !currentStatus })
      });
      if (!res.ok) throw new Error('API failed to toggle');
      setErrorMsg(null);
    } catch (err) {
      setErrorMsg(err.message);
      // Revert on error
      setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: currentStatus } : t));
    }
  };

  const deleteTask = async (id) => {
    const backup = [...tasks];
    // Optimistic delete
    setTasks(prev => prev.filter(t => t.id !== id));
    try {
      const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('API failed to delete');
      setErrorMsg(null);
    } catch (err) {
      setErrorMsg(err.message);
      setTasks(backup);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
        <Loader2 size={36} style={{ margin: '0 auto', animation: 'spin 1s linear infinite' }} />
        <p style={{ marginTop: '1.5rem', fontWeight: 500, letterSpacing: '0.02em' }}>Loading Global Tasks...</p>
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div>
      <form onSubmit={addTask} className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        {errorMsg && (
          <div style={{ padding: '0.75rem', marginBottom: '1rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', border: '1px solid var(--danger)', borderRadius: '8px', fontSize: '0.9rem' }}>
            <strong>Connection Error:</strong> {errorMsg}
          </div>
        )}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <input
            type="text"
            className="input-field"
            placeholder="What needs to be done?"
            value={text}
            onChange={e => setText(e.target.value)}
            disabled={submitting}
            autoFocus
          />
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <select 
            className="input-field" style={{ flex: 1, minWidth: '140px', cursor: 'pointer' }}
            value={category} onChange={e => setCategory(e.target.value)}
          >
            <option value="Work">💼 Work</option>
            <option value="Personal">🏠 Personal</option>
            <option value="Study">📚 Study</option>
          </select>
          <select 
            className="input-field" style={{ flex: 1, minWidth: '140px', cursor: 'pointer' }}
            value={priority} onChange={e => setPriority(e.target.value)}
          >
            <option value="low">🌱 Low Priority</option>
            <option value="medium">⚡ Medium</option>
            <option value="high">🔥 High Priority</option>
          </select>
          <button type="submit" className="btn-primary" disabled={!text.trim() || submitting} style={{ flex: 1, minWidth: '160px' }}>
            {submitting ? <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> : <Plus size={20} />}
            Add Task
          </button>
        </div>
      </form>

      <div className="tasks-container">
        {tasks.length === 0 ? (
          <div className="glass-panel animate-in" style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>No tasks found</h3>
            <p>Create a task above, and it will be saved to the database for everyone to see!</p>
          </div>
        ) : (
          tasks.map((task, idx) => (
            <div 
              key={task.id} 
              className={`glass-panel task-item animate-item ${task.completed ? 'completed' : ''}`}
              style={{ animationDelay: `${Math.min(idx * 0.05, 0.5)}s` }}
            >
              <button 
                className="btn-icon" 
                onClick={() => toggleTask(task.id, task.completed)}
              >
                {task.completed ? <CheckCircle size={24} color="var(--success)" strokeWidth={2.5} /> : <Circle size={24} strokeWidth={2} />}
              </button>
              
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                <span className="task-text">{task.text}</span>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.4rem', alignItems: 'center' }}>
                  <span className="badge" style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'var(--text-main)' }}>
                    {task.category}
                  </span>
                  <span className={`badge priority-${task.priority}`}>
                    {task.priority === 'high' ? '🔥 High' : task.priority === 'medium' ? '⚡ Med' : '🌱 Low'}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    ⏱ {new Date(task.created_at || Date.now()).toLocaleString()}
                  </span>
                </div>
              </div>

              <button 
                className="btn-icon danger" 
                onClick={() => deleteTask(task.id)}
                aria-label="Delete Task"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
