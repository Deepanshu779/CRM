import React, { useEffect, useState } from 'react';
import { customerService } from '../services/api';
import { Search, Plus, Pencil, Trash2, ChevronLeft, ChevronRight, X } from 'lucide-react';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', company: '', notes: '' });

  const fetchCustomers = async () => {
    try {
      const response = await customerService.getAll();
      setCustomers(response.data.customers);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await customerService.update(editingId, formData);
      } else {
        await customerService.add(formData);
      }
      resetForm();
      fetchCustomers();
    } catch (err) {
      alert('Error saving record');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) return;
    try {
      await customerService.delete(id);
      fetchCustomers();
    } catch (err) {
      alert('Error deleting record');
    }
  };

  const handleEdit = (customer) => {
    setEditingId(customer.id);
    setFormData(customer);
    setShowForm(true);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ name: '', email: '', phone: '', company: '', notes: '' });
  };

  const filteredCustomers = (customers || []).filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.email.toLowerCase().includes(search.toLowerCase()) || 
    (c.company && c.company.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) return <div className="animate-fade-in">Loading Global Database...</div>;

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: '800' }}>Customers</h2>
        <button 
          onClick={() => showForm ? resetForm() : setShowForm(true)} 
          className={showForm ? 'btn-outline' : 'btn-primary'} 
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.75rem 1.25rem' }}
        >
          {showForm ? <X size={18} /> : <Plus size={18} />} {showForm ? 'Cancel' : 'Add Customer'}
        </button>
      </div>

      {showForm && (
        <div className="card animate-fade-in" style={{ marginBottom: '2.5rem', border: '1px solid var(--primary)' }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: '700' }}>
            {editingId ? 'Edit Customer Profile' : 'Create New Customer Profile'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label style={{ fontSize: '0.9rem', fontWeight: '600', display: 'block', marginBottom: '8px' }}>Full Name</label>
                <input placeholder="Ex: John Doe" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              </div>
              <div>
                <label style={{ fontSize: '0.9rem', fontWeight: '600', display: 'block', marginBottom: '8px' }}>Email Address</label>
                <input placeholder="john.doe@example.com" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
              </div>
              <div>
                <label style={{ fontSize: '0.9rem', fontWeight: '600', display: 'block', marginBottom: '8px' }}>Phone Number</label>
                <input placeholder="+1 234 567 890" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div>
                <label style={{ fontSize: '0.9rem', fontWeight: '600', display: 'block', marginBottom: '8px' }}>Company</label>
                <input placeholder="Acme Corporation" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} />
              </div>
            </div>
            <label style={{ fontSize: '0.9rem', fontWeight: '600', display: 'block', marginBottom: '8px' }}>Notes</label>
            <textarea placeholder="Additional business notes..." value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} rows="3" />
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" className="btn-primary" style={{ flex: 1, marginTop: '0.5rem' }}>
                {editingId ? 'Update Profile' : 'Save Profile'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="search-container">
        <div className="search-input-wrapper">
          <Search className="search-icon" size={18} />
          <input type="text" placeholder="Search customers..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="table-container shadow-sm">
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left' }}>Name</th>
              <th style={{ textAlign: 'left' }}>Email</th>
              <th style={{ textAlign: 'left' }}>Phone</th>
              <th style={{ textAlign: 'left' }}>Company</th>
              <th style={{ textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map(c => (
              <tr key={c.id}>
                <td style={{ fontWeight: '600', color: '#1a1a1a' }}>{c.name}</td>
                <td style={{ color: '#475569' }}>{c.email}</td>
                <td style={{ color: '#475569' }}>{c.phone || '-'}</td>
                <td style={{ color: '#475569' }}>{c.company || '-'}</td>
                <td style={{ textAlign: 'center' }}>
                  <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                    <Pencil size={18} className="action-icon" style={{ color: '#0061ff' }} onClick={() => handleEdit(c)} />
                    <Trash2 size={18} className="action-icon" style={{ color: '#ef4444' }} onClick={() => handleDelete(c.id)} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination-footer shadow-sm">
        <div style={{ fontSize: '0.9rem', color: 'var(--text-dim)', fontWeight: '500' }}>
          Showing 1 to {filteredCustomers.length} of {filteredCustomers.length} entries
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

export default Customers;
