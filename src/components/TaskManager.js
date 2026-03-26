'use client';

import React, { useState, useEffect } from 'react';
import { Trash2, Loader2, Plus, Check, Calendar, X } from 'lucide-react';

export default function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState('');
  const [category, setCategory] = useState('Work');
  const [priority, setPriority] = useState('medium');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [dueDate, setDueDate] = useState('');
  const [editingDueDateId, setEditingDueDateId] = useState(null);
  const [editingDueDateVal, setEditingDueDateVal] = useState('');

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
    const isoDueDate = dueDate ? new Date(dueDate).toISOString() : null;
    // Remove optimistic update to prevent double-popup animation on server response
    // const newTask = { id: tempId, text, category, priority, due_date: isoDueDate, completed: false, created_at: new Date().toISOString() };
    // setTasks(prev => [newTask, ...prev]);

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, category, priority, due_date: isoDueDate })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'API failed to save task');
      // Append exactly what server returns to trigger exactly one animation
      setTasks(prev => [data, ...prev]);
      setText('');
      setErrorMsg(null);
    } catch (err) {
      console.error('Failed to add task:', err);
      setErrorMsg(err.message);
      // setTasks(prev => prev.filter(t => t.id !== tempId));
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

  const updateDueDate = async (id, newDueDate) => {
    const isoDueDate = newDueDate ? new Date(newDueDate).toISOString() : null;
    const backup = [...tasks];
    setTasks(prev => prev.map(t => t.id === id ? { ...t, due_date: isoDueDate } : t));
    setEditingDueDateId(null);
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ due_date: isoDueDate })
      });
      if (!res.ok) throw new Error('API failed to update due date');
    } catch (err) {
      setErrorMsg(err.message);
      setTasks(backup);
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
        <Loader2 size={40} style={{ margin: '0 auto', animation: 'spin 1s linear infinite', color: 'var(--pastel-pink)' }} />
        <p style={{ marginTop: '1.5rem', fontSize: '1.1rem', fontWeight: 500 }}>불러오는 중... 🌸</p>
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const formatDatetimeForInput = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const offset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - offset).toISOString().slice(0, 16);
  };

  // Hybrid Sorting Logic
  const sortedTasks = [...tasks].sort((a, b) => {
    const aHasDue = !!a.due_date;
    const bHasDue = !!b.due_date;

    if (aHasDue && bHasDue) {
      return new Date(a.due_date) - new Date(b.due_date);
    } else if (aHasDue && !bHasDue) {
      return -1;
    } else if (!aHasDue && bHasDue) {
      return 1;
    } else {
      return new Date(b.created_at) - new Date(a.created_at);
    }
  });

  const highTasks = sortedTasks.filter(t => t.priority === 'high');
  const mediumTasks = sortedTasks.filter(t => t.priority === 'medium');
  const lowTasks = sortedTasks.filter(t => t.priority === 'low');

  const renderTaskItem = (task, idx) => (
    <div 
      key={task.id} 
      className={`pinned-panel task-item animate-item ${task.completed ? 'completed' : ''}`}
      style={{ animationDelay: `${Math.min(idx * 0.05, 0.5)}s`, borderLeftColor: task.priority === 'high' ? 'var(--danger)' : task.priority === 'low' ? 'var(--success)' : 'var(--pastel-purple)', marginBottom: 0 }}
    >
      <div className="pin yellow" style={{ top: '-8px', left: '15px' }}></div>
      <div className="pin pink" style={{ top: '-8px', right: '15px' }}></div>

      <div style={{ display: 'flex', alignItems: 'flex-start', width: '100%', marginTop: '0.5rem' }}>
        <div 
          className={`status-circle ${task.completed ? 'active' : ''}`} 
          onClick={() => toggleTask(task.id, task.completed)}
          style={{ marginTop: '0.2rem' }}
        >
          {task.completed && <Check size={14} color="#fff" strokeWidth={3} />}
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, marginLeft: '1rem' }}>
          <span className="task-text">{task.text}</span>
          
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <span className="badge category" style={{ fontSize: '0.7rem', padding: '0.2rem 0.4rem' }}>
              {task.category}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.4rem', marginLeft: 'auto' }}>
              {editingDueDateId === task.id ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#fff9fb', padding: '0.2rem 0.4rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <input type="datetime-local" style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', outline: 'none', fontSize: '0.75rem', colorScheme: 'light' }} value={editingDueDateVal} onChange={(e) => setEditingDueDateVal(e.target.value)} autoFocus />
                  <button onClick={(e) => { e.stopPropagation(); updateDueDate(task.id, editingDueDateVal || null); }} style={{ background: 'rgba(255, 179, 198, 0.15)', color: '#c05888', border: '1px solid rgba(255, 179, 198, 0.4)', borderRadius: '6px', padding: '0.2rem 0.5rem', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 'bold', fontFamily: 'inherit' }}>저장 ✓</button>
                  <button onClick={(e) => { e.stopPropagation(); setEditingDueDateId(null); setEditingDueDateVal(''); }} style={{ background: 'transparent', color: 'var(--danger)', border: 'none', cursor: 'pointer', display: 'flex' }}><X size={12} /></button>
                </div>
              ) : (
                <div 
                  onClick={(e) => { e.stopPropagation(); setEditingDueDateId(task.id); setEditingDueDateVal(task.due_date ? formatDatetimeForInput(task.due_date) : ''); }} 
                  style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer', padding: '0.2rem 0.5rem', borderRadius: '8px', background: task.due_date ? (new Date(task.due_date) < new Date() ? 'rgba(255, 112, 150, 0.1)' : 'rgba(255, 179, 198, 0.12)') : 'transparent', color: task.due_date ? (new Date(task.due_date) < new Date() ? 'var(--danger)' : '#c05888') : 'var(--text-muted)', border: '1px solid transparent', transition: 'all 0.2s' }}
                  title="クリックして期限を編集"
                  onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 179, 198, 0.18)'}
                  onMouseOut={(e) => e.currentTarget.style.background = task.due_date ? (new Date(task.due_date) < new Date() ? 'rgba(255, 112, 150, 0.1)' : 'rgba(255, 179, 198, 0.12)') : 'transparent'}
                >
                  <Calendar size={12} />
                  <span>{task.due_date ? `${new Date(task.due_date).toLocaleString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}` : '기한 설정 🗓️'}</span>
                </div>
              )}
            </span>
          </div>
        </div>

        <button 
          className="btn-icon danger" 
          onClick={() => deleteTask(task.id)}
          aria-label="Delete Task"
          style={{ marginLeft: '0.5rem', padding: '0.4rem' }}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );

  return (
    <div>
      <form onSubmit={addTask} className="pinned-panel" style={{ padding: '2rem', marginBottom: '2.5rem', maxWidth: '800px', margin: '0 auto 2.5rem auto' }}>
        <div className="pin blue" style={{ top: '-8px', left: '-8px' }}></div>
        <div className="pin purple" style={{ top: '-8px', right: '-8px' }}></div>
        <div className="pin yellow" style={{ bottom: '-8px', left: '-8px' }}></div>
        <div className="pin pink" style={{ bottom: '-8px', right: '-8px' }}></div>

        {errorMsg && (
          <div style={{ padding: '1rem', marginBottom: '1.5rem', background: 'rgba(255, 112, 150, 0.08)', color: 'var(--danger)', border: '1.5px solid rgba(255, 112, 150, 0.25)', borderRadius: '12px', fontSize: '0.95rem' }}>
            <strong>앗, 오류가 났어요 🙈</strong>　{errorMsg}
          </div>
        )}
        
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <input
            type="text"
            className="input-field"
            placeholder="오늘 할 일... 🌸"
            value={text}
            onChange={e => setText(e.target.value)}
            disabled={submitting}
            autoFocus
          />
        </div>
        
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, position: 'relative', minWidth: '160px' }}>
            <Calendar size={16} color="var(--pastel-pink)" style={{ position: 'absolute', left: '12px', top: '15px' }} />
            <input type="datetime-local" className="input-field select-field" style={{ paddingLeft: '2.5rem', cursor: 'pointer' }} value={dueDate} onChange={e => setDueDate(e.target.value)} />
          </div>
          <select 
            className="input-field select-field" style={{ flex: 1, minWidth: '90px', cursor: 'pointer' }}
            value={category} onChange={e => setCategory(e.target.value)}
          >
            <option value="Work">💼 업무</option>
            <option value="Personal">🌷 개인</option>
            <option value="Study">📚 공부</option>
          </select>
          
          <select 
            className="input-field select-field" style={{ flex: 1, minWidth: '90px', cursor: 'pointer' }}
            value={priority} onChange={e => setPriority(e.target.value)}
          >
            <option value="low">🍀 여유</option>
            <option value="medium">✨ 보통</option>
            <option value="high">🌸 급해요!</option>
          </select>
          
          <button type="submit" className="btn-primary" disabled={!text.trim() || submitting} style={{ flex: 1, minWidth: '100px' }}>
            {submitting ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <Plus size={20} />}
            추가하기 ✨
          </button>
        </div>
      </form>

      {tasks.length === 0 ? (
        <div className="pinned-panel animate-in" style={{ padding: '5rem 2rem', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
          <div className="pin blue" style={{ top: '-8px', left: '50%', transform: 'translateX(-50%)' }}></div>
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🌸</div>
          <h3 style={{ fontSize: '1.5rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>아직 할 일이 없어요 (´･ω･`)</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>첫 번째 할 일을 추가해봐요! ✨</p>
        </div>
      ) : (
        <div className="kanban-board">
          <div className="kanban-col-wrapper">
            <div className="col-header" style={{ color: 'var(--danger)' }}>🌸 급해요! <span>{highTasks.length}</span></div>
            <div className="kanban-col">{highTasks.map((task, idx) => renderTaskItem(task, idx))}</div>
          </div>

          <div className="kanban-col-wrapper">
            <div className="col-header" style={{ color: '#9070c8' }}>✨ 보통 <span>{mediumTasks.length}</span></div>
            <div className="kanban-col">{mediumTasks.map((task, idx) => renderTaskItem(task, idx))}</div>
          </div>

          <div className="kanban-col-wrapper">
            <div className="col-header" style={{ color: 'var(--success)' }}>🍀 여유 <span>{lowTasks.length}</span></div>
            <div className="kanban-col">{lowTasks.map((task, idx) => renderTaskItem(task, idx))}</div>
          </div>
        </div>
      )}
    </div>
  );
}
