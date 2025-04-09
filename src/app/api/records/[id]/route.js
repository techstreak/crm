// src/app/api/records/[id]/route.js

import { NextResponse } from 'next/server';
import pool from '@/utils/db';

export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    const result = await pool.query('DELETE FROM records WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/records/[id] error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
