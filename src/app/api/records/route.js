import { NextResponse } from 'next/server';
import pool from '@/utils/db'; // We'll create this DB connection below

export async function GET() {
  const res = await pool.query('SELECT * FROM records ORDER BY id DESC');
  return NextResponse.json(res.rows);
}

export async function POST(req) {
  const { data } = await req.json();

  for (const row of data) {
    await pool.query(
      `INSERT INTO records 
        (name, type_of_work, reference_through, fee, income_tax_challan, labour_challan, gst_challan, total, paid, due, mode, dop)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
      [
        row.name, row.type_of_work, row.reference_through, row.fee,
        row.income_tax_challan, row.labour_challan, row.gst_challan,
        row.total, row.paid, row.due, row.mode, row.dop
      ]
    );
  }

  return NextResponse.json({ status: 'success' });
}
