import { NextResponse } from 'next/server';
import { normalizeCategory } from '@/lib/taskOptions';
import { getSql, DATABASE_ERROR_MESSAGE } from '@/lib/db';

export const dynamic = 'force-dynamic';

function shapeTask(task) {
  return {
    ...task,
    category: normalizeCategory(task.category),
  };
}

export async function GET() {
  const sql = getSql();
  if (!sql) {
    return NextResponse.json({ error: DATABASE_ERROR_MESSAGE }, { status: 503 });
  }

  try {
    const rows = await sql`SELECT * FROM tasks ORDER BY position ASC, created_at DESC`;
    return NextResponse.json(rows.map(shapeTask));
  } catch (error) {
    if (error.message.includes('relation "tasks" does not exist') || error.message.includes('tasks" does not exist')) {
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
