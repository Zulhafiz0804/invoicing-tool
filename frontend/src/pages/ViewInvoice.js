import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { invoiceAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import '../styles/Forms.css';

const ViewInvoice = () => {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    loadInvoice();
  }, [id]);

  const loadInvoice = async () => {
    try {
      setLoading(true);
      const res = await invoiceAPI.getOne(id);
      setInvoice(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Error loading invoice');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this invoice? This action cannot be undone.')) {
      try {
        await invoiceAPI.delete(id);
        navigate('/dashboard');
      } catch (err) {
        setError(err.response?.data?.error || 'Error deleting invoice');
      }
    }
  };

  if (loading) {
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

  if (error) {
    return (
      <div className="form-page">
        <div className="form-container">
          <div className="form-body">
            <div className="alert alert-error">{error}</div>
            <button onClick={() => navigate('/dashboard')} className="btn-primary">
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="form-page">
        <div className="form-container">
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
            Invoice not found
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'draft':
        return '#fef3c7';
      case 'sent':
        return '#cffafe';
      case 'paid':
        return '#dcfce7';
      default:
        return '#dbeafe';
    }
  };

  const getStatusTextColor = (status) => {
    switch (status) {
      case 'draft':
        return '#92400e';
      case 'sent':
        return '#0c4a6e';
      case 'paid':
        return '#15803d';
      default:
        return '#1e40af';
    }
  };

  return (
    <div className="form-page">
      <div className="form-container">
        <div className="form-header">
          <h1>Invoice #{invoice.invoice_number}</h1>
          <p>Invoice Details</p>
        </div>

        <div className="form-body">
          <div className="client-details">
            <div className="detail-item">
              <label>Invoice Number</label>
              <p style={{ fontSize: '1.1rem', fontWeight: '600' }}>{invoice.invoice_number}</p>
            </div>

            <div className="detail-item">
              <label>Client ID</label>
              <p>{invoice.client_id}</p>
            </div>

            <div className="detail-item">
              <label>Issue Date</label>
              <p>{new Date(invoice.issue_date).toLocaleDateString()}</p>
            </div>

            <div className="detail-item">
              <label>Due Date</label>
              <p>{new Date(invoice.due_date).toLocaleDateString()}</p>
            </div>

            <div className="detail-item">
              <label>Amount</label>
              <p style={{ fontSize: '1.25rem', fontWeight: '600', color: '#2563eb' }}>
                ${parseFloat(invoice.amount).toFixed(2)}
              </p>
            </div>

            <div className="detail-item">
              <label>Status</label>
              <p>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    backgroundColor: getStatusColor(invoice.status),
                    color: getStatusTextColor(invoice.status),
                    fontWeight: '600',
                    fontSize: '0.85rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  {invoice.status}
                </span>
              </p>
            </div>

            {invoice.notes && (
              <div className="detail-item">
                <label>Notes</label>
                <p>{invoice.notes}</p>
              </div>
            )}

            {invoice.items && invoice.items.length > 0 && (
              <div className="detail-item" style={{ gridColumn: '1 / -1' }}>
                <label>Invoice Items</label>
                <div style={{ marginTop: '12px' }}>
                  {invoice.items.map((item, index) => (
                    <div
                      key={item.id || index}
                      style={{
                        padding: '12px',
                        backgroundColor: '#f8fafc',
                        borderRadius: '6px',
                        marginBottom: '8px',
                        borderLeft: '3px solid #2563eb',
                      }}
                    >
                      <p style={{ margin: '0 0 4px 0', fontWeight: '600' }}>
                        {item.description}
                      </p>
                      <p style={{ margin: '0', color: '#64748b', fontSize: '0.9rem' }}>
                        Qty: {item.quantity} × ${parseFloat(item.rate).toFixed(2)} = $
                        {parseFloat(item.amount).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="detail-item">
              <label>Created</label>
              <p>{new Date(invoice.created_at).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate('/dashboard')}
            >
              Back
            </button>
            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate(`/invoices/${id}/edit`)}
              style={{ backgroundColor: '#3b82f6', color: 'white', border: 'none' }}
            >
              Edit
            </button>
            <button
              type="button"
              onClick={handleDelete}
              style={{
                backgroundColor: '#ef4444',
                color: 'white',
                flex: 1,
                padding: '12px 20px',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewInvoice;