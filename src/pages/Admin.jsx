import React, { useState, useEffect } from 'react';
import { useUser } from '../hooks/useUser';
import { fetchApi } from '../lib/api';

interface AdminStats {
  users: { total: number; activeThisMonth: number; newThisMonth: number };
  submissions: { total: number; thisMonth: number; avgScore: number; solvedCount: number };
  revenue: { mrr: number; arr: number; churnRate: number };
  engagement: { dau: number; mau: number };
}

export default function Admin() {
  const { user } = useUser();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'reports'>('dashboard');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await fetchApi('/api/admin/stats');
      setStats(data);
    } catch (error) {
      console.error('Failed to load admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (!stats) return <div className="p-8">No access</div>;

  return (
    <div className="min-h-screen bg-cream p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="border-4 border-dark p-6 retro-box mb-12">
          <h1 className="text-4xl font-bold font-mono text-dark mb-2">Admin Dashboard</h1>
          <p className="text-dark">Platform management and analytics</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-12 border-b-4 border-dark">
          {(['dashboard', 'users', 'reports'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 border-4 border-dark border-b-0 font-mono font-bold ${
                activeTab === tab
                  ? 'bg-green-dark text-cream'
                  : 'bg-cream text-dark'
              }`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* User Metrics */}
            <div className="border-4 border-dark p-8 retro-box">
              <h2 className="text-2xl font-bold text-dark mb-6">User Metrics</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 border-3 border-dark">
                  <p className="text-sm text-dark/70">TOTAL USERS</p>
                  <p className="text-3xl font-bold text-green-dark">{stats.users.total}</p>
                </div>
                <div className="p-4 border-3 border-dark">
                  <p className="text-sm text-dark/70">ACTIVE THIS MONTH</p>
                  <p className="text-3xl font-bold text-green-dark">{stats.users.activeThisMonth}</p>
                </div>
                <div className="p-4 border-3 border-dark">
                  <p className="text-sm text-dark/70">NEW THIS MONTH</p>
                  <p className="text-3xl font-bold text-green-dark">{stats.users.newThisMonth}</p>
                </div>
                <div className="p-4 border-3 border-dark">
                  <p className="text-sm text-dark/70">DAU</p>
                  <p className="text-3xl font-bold text-green-dark">{stats.engagement.dau}</p>
                </div>
              </div>
            </div>

            {/* Submission Metrics */}
            <div className="border-4 border-dark p-8 retro-box">
              <h2 className="text-2xl font-bold text-dark mb-6">Submission Metrics</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 border-3 border-dark">
                  <p className="text-sm text-dark/70">TOTAL</p>
                  <p className="text-3xl font-bold text-green-dark">{stats.submissions.total}</p>
                </div>
                <div className="p-4 border-3 border-dark">
                  <p className="text-sm text-dark/70">THIS MONTH</p>
                  <p className="text-3xl font-bold text-green-dark">{stats.submissions.thisMonth}</p>
                </div>
                <div className="p-4 border-3 border-dark">
                  <p className="text-sm text-dark/70">AVG SCORE</p>
                  <p className="text-3xl font-bold text-green-dark">{stats.submissions.avgScore}%</p>
                </div>
                <div className="p-4 border-3 border-dark">
                  <p className="text-sm text-dark/70">SOLVED</p>
                  <p className="text-3xl font-bold text-green-dark">{stats.submissions.solvedCount}</p>
                </div>
              </div>
            </div>

            {/* Revenue Metrics */}
            <div className="border-4 border-dark p-8 retro-box">
              <h2 className="text-2xl font-bold text-dark mb-6">Revenue Metrics</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border-3 border-dark">
                  <p className="text-sm text-dark/70">MRR</p>
                  <p className="text-3xl font-bold text-green-dark">${stats.revenue.mrr}</p>
                </div>
                <div className="p-4 border-3 border-dark">
                  <p className="text-sm text-dark/70">ARR</p>
                  <p className="text-3xl font-bold text-green-dark">${stats.revenue.arr}</p>
                </div>
                <div className="p-4 border-3 border-dark">
                  <p className="text-sm text-dark/70">CHURN RATE</p>
                  <p className="text-3xl font-bold text-green-dark">{stats.revenue.churnRate}%</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="border-4 border-dark p-8 retro-box">
            <h2 className="text-2xl font-bold text-dark mb-6">User Management</h2>
            <p className="text-dark/70">User management tools coming soon</p>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="border-4 border-dark p-8 retro-box">
            <h2 className="text-2xl font-bold text-dark mb-6">Reports</h2>
            <p className="text-dark/70">Detailed reports coming soon</p>
          </div>
        )}
      </div>
    </div>
  );
}
