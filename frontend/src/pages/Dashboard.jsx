import React, { useEffect, useState } from 'react';
import { dashboardService } from '../services/api';
import { Bar, Doughnut } from 'react-chartjs-2';
import { TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await dashboardService.getStats();
        setStats(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="animate-fade-in">Initializing Dashboard Intelligence...</div>;
  if (!stats) return <div className="card">Session Timed Out. Please re-authenticate.</div>;

  const statusColors = ['#0061ff', '#22d3ee', '#10b981', '#f59e0b', '#ef4444'];
  
  const doughnutData = {
    labels: stats.leads_by_status ? Object.keys(stats.leads_by_status) : [],
    datasets: [{
      data: stats.leads_by_status ? Object.values(stats.leads_by_status) : [],
      backgroundColor: statusColors,
      borderWidth: 0,
      hoverOffset: 10,
      cutout: '75%'
    }]
  };

  const funnelData = {
    labels: stats.leads_by_status ? Object.keys(stats.leads_by_status) : [],
    datasets: [{
      label: 'Volume',
      data: stats.leads_by_status ? Object.values(stats.leads_by_status).sort((a,b) => b-a) : [],
      backgroundColor: statusColors,
      borderRadius: 4,
      barThickness: (context) => {
        const index = context.dataIndex;
        return 60 - (index * 10);
      }
    }]
  };

  const getInteractionBadge = (type) => {
    switch (type) {
      case 'Call': return { bg: '#ebf5ff', color: '#0061ff' };
      case 'Email': return { bg: '#fff7ed', color: '#f97316' };
      case 'Meeting': return { bg: '#f0fdf4', color: '#16a34a' };
      default: return { bg: '#f9fafb', color: '#6b7280' };
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="dashboard-grid">
        <div className="card stat-card">
          <div className="text-dim" style={{ fontSize: '0.9rem', fontWeight: '600' }}>Total Customers</div>
          <div className="stat-value">{stats.total_customers}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }} className="text-success">
            <ArrowUpRight size={14} /> 12.5% <span className="text-light">from last month</span>
          </div>
        </div>
        <div className="card stat-card">
          <div className="text-dim" style={{ fontSize: '0.9rem', fontWeight: '600' }}>Total Leads</div>
          <div className="stat-value" style={{ color: '#0061ff' }}>{stats.total_leads}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }} className="text-success">
            <ArrowUpRight size={14} /> 8.2% <span className="text-light">from last month</span>
          </div>
        </div>
        <div className="card stat-card">
          <div className="text-dim" style={{ fontSize: '0.9rem', fontWeight: '600' }}>Open Leads</div>
          <div className="stat-value" style={{ color: '#f59e0b' }}>{stats.open_leads || 0}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }} className="text-warning">
            <ArrowUpRight size={14} /> 5.4% <span className="text-light">from last month</span>
          </div>
        </div>
        <div className="card stat-card">
          <div className="text-dim" style={{ fontSize: '0.9rem', fontWeight: '600' }}>Total Interactions</div>
          <div className="stat-value" style={{ color: '#8b5cf6' }}>{stats.total_interactions || 0}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }} className="text-success">
            <TrendingUp size={14} /> 15.3% <span className="text-light">from last month</span>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Leads by Status</h3>
            <div className="text-light" style={{ fontSize: '0.85rem' }}>Total: {stats.total_leads}</div>
          </div>
          <div style={{ height: '350px', position: 'relative' }}>
            <Doughnut data={doughnutData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'right', labels: { padding: 20, font: { family: 'Inter', size: 12 } } } } }} />
            <div style={{ position: 'absolute', top: '50%', left: '35%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: '800' }}>{stats.total_leads}</div>
              <div className="text-light" style={{ fontSize: '0.75rem', fontWeight: '600' }}>TOTAL</div>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Recent Interactions</h3>
            <a href="/interactions" className="text-primary" style={{ fontSize: '0.85rem', fontWeight: '600', textDecoration: 'none' }}>View All</a>
          </div>
          <div className="interaction-list">
            {(stats.recent_interactions || []).map(i => {
              const style = getInteractionBadge(i.interaction_type);
              return (
                <div key={i.id} className="interaction-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>{i.description}</div>
                    <div className="text-dim" style={{ fontSize: '0.85rem', marginTop: '4px' }}>Lead: {i.lead_name}</div>
                  </div>
                  <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                    <span className="badge" style={{ backgroundColor: style.bg, color: style.color, fontSize: '0.7rem' }}>{i.interaction_type}</span>
                    <div className="text-light" style={{ fontSize: '0.75rem' }}>{i.date}</div>
                  </div>
                </div>
              );
            })}
            {(!stats.recent_interactions || stats.recent_interactions.length === 0) && (
              <div style={{ textAlign: 'center', color: 'var(--text-light)', padding: '3rem' }}>No activity stream detected.</div>
            )}
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: '2rem', width: '35%' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '2rem' }}>Sales Pipeline</h3>
        <div style={{ height: '300px' }}>
           <Bar 
              data={funnelData} 
              options={{ 
                indexAxis: 'y', 
                maintainAspectRatio: false, 
                plugins: { legend: { display: false } },
                scales: { 
                    x: { display: false }, 
                    y: { grid: { display: false }, ticks: { font: { family: 'Inter', weight: '600' } } } 
                } 
              }} 
            />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
