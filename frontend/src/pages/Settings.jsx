import React, { useState } from 'react';
import { profileService } from '../services/api';
import { Lock, ShieldCheck, BellRing, UserCog, Save } from 'lucide-react';

const Settings = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setMessage('Passwords do not match!');
    }
    try {
      await profileService.update({ password });
      setMessage('Security credentials updated!');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setMessage('Failed to update credentials.');
    }
  };

  return (
    <div className="animate-fade-in">
      <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '2.5rem' }}>System Settings</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '3rem' }}>
        {/* Navigation Sidebar */}
        <div className="card shadow-sm" style={{ padding: '1.5rem', height: 'fit-content' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '0.75rem 1rem', background: '#f1f5f9', borderRadius: '8px', color: 'var(--primary)', fontWeight: '600' }}>
              <Lock size={18} /> Security
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '0.75rem 1rem', borderRadius: '8px', color: '#64748b' }}>
              <BellRing size={18} /> Notifications
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '0.75rem 1rem', borderRadius: '8px', color: '#64748b' }}>
              <UserCog size={18} /> Preferences
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="card shadow-sm" style={{ padding: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '2.5rem' }}>
            <div style={{ padding: '12px', background: '#f0fdf4', borderRadius: '12px', color: '#16a34a' }}>
              <ShieldCheck size={28} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Security Credentials</h3>
              <p className="text-dim" style={{ fontSize: '0.85rem' }}>Update your access credentials and authorization keys.</p>
            </div>
          </div>

          {message && <div style={{ background: message.includes('success') || message.includes('Security') ? '#f0fdf4' : '#fef2f2', color: message.includes('success') || message.includes('Security') ? '#16a34a' : '#ef4444', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>{message}</div>}

          <form onSubmit={handlePasswordChange}>
            <div style={{ maxWidth: '500px' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: '600', display: 'block', marginBottom: '8px' }}>New Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input 
                    type="password" 
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    style={{ paddingLeft: '40px', marginBottom: 0 }}
                    required
                  />
                </div>
              </div>

              <div style={{ marginBottom: '2.5rem' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: '600', display: 'block', marginBottom: '8px' }}>Confirm New Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input 
                    type="password" 
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Verify your new password"
                    style={{ paddingLeft: '40px', marginBottom: 0 }}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0.75rem 2rem' }}>
                <Save size={18} /> Update Security
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
