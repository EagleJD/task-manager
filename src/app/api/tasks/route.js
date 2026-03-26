import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';
import { normalizeCategory } from '@/lib/taskOptions';

export const dynamic = 'force-dynamic';
const DATABASE_ERROR_MESSAGE =
  'DATABASE_URL 또는 POSTGRES_URL 환경변수가 설정되지 않았습니다. .env.local에 Neon 연결 문자열을 추가해 주세요.';

function shapeTask(task) {
  return {
    ...task,
    category: normalizeCategory(task.category),
  };
}

function getSql() {
  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

  if (!connectionString) {
    return null;
  }

  return neon(connectionString);
}

export async function GET() {
  try {
    const sql = getSql();

    if (!sql) {
      return NextResponse.json({ error: DATABASE_ERROR_MESSAGE }, { status: 503 });
    }

    await sql`ALTER TABLE tasks ADD COLUMN IF NOT EXISTS due_date TIMESTAMP WITH TIME ZONE;`;
    const rows = await sql`SELECT * FROM tasks ORDER BY position ASC, created_at DESC`;
    return NextResponse.json(rows.map(shapeTask));
  } catch (error) {
    if (error.message.includes('relation "tasks" does not exist') || error.message.includes('tasks" does not exist')) {
      const sql = getSql();

      if (!sql) {
        return NextResponse.json({ error: DATABASE_ERROR_MESSAGE }, { status: 503 });
      }

      await sql`
        CREATE TABLE IF NOT EXISTS tasks (
          id SERIAL PRIMARY KEY,
          text TEXT NOT NULL,
          completed BOOLEAN NOT NULL DEFAULT FALSE,
          category VARCHAR(50) NOT NULL,
          priority VARCHAR(20) NOT NULL,
          position INTEGER NOT NULL DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          due_date TIMESTAMP WITH TIME ZONE
        );
      `;
      return NextResponse.json([]);
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const sql = getSql();

    if (!sql) {
      return NextResponse.json({ error: DATABASE_ERROR_MESSAGE }, { status: 503 });
    }

    const { text, category, priority, due_date } = await request.json();
    const normalizedCategory = normalizeCategory(category);
    const rows = await sql`
      INSERT INTO tasks (text, category, priority, completed, position, due_date)
      VALUES (${text}, ${normalizedCategory}, ${priority}, false, 0, ${due_date || null})
      RETURNING *
    `;
    return NextResponse.json(shapeTask(rows[0]));
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
