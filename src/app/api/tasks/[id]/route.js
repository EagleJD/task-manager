import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const { completed, due_date } = await request.json();
    const sql = neon(process.env.DATABASE_URL || process.env.POSTGRES_URL);
    
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
    const sql = neon(process.env.DATABASE_URL || process.env.POSTGRES_URL);
    await sql`DELETE FROM tasks WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
