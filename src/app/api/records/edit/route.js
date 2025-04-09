import { NextResponse } from 'next/server';
import pool from '@/utils/db';

export async function POST(req) {
  const { id, field, value } = await req.json();

  await pool.query(`UPDATE records SET ${field} = $1 WHERE id = $2`, [value, id]);

  return NextResponse.json({ status: 'updated' });
}
