// src/app/clients/new/page.js


'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

import './style.css';


export default function AddClientPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    typeOfWork: '',
    reference: '',
    fee: 0,
    incomeTax: 0,
    labour: 0,
    gst: 0,
    total: 0,
    paid: 0,
    due: 0,
    mode: '', // This will store both mode and details like "Bank Transfer ICICI 9823xxxx"
    dop: new Date().toISOString().slice(0, 10),
  });
  
  

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedValue = name === 'fee' || name === 'incomeTax' || name === 'labour' || name === 'gst' || name === 'paid'
      ? Number(value)
      : value;

    const updatedForm = {
      ...form,
      [name]: updatedValue,
    };

    // Auto-calculate total and due
    const total = Number(updatedForm.fee) + Number(updatedForm.incomeTax) + Number(updatedForm.labour) + Number(updatedForm.gst);
    const due = total - Number(updatedForm.paid);

    updatedForm.total = total;
    updatedForm.due = due;

    setForm(updatedForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setSuccessMessage('✅ Client added successfully!');
        setForm({
          name: '',
          typeOfWork: '',
          reference: '',
          fee: 0,
          incomeTax: 0,
          labour: 0,
          gst: 0,
          total: 0,
          paid: 0,
          due: 0,
          mode: 'Cash',
          paymentDetails: '',
          dop: new Date().toISOString().slice(0, 10),
        });
        
      } else {
        setSuccessMessage('❌ Something went wrong. Try again. Client might already exist.');
      }
    } catch (error) {
      console.error('Error submitting client:', error);
      setSuccessMessage('❌ Network error. Please try again.');
    }

    setIsSubmitting(false);
  };

  return (

    
  <>
  <Navbar />
  <div className="add-client-container">
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '28px', marginBottom: '20px' }}>➕ Add New Client</h1>

      {successMessage && (
        <p style={{ color: successMessage.startsWith('✅') ? 'green' : 'red', marginBottom: '16px' }}>
          {successMessage}
        </p>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {[
          ['name', 'Name'],
          ['typeOfWork', 'Type of Work'],
          ['reference', 'Reference Through'],
          ['fee', 'Fee'],
          ['incomeTax', 'Income Tax Challan'],
          ['labour', 'Labour Challan'],
          ['gst', 'GST Challan'],
          ['total', 'Total (auto-calculated)'],
          ['paid', 'Paid'],
          ['due', 'Due (auto-calculated)'],
        ].map(([key, label]) => (
          <div key={key}>
            <label style={{ display: 'block', marginBottom: '6px' }}>{label}</label>
            <input
              type={['fee', 'incomeTax', 'labour', 'gst', 'total', 'paid', 'due'].includes(key) ? 'number' : 'text'}
              name={key}
              value={form[key]}
              onChange={handleChange}
              required
              disabled={key === 'total' || key === 'due'} // make auto-calculated fields read-only
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '6px',
                border: '1px solid #ccc',
                backgroundColor: key === 'total' || key === 'due' ? '#f5f5f5' : 'white',
              }}
            />
          </div>
        ))}

<div style={{ display: 'flex', gap: '10px' }}>
  <div style={{ flex: 1 }}>
    <label style={{ display: 'block', marginBottom: '6px' }}>Payment Mode</label>
    <select
      onChange={(e) => {
        const selected = e.target.value;
        const currentDetails = form.mode.split(' ').slice(1).join(' ');
        setForm((prev) => ({
          ...prev,
          mode: currentDetails ? `${selected} ${currentDetails}` : selected,
        }));
      }}
      value={form.mode.split(' ')[0] || ''}
      style={{
        width: '100%',
        padding: '8px',
        borderRadius: '6px',
        border: '1px solid #ccc',
      }}
    >
      <option value="">Select Mode</option>
      <option value="Cash">Cash</option>
      <option value="BankTransfer">Bank Transfer</option>
      <option value="PhonePe">PhonePe</option>
      <option value="GPay">G Pay</option>
      <option value="UPI"> Other UPI</option>
    </select>
  </div>

  <div style={{ flex: 1 }}>
    <label style={{ display: 'block', marginBottom: '6px' }}>Details</label>
    <input
      type="text"
      placeholder="ICICI 9861xxxx / TXN123"
      value={form.mode.split(' ').slice(1).join(' ')}
      onChange={(e) => {
        const details = e.target.value;
        const baseMode = form.mode.split(' ')[0] || '';
        setForm((prev) => ({
          ...prev,
          mode: `${baseMode} ${details}`.trim(),
        }));
      }}
      style={{
        width: '100%',
        padding: '8px',
        borderRadius: '6px',
        border: '1px solid #ccc',
      }}
    />
  </div>
</div>


        <div>
          <label style={{ display: 'block', marginBottom: '6px' }}>DOP (Date of Payment)</label>
          <input
            type="date"
            name="dop"
            value={form.dop}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}
          />
        </div>

        <div style={{ gridColumn: 'span 2' }}>
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              marginTop: '10px',
              padding: '12px 20px',
              backgroundColor: isSubmitting ? '#999' : '#0070f3',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              width: '100%',
            }}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Client'}
          </button>
        </div>
      </form>
    </div>
    </div>
  </>
  );
}
