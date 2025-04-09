'use client';

import { useEffect, useState } from 'react';

import Navbar from '@/components/Navbar';


import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

export default function AnalyticsPage() {
  const [summary, setSummary] = useState({
    totalClients: 0,
    totalPaid: 0,
    totalDue: 0,
    totalProjects: 0,
  });

  const [topClients, setTopClients] = useState([]);
  const [pieData, setPieData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/clients');
      const data = await res.json();

      let totalPaid = 0;
      let totalDue = 0;

      const processedClients = data.map((client) => {
        const paid = Number(client.paid) || 0;
        const total = Number(client.total) || 0;
        const due = total - paid;

        totalPaid += paid;
        totalDue += due;

        return {
          name: client.name,
          paid,
          total,
          due,
        };
      });

      setSummary({
        totalClients: data.length,
        totalPaid,
        totalDue,
        totalProjects: data.length,
      });

      const top = [...processedClients]
        .sort((a, b) => b.total - a.total)
        .slice(0, 5);
      setTopClients(top);

      setPieData([
        { name: 'Paid', value: totalPaid },
        { name: 'Due', value: totalDue },
      ]);
    };

    fetchData();
  }, []);

  return (

    <>
        <Navbar />


    
    <div style={{ padding: '40px', fontFamily: 'Segoe UI, sans-serif', backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '36px', fontWeight: '600', marginBottom: '30px' }}>📊 Analytics Overview</h1>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '50px',
        }}
      >
        <AnalyticsCard title="Total Clients" value={summary.totalClients} color="#0070f3" />
        <AnalyticsCard title="Total Paid" value={`₹ ${summary.totalPaid}`} color="#28a745" />
        <AnalyticsCard title="Total Due" value={`₹ ${summary.totalDue}`} color="#dc3545" />
        <AnalyticsCard title="Total Projects" value={summary.totalProjects} color="#6f42c1" />
      </div>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '40px',
          justifyContent: 'center',
        }}
      >
        <div style={{ width: '100%', maxWidth: '600px', height: 350, background: 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', padding: '20px' }}>
          <h3 style={{ fontSize: '20px', marginBottom: '10px' }}>Top 5 Clients (Paid vs Total)</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topClients}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" fill="#8884d8" name="Total" />
              <Bar dataKey="paid" fill="#82ca9d" name="Paid" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ width: '100%', maxWidth: '400px', height: 350, background: 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', padding: '20px' }}>
          <h3 style={{ fontSize: '20px', marginBottom: '10px' }}>Paid vs Due</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index === 0 ? '#28a745' : '#dc3545'}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>

    </>
  );
}

function AnalyticsCard({ title, value, color }) {
  return (
    <div
      style={{
        padding: '20px',
        borderRadius: '16px',
        backgroundColor: color,
        color: 'white',
        textAlign: 'center',
        fontSize: '18px',
        boxShadow: '0 6px 12px rgba(0,0,0,0.1)',
        transition: 'transform 0.2s ease',
      }}
    >
      <h3 style={{ marginBottom: '10px', fontWeight: '600' }}>{title}</h3>
      <p style={{ fontSize: '28px', fontWeight: 'bold' }}>{value}</p>
    </div>
  );
}
