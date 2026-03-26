import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const { completed } = await request.json();
    const { rows } = await sql`
      UPDATE tasks
      SET completed = ${completed}
      WHERE id = ${id}
      RETURNING *
    `;
    return NextResponse.json(rows[0]);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    await sql`DELETE FROM tasks WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
