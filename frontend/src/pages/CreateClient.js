import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { clientAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import '../styles/Forms.css';

const CreateClient = () => {
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
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await clientAPI.create(formData);
      setSuccess('Client created successfully!');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  return (
    <div className="form-page">
      <div className="form-container">
        <div className="form-header">
          <h1>Add New Client</h1>
          <p>Enter your client's details</p>
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
                <p className="form-helper">Full name of your client</p>
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
                <p className="form-helper">Client email address</p>
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
                <p className="form-helper">Contact number</p>
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
                <p className="form-helper">Business name</p>
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
              <p className="form-helper">Complete address</p>
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
                {loading ? 'Creating...' : 'Create Client'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateClient;