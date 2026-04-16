import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Target, 
  MessageSquare, 
  BarChart3, 
  Settings as SettingsIcon, 
  LogOut,
  Bell,
  Search,
  Menu
} from 'lucide-react';

import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Leads from './pages/Leads';
import Interactions from './pages/Interactions';
import Reports from './pages/Reports';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Notifications from './pages/Notifications';

const Layout = ({ token, handleLogout, children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const username = localStorage.getItem('username') || 'Admin User';

  if (!token) return children;

  return (
    <>
      <nav className="animate-fade-in shadow-lg">
        <div className="sidebar-brand">
          <Menu className="menu-icon" size={20} style={{ marginRight: '10px' }} />
          CRM System
        </div>
        <ul className="nav-links">
          <li>
            <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>
              <LayoutDashboard size={18} /> Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/customers" className={({ isActive }) => isActive ? 'active' : ''}>
              <Users size={18} /> Customers
            </NavLink>
          </li>
          <li>
            <NavLink to="/leads" className={({ isActive }) => isActive ? 'active' : ''}>
              <Target size={18} /> Leads
            </NavLink>
          </li>
          <li>
            <NavLink to="/interactions" className={({ isActive }) => isActive ? 'active' : ''}>
              <MessageSquare size={18} /> Interactions
            </NavLink>
          </li>
          <li>
            <NavLink to="/reports" className={({ isActive }) => isActive ? 'active' : ''}>
              <BarChart3 size={18} /> Reports
            </NavLink>
          </li>
          <li>
            <NavLink to="/settings" className={({ isActive }) => isActive ? 'active' : ''}>
              <SettingsIcon size={18} /> Settings
            </NavLink>
          </li>
        </ul>
        <div className="logout-btn">
          <button onClick={handleLogout} className="btn-outline" style={{ 
            width: '100%', 
            borderColor: 'rgba(255,255,255,0.1)', 
            color: '#d1d5db',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            justifyContent: 'center'
          }}>
            <LogOut size={18} /> Logout
          </button>
        </div>
      </nav>

      <header className="top-header shadow-sm">
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Menu className="text-dim" style={{ cursor: 'pointer' }} size={20} />
          <div style={{ fontWeight: '600', color: 'var(--text-main)', fontSize: '1.1rem' }}>
             {location.pathname === '/' ? 'Dashboard' : location.pathname.split('/')[1].charAt(0).toUpperCase() + location.pathname.split('/')[1].slice(1)}
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
          <Search className="text-dim" size={20} style={{ cursor: 'pointer' }} />
          <Bell className="text-dim" size={20} style={{ cursor: 'pointer' }} onClick={() => navigate('/notifications')} />
          <div 
            onClick={() => navigate('/profile')} 
            style={{ display: 'flex', alignItems: 'center', gap: '12px', shadow: 'none', borderLeft: '1px solid var(--border)', paddingLeft: '25px', cursor: 'pointer' }}
          >
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: '700' }}>{username}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: '500' }}>Admin</div>
            </div>
            <img 
              src={`https://ui-avatars.com/api/?name=${username}&background=0061ff&color=fff`} 
              alt="Avatar" 
              style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
            />
          </div>
        </div>
      </header>
      
      <main className="main-content">
        {children}
      </main>
    </>
  );
};

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
    }
  }, [token]);

  const handleLogout = () => {
    setToken(null);
  };

  const PrivateRoute = ({ children }) => {
    return token ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      <Layout token={token} handleLogout={handleLogout}>
        <Routes>
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/customers" element={<PrivateRoute><Customers /></PrivateRoute>} />
          <Route path="/leads" element={<PrivateRoute><Leads /></PrivateRoute>} />
          <Route path="/interactions" element={<PrivateRoute><Interactions /></PrivateRoute>} />
          <Route path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
          <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
