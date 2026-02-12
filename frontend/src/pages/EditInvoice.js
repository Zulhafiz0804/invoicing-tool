import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { invoiceAPI, clientAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';

const EditInvoice = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    client_id: '',
    invoice_number: '',
    issue_date: '',
    due_date: '',
    amount: '',
    status: 'draft',
    notes: '',
  });
  const [clients, setClients] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    loadClients();
    loadInvoice();
  }, [id]);

  const loadClients = async () => {
    try {
      const res = await clientAPI.getAll();
      setClients(res.data);
    } catch (err) {
      console.error('Error loading clients:', err);
    }
  };

  const loadInvoice = async () => {
    try {
      const res = await invoiceAPI.getOne(id);
      setFormData(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Error loading invoice');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await invoiceAPI.update(id, {
        ...formData,
        client_id: parseInt(formData.client_id),
        amount: parseFloat(formData.amount),
      });
      setSuccess('Invoice updated successfully!');
      setTimeout(() => navigate(`/invoices/${id}`), 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '50px auto', padding: '20px' }}>
      <h2>Edit Invoice</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>Client:</label>
          <select 
            name="client_id" 
            value={formData.client_id} 
            onChange={handleChange} 
            required
            style={{ width: '100%', padding: '8px' }}
          >
            <option value="">Select a client</option>
            {clients.map(client => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Invoice Number:</label>
          <input 
            type="text" 
            name="invoice_number" 
            placeholder="e.g., INV-001" 
            value={formData.invoice_number} 
            onChange={handleChange} 
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Issue Date:</label>
          <input 
            type="date" 
            name="issue_date" 
            value={formData.issue_date} 
            onChange={handleChange} 
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Due Date:</label>
          <input 
            type="date" 
            name="due_date" 
            value={formData.due_date} 
            onChange={handleChange} 
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Amount:</label>
          <input 
            type="number" 
            name="amount" 
            placeholder="Amount" 
            value={formData.amount} 
            onChange={handleChange} 
            step="0.01"
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Status:</label>
          <select 
            name="status" 
            value={formData.status} 
            onChange={handleChange}
            style={{ width: '100%', padding: '8px' }}
          >
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="paid">Paid</option>
          </select>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Notes:</label>
          <textarea 
            name="notes" 
            placeholder="Notes" 
            value={formData.notes} 
            onChange={handleChange} 
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <button type="submit" style={{ padding: '10px 20px', marginRight: '10px' }}>Update Invoice</button>
        <button type="button" onClick={() => navigate(`/invoices/${id}`)} style={{ padding: '10px 20px' }}>Cancel</button>
      </form>
    </div>
  );
};

export default EditInvoice;