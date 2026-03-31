'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import TaskManager from './TaskManager';
import { normalizeCategory } from '@/lib/taskOptions';

const BOOKMARKS = [
  { key: 'work',     label: 'WORK',  sublabel: '업무', colorClass: 'blue',   tilt: '-4deg' },
  { key: 'personal', label: '개인',   sublabel: '일상', colorClass: 'pink',   tilt:  '2deg' },
  { key: 'study',    label: '공부',   sublabel: '학습', colorClass: 'yellow', tilt:  '5deg' },
];

export default function DiaryApp() {
  const [tasks,          setTasks]          = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [filterCategory, setFilterCategory] = useState(null); // null = show all

  useEffect(() => {
    fetch('/api/tasks')
      .then((r) => r.json())
      .then((data) => setTasks(Array.isArray(data) ? data : []))
      .catch(() => setTasks([]))
      .finally(() => setLoading(false));
  }, []);

  // Per-category counts for bookmark sublabels
  const counts = BOOKMARKS.reduce((acc, bm) => {
    acc[bm.key] = tasks.filter((t) => normalizeCategory(t.category) === bm.key).length;
    return acc;
  }, {});

  function toggleFilter(key) {
    setFilterCategory((prev) => (prev === key ? null : key));
  }

  return (
    <>
      {/* Bookmark filter tabs */}
      <div className="top-bookmarks" role="group" aria-label="카테고리 필터">
        {BOOKMARKS.map((bm) => (
          <button
            key={bm.key}
            type="button"
            className={`bookmark ${bm.colorClass}${filterCategory === bm.key ? ' active' : ''}`}
            style={{ transform: `rotate(${bm.tilt})` }}
            onClick={() => toggleFilter(bm.key)}
            aria-pressed={filterCategory === bm.key}
          >
            <span className="bookmark-cap" />
            <span className="bookmark-eyelet" />
            <span className="bookmark-label">{bm.label}</span>
            <span className="bookmark-sublabel">{counts[bm.key]}개</span>
          </button>
        ))}
      </div>

      <div className="container animate-in">
        <section className="hero-diary pinned-panel">
          <div className="hero-rings" aria-hidden="true">
            <span /><span /><span /><span /><span />
          </div>
          <div className="pin pink" style={{ top: '-10px', left: '14%' }} />
          <div className="pin blue" style={{ top: '-10px', right: '14%' }} />
          <h1 className="hero-title">
            <Image
              src="/hero-title.png"
              alt="My Task Diary"
              width={1520}
              height={360}
              priority
              style={{ width: '100%', height: 'auto' }}
            />
          </h1>
        </section>

        <main>
          <TaskManager
            tasks={tasks}
            setTasks={setTasks}
            loading={loading}
            filterCategory={filterCategory}
          />
        </main>
      </div>
    </>
  );
}
