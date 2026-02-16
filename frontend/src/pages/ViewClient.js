import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { clientAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import '../styles/Forms.css';

const ViewClient = () => {
  const { id } = useParams();
  const [client, setClient] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    loadClient();
  }, [id]);

  const loadClient = async () => {
    try {
      setLoading(true);
      const res = await clientAPI.getOne(id);
      setClient(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Error loading client');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this client? This action cannot be undone.')) {
      try {
        await clientAPI.delete(id);
        navigate('/dashboard');
      } catch (err) {
        setError(err.response?.data?.error || 'Error deleting client');
      }
    }
  };

  if (loading) {
    return (
      <div className="form-page">
        <div className="form-container">
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
            Loading client details...
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

  if (!client) {
    return (
      <div className="form-page">
        <div className="form-container">
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
            Client not found
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="form-page">
      <div className="form-container">
        <div className="form-header">
          <h1>{client.name}</h1>
          <p>Client Details</p>
        </div>

        <div className="form-body">
          <div className="client-details">
            <div className="detail-item">
              <label>Name</label>
              <p>{client.name}</p>
            </div>

            <div className="detail-item">
              <label>Email</label>
              <p>
                {client.email ? (
                  <a href={`mailto:${client.email}`}>{client.email}</a>
                ) : (
                  <span style={{ color: '#94a3b8' }}>Not provided</span>
                )}
              </p>
            </div>

            <div className="detail-item">
              <label>Phone</label>
              <p>
                {client.phone ? (
                  <a href={`tel:${client.phone}`}>{client.phone}</a>
                ) : (
                  <span style={{ color: '#94a3b8' }}>Not provided</span>
                )}
              </p>
            </div>

            <div className="detail-item">
              <label>Company</label>
              <p>{client.company_name || <span style={{ color: '#94a3b8' }}>Not provided</span>}</p>
            </div>

            <div className="detail-item">
              <label>Address</label>
              <p>{client.address || <span style={{ color: '#94a3b8' }}>Not provided</span>}</p>
            </div>

            <div className="detail-item">
              <label>Created</label>
              <p>{new Date(client.created_at).toLocaleDateString()}</p>
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
              onClick={() => navigate(`/clients/${id}/edit`)}
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
                fontWeight: '600'
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

export default ViewClient;