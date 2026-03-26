'use client';

import React, { useState, useEffect } from 'react';
import { Trash2, Loader2, Sparkles, Folder, Zap } from 'lucide-react';

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
        throw new Error(data.error || 'Failed to connect to Neon Matrix.');
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
    const newTask = { id: tempId, text, category, priority, completed: false, created_at: new Date().toISOString() };
    
    setTasks(prev => [newTask, ...prev]);

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, category, priority })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'API failed to save task');
      
      setTasks(prev => prev.map(t => t.id === tempId ? data : t));
      setText('');
      setErrorMsg(null);
    } catch (err) {
      console.error('Failed to add task:', err);
      setErrorMsg(err.message);
      setTasks(prev => prev.filter(t => t.id !== tempId));
    } finally {
      setSubmitting(false);
    }
  };

  const toggleTask = async (id, currentStatus) => {
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
      setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: currentStatus } : t));
    }
  };

  const deleteTask = async (id) => {
    const backup = [...tasks];
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
      <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--neon-cyan)' }}>
        <Loader2 size={48} style={{ margin: '0 auto', animation: 'spin 1s linear infinite', filter: 'drop-shadow(0 0 10px rgba(61, 234, 220, 0.8))' }} />
        <p style={{ marginTop: '2rem', fontSize: '1.2rem', fontWeight: 600, letterSpacing: '0.1em', animation: 'pulse 2s infinite' }}>ESTABLISHING NEON LINK...</p>
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } } @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }`}</style>
      </div>
    );
  }

  return (
    <div>
      {/* Input Form Panel */}
      <form onSubmit={addTask} className="pinned-panel" style={{ padding: '2.5rem', marginBottom: '4rem' }}>
        {/* Pins for Input Form */}
        <div className="pin cyan" style={{ top: '-10px', left: '-10px' }}></div>
        <div className="pin purple" style={{ top: '-10px', right: '-10px' }}></div>
        <div className="pin purple" style={{ bottom: '-10px', left: '-10px' }}></div>
        <div className="pin cyan" style={{ bottom: '-10px', right: '-10px' }}></div>

        {errorMsg && (
          <div style={{ padding: '1rem', marginBottom: '1.5rem', background: 'rgba(255, 92, 141, 0.1)', color: 'var(--danger)', border: '1px solid var(--danger)', borderRadius: '6px', fontSize: '0.95rem' }}>
            <strong style={{ letterSpacing: '0.05em' }}>SYSTEM ERROR:</strong> {errorMsg}
          </div>
        )}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <input
            type="text"
            className="input-field"
            placeholder="Initialize new objective..."
            value={text}
            onChange={e => setText(e.target.value)}
            disabled={submitting}
            autoFocus
          />
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Folder size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '16px' }} />
            <select 
              className="input-field select-field" style={{ paddingLeft: '2.5rem', cursor: 'pointer' }}
              value={category} onChange={e => setCategory(e.target.value)}
            >
              <option value="Work">CORPORATE</option>
              <option value="Personal">PERSONAL</option>
              <option value="Study">RESEARCH</option>
            </select>
          </div>
          
          <div style={{ flex: 1, position: 'relative' }}>
            <Zap size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '16px' }} />
            <select 
              className="input-field select-field" style={{ paddingLeft: '2.5rem', cursor: 'pointer' }}
              value={priority} onChange={e => setPriority(e.target.value)}
            >
              <option value="low">LOW YIELD</option>
              <option value="medium">STANDARD</option>
              <option value="high">CRITICAL</option>
            </select>
          </div>
          
          <button type="submit" className="btn-primary" disabled={!text.trim() || submitting} style={{ flex: 1, minWidth: '160px' }}>
            {submitting ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <Sparkles size={18} />}
            EXECUTE
          </button>
        </div>
      </form>

      {/* Task List */}
      <div className="tasks-container">
        {tasks.length === 0 ? (
          <div className="pinned-panel animate-in" style={{ padding: '6rem 2rem', textAlign: 'center' }}>
            <div className="pin cyan" style={{ top: '-10px', left: '50%', transform: 'translateX(-50%)' }}></div>
            <div style={{ fontSize: '4.5rem', marginBottom: '1.5rem', color: 'var(--neon-purple)', textShadow: '0 0 20px rgba(181, 111, 245, 0.4)' }}>✨</div>
            <h3 style={{ fontSize: '1.75rem', color: '#fff', marginBottom: '1rem', letterSpacing: '0.05em' }}>DATABANKS EMPTY</h3>
            <p style={{ opacity: 0.7, fontSize: '1.1rem' }}>Transmit your first objective to the Neon Matrix.</p>
          </div>
        ) : (
          tasks.map((task, idx) => (
            <div 
              key={task.id} 
              className={`pinned-panel task-item animate-item ${task.completed ? 'completed' : ''}`}
              style={{ animationDelay: `${Math.min(idx * 0.05, 0.5)}s` }}
            >
              {/* Task Pins */}
              <div className="pin purple" style={{ top: '-10px', left: '-10px' }}></div>
              <div className="pin cyan" style={{ bottom: '-10px', right: '-10px' }}></div>

              <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <div 
                  className={`status-circle ${task.completed ? 'active' : ''}`} 
                  onClick={() => toggleTask(task.id, task.completed)}
                ></div>
                
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1, marginLeft: '1rem' }}>
                  <span className="task-text">{task.text}</span>
                  
                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.8rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <span className="badge category">
                      {task.category.toUpperCase()}
                    </span>
                    <span className={`badge priority-${task.priority}`}>
                      ⚡ {task.priority === 'high' ? 'CRITICAL' : task.priority === 'medium' ? 'STD' : 'LOW'}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: 'auto', letterSpacing: '0.05em' }}>
                      | {new Date(task.created_at || Date.now()).toLocaleTimeString()} |
                    </span>
                  </div>
                </div>

                <button 
                  className="btn-icon danger" 
                  onClick={() => deleteTask(task.id)}
                  aria-label="Delete Task"
                  style={{ marginLeft: '1rem' }}
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
