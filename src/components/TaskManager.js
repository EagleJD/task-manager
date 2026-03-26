'use client';

import React, { useState, useEffect } from 'react';
import { Trash2, Loader2, Plus, Check } from 'lucide-react';

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
        throw new Error(data.error || 'Failed to connect to database.');
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
      <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-muted)' }}>
        <Loader2 size={40} style={{ margin: '0 auto', animation: 'spin 1s linear infinite', color: 'var(--pastel-blue)' }} />
        <p style={{ marginTop: '1.5rem', fontSize: '1.1rem', fontWeight: 500 }}>Loading tasks...</p>
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div>
      <form onSubmit={addTask} className="pinned-panel" style={{ padding: '2.5rem', marginBottom: '3.5rem' }}>
        <div className="pin blue" style={{ top: '-8px', left: '-8px' }}></div>
        <div className="pin purple" style={{ top: '-8px', right: '-8px' }}></div>
        <div className="pin yellow" style={{ bottom: '-8px', left: '-8px' }}></div>
        <div className="pin pink" style={{ bottom: '-8px', right: '-8px' }}></div>

        {errorMsg && (
          <div style={{ padding: '1rem', marginBottom: '1.5rem', background: '#fef2f2', color: '#b91c1c', border: '1px solid #fca5a5', borderRadius: '8px', fontSize: '0.95rem' }}>
            <strong>Error:</strong> {errorMsg}
          </div>
        )}
        
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
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
            className="input-field select-field" style={{ flex: 1, minWidth: '140px', cursor: 'pointer' }}
            value={category} onChange={e => setCategory(e.target.value)}
          >
            <option value="Work">Corporate</option>
            <option value="Personal">Personal</option>
            <option value="Study">Study</option>
          </select>
          
          <select 
            className="input-field select-field" style={{ flex: 1, minWidth: '140px', cursor: 'pointer' }}
            value={priority} onChange={e => setPriority(e.target.value)}
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
          
          <button type="submit" className="btn-primary" disabled={!text.trim() || submitting} style={{ flex: 1, minWidth: '160px' }}>
            {submitting ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <Plus size={20} />}
            Add Task
          </button>
        </div>
      </form>

      <div className="tasks-container">
        {tasks.length === 0 ? (
          <div className="pinned-panel animate-in" style={{ padding: '5rem 2rem', textAlign: 'center' }}>
            <div className="pin blue" style={{ top: '-8px', left: '50%', transform: 'translateX(-50%)' }}></div>
            <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>📝</div>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>No tasks found</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Pin your first task to the board.</p>
          </div>
        ) : (
          tasks.map((task, idx) => (
            <div 
              key={task.id} 
              className={`pinned-panel task-item animate-item ${task.completed ? 'completed' : ''}`}
              style={{ animationDelay: `${Math.min(idx * 0.05, 0.5)}s`, borderLeftColor: task.priority === 'high' ? 'var(--danger)' : task.priority === 'low' ? 'var(--success)' : 'var(--pastel-blue)' }}
            >
              <div className="pin yellow" style={{ top: '-8px', left: '15px' }}></div>
              <div className="pin pink" style={{ top: '-8px', right: '15px' }}></div>

              <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginTop: '0.5rem' }}>
                <div 
                  className={`status-circle ${task.completed ? 'active' : ''}`} 
                  onClick={() => toggleTask(task.id, task.completed)}
                >
                  {task.completed && <Check size={14} color="#fff" strokeWidth={3} />}
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1, marginLeft: '1.25rem' }}>
                  <span className="task-text">{task.text}</span>
                  
                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <span className="badge category">
                      {task.category}
                    </span>
                    <span className={`badge priority-${task.priority}`}>
                      {task.priority === 'high' ? 'High' : task.priority === 'medium' ? 'Medium' : 'Low'}
                    </span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500, marginLeft: 'auto' }}>
                      {new Date(task.created_at || Date.now()).toLocaleDateString()} {new Date(task.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
