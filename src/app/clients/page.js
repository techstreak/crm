// src/app/clients/page.js


'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

import './clients.css';


export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchClients = async () => {
      const res = await fetch('/api/clients');
      const data = await res.json();
      setClients(data);
    };
    fetchClients();
  }, []);

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(search.toLowerCase())
  );

  return (  
  <>
      <Navbar /> 
      <div className="clients-container">
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '28px', marginBottom: '20px' }}>Clients</h1>

      <input
        type="text"
        placeholder="Search clients..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: '100%',
          padding: '10px',
          marginBottom: '20px',
          borderRadius: '8px',
          border: '1px solid #ccc',
          fontSize: '16px',
        }}
      />

      {filteredClients.length > 0 ? (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {filteredClients.map((client) => (
            <li key={client.id} style={{ marginBottom: '12px' }}>
              <Link
                href={`/clients/${client.id}`}
                style={{
                  display: 'block',
                  padding: '12px 16px',
                  backgroundColor: client.due > 0 ? '#ffe5e5' : '#f5f5f5', // light red if due > 0
                  borderLeft: client.due > 0 ? '6px solid red' : '6px solid #ccc',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: '#333',
                  fontWeight: '500',
                  transition: 'background 0.2s',
                }}
              >
                {client.name}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No clients found.</p>
      )}
    </div>
    </div>
</>
  );
}
