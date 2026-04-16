import React from 'react';
import { Bell, Info, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const Notifications = () => {
  const notifications = [
    { id: 1, type: 'info', title: 'New Lead Assigned', message: 'A new high-priority lead from "Acme Corp" has been assigned to you.', time: '2 hours ago' },
    { id: 2, type: 'success', title: 'Deal Closed', message: 'Congratulations! The "Innotech project" has been marked as Closed Won.', time: '5 hours ago' },
    { id: 3, type: 'warning', title: 'Follow-up Reminder', message: 'You have a pending meeting with John Doe in 30 minutes.', time: '1 day ago' },
    { id: 4, type: 'info', title: 'System Update', message: 'CRM Core has been updated to v2.4. New reporting tools are available.', time: '2 days ago' },
  ];

  const getIcon = (type) => {
    switch (type) {
      case 'info': return <Info size={20} className="text-primary" />;
      case 'success': return <CheckCircle size={20} style={{ color: '#16a34a' }} />;
      case 'warning': return <AlertTriangle size={20} style={{ color: '#f59e0b' }} />;
      default: return <Bell size={20} />;
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: '800' }}>Recent Activity Alerts</h2>
        <button className="btn-outline" style={{ fontSize: '0.85rem' }}>Mark all as read</button>
      </div>

      <div className="card shadow-sm" style={{ padding: 0, overflow: 'hidden' }}>
        {notifications.map((n, idx) => (
          <div key={n.id} style={{ 
            display: 'flex', 
            gap: '20px', 
            padding: '1.5rem 2rem', 
            borderBottom: idx === notifications.length - 1 ? 'none' : '1px solid #f1f5f9',
            background: n.id === 1 ? '#f8fafc' : 'white',
            cursor: 'pointer'
          }}>
            <div style={{ marginTop: '4px' }}>{getIcon(n.type)}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: '700' }}>{n.title}</h4>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={12} /> {n.time}
                </span>
              </div>
              <p className="text-dim" style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>{n.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
