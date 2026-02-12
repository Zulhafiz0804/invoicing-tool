import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { clientAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';

const ViewClient = () => {
  const { id } = useParams();
  const [client, setClient] = useState(null);
  const [error, setError] = useState('');
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    loadClient();
  }, [id]);

  const loadClient = async () => {
    try {
      const res = await clientAPI.getOne(id);
      setClient(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Error loading client');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      try {
        await clientAPI.delete(id);
        navigate('/dashboard');
      } catch (err) {
        setError(err.response?.data?.error || 'Error deleting client');
      }
    }
  };

  if (error) return <div style={{ padding: '20px' }}><p style={{ color: 'red' }}>{error}</p></div>;
  if (!client) return <div style={{ padding: '20px' }}>Loading...</div>;

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px' }}>
      <h2>Client Details</h2>
      <div style={{ border: '1px solid #ccc', padding: '20px', marginBottom: '20px' }}>
        <p><strong>Name:</strong> {client.name}</p>
        <p><strong>Email:</strong> {client.email}</p>
        <p><strong>Phone:</strong> {client.phone}</p>
        <p><strong>Company:</strong> {client.company_name}</p>
        <p><strong>Address:</strong> {client.address}</p>
      </div>
      <button onClick={() => navigate(`/clients/${id}/edit`)} style={{ padding: '10px 20px', marginRight: '10px' }}>Edit</button>
      <button onClick={handleDelete} style={{ padding: '10px 20px', marginRight: '10px', backgroundColor: '#ff4444', color: 'white' }}>Delete</button>
      <button onClick={() => navigate('/dashboard')} style={{ padding: '10px 20px' }}>Back to Dashboard</button>
    </div>
  );
};

export default ViewClient;