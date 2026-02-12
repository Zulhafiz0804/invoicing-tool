import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { invoiceAPI, clientAPI } from '../services/api';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [invoices, setInvoices] = useState([]);
  const [clients, setClients] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate('/');
    loadData();
  }, [user]);

  const loadData = async () => {
    try {
      const invoicesRes = await invoiceAPI.getAll();
      const clientsRes = await clientAPI.getAll();
      setInvoices(invoicesRes.data);
      setClients(clientsRes.data);
    } catch (err) {
      console.error('Error loading data:', err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h1>Dashboard</h1>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h2>Invoices ({invoices.length})</h2>
        <button onClick={() => navigate('/invoices/new')}>Create New Invoice</button>
        <ul>
          {invoices.map(inv => (
            <li key={inv.id}>
              Invoice #{inv.invoice_number} - ${inv.amount} ({inv.status})
              <button onClick={() => navigate(`/invoices/${inv.id}`)}>View</button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2>Clients ({clients.length})</h2>
        <button onClick={() => navigate('/clients/new')}>Add New Client</button>
        <ul>
          {clients.map(client => (
            <li key={client.id}>
              {client.name} ({client.email})
              <button onClick={() => navigate(`/clients/${client.id}`)}>View</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;