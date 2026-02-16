import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { invoiceAPI, clientAPI } from '../services/api';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [invoices, setInvoices] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate('/');
    loadData();
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      const invoicesRes = await invoiceAPI.getAll();
      const clientsRes = await clientAPI.getAll();
      setInvoices(invoicesRes.data);
      setClients(clientsRes.data);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      draft: 'badge-warning',
      sent: 'badge-info',
      paid: 'badge-success',
    };
    return statusMap[status] || 'badge-primary';
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-logo">
            <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
              <rect width="48" height="48" rx="12" fill="#2563eb" />
              <text x="24" y="32" fontSize="24" fontWeight="bold" fill="white" textAnchor="middle">$</text>
            </svg>
            <h1>Invoice Pro</h1>
          </div>
          <div className="header-actions">
            <span className="user-greeting">Welcome, {user?.name}! 👋</span>
            <button onClick={handleLogout} className="btn-logout">
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="container">
          {/* Stats */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon invoices">📄</div>
              <div className="stat-content">
                <h3>{invoices.length}</h3>
                <p>Total Invoices</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon clients">👥</div>
              <div className="stat-content">
                <h3>{clients.length}</h3>
                <p>Total Clients</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon amount">💰</div>
              <div className="stat-content">
                <h3>${(invoices.reduce((sum, inv) => sum + (parseFloat(inv.amount) || 0), 0)).toFixed(2)}</h3>
                <p>Total Amount</p>
              </div>
            </div>
          </div>

          {/* Sections */}
          <div className="dashboard-sections">
            {/* Invoices Section */}
            <section className="dashboard-section">
              <div className="section-header">
                <h2>Recent Invoices</h2>
                <button 
                  onClick={() => navigate('/invoices/new')}
                  className="btn-primary btn-sm"
                >
                  ➕ Create Invoice
                </button>
              </div>

              {loading ? (
                <div className="loading">Loading invoices...</div>
              ) : invoices.length === 0 ? (
                <div className="empty-state">
                  <p>No invoices yet. Create your first invoice!</p>
                </div>
              ) : (
                <div className="invoices-list">
                  {invoices.map((inv) => (
                    <div 
                      key={inv.id} 
                      className="invoice-item"
                      onClick={() => navigate(`/invoices/${inv.id}`)}
                    >
                      <div className="invoice-info">
                        <h4>Invoice #{inv.invoice_number}</h4>
                        <p className="invoice-date">
                          {new Date(inv.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="invoice-details">
                        <span className={`badge ${getStatusBadge(inv.status)}`}>
                          {inv.status.toUpperCase()}
                        </span>
                        <span className="invoice-amount">
                          ${parseFloat(inv.amount).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Clients Section */}
            <section className="dashboard-section">
              <div className="section-header">
                <h2>Your Clients</h2>
                <button 
                  onClick={() => navigate('/clients/new')}
                  className="btn-primary btn-sm"
                >
                  ➕ Add Client
                </button>
              </div>

              {loading ? (
                <div className="loading">Loading clients...</div>
              ) : clients.length === 0 ? (
                <div className="empty-state">
                  <p>No clients yet. Add your first client!</p>
                </div>
              ) : (
                <div className="clients-list">
                  {clients.map((client) => (
                    <div 
                      key={client.id} 
                      className="client-item"
                      onClick={() => navigate(`/clients/${client.id}`)}
                    >
                      <div className="client-avatar">
                        {client.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="client-info">
                        <h4>{client.name}</h4>
                        <p>{client.company_name}</p>
                        <p className="client-email">{client.email}</p>
                      </div>
                      <div className="client-action">
                        <span className="arrow">→</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;