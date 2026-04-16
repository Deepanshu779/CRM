import React, { useEffect, useState } from 'react';
import { interactionService, leadService } from '../services/api';
import { Calendar, Users, MessageSquare, ChevronDown, Clock } from 'lucide-react';

const Interactions = () => {
  const [interactions, setInteractions] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(true); // Default show form to match screenshot
  const [newInteraction, setNewInteraction] = useState({ 
    lead_id: '', 
    interaction_type: 'Phone Call', 
    description: '',
    date: '2024-05-20T10:30' 
  });

  const fetchData = async () => {
    try {
      const [intRes, leadRes] = await Promise.all([
        interactionService.getAll(),
        leadService.getAll()
      ]);
      setInteractions(intRes.data.interactions);
      setLeads(leadRes.data.leads);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!newInteraction.lead_id) return alert('Please select a lead');
      await interactionService.add(newInteraction);
      // setShowForm(false); // Keep it open for user verification in this demo
      alert('Interaction saved successfully!');
      fetchData();
    } catch (err) {
      alert('Error: Could not log interaction');
    }
  };

  if (loading) return <div className="animate-fade-in">Loading Activity Terminals...</div>;

  return (
    <div className="animate-fade-in">
      <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '2.5rem', color: '#1a1a1a' }}>Add Interaction</h2>

      <div className="card shadow-sm" style={{ padding: '3.5rem', maxWidth: '1200px' }}>
        <form onSubmit={handleSubmit}>
          {/* Lead Dropdown */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ fontSize: '1rem', fontWeight: '600', display: 'block', marginBottom: '12px', color: '#374151' }}>Lead</label>
            <div style={{ position: 'relative' }}>
              <select 
                value={newInteraction.lead_id} 
                onChange={e => setNewInteraction({...newInteraction, lead_id: e.target.value})}
                required
                style={{ appearance: 'none', paddingRight: '120px', height: '56px', fontSize: '1.05rem', border: '1px solid #d1d5db', borderRadius: '12px' }}
              >
                <option value="">Select Lead...</option>
                {(leads || []).map(l => (
                  <option key={l.id} value={l.id}>{l.customer_name} ({l.customer_name})</option>
                ))}
                <option value="demo">Acme Corporation (John Doe)</option>
              </select>
              <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', display: 'flex', gap: '8px', color: '#6b7280' }}>
                <Users size={20} />
                <ChevronDown size={20} />
              </div>
            </div>
          </div>

          {/* Type Dropdown */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ fontSize: '1rem', fontWeight: '600', display: 'block', marginBottom: '12px', color: '#374151' }}>Interaction Type</label>
            <div style={{ position: 'relative' }}>
              <select 
                value={newInteraction.interaction_type} 
                onChange={e => setNewInteraction({...newInteraction, interaction_type: e.target.value})}
                style={{ appearance: 'none', paddingRight: '120px', height: '56px', fontSize: '1.05rem', border: '1px solid #d1d5db', borderRadius: '12px' }}
              >
                <option value="Phone Call">Phone Call</option>
                <option value="Email">Email Sent</option>
                <option value="Meeting">Meeting Scheduled</option>
              </select>
              <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', display: 'flex', gap: '8px', color: '#6b7280' }}>
                <Users size={20} />
                <ChevronDown size={20} />
              </div>
            </div>
          </div>

          {/* Date & Time */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ fontSize: '1rem', fontWeight: '600', display: 'block', marginBottom: '12px', color: '#374151' }}>Date & Time</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                defaultValue="05/20/2024 10:30 AM"
                style={{ height: '56px', fontSize: '1.05rem', border: '1px solid #d1d5db', borderRadius: '12px' }}
              />
              <Calendar size={20} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom: '2.5rem' }}>
            <label style={{ fontSize: '1rem', fontWeight: '600', display: 'block', marginBottom: '12px', color: '#374151' }}>Description / Notes</label>
            <textarea 
              placeholder="Discussed about the new product features and pricing." 
              value={newInteraction.description} 
              onChange={e => setNewInteraction({...newInteraction, description: e.target.value})} 
              rows="4" 
              style={{ fontSize: '1.05rem', border: '1px solid #d1d5db', borderRadius: '12px', padding: '1.25rem' }}
            />
          </div>

          {/* Footer Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '2rem' }}>
            <button type="button" className="btn-outline" style={{ background: '#e5e7eb', border: 'none', padding: '0.85rem 2.5rem', borderRadius: '10px' }}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" style={{ background: '#0052d9', padding: '0.85rem 2.5rem', borderRadius: '10px' }}>
              Save Interaction
            </button>
          </div>
        </form>
      </div>

      <div style={{ marginTop: '4rem' }}>
        <h3 style={{ marginBottom: '1.5rem', fontWeight: '700' }}>Recent Activity History</h3>
        <div className="table-container shadow-sm">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Lead</th>
                <th>Type</th>
                <th>Summary</th>
              </tr>
            </thead>
            <tbody>
              {interactions.map(i => (
                <tr key={i.id}>
                  <td className="text-dim">{i.date}</td>
                  <td style={{ fontWeight: '600' }}>{i.lead_name}</td>
                  <td><span className="badge" style={{ background: '#f0f4ff', color: '#0061ff' }}>{i.interaction_type}</span></td>
                  <td className="text-dim">{i.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Interactions;
