// src/utils/exportPDF.js
'use client'; // 👈 Force it to run only in the browser

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

autoTable(jsPDF); // plugin registration

export const exportToPDF = (data) => {
  const doc = new jsPDF();
  doc.text('Client Records', 14, 15);

  autoTable(doc, {
    head: [['Name', 'Email', 'Phone', 'Date']],
    body: data.map((record) => [
      record.name,
      record.email,
      record.phone,
      new Date(record.created_at).toLocaleDateString(),
    ]),
    startY: 20,
  });

  doc.save('records.pdf');
};
