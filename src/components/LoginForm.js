'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function LoginForm() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const form = new FormData(e.currentTarget);
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: form.get('username'),
        password: form.get('password'),
        rememberMe: form.get('rememberMe') === 'on',
      }),
    });

    const data = await res.json();
    if (res.ok) {
      const params = new URLSearchParams(window.location.search);
      router.push(params.get('from') || '/');
    } else {
      setError(data.error || '로그인에 실패했습니다.');
      setLoading(false);
    }
  }

  return (
    <div className="container animate-in" style={{ maxWidth: 480 }}>
      <section className="hero-diary pinned-panel login-card">
        <div className="hero-rings" aria-hidden="true">
          <span /><span /><span />
        </div>
        <div className="pin pink" style={{ top: '-10px', left: '20%' }} />
        <div className="pin blue" style={{ top: '-10px', right: '20%' }} />

        <p className="hero-kicker">✦ 다이어리 잠금 해제 ✦</p>
        <h1 style={{
          fontFamily: "Gaegu, 'M PLUS Rounded 1c', sans-serif",
          fontSize: 'var(--text-2xl)',
          fontWeight: 800,
          color: 'var(--text-main)',
          marginBottom: 'var(--sp-4)',
          letterSpacing: '0.02em',
        }}>
          My Task Diary
        </h1>

        <form onSubmit={handleSubmit} className="login-form">
          <input
            className="input-field"
            type="text"
            name="username"
            placeholder="사용자 이름"
            required
            autoComplete="username"
            autoFocus
            disabled={loading}
          />
          <input
            className="input-field"
            type="password"
            name="password"
            placeholder="비밀번호"
            required
            autoComplete="current-password"
            disabled={loading}
          />

          <label className="login-remember">
            <input type="checkbox" name="rememberMe" />
            <span>로그인 유지 (30일)</span>
          </label>

          {error && <p className="login-error">{error}</p>}

          <button
            type="submit"
            className="btn-primary task-form-submit"
            disabled={loading}
          >
            {loading
              ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
              : null}
            {loading ? '확인 중…' : '✦ 열기'}
          </button>
        </form>
      </section>
    </div>
  );
}
