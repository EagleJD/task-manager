import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

const DATABASE_ERROR_MESSAGE =
  'DATABASE_URL 또는 POSTGRES_URL 환경변수가 설정되지 않았습니다. .env.local에 Neon 연결 문자열을 추가해 주세요.';

function getSql() {
  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

  if (!connectionString) {
    return null;
  }

  return neon(connectionString);
}

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const { completed, due_date } = await request.json();
    const sql = getSql();

    if (!sql) {
      return NextResponse.json({ error: DATABASE_ERROR_MESSAGE }, { status: 503 });
    }
    
    let rows;
    if (due_date !== undefined) {
      if (completed !== undefined) {
        rows = await sql`UPDATE tasks SET completed = ${completed}, due_date = ${due_date} WHERE id = ${id} RETURNING *`;
      } else {
        rows = await sql`UPDATE tasks SET due_date = ${due_date} WHERE id = ${id} RETURNING *`;
      }
    } else {
      rows = await sql`UPDATE tasks SET completed = ${completed} WHERE id = ${id} RETURNING *`;
    }
    return NextResponse.json(rows[0]);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const sql = getSql();

    if (!sql) {
      return NextResponse.json({ error: DATABASE_ERROR_MESSAGE }, { status: 503 });
    }

    await sql`DELETE FROM tasks WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
