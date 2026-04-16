import React, { useEffect, useState } from 'react';
import { leadService, customerService } from '../services/api';
import { Search, Plus, Pencil, Trash2, ChevronLeft, ChevronRight, X } from 'lucide-react';

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ customer_id: '', status: 'New', notes: '' });

  const fetchData = async () => {
    try {
      const [leadRes, custRes] = await Promise.all([
        leadService.getAll(),
        customerService.getAll()
      ]);
      setLeads(leadRes.data.leads);
      setCustomers(custRes.data.customers);
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
      if (editingId) {
        await leadService.update(editingId, formData);
      } else {
        await leadService.add(formData);
      }
      resetForm();
      fetchData();
    } catch (err) {
      alert('Error: Could not save lead');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;
    try {
      await leadService.delete(id);
      fetchData();
    } catch (err) {
      alert('Error deleting lead');
    }
  };

  const handleEdit = (lead) => {
    setEditingId(lead.id);
    const customer = customers.find(c => c.name === lead.customer_name);
    setFormData({ 
      customer_id: customer ? customer.id : '', 
      status: lead.status, 
      notes: lead.notes 
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ customer_id: '', status: 'New', notes: '' });
  };

  const filteredLeads = (leads || []).filter(l => 
    l.customer_name.toLowerCase().includes(search.toLowerCase()) || 
    l.status.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="animate-fade-in">Accessing Pipeline...</div>;

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: '800' }}>Leads</h2>
        <button 
          onClick={() => showForm ? resetForm() : setShowForm(true)} 
          className={showForm ? 'btn-outline' : 'btn-primary'} 
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.75rem 1.25rem' }}
        >
          {showForm ? <X size={18} /> : <Plus size={18} />} {showForm ? 'Cancel' : 'Add Lead'}
        </button>
      </div>

      {showForm && (
        <div className="card animate-fade-in" style={{ marginBottom: '2.5rem', border: '1px solid var(--primary)' }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: '700' }}>
            {editingId ? 'Update Pipeline Lead' : 'Initiate New Business Lead'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label style={{ fontSize: '0.9rem', fontWeight: '600', display: 'block', marginBottom: '8px' }}>Target Customer</label>
                <select 
                  value={formData.customer_id} 
                  onChange={e => setFormData({...formData, customer_id: e.target.value})}
                  required
                  disabled={!!editingId} // Lead customer usually shouldn't change
                >
                  <option value="">Select Customer...</option>
                  {(customers || []).map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.company || 'Private'})</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.9rem', fontWeight: '600', display: 'block', marginBottom: '8px' }}>Pipeline Status</label>
                <select 
                  value={formData.status} 
                  onChange={e => setFormData({...formData, status: e.target.value})}
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Proposal">Proposal</option>
                  <option value="Closed Won">Closed Won</option>
                </select>
              </div>
            </div>
            <label style={{ fontSize: '0.9rem', fontWeight: '600', display: 'block', marginBottom: '8px' }}>Opportunity Notes</label>
            <textarea placeholder="Describe the potential deal..." value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} rows="3" />
            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
              {editingId ? 'Update Lead' : 'Launch Lead'}
            </button>
          </form>
        </div>
      )}

      <div className="search-container">
        <div className="search-input-wrapper">
          <Search className="search-icon" size={18} />
          <input type="text" placeholder="Search leads..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="table-container shadow-sm">
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left' }}>Company/Project</th>
              <th style={{ textAlign: 'left' }}>Customer</th>
              <th style={{ textAlign: 'left' }}>Status</th>
              <th style={{ textAlign: 'left' }}>Assigned To</th>
              <th style={{ textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.map(l => (
              <tr key={l.id}>
                <td style={{ fontWeight: '600', color: '#1a1a1a' }}>Sales Pipeline Deal</td>
                <td style={{ color: '#475569' }}>{l.customer_name}</td>
                <td>
                  <span className="badge" style={{ backgroundColor: '#f0f4ff', color: '#0061ff', fontSize: '0.75rem' }}>
                    {l.status}
                  </span>
                </td>
                <td style={{ color: '#475569' }}>Admin User</td>
                <td style={{ textAlign: 'center' }}>
                  <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                    <Pencil size={18} className="action-icon" style={{ color: '#0061ff' }} onClick={() => handleEdit(l)} />
                    <Trash2 size={18} className="action-icon" style={{ color: '#ef4444' }} onClick={() => handleDelete(l.id)} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination-footer shadow-sm">
        <div style={{ fontSize: '0.9rem', color: 'var(--text-dim)', fontWeight: '500' }}>
          Showing 1 to {filteredLeads.length} of {filteredLeads.length} entries
        </div>
        <div className="pagination-controls">
          <div className="page-item"><ChevronLeft size={16} /></div>
          <div className="page-item active">1</div>
          <div className="page-item"><ChevronRight size={16} /></div>
        </div>
      </div>
    </div>
  );
};

export default Leads;
