import { NextResponse } from 'next/server';
import pool from '@/utils/db';

export async function GET() {
  const res = await pool.query('SELECT * FROM records');
  return NextResponse.json(res.rows);
}

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      name,
      typeOfWork,
      reference,
      fee,
      incomeTaxChallan,
      labourChallan,
      gstChallan,
      total,
      paid,
      due,
      mode,
      dop,
    } = body;

    // Check for existing record (same name and type of work on same date)
    const checkQuery = `
      SELECT * FROM records
      WHERE name = $1 AND type_of_work = $2 AND dop = $3
    `;
    const checkResult = await pool.query(checkQuery, [name, typeOfWork, dop]);

    if (checkResult.rows.length > 0) {
      return NextResponse.json({ error: 'Duplicate entry found.' }, { status: 409 }); // Conflict
    }

    const insertQuery = `
      INSERT INTO records (
        name, type_of_work, reference_through, fee,
        income_tax_challan, labour_challan, gst_challan,
        total, paid, due, mode, dop
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
      RETURNING *;
    `;

    const values = [
      name,
      typeOfWork,
      reference,
      fee,
      incomeTaxChallan,
      labourChallan,
      gstChallan,
      total,
      paid,
      due,
      mode,
      dop,
    ];

    const result = await pool.query(insertQuery, values);
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('POST /api/clients error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
