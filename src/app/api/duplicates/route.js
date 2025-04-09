import { NextResponse } from 'next/server';
import pool from '@/utils/db';

export async function GET() {
  try {
    const query = `
      SELECT *
      FROM records
      WHERE (name, type_of_work, reference_through) IN (
        SELECT name, type_of_work, reference_through
        FROM records
        GROUP BY name, type_of_work, reference_through
        HAVING COUNT(*) > 1
      )
      ORDER BY name, type_of_work, dop DESC;
    `;
    const result = await pool.query(query);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('GET /api/duplicates error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
