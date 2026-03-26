'use client';

import { useEffect, useState } from 'react';
import { Trash2, Loader2, Plus, Check, Calendar, X } from 'lucide-react';
import {
  CATEGORY_LABELS,
  PRIORITY_LABELS,
  TASK_CATEGORIES,
  normalizeCategory,
} from '@/lib/taskOptions';

const DEFAULT_CATEGORY = TASK_CATEGORIES[0].value;
const EMPTY_TASK_MESSAGE = '아직 적어둔 일이 없어요. 첫 태스크를 남겨보세요.';

function formatDatetimeForInput(isoString) {
  if (!isoString) return '';

  const date = new Date(isoString);
  const offset = date.getTimezoneOffset() * 60000;

  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

function formatDueDate(isoString) {
  if (!isoString) return '기한 설정';

  return new Date(isoString).toLocaleString('ko-KR', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function normalizeTask(task) {
  return {
    ...task,
    category: normalizeCategory(task.category),
  };
}

export default function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState('');
  const [category, setCategory] = useState(DEFAULT_CATEGORY);
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

  async function fetchTasks() {
    try {
      const res = await fetch('/api/tasks');
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || '데이터베이스에 연결하지 못했습니다.');
      }

      setTasks(Array.isArray(data) ? data.map(normalizeTask) : []);
      setErrorMsg(null);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function addTask(event) {
    event.preventDefault();
    if (!text.trim()) return;

    setSubmitting(true);
    const isoDueDate = dueDate ? new Date(dueDate).toISOString() : null;

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: text.trim(),
          category,
          priority,
          due_date: isoDueDate,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || '태스크를 저장하지 못했습니다.');
      }

      setTasks((prev) => [normalizeTask(data), ...prev]);
      setText('');
      setDueDate('');
      setCategory(DEFAULT_CATEGORY);
      setPriority('medium');
      setErrorMsg(null);
    } catch (err) {
      console.error('Failed to add task:', err);
      setErrorMsg(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleTask(id, currentStatus) {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );

    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !currentStatus }),
      });

      if (!res.ok) {
        throw new Error('완료 상태를 바꾸지 못했습니다.');
      }

      setErrorMsg(null);
    } catch (err) {
      setErrorMsg(err.message);
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id ? { ...task, completed: currentStatus } : task
        )
      );
    }
  }

  async function updateDueDate(id, newDueDate) {
    const isoDueDate = newDueDate ? new Date(newDueDate).toISOString() : null;
    const backup = [...tasks];

    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, due_date: isoDueDate } : task
      )
    );
    setEditingDueDateId(null);

    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ due_date: isoDueDate }),
      });

      if (!res.ok) {
        throw new Error('기한을 업데이트하지 못했습니다.');
      }

      setErrorMsg(null);
    } catch (err) {
      setErrorMsg(err.message);
      setTasks(backup);
    }
  }

  async function deleteTask(id) {
    const backup = [...tasks];
    setTasks((prev) => prev.filter((task) => task.id !== id));

    try {
      const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });

      if (!res.ok) {
        throw new Error('태스크를 삭제하지 못했습니다.');
      }

      setErrorMsg(null);
    } catch (err) {
      setErrorMsg(err.message);
      setTasks(backup);
    }
  }

  const sortedTasks = [...tasks].sort((a, b) => {
    const aHasDue = Boolean(a.due_date);
    const bHasDue = Boolean(b.due_date);

    if (aHasDue && bHasDue) {
      return new Date(a.due_date) - new Date(b.due_date);
    }

    if (aHasDue && !bHasDue) return -1;
    if (!aHasDue && bHasDue) return 1;

    return new Date(b.created_at) - new Date(a.created_at);
  });

  const columns = [
    { key: 'high', title: '긴급', color: 'var(--danger)' },
    { key: 'medium', title: '보통', color: '#9070c8' },
    { key: 'low', title: '여유', color: 'var(--success)' },
  ];

  function renderTaskItem(task, idx) {
    const overdue = task.due_date && new Date(task.due_date) < new Date();

    return (
      <div
        key={task.id}
        className={`pinned-panel task-item animate-item ${task.completed ? 'completed' : ''}`}
        style={{
          animationDelay: `${Math.min(idx * 0.05, 0.5)}s`,
          borderLeftColor:
            task.priority === 'high'
              ? 'var(--danger)'
              : task.priority === 'low'
                ? 'var(--success)'
                : 'var(--pastel-purple)',
          marginBottom: 0,
        }}
      >
        <div className="pin yellow" style={{ top: '-8px', left: '15px' }}></div>
        <div className="pin pink" style={{ top: '-8px', right: '15px' }}></div>

        <div style={{ display: 'flex', alignItems: 'flex-start', width: '100%', marginTop: '0.5rem' }}>
          <button
            type="button"
            className={`status-circle ${task.completed ? 'active' : ''}`}
            onClick={() => toggleTask(task.id, task.completed)}
            style={{ marginTop: '0.2rem' }}
            aria-label={task.completed ? '태스크 미완료로 변경' : '태스크 완료로 변경'}
          >
            {task.completed && <Check size={14} color="#fff" strokeWidth={3} />}
          </button>

          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, marginLeft: '1rem' }}>
            <span className="task-text">{task.text}</span>

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <span className="badge category" style={{ fontSize: '0.7rem', padding: '0.2rem 0.4rem' }}>
                {CATEGORY_LABELS[normalizeCategory(task.category)]}
              </span>
              <span className={`badge priority-${task.priority}`}>
                {PRIORITY_LABELS[task.priority]}
              </span>

              <span
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  marginLeft: 'auto',
                }}
              >
                {editingDueDateId === task.id ? (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      background: '#fff9fb',
                      padding: '0.2rem 0.4rem',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                    }}
                  >
                    <input
                      type="datetime-local"
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-main)',
                        outline: 'none',
                        fontSize: '0.75rem',
                        colorScheme: 'light',
                      }}
                      value={editingDueDateVal}
                      onChange={(event) => setEditingDueDateVal(event.target.value)}
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        updateDueDate(task.id, editingDueDateVal || null);
                      }}
                      style={{
                        background: 'rgba(255, 179, 198, 0.15)',
                        color: '#c05888',
                        border: '1px solid rgba(255, 179, 198, 0.4)',
                        borderRadius: '6px',
                        padding: '0.2rem 0.5rem',
                        cursor: 'pointer',
                        fontSize: '0.7rem',
                        fontWeight: 'bold',
                        fontFamily: 'inherit',
                      }}
                    >
                      저장
                    </button>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        setEditingDueDateId(null);
                        setEditingDueDateVal('');
                      }}
                      style={{
                        background: 'transparent',
                        color: 'var(--danger)',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                      }}
                      aria-label="기한 편집 취소"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      setEditingDueDateId(task.id);
                      setEditingDueDateVal(task.due_date ? formatDatetimeForInput(task.due_date) : '');
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      cursor: 'pointer',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '8px',
                      background: task.due_date
                        ? overdue
                          ? 'rgba(255, 112, 150, 0.1)'
                          : 'rgba(255, 179, 198, 0.12)'
                        : 'transparent',
                      color: task.due_date
                        ? overdue
                          ? 'var(--danger)'
                          : '#c05888'
                        : 'var(--text-muted)',
                      border: '1px solid transparent',
                      transition: 'all 0.2s',
                      font: 'inherit',
                    }}
                    title="클릭해서 기한 수정"
                  >
                    <Calendar size={12} />
                    <span>{formatDueDate(task.due_date)}</span>
                  </button>
                )}
              </span>
            </div>
          </div>

          <button
            type="button"
            className="btn-icon danger"
            onClick={() => deleteTask(task.id)}
            aria-label="태스크 삭제"
            style={{ marginLeft: '0.5rem', padding: '0.4rem' }}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-muted)' }}>
        <Loader2
          size={40}
          style={{ margin: '0 auto', animation: 'spin 1s linear infinite', color: 'var(--pastel-pink)' }}
        />
        <p style={{ marginTop: '1.5rem', fontSize: '1.1rem', fontWeight: 500 }}>
          다이어리를 불러오는 중이에요.
        </p>
        <style>{'@keyframes spin { 100% { transform: rotate(360deg); } }'}</style>
      </div>
    );
  }

  return (
    <div>
      <form
        onSubmit={addTask}
        className="pinned-panel"
        style={{ padding: '2rem', marginBottom: '2.5rem', maxWidth: '800px', margin: '0 auto 2.5rem auto' }}
      >
        <div className="pin blue" style={{ top: '-8px', left: '-8px' }}></div>
        <div className="pin purple" style={{ top: '-8px', right: '-8px' }}></div>
        <div className="pin yellow" style={{ bottom: '-8px', left: '-8px' }}></div>
        <div className="pin pink" style={{ bottom: '-8px', right: '-8px' }}></div>

        {errorMsg && (
          <div
            style={{
              padding: '1rem',
              marginBottom: '1.5rem',
              background: 'rgba(255, 112, 150, 0.08)',
              color: 'var(--danger)',
              border: '1.5px solid rgba(255, 112, 150, 0.25)',
              borderRadius: '12px',
              fontSize: '0.95rem',
            }}
          >
            <strong>앗, 문제가 생겼어요.</strong> {errorMsg}
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <input
            type="text"
            className="input-field"
            placeholder="오늘 해야 할 일을 적어보세요"
            value={text}
            onChange={(event) => setText(event.target.value)}
            disabled={submitting}
            autoFocus
          />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, position: 'relative', minWidth: '160px' }}>
            <Calendar size={16} color="var(--pastel-pink)" style={{ position: 'absolute', left: '12px', top: '15px' }} />
            <input
              type="datetime-local"
              className="input-field select-field"
              style={{ paddingLeft: '2.5rem', cursor: 'pointer' }}
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
            />
          </div>

          <select
            className="input-field select-field"
            style={{ flex: 1, minWidth: '110px', cursor: 'pointer' }}
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            {TASK_CATEGORIES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>

          <select
            className="input-field select-field"
            style={{ flex: 1, minWidth: '100px', cursor: 'pointer' }}
            value={priority}
            onChange={(event) => setPriority(event.target.value)}
          >
            {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="btn-primary"
            disabled={!text.trim() || submitting}
            style={{ flex: 1, minWidth: '120px' }}
          >
            {submitting ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <Plus size={20} />}
            태스크 추가
          </button>
        </div>
      </form>

      {tasks.length === 0 ? (
        <div
          className="pinned-panel animate-in"
          style={{ padding: '5rem 2rem', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}
        >
          <div className="pin blue" style={{ top: '-8px', left: '50%', transform: 'translateX(-50%)' }}></div>
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>📔</div>
          <h3 style={{ fontSize: '1.5rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
            오늘의 첫 페이지를 열어볼까요?
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>{EMPTY_TASK_MESSAGE}</p>
        </div>
      ) : (
        <div className="kanban-board">
          {columns.map((column) => {
            const columnTasks = sortedTasks.filter((task) => task.priority === column.key);

            return (
              <div key={column.key} className="kanban-col-wrapper">
                <div className="col-header" style={{ color: column.color }}>
                  {column.title}
                  <span>{columnTasks.length}</span>
                </div>
                <div className="kanban-col">{columnTasks.map((task, idx) => renderTaskItem(task, idx))}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
