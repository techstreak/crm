'use client';

import { useEffect, useState } from 'react';

export default function DuplicatesPage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const res = await fetch('/api/duplicates');
    const data = await res.json();
    setRecords(data);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this record?')) return;
    const res = await fetch(`/api/records/${id}`, { method: 'DELETE' });
    if (res.ok) {
      window.location.reload();
    } else {
      alert('Failed to delete record.');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '10px' }}>⚠️ Duplicate Records</h1>
      

      <a href="/records" style={{ marginRight: '10px', textDecoration: 'none', color: '#0070f3' }}>
        Go to Database
      </a>



      {loading ? (
        <p>Loading...</p>
      ) : records.length === 0 ? (
        <p>No duplicate records found 🎉</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr>
              {['Name', 'Type of Work', 'Reference', 'Total', 'Paid', 'Due', 'Mode', 'DOP', 'Actions'].map((header) => (
                <th key={header} style={{ borderBottom: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.id}>
                <td>{record.name}</td>
                <td>{record.type_of_work}</td>
                <td>{record.reference_through}</td>
                <td>₹{record.total}</td>
                <td>₹{record.paid}</td>
                <td>₹{record.due}</td>
                <td>{record.mode}</td>
                <td>{record.dop.split('T')[0]}</td>
                <td>
                  <button
                    onClick={() => handleDelete(record.id)}
                    style={{
                      backgroundColor: 'red',
                      color: 'white',
                      border: 'none',
                      padding: '6px 10px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
