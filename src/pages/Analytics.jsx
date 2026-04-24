import React, { useState, useEffect } from 'react';
import { useUser } from '../hooks/useUser';
import { fetchApi } from '../lib/api';

interface AnalyticsData {
  totalSubmissions: number;
  submissionsThisWeek: number;
  avgScore: number;
  challengesCompleted: number;
  currentStreak: number;
  learningProgress: number;
}

export default function Analytics() {
  const { user } = useUser();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [dateRange, setDateRange] = useState('week');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [dateRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const data = await fetchApi('/api/analytics/user');
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (!analytics) return <div className="p-8">No data available</div>;

  return (
    <div className="min-h-screen bg-cream p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="border-4 border-dark p-6 retro-box mb-12">
          <h1 className="text-4xl font-bold font-mono text-dark mb-2">Your Analytics</h1>
          <p className="text-dark">Track your learning progress</p>
        </div>

        {/* Date Range Selector */}
        <div className="flex gap-4 mb-12">
          {['week', 'month', 'all'].map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-6 py-3 border-3 border-dark font-mono font-bold ${
                dateRange === range
                  ? 'retro-btn-primary'
                  : 'retro-btn'
              }`}
            >
              {range.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="retro-box p-6">
            <div className="text-sm text-dark/70 mb-2">TOTAL SUBMISSIONS</div>
            <div className="text-4xl font-bold text-green-dark">{analytics.totalSubmissions}</div>
          </div>
          <div className="retro-box p-6">
            <div className="text-sm text-dark/70 mb-2">THIS WEEK</div>
            <div className="text-4xl font-bold text-green-dark">{analytics.submissionsThisWeek}</div>
          </div>
          <div className="retro-box p-6">
            <div className="text-sm text-dark/70 mb-2">AVG SCORE</div>
            <div className="text-4xl font-bold text-green-dark">{analytics.avgScore}%</div>
          </div>
        </div>

        {/* Progress Metrics */}
        <div className="border-4 border-dark p-8 retro-box mb-12">
          <h2 className="text-2xl font-bold text-dark mb-8">Learning Progress</h2>

          <div className="space-y-8">
            {/* Challenges Completed */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-mono font-bold text-dark">Challenges Completed</span>
                <span className="font-mono font-bold text-green-dark">
                  {analytics.challengesCompleted}
                </span>
              </div>
              <div className="w-full h-6 border-3 border-dark bg-cream">
                <div
                  className="h-full bg-green-dark"
                  style={{
                    width: `${Math.min((analytics.challengesCompleted / 50) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>

            {/* Current Streak */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-mono font-bold text-dark">Current Streak</span>
                <span className="font-mono font-bold text-green-dark">
                  {analytics.currentStreak} days
                </span>
              </div>
              <div className="w-full h-6 border-3 border-dark bg-cream">
                <div
                  className="h-full bg-green-dark"
                  style={{
                    width: `${Math.min((analytics.currentStreak / 30) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>

            {/* Learning Progress */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-mono font-bold text-dark">Learning Path</span>
                <span className="font-mono font-bold text-green-dark">
                  {analytics.learningProgress}%
                </span>
              </div>
              <div className="w-full h-6 border-3 border-dark bg-cream">
                <div
                  className="h-full bg-green-dark"
                  style={{ width: `${analytics.learningProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="border-4 border-dark p-8 retro-box">
          <h2 className="text-2xl font-bold text-dark mb-6">Recent Activity</h2>
          <div className="text-center text-dark/70 py-8">
            <p>No recent activity</p>
          </div>
        </div>
      </div>
    </div>
  );
}
