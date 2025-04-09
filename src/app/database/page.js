'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';

export default function DatabasePage() {
  const [records, setRecords] = useState([]);
  const [textInput, setTextInput] = useState('');

  useEffect(() => {
    fetch('/api/records')
      .then((res) => res.json())
      .then((data) => setRecords(data));
  }, []);

  const handleSubmit = async () => {
    const rows = textInput.trim().split('\n');
    const formattedData = rows.map(row => {
      const cols = row.split('\t'); // or use ',' if it's comma separated
      return {
        name: cols[0],
        type_of_work: cols[1],
        reference_through: cols[2],
        fee: parseFloat(cols[3]),
        income_tax_challan: parseFloat(cols[4]),
        labour_challan: parseFloat(cols[5]),
        gst_challan: parseFloat(cols[6]),
        total: parseFloat(cols[7]),
        paid: parseFloat(cols[8]),
        due: parseFloat(cols[9]),
        mode: cols[10],
        dop: cols[11],
      };
    });

    const res = await fetch('/api/records', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: formattedData }),
    });

    if (res.ok) {
      alert('Data inserted successfully!');
      setTextInput('');
      const refreshed = await fetch('/api/records').then(res => res.json());
      setRecords(refreshed);
    } else {
      alert('Error inserting data');
    }
  };

  return (
<>
    <Navbar />
 
    <div style={{ padding: '30px', fontFamily: 'Arial' }}>
      <h1>Database Page</h1>

      {/* Paste Data Area */}
      <textarea
        placeholder="Paste tab-separated data here (one row per line)..."
        value={textInput}
        onChange={(e) => setTextInput(e.target.value)}
        rows={8}
        style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
      />

      <button onClick={handleSubmit} style={buttonStyle}>
        Submit Data
      </button>

      {/* Existing Records */}
      <h2 style={{ marginTop: '40px' }}>Existing Records</h2>
      <table border="1" cellPadding="8" cellSpacing="0">
        <thead>
          <tr>
            <th>Name</th><th>Type of Work</th><th>Reference Through</th><th>Fee</th>
            <th>Income Tax</th><th>Labour</th><th>GST</th><th>Total</th>
            <th>Paid</th><th>Due</th><th>Mode</th><th>DOP</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r, idx) => (
            <tr key={idx}>
              <td>{r.name}</td><td>{r.type_of_work}</td><td>{r.reference_through}</td><td>{r.fee}</td>
              <td>{r.income_tax_challan}</td><td>{r.labour_challan}</td><td>{r.gst_challan}</td><td>{r.total}</td>
              <td>{r.paid}</td><td>{r.due}</td><td>{r.mode}</td><td>{r.dop}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    </>
  );
}

const buttonStyle = {
  padding: '10px 20px',
  backgroundColor: '#28a745',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
};
