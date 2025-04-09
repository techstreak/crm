import { NextResponse } from 'next/server';
import pool from '@/utils/db';

export async function POST(req) {
  const { id } = await req.json();

  await pool.query(`DELETE FROM records WHERE id = $1`, [id]);

  return NextResponse.json({ status: 'deleted' });
}
