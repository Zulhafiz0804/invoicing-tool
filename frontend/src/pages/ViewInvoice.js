import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { invoiceAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';

const ViewInvoice = () => {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [error, setError] = useState('');
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    loadInvoice();
  }, [id]);

  const loadInvoice = async () => {
    try {
      const res = await invoiceAPI.getOne(id);
      setInvoice(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Error loading invoice');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      try {
        await invoiceAPI.delete(id);
        navigate('/dashboard');
      } catch (err) {
        setError(err.response?.data?.error || 'Error deleting invoice');
      }
    }
  };

  if (error) return <div style={{ padding: '20px' }}><p style={{ color: 'red' }}>{error}</p></div>;
  if (!invoice) return <div style={{ padding: '20px' }}>Loading...</div>;

  return (
    <div style={{ maxWidth: '700px', margin: '50px auto', padding: '20px' }}>
      <h2>Invoice Details</h2>
      <div style={{ border: '1px solid #ccc', padding: '20px', marginBottom: '20px' }}>
        <p><strong>Invoice Number:</strong> {invoice.invoice_number}</p>
        <p><strong>Client ID:</strong> {invoice.client_id}</p>
        <p><strong>Issue Date:</strong> {invoice.issue_date}</p>
        <p><strong>Due Date:</strong> {invoice.due_date}</p>
        <p><strong>Amount:</strong> ${invoice.amount}</p>
        <p><strong>Status:</strong> {invoice.status}</p>
        <p><strong>Notes:</strong> {invoice.notes}</p>
        {invoice.items && invoice.items.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <h3>Invoice Items</h3>
            <ul>
              {invoice.items.map(item => (
                <li key={item.id}>
                  {item.description} - Qty: {item.quantity} x ${item.rate} = ${item.amount}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <button onClick={() => navigate(`/invoices/${id}/edit`)} style={{ padding: '10px 20px', marginRight: '10px' }}>Edit</button>
      <button onClick={handleDelete} style={{ padding: '10px 20px', marginRight: '10px', backgroundColor: '#ff4444', color: 'white' }}>Delete</button>
      <button onClick={() => navigate('/dashboard')} style={{ padding: '10px 20px' }}>Back to Dashboard</button>
    </div>
  );
};

export default ViewInvoice;