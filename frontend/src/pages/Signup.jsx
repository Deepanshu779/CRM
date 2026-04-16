import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';
import { Eye, EyeOff, User, Mail, Lock } from 'lucide-react';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authService.signup(username, email, password);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      width: '100vw', 
      background: '#f0f2f5', 
      padding: '2rem',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 1000
    }}>
      <div style={{ 
        display: 'flex', 
        width: '1000px', 
        maxWidth: '95vw',
        minHeight: '600px',
        background: 'white', 
        borderRadius: '24px', 
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0,0,0,0.1)'
      }}>
        
        {/* Left Side: Branding */}
        <div style={{ 
          flex: 1, 
          background: '#e0fcfc', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          padding: '3rem',
          textAlign: 'center'
        }}>
          <h1 style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '0.5rem', color: '#1a1a1a' }}>CRM</h1>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#4a4a4a', marginBottom: '2rem', maxWidth: '300px' }}>
            Transforming leads into lasting relationships
          </h2>
          <div style={{ fontSize: '8rem', marginTop: '1rem' }}>🤝</div>
          <p style={{ marginTop: '2rem', color: '#6b7280', fontSize: '1rem', maxWidth: '350px' }}>
            Join the most intuitive CRM platform and start managing your sales pipeline today.
          </p>
        </div>

        {/* Right Side: Signup Form */}
        <div style={{ 
          flex: 1, 
          padding: '4rem 5rem', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center'
        }}>
          <h2 style={{ fontSize: '2.25rem', fontWeight: '800', marginBottom: '0.5rem' }}>Create Account</h2>
          <p style={{ color: '#6b7280', fontSize: '1.1rem', marginBottom: '2.5rem' }}>Join the CRM community</p>

          {error && <div style={{ background: '#fef2f2', color: '#ef4444', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>{error}</div>}

          <form onSubmit={handleSubmit} autoComplete="on">
            <div style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="username" style={{ fontSize: '1rem', fontWeight: '600', display: 'block', marginBottom: '0.75rem', color: '#374151' }}>Username</label>
              <div style={{ position: 'relative' }}>
                <User size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                <input 
                  id="username"
                  name="username"
                  type="text" 
                  autoComplete="username"
                  placeholder="Choose a username" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  required 
                  style={{ paddingLeft: '50px', borderColor: '#e5e7eb', background: '#fff', marginBottom: 0, height: '56px' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="email" style={{ fontSize: '1rem', fontWeight: '600', display: 'block', marginBottom: '0.75rem', color: '#374151' }}>Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                <input 
                  id="email"
                  name="email"
                  type="email" 
                  autoComplete="email"
                  placeholder="name@company.com" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  style={{ paddingLeft: '50px', borderColor: '#e5e7eb', background: '#fff', marginBottom: 0, height: '56px' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label htmlFor="password" style={{ fontSize: '1rem', fontWeight: '600', display: 'block', marginBottom: '0.75rem', color: '#374151' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                <input 
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"} 
                  autoComplete="new-password"
                  placeholder="••••••••••" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  style={{ paddingLeft: '50px', paddingRight: '50px', borderColor: '#e5e7eb', background: '#fff', marginBottom: 0, height: '56px' }}
                />
                <div 
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </div>
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1rem', height: '56px', fontSize: '1.1rem', borderRadius: '12px', background: '#0061ff', borderColor: '#0061ff' }}>
              Create Account
            </button>
          </form>

          <p style={{ marginTop: '2.5rem', textAlign: 'center', color: '#6b7280', fontSize: '1rem' }}>
            Already have an account? <Link to="/login" style={{ color: '#0061ff', fontWeight: '700', textDecoration: 'none' }}>Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
