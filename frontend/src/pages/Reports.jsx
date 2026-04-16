import React, { useEffect, useState } from 'react';
import { dashboardService } from '../services/api';
import { Bar, Line } from 'react-chartjs-2';
import { Download, ChevronDown } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Reports = () => {
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

  if (loading) return <div className="animate-fade-in">Synthesizing Analytics...</div>;

  const barData = {
    labels: stats.leads_by_status ? Object.keys(stats.leads_by_status) : [],
    datasets: [{
      label: 'Volume',
      data: stats.leads_by_status ? Object.values(stats.leads_by_status) : [],
      backgroundColor: ['#60a5fa', '#3b82f6', '#2dd4bf', '#fbbf24', '#4ade80'],
      borderRadius: 4,
      barThickness: 40
    }]
  };

  const lineData = {
    labels: stats.leads_over_time ? stats.leads_over_time.map(d => d.date) : [],
    datasets: [{
      label: 'Acquisition',
      data: stats.leads_over_time ? stats.leads_over_time.map(d => d.count) : [],
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      fill: true,
      tension: 0.4,
      pointRadius: 4,
      pointBackgroundColor: '#fff',
      pointBorderWidth: 2,
      pointBorderColor: '#3b82f6'
    }]
  };

  const chartOptions = {
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { font: { family: 'Inter', size: 12, weight: '500' } } },
      y: { 
        border: { display: false },
        grid: { color: '#f1f5f9' },
        ticks: { stepSize: 10, font: { family: 'Inter', size: 12 } }
      }
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Header bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: '800' }}>Reports & Analytics</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#fff', border: '1px solid #e2e8f0', padding: '0.6rem 1.25rem', borderRadius: '8px', cursor: 'pointer' }}>
             <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>May 1, 2024 - May 20, 2024</span>
             <ChevronDown size={16} color="#64748b" />
          </div>
          <button className="btn-primary" style={{ background: '#0052d9', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Download size={18} /> Export
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="dashboard-grid" style={{ marginBottom: '2.5rem' }}>
        <div className="card shadow-sm" style={{ padding: '2rem' }}>
          <div className="text-dim" style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '1rem' }}>Total Customers</div>
          <div style={{ fontSize: '2.25rem', fontWeight: '800' }}>{stats.total_customers}</div>
        </div>
        <div className="card shadow-sm" style={{ padding: '2rem' }}>
          <div className="text-dim" style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '1rem' }}>Total Leads</div>
          <div style={{ fontSize: '2.25rem', fontWeight: '800', color: '#3b82f6' }}>{stats.total_leads}</div>
        </div>
        <div className="card shadow-sm" style={{ padding: '2rem' }}>
          <div className="text-dim" style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '1rem' }}>Closed Won</div>
          <div style={{ fontSize: '2.25rem', fontWeight: '800', color: '#16a34a' }}>{stats.closed_won}</div>
        </div>
        <div className="card shadow-sm" style={{ padding: '2rem' }}>
          <div className="text-dim" style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '1rem' }}>Conversion Rate</div>
          <div style={{ fontSize: '2.25rem', fontWeight: '800', color: '#7c3aed' }}>{stats.conversion_rate}%</div>
        </div>
      </div>

      {/* Charts section */}
      <div className="charts-grid" style={{ gridTemplateColumns: '1fr 1.25fr' }}>
        <div className="card shadow-sm" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '2rem' }}>Leads by Status</h3>
          <div style={{ height: '350px' }}>
            <Bar data={barData} options={chartOptions} />
          </div>
        </div>
        <div className="card shadow-sm" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '2rem' }}>Leads Over Time</h3>
          <div style={{ height: '350px' }}>
            <Line data={lineData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
