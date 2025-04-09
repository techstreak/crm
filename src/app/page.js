'use client';

import Navbar from '@/components/Navbar';
import { useRouter } from 'next/navigation';



export default function HomePage() {
  const router = useRouter();

  const navButton = (label, path) => (
    <button
      onClick={() => router.push(path)}
      style={{
        padding: '16px 24px',
        margin: '10px',
        fontSize: '18px',
        borderRadius: '10px',
        border: 'none',
        backgroundColor: '#0070f3',
        color: 'white',
        cursor: 'pointer',
        transition: 'background 0.3s',
      }}
    >
      {label}
    </button>
  );

  return (

    <>
    <Navbar />

    {/* Main content */}
   
    <div
      style={{
        textAlign: 'center',
        padding: '60px',
        fontFamily: 'sans-serif',
      }}
    >
      <h1 style={{ fontSize: '36px', marginBottom: '20px' }}>Welcome to My CRM</h1>
      <p style={{ fontSize: '18px', marginBottom: '40px' }}>
        Manage clients, view records, and stay organized — all in one place.
      </p>

      <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
        {navButton('View Clients', '/clients')}
        {navButton('Add Data', '/database')}
        {navButton('View Full Records', '/records')}
        {navButton('Analytics', '/analytics')}
        {navButton('New Client', '/clients/new')}
      </div>
    </div>

    </>
  );
  
}
