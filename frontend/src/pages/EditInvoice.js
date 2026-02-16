import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { invoiceAPI, clientAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import '../styles/Forms.css';

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
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
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
      setPageLoading(true);
      const res = await invoiceAPI.getOne(id);
      setFormData(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Error loading invoice');
    } finally {
      setPageLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(`/invoices/${id}`);
  };

  if (pageLoading) {
    return (
      <div className="form-page">
        <div className="form-container">
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
            Loading invoice details...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="form-page">
      <div className="form-container">
        <div className="form-header">
          <h1>Edit Invoice</h1>
          <p>Update invoice information</p>
        </div>

        <div className="form-body">
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit} className={loading ? 'form-loading' : ''}>
            <div className="form-group">
              <label htmlFor="client">Select Client *</label>
              <select
                id="client"
                name="client_id"
                value={formData.client_id}
                onChange={handleChange}
                required
                disabled={loading}
              >
                <option value="">-- Choose a client --</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name} ({client.company_name})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="invoice_number">Invoice Number *</label>
                <input
                  id="invoice_number"
                  type="text"
                  name="invoice_number"
                  placeholder="INV-001"
                  value={formData.invoice_number}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="amount">Amount *</label>
                <input
                  id="amount"
                  type="number"
                  name="amount"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={handleChange}
                  step="0.01"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="issue_date">Issue Date *</label>
                <input
                  id="issue_date"
                  type="date"
                  name="issue_date"
                  value={formData.issue_date}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="due_date">Due Date *</label>
                <input
                  id="due_date"
                  type="date"
                  name="due_date"
                  value={formData.due_date}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="draft">Draft</option>
                <option value="sent">Sent</option>
                <option value="paid">Paid</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="notes">Notes</label>
              <textarea
                id="notes"
                name="notes"
                placeholder="Add any additional notes..."
                value={formData.notes}
                onChange={handleChange}
                disabled={loading}
              ></textarea>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-submit"
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Invoice'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditInvoice;