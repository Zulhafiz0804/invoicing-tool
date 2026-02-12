import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { clientAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';

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
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    loadClient();
  }, [id]);

  const loadClient = async () => {
    try {
      const res = await clientAPI.getOne(id);
      setFormData(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Error loading client');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await clientAPI.update(id, formData);
      setSuccess('Client updated successfully!');
      setTimeout(() => navigate(`/clients/${id}`), 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '50px auto', padding: '20px' }}>
      <h2>Edit Client</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>Name:</label>
          <input 
            type="text" 
            name="name" 
            placeholder="Client Name" 
            value={formData.name} 
            onChange={handleChange} 
            required 
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Email:</label>
          <input 
            type="email" 
            name="email" 
            placeholder="Email" 
            value={formData.email} 
            onChange={handleChange} 
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Phone:</label>
          <input 
            type="text" 
            name="phone" 
            placeholder="Phone" 
            value={formData.phone} 
            onChange={handleChange} 
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Company Name:</label>
          <input 
            type="text" 
            name="company_name" 
            placeholder="Company Name" 
            value={formData.company_name} 
            onChange={handleChange} 
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Address:</label>
          <textarea 
            name="address" 
            placeholder="Address" 
            value={formData.address} 
            onChange={handleChange} 
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <button type="submit" style={{ padding: '10px 20px', marginRight: '10px' }}>Update Client</button>
        <button type="button" onClick={() => navigate(`/clients/${id}`)} style={{ padding: '10px 20px' }}>Cancel</button>
      </form>
    </div>
  );
};

export default EditClient;