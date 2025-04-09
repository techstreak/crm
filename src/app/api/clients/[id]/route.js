import pool from '@/utils/db';
import { NextResponse } from 'next/server';

// GET client by ID
export async function GET(req, { params }) {
  const result = await pool.query('SELECT * FROM records WHERE id = $1', [params.id]);
  return NextResponse.json(result.rows[0]);
}

// UPDATE client
export async function PUT(req, { params }) {
  const body = await req.json();
  const keys = Object.keys(body);
  const values = Object.values(body);

  const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');
  const query = `UPDATE records SET ${setClause} WHERE id = $${keys.length + 1}`;
  await pool.query(query, [...values, params.id]);

  return NextResponse.json({ success: true });
}
