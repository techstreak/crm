'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ClientEditor({ id }) {
  const router = useRouter();
  const [client, setClient] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchClient = async () => {
      const res = await fetch(`/api/clients/${id}`);
      const data = await res.json();
      setClient(data);
      setFormData(data);
    };
    fetchClient();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const res = await fetch(`/api/clients/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      alert('Saved successfully');
    } else {
      alert('Error saving data');
    }
  };

  if (!client) return <div style={{ padding: '40px', fontSize: '18px' }}>Loading client info...</div>;

  return (

  <>
    <Navbar />
    
    <div style={{
      padding: '40px',
      maxWidth: '900px',
      margin: '0 auto',
      fontFamily: 'Segoe UI, sans-serif',
      backgroundColor: '#f9f9f9',
      minHeight: '100vh'
    }}>
      <h1 style={{
        fontSize: '30px',
        fontWeight: '600',
        marginBottom: '30px',
        borderBottom: '2px solid #eee',
        paddingBottom: '10px'
      }}>
        ✏️ Edit Client: <span style={{ color: '#0070f3' }}>{client.name}</span>
      </h1>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
        }}
      >
        {Object.entries(formData).map(([key, value]) => (
          <div key={key}>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', textTransform: 'capitalize' }}>
              {key.replace(/_/g, ' ')}
            </label>
            <input
              type="text"
              name={key}
              value={value === null ? '' : value}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid #ccc',
                fontSize: '16px',
                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)',
              }}
            />
          </div>
        ))}
      </div>

      <div style={{ marginTop: '40px', display: 'flex', gap: '12px' }}>
        <button
          onClick={handleSave}
          style={{
            padding: '12px 24px',
            backgroundColor: '#28a745',
            color: 'white',
            fontWeight: '600',
            fontSize: '16px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = '#218838')}
          onMouseOut={(e) => (e.target.style.backgroundColor = '#28a745')}
        >
          💾 Save
        </button>

        <button
          onClick={() => router.push('/clients')}
          style={{
            padding: '12px 24px',
            backgroundColor: '#6c757d',
            color: 'white',
            fontWeight: '600',
            fontSize: '16px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = '#5a6268')}
          onMouseOut={(e) => (e.target.style.backgroundColor = '#6c757d')}
        >
          ⬅️ Back to Clients
        </button>
      </div>
    </div>

    </>
  );
}
