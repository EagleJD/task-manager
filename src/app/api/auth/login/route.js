import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { getSql, DATABASE_ERROR_MESSAGE } from '@/lib/db';
import { signToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const sql = getSql();
    if (!sql) {
      return Response.json({ error: DATABASE_ERROR_MESSAGE }, { status: 503 });
    }

    // Ensure users table exists
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    const { username, password, rememberMe } = await request.json();

    if (!username || !password) {
      return Response.json({ error: '사용자 이름과 비밀번호를 입력하세요.' }, { status: 400 });
    }

    const rows = await sql`
      SELECT id, username, password_hash FROM users WHERE username = ${username} LIMIT 1
    `;
    const user = rows[0];

    // Constant-time comparison even when user doesn't exist (timing attack prevention)
    const hashToCompare =
      user?.password_hash ?? '$2a$12$invalidhashfortimingattackprevention00000000000000000000';
    const valid = await bcrypt.compare(password, hashToCompare);

    if (!user || !valid) {
      return Response.json(
        { error: '사용자 이름 또는 비밀번호가 올바르지 않습니다.' },
        { status: 401 }
      );
    }

    const expiresIn = rememberMe ? '30d' : '1d';
    const maxAge = rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60;

    const token = await signToken({ userId: user.id, username: user.username }, expiresIn);

    const cookieStore = await cookies();
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge,
      path: '/',
    });

    return Response.json({ ok: true, username: user.username });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
