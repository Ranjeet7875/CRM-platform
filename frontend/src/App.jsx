import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Styles
const styles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', sans-serif;
    background: #f5f7fa;
    color: #2c3e50;
  }

  .app-container {
    display: flex;
    height: 100vh;
    overflow: hidden;
  }

  .sidebar {
    width: 260px;
    background: linear-gradient(180deg, #2c3e50 0%, #34495e 100%);
    color: white;
    display: flex;
    flex-direction: column;
    box-shadow: 2px 0 10px rgba(0,0,0,0.1);
  }

  .sidebar-header {
    padding: 24px 20px;
    border-bottom: 1px solid rgba(255,255,255,0.1);
  }

  .sidebar-header h1 {
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 4px;
  }

  .sidebar-header p {
    font-size: 12px;
    opacity: 0.7;
  }

  .nav-menu {
    flex: 1;
    padding: 20px 0;
  }

  .nav-item {
    padding: 12px 20px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 15px;
  }

  .nav-item:hover {
    background: rgba(255,255,255,0.1);
  }

  .nav-item.active {
    background: rgba(255,255,255,0.15);
    border-left: 3px solid #3498db;
  }

  .nav-icon {
    width: 20px;
    height: 20px;
  }

  .user-profile {
    padding: 20px;
    border-top: 1px solid rgba(255,255,255,0.1);
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #3498db;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
  }

  .user-info h3 {
    font-size: 14px;
    margin-bottom: 2px;
  }

  .user-info p {
    font-size: 12px;
    opacity: 0.7;
  }

  .main-content {
    flex: 1;
    overflow-y: auto;
    background: #f5f7fa;
  }

  .top-bar {
    background: white;
    padding: 20px 30px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .top-bar h2 {
    font-size: 24px;
    color: #2c3e50;
  }

  .top-bar-actions {
    display: flex;
    gap: 12px;
  }

  .btn {
    padding: 10px 20px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .btn-primary {
    background: #3498db;
    color: white;
  }

  .btn-primary:hover {
    background: #2980b9;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
  }

  .btn-secondary {
    background: white;
    color: #2c3e50;
    border: 1px solid #ddd;
  }

  .btn-secondary:hover {
    background: #f8f9fa;
  }

  .content-area {
    padding: 30px;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
  }

  .stat-card {
    background: white;
    padding: 24px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    transition: all 0.3s ease;
  }

  .stat-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 20px rgba(0,0,0,0.1);
  }

  .stat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }

  .stat-title {
    font-size: 14px;
    color: #7f8c8d;
    font-weight: 500;
  }

  .stat-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .stat-value {
    font-size: 32px;
    font-weight: 700;
    color: #2c3e50;
    margin-bottom: 8px;
  }

  .stat-change {
    font-size: 13px;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .stat-change.positive {
    color: #27ae60;
  }

  .stat-change.negative {
    color: #e74c3c;
  }

  .charts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
  }

  .chart-card {
    background: white;
    padding: 24px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  }

  .chart-card h3 {
    font-size: 18px;
    margin-bottom: 20px;
    color: #2c3e50;
  }

  .data-table {
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    overflow: hidden;
  }

  .table-header {
    padding: 20px 24px;
    border-bottom: 1px solid #ecf0f1;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .table-header h3 {
    font-size: 18px;
    color: #2c3e50;
  }

  .search-box {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    border: 1px solid #ddd;
    border-radius: 6px;
    background: #f8f9fa;
  }

  .search-box input {
    border: none;
    background: none;
    outline: none;
    font-size: 14px;
    width: 200px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  thead {
    background: #f8f9fa;
  }

  th {
    padding: 16px 24px;
    text-align: left;
    font-size: 13px;
    font-weight: 600;
    color: #7f8c8d;
    text-transform: uppercase;
  }

  td {
    padding: 16px 24px;
    border-top: 1px solid #ecf0f1;
    font-size: 14px;
    color: #2c3e50;
  }

  tbody tr {
    transition: background 0.2s ease;
  }

  tbody tr:hover {
    background: #f8f9fa;
  }

  .status-badge {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
  }

  .status-new {
    background: #e3f2fd;
    color: #1976d2;
  }

  .status-contacted {
    background: #fff3e0;
    color: #f57c00;
  }

  .status-qualified {
    background: #f3e5f5;
    color: #7b1fa2;
  }

  .status-converted {
    background: #e8f5e9;
    color: #388e3c;
  }

  .status-lost {
    background: #ffebee;
    color: #d32f2f;
  }

  .priority-high {
    color: #e74c3c;
    font-weight: 600;
  }

  .priority-medium {
    color: #f39c12;
    font-weight: 600;
  }

  .priority-low {
    color: #95a5a6;
  }

  .action-buttons {
    display: flex;
    gap: 8px;
  }

  .icon-btn {
    width: 32px;
    height: 32px;
    border: none;
    background: #f8f9fa;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
  }

  .icon-btn:hover {
    background: #3498db;
    color: white;
  }

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .modal {
    background: white;
    border-radius: 12px;
    width: 90%;
    max-width: 600px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  }

  .modal-header {
    padding: 24px;
    border-bottom: 1px solid #ecf0f1;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .modal-header h2 {
    font-size: 20px;
    color: #2c3e50;
  }

  .close-btn {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #95a5a6;
  }

  .modal-body {
    padding: 24px;
  }

  .form-group {
    margin-bottom: 20px;
  }

  .form-group label {
    display: block;
    margin-bottom: 8px;
    font-size: 14px;
    font-weight: 500;
    color: #2c3e50;
  }

  .form-group input,
  .form-group select,
  .form-group textarea {
    width: 100%;
    padding: 10px 14px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 14px;
    font-family: inherit;
    transition: border-color 0.3s ease;
  }

  .form-group input:focus,
  .form-group select:focus,
  .form-group textarea:focus {
    outline: none;
    border-color: #3498db;
  }

  .form-group textarea {
    resize: vertical;
    min-height: 100px;
  }

  .modal-footer {
    padding: 20px 24px;
    border-top: 1px solid #ecf0f1;
    display: flex;
    justify-content: flex-end;
    gap: 12px;
  }

  .notification-badge {
    position: relative;
  }

  .notification-badge::after {
    content: attr(data-count);
    position: absolute;
    top: -8px;
    right: -8px;
    background: #e74c3c;
    color: white;
    font-size: 11px;
    font-weight: 600;
    padding: 2px 6px;
    border-radius: 10px;
    min-width: 18px;
    text-align: center;
  }

  .activity-timeline {
    margin-top: 20px;
  }

  .timeline-item {
    display: flex;
    gap: 16px;
    margin-bottom: 24px;
    position: relative;
  }

  .timeline-item::before {
    content: '';
    position: absolute;
    left: 11px;
    top: 32px;
    bottom: -24px;
    width: 2px;
    background: #ecf0f1;
  }

  .timeline-item:last-child::before {
    display: none;
  }

  .timeline-icon {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: #3498db;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 12px;
    flex-shrink: 0;
    z-index: 1;
  }

  .timeline-content {
    flex: 1;
  }

  .timeline-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 4px;
  }

  .timeline-title {
    font-weight: 600;
    font-size: 14px;
    color: #2c3e50;
  }

  .timeline-time {
    font-size: 12px;
    color: #95a5a6;
  }

  .timeline-text {
    font-size: 14px;
    color: #7f8c8d;
    line-height: 1.5;
  }

  .login-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }

  .login-box {
    background: white;
    padding: 48px;
    border-radius: 16px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    width: 100%;
    max-width: 420px;
  }

  .login-header {
    text-align: center;
    margin-bottom: 32px;
  }

  .login-header h1 {
    font-size: 28px;
    color: #2c3e50;
    margin-bottom: 8px;
  }

  .login-header p {
    color: #7f8c8d;
    font-size: 14px;
  }

  .tabs {
    display: flex;
    gap: 8px;
    margin-bottom: 24px;
    background: #f8f9fa;
    padding: 4px;
    border-radius: 8px;
  }

  .tab {
    flex: 1;
    padding: 10px;
    border: none;
    background: none;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    border-radius: 6px;
    transition: all 0.3s ease;
    color: #7f8c8d;
  }

  .tab.active {
    background: white;
    color: #3498db;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
`;

// Mock data
const salesData = [
  { month: 'Jan', revenue: 45000, leads: 120 },
  { month: 'Feb', revenue: 52000, leads: 145 },
  { month: 'Mar', revenue: 48000, leads: 130 },
  { month: 'Apr', revenue: 61000, leads: 170 },
  { month: 'May', revenue: 72000, leads: 195 },
  { month: 'Jun', revenue: 68000, leads: 180 },
];

const leadStatusData = [
  { name: 'New', value: 35, color: '#3498db' },
  { name: 'Contacted', value: 28, color: '#f39c12' },
  { name: 'Qualified', value: 22, color: '#9b59b6' },
  { name: 'Converted', value: 15, color: '#27ae60' },
];

const mockLeads = [
  { id: 1, name: 'Acme Corp', contact: 'John Smith', email: 'john@acme.com', status: 'qualified', priority: 'high', value: '$45,000', owner: 'Sarah Johnson' },
  { id: 2, name: 'TechStart Inc', contact: 'Emily Davis', email: 'emily@techstart.com', status: 'contacted', priority: 'medium', value: '$28,000', owner: 'Mike Chen' },
  { id: 3, name: 'Global Solutions', contact: 'Robert Brown', email: 'robert@global.com', status: 'new', priority: 'high', value: '$62,000', owner: 'Sarah Johnson' },
  { id: 4, name: 'Innovate Labs', contact: 'Lisa Anderson', email: 'lisa@innovate.com', status: 'converted', priority: 'low', value: '$15,000', owner: 'James Wilson' },
  { id: 5, name: 'NextGen Systems', contact: 'David Martinez', email: 'david@nextgen.com', status: 'qualified', priority: 'medium', value: '$38,000', owner: 'Mike Chen' },
];

const activityData = [
  { type: 'call', title: 'Phone call with John Smith', text: 'Discussed pricing and implementation timeline. Positive response.', time: '2 hours ago' },
  { type: 'email', title: 'Email sent to Emily Davis', text: 'Sent follow-up proposal with detailed breakdown.', time: '5 hours ago' },
  { type: 'meeting', title: 'Demo meeting scheduled', text: 'Product demo scheduled for Acme Corp - June 20th at 2 PM', time: '1 day ago' },
  { type: 'note', title: 'Status updated to Qualified', text: 'Lead moved to qualified stage after successful call.', time: '2 days ago' },
];

function App() {
  const [currentView, setCurrentView] = useState('login');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showModal, setShowModal] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [notifications, setNotifications] = useState(3);

  const handleLogin = (role) => {
    setUserRole(role);
    setCurrentView('app');
  };

  const filteredLeads = mockLeads.filter(lead =>
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.contact.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (currentView === 'login') {
    return (
      <>
        <style>{styles}</style>
        <div className="login-container">
          <div className="login-box">
            <div className="login-header">
              <h1>CRM Platform</h1>
              <p>Select your role to continue</p>
            </div>
            
            <div className="tabs">
              <button className="tab active">Demo Login</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button 
                className="btn btn-primary" 
                style={{ width: '100%', justifyContent: 'center', padding: '14px' }}
                onClick={() => handleLogin('Admin')}
              >
                Login as Admin
              </button>
              <button 
                className="btn btn-primary" 
                style={{ width: '100%', justifyContent: 'center', padding: '14px' }}
                onClick={() => handleLogin('Manager')}
              >
                Login as Manager
              </button>
              <button 
                className="btn btn-primary" 
                style={{ width: '100%', justifyContent: 'center', padding: '14px' }}
                onClick={() => handleLogin('Sales Executive')}
              >
                Login as Sales Executive
              </button>
            </div>

            <p style={{ marginTop: '24px', textAlign: 'center', fontSize: '13px', color: '#7f8c8d' }}>
              This is a demo version. Full authentication with JWT is implemented in the backend.
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="app-container">
        <div className="sidebar">
          <div className="sidebar-header">
            <h1>CRM Platform</h1>
            <p>Sales Management System</p>
          </div>

          <div className="nav-menu">
            <div 
              className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <span className="nav-icon">📊</span>
              Dashboard
            </div>
            <div 
              className={`nav-item ${activeTab === 'leads' ? 'active' : ''}`}
              onClick={() => setActiveTab('leads')}
            >
              <span className="nav-icon">👥</span>
              Leads
            </div>
            <div 
              className={`nav-item ${activeTab === 'activities' ? 'active' : ''}`}
              onClick={() => setActiveTab('activities')}
            >
              <span className="nav-icon">📅</span>
              Activities
            </div>
            <div 
              className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveTab('analytics')}
            >
              <span className="nav-icon">📈</span>
              Analytics
            </div>
            <div className="nav-item">
              <span className="nav-icon">⚙️</span>
              Settings
            </div>
          </div>

          <div className="user-profile">
            <div className="user-avatar">
              {userRole.charAt(0)}
            </div>
            <div className="user-info">
              <h3>{userRole} User</h3>
              <p>{userRole.toLowerCase()}@crm.com</p>
            </div>
          </div>
        </div>

        <div className="main-content">
          <div className="top-bar">
            <h2>
              {activeTab === 'dashboard' && 'Dashboard'}
              {activeTab === 'leads' && 'Lead Management'}
              {activeTab === 'activities' && 'Activity Timeline'}
              {activeTab === 'analytics' && 'Analytics'}
            </h2>
            <div className="top-bar-actions">
              <button className="btn btn-secondary notification-badge" data-count={notifications}>
                🔔 Notifications
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => setShowModal(true)}
              >
                + Add New Lead
              </button>
            </div>
          </div>

          <div className="content-area">
            {activeTab === 'dashboard' && (
              <>
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-header">
                      <span className="stat-title">Total Leads</span>
                      <div className="stat-icon" style={{ background: '#e3f2fd' }}>
                        👥
                      </div>
                    </div>
                    <div className="stat-value">248</div>
                    <div className="stat-change positive">
                      ↑ 12% from last month
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-header">
                      <span className="stat-title">Conversion Rate</span>
                      <div className="stat-icon" style={{ background: '#e8f5e9' }}>
                        📈
                      </div>
                    </div>
                    <div className="stat-value">18.2%</div>
                    <div className="stat-change positive">
                      ↑ 3.1% from last month
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-header">
                      <span className="stat-title">Revenue</span>
                      <div className="stat-icon" style={{ background: '#f3e5f5' }}>
                        💰
                      </div>
                    </div>
                    <div className="stat-value">$68K</div>
                    <div className="stat-change positive">
                      ↑ 8.4% from last month
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-header">
                      <span className="stat-title">Active Deals</span>
                      <div className="stat-icon" style={{ background: '#fff3e0' }}>
                        🎯
                      </div>
                    </div>
                    <div className="stat-value">42</div>
                    <div className="stat-change negative">
                      ↓ 2.3% from last month
                    </div>
                  </div>
                </div>

                <div className="charts-grid">
                  <div className="chart-card">
                    <h3>Revenue Trend</h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={salesData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ecf0f1" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="revenue" stroke="#3498db" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="chart-card">
                    <h3>Lead Distribution</h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={leadStatusData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={(entry) => entry.name}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {leadStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="chart-card">
                  <h3>Monthly Performance</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ecf0f1" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="leads" fill="#3498db" />
                      <Bar dataKey="revenue" fill="#27ae60" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </>
            )}

            {activeTab === 'leads' && (
              <div className="data-table">
                <div className="table-header">
                  <h3>All Leads ({filteredLeads.length})</h3>
                  <div className="search-box">
                    <span>🔍</span>
                    <input 
                      type="text" 
                      placeholder="Search leads..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <table>
                  <thead>
                    <tr>
                      <th>Company</th>
                      <th>Contact</th>
                      <th>Email</th>
                      <th>Status</th>
                      <th>Priority</th>
                      <th>Value</th>
                      <th>Owner</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeads.map(lead => (
                      <tr key={lead.id}>
                        <td><strong>{lead.name}</strong></td>
                        <td>{lead.contact}</td>
                        <td>{lead.email}</td>
                        <td>
                          <span className={`status-badge status-${lead.status}`}>
                            {lead.status}
                          </span>
                        </td>
                        <td className={`priority-${lead.priority}`}>
                          {lead.priority}
                        </td>
                        <td><strong>{lead.value}</strong></td>
                        <td>{lead.owner}</td>
                        <td>
                          <div className="action-buttons">
                            <button className="icon-btn" title="View">👁️</button>
                            <button className="icon-btn" title="Edit">✏️</button>
                            <button className="icon-btn" title="Delete">🗑️</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'activities' && (
              <div className="chart-card">
                <h3>Recent Activities</h3>
                <div className="activity-timeline">
                  {activityData.map((activity, index) => (
                    <div key={index} className="timeline-item">
                      <div className="timeline-icon">
                        {activity.type === 'call' && '📞'}
                        {activity.type === 'email' && '📧'}
                        {activity.type === 'meeting' && '🤝'}
                        {activity.type === 'note' && '📝'}
                      </div>
                      <div className="timeline-content">
                        <div className="timeline-header">
                          <span className="timeline-title">{activity.title}</span>
                          <span className="timeline-time">{activity.time}</span>
                        </div>
                        <p className="timeline-text">{activity.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <>
                <div className="charts-grid">
                  <div className="chart-card">
                    <h3>Sales Pipeline</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={salesData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ecf0f1" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="revenue" fill="#3498db" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="chart-card">
                    <h3>Lead Sources</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Website', value: 45, color: '#3498db' },
                            { name: 'Referral', value: 30, color: '#27ae60' },
                            { name: 'Social Media', value: 15, color: '#f39c12' },
                            { name: 'Direct', value: 10, color: '#9b59b6' },
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={(entry) => `${entry.name}: ${entry.value}%`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {[
                            { name: 'Website', value: 45, color: '#3498db' },
                            { name: 'Referral', value: 30, color: '#27ae60' },
                            { name: 'Social Media', value: 15, color: '#f39c12' },
                            { name: 'Direct', value: 10, color: '#9b59b6' },
                          ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="chart-card">
                  <h3>Team Performance Comparison</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart 
                      data={[
                        { name: 'Sarah Johnson', leads: 45, converted: 12 },
                        { name: 'Mike Chen', leads: 38, converted: 8 },
                        { name: 'James Wilson', leads: 32, converted: 7 },
                        { name: 'Emily Parker', leads: 41, converted: 10 },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#ecf0f1" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="leads" fill="#3498db" />
                      <Bar dataKey="converted" fill="#27ae60" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </>
            )}
          </div>
        </div>

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Add New Lead</h2>
                <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>Company Name *</label>
                  <input type="text" placeholder="Enter company name" />
                </div>
                <div className="form-group">
                  <label>Contact Person *</label>
                  <input type="text" placeholder="Enter contact name" />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input type="email" placeholder="contact@company.com" />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input type="tel" placeholder="+1 (555) 000-0000" />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select>
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="converted">Converted</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Priority</label>
                  <select>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Estimated Value</label>
                  <input type="text" placeholder="$0" />
                </div>
                <div className="form-group">
                  <label>Notes</label>
                  <textarea placeholder="Add any additional information..."></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={() => {
                  alert('Lead would be saved to database via API');
                  setShowModal(false);
                }}>
                  Save Lead
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;