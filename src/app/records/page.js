'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';

const getFormattedDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0]; // YYYY-MM-DD
};

const exportToCSV = (data) => {
  const csv = [
    Object.keys(data[0]).join(','),
    ...data.map((row) => Object.values(row).join(',')),
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `records-${getFormattedDate()}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
};

export default function RecordsPage() {
  const [records, setRecords] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [sortField, setSortField] = useState(null);
  const [sortAsc, setSortAsc] = useState(true);

  const fetchData = async () => {
    const res = await fetch('/api/records');
    const data = await res.json();
    setRecords(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSort = (field) => {
    const asc = sortField === field ? !sortAsc : true;
    setSortField(field);
    setSortAsc(asc);
  };

  const sortedFilteredRecords = records
    .filter((r) =>
      [
        r.id,
        r.name,
        r.type_of_work,
        r.mode,
        r.reference_through,
        r.dop,
        r.created_at,
      ]
        .map((field) => String(field)?.toLowerCase())
        .some((field) => field.includes(filterText.toLowerCase()))
    )
    .sort((a, b) => {
      if (!sortField) return 0;
      const valA = a[sortField];
      const valB = b[sortField];
      const isNumeric = !isNaN(Number(valA)) && !isNaN(Number(valB));
      if (isNumeric) {
        return sortAsc ? valA - valB : valB - valA;
      }
      return sortAsc
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });

  const handleEdit = async (id, field, value) => {
    const res = await fetch('/api/records/edit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, field, value }),
    });
    if (res.ok) {
      fetchData();
    }
  };

  const handleDelete = async (id) => {
    const res = await fetch(`/api/records/delete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      fetchData();
    }
  };

  const handlePrint = () => {
    document.title = `records-${getFormattedDate()}`;
    window.print();
  };

  return (
    <>
      <Navbar />
      <style jsx>{`
        @media print {
          input,
          button,
          a,
          .no-print {
            display: none !important;
          }

          table {
            width: 100%;
            border-collapse: collapse;
          }

          th,
          td {
            border: 1px solid black;
            padding: 6px;
          }
        }
      `}</style>
      <div style={{ padding: '30px', fontFamily: 'Arial' }}>
        <h1>Client Records</h1>

        <input
          placeholder="Search by id/name/type/mode/date..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          style={{
            padding: '8px',
            marginBottom: '20px',
            width: '300px',
            borderRadius: '6px',
          }}
        />

        <div style={{ marginBottom: '20px' }} className="no-print">
          <button
            onClick={() => exportToCSV(sortedFilteredRecords)}
            style={{
              marginRight: '10px',
              padding: '8px 12px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            Export CSV
          </button>

          <button
            onClick={handlePrint}
            style={{
              marginRight: '10px',
              padding: '8px 12px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            Print PDF
          </button>

          <a
            href="/duplicates"
            style={{
              padding: '8px 12px',
              backgroundColor: '#007bff',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px',
              fontWeight: 'bold',
              display: 'inline-block',
              transition: 'background-color 0.3s',
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = '#0056b3')}
            onMouseOut={(e) => (e.target.style.backgroundColor = '#007bff')}
          >
            View Duplicates
          </a>
        </div>

        <table border="1" cellPadding="6" cellSpacing="0">
          <thead>
            <tr>
              {[
                'id',
                'name',
                'type_of_work',
                'reference_through',
                'fee',
                'income_tax_challan',
                'labour_challan',
                'gst_challan',
                'total',
                'paid',
                'due',
                'mode',
                'dop',
                'created_at',
              ].map((field) => (
                <th
                  key={field}
                  onClick={() => handleSort(field)}
                  style={{ cursor: 'pointer', background: '#f1f1f1' }}
                >
                  {field.replace(/_/g, ' ').toUpperCase()}
                  {sortField === field ? (sortAsc ? ' 🔼' : ' 🔽') : ''}
                </th>
              ))}
              <th className="no-print" style={{ background: '#f1f1f1' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedFilteredRecords.map((record) => (
              <tr key={record.id}>
                {[
                  'id',
                  'name',
                  'type_of_work',
                  'reference_through',
                  'fee',
                  'income_tax_challan',
                  'labour_challan',
                  'gst_challan',
                  'total',
                  'paid',
                  'due',
                  'mode',
                  'dop',
                  'created_at',
                ].map((key) => (
                  <td
                    key={key}
                    contentEditable={key !== 'id' && key !== 'created_at'}
                    suppressContentEditableWarning
                    onBlur={
                      key !== 'id' && key !== 'created_at'
                        ? (e) => handleEdit(record.id, key, e.target.innerText)
                        : undefined
                    }
                    style={{ backgroundColor: '#fffbe7' }}
                  >
                    {(key === 'dop' || key === 'created_at') && record[key]
                      ? String(record[key]).split('T')[0]
                      : record[key]}
                  </td>
                ))}
                <td className="no-print">
                  <button
                    onClick={() => handleDelete(record.id)}
                    style={{
                      backgroundColor: 'red',
                      color: 'white',
                      padding: '4px 8px',
                      border: 'none',
                      borderRadius: '4px',
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
      </div>
    </>
  );
}
