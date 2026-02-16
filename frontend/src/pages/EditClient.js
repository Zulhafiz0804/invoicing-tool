import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { clientAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import '../styles/Forms.css';

const EditClient = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company_name: '',
    address: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    loadClient();
  }, [id]);

  const loadClient = async () => {
    try {
      setPageLoading(true);
      const res = await clientAPI.getOne(id);
      setFormData(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Error loading client');
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
      await clientAPI.update(id, formData);
      setSuccess('Client updated successfully!');
      setTimeout(() => navigate(`/clients/${id}`), 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(`/clients/${id}`);
  };

  if (pageLoading) {
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

  return (
    <div className="form-page">
      <div className="form-container">
        <div className="form-header">
          <h1>Edit Client</h1>
          <p>Update client information</p>
        </div>

        <div className="form-body">
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit} className={loading ? 'form-loading' : ''}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Client Name *</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="John Smith"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  placeholder="+60 12 3456 7890"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="company">Company Name</label>
                <input
                  id="company"
                  type="text"
                  name="company_name"
                  placeholder="ABC Company Sdn Bhd"
                  value={formData.company_name}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="address">Address</label>
              <textarea
                id="address"
                name="address"
                placeholder="123 Main Street, City, State, Postal Code"
                value={formData.address}
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
                {loading ? 'Updating...' : 'Update Client'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditClient;