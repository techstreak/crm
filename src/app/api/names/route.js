import { Pool } from 'pg';

const pool = new Pool();

export async function GET() {
  try {
    const result = await pool.query('SELECT * FROM records');
    return new Response(JSON.stringify(result.rows), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Database error' }), {
      status: 500,
    });
  }
}
//src/app/api/records/route.js