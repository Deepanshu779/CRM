import React, { useEffect, useState } from 'react';
import { profileService } from '../services/api';
import { User, Mail, Shield, Calendar, Save } from 'lucide-react';

const Profile = () => {
  const [profile, setProfile] = useState({ username: '', email: '', role: '', created_at: '' });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await profileService.get();
        setProfile(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await profileService.update(profile);
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
      localStorage.setItem('username', profile.username);
    } catch (err) {
      setMessage('Failed to update profile.');
    }
  };

  if (loading) return <div className="animate-fade-in">Accessing Profile Directory...</div>;

  return (
    <div className="animate-fade-in">
      <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '2.5rem' }}>Management Profile</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2.5rem' }}>
        {/* Profile Info Card */}
        <div className="card shadow-sm" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
          <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '2.5rem' }}>
            👤
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem' }}>{profile.username}</h3>
          <p className="text-dim" style={{ fontSize: '0.9rem', marginBottom: '2rem' }}>{profile.email}</p>
          
          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.85rem' }}>
              <Shield size={16} className="text-primary" /> <strong>Role:</strong> {profile.role}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.85rem' }}>
              <Calendar size={16} className="text-primary" /> <strong>Joined:</strong> {profile.created_at}
            </div>
          </div>
        </div>

        {/* Update Profile Card */}
        <div className="card shadow-sm" style={{ padding: '2.5rem' }}>
          <h3 style={{ marginBottom: '2rem', fontSize: '1.1rem', fontWeight: '700' }}>Edit Personal Details</h3>
          
          {message && <div style={{ background: message.includes('success') ? '#f0fdf4' : '#fef2f2', color: message.includes('success') ? '#16a34a' : '#ef4444', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>{message}</div>}

          <form onSubmit={handleUpdate}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: '600', display: 'block', marginBottom: '8px' }}>Username</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input 
                  type="text" 
                  value={profile.username} 
                  onChange={e => setProfile({...profile, username: e.target.value})}
                  style={{ paddingLeft: '40px', marginBottom: 0 }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '2.5rem' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: '600', display: 'block', marginBottom: '8px' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input 
                  type="email" 
                  value={profile.email} 
                  onChange={e => setProfile({...profile, email: e.target.value})}
                  style={{ paddingLeft: '40px', marginBottom: 0 }}
                />
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center', width: '100%' }}>
              <Save size={18} /> Update Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
