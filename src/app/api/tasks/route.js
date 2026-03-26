import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { rows } = await sql`SELECT * FROM tasks ORDER BY position ASC, created_at DESC`;
    return NextResponse.json(rows);
  } catch (error) {
    // If the table doesn't exist yet, create it automatically
    if (error.message.includes('relation "tasks" does not exist') || error.message.includes('tasks" does not exist')) {
      await sql`
        CREATE TABLE IF NOT EXISTS tasks (
          id SERIAL PRIMARY KEY,
          text TEXT NOT NULL,
          completed BOOLEAN NOT NULL DEFAULT FALSE,
          category VARCHAR(50) NOT NULL,
          priority VARCHAR(20) NOT NULL,
          position INTEGER NOT NULL DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `;
      return NextResponse.json([]);
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { text, category, priority } = await request.json();
    const { rows } = await sql`
      INSERT INTO tasks (text, category, priority, completed, position)
      VALUES (${text}, ${category}, ${priority}, false, 0)
      RETURNING *
    `;
    return NextResponse.json(rows[0]);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
