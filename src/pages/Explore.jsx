import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import { fetchApi } from '../lib/api';

interface Challenge {
  id: string;
  title: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  points: number;
  completedByUser: boolean;
}

export default function Explore() {
  const { user, loading: userLoading } = useUser();
  const navigate = useNavigate();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSubmissions: 0,
    avgScore: 0,
    topCreators: [],
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await fetchApi('/api/analytics/dashboard');
      setStats(data || {});
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (userLoading || loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-cream p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12 border-4 border-dark p-6 retro-box">
          <h1 className="text-4xl font-bold font-mono text-dark mb-2">Explore Challenges</h1>
          <p className="text-dark text-lg">Discover and practice prompt engineering</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          <div className="retro-box p-6">
            <div className="text-3xl font-bold text-green-dark">{stats.totalUsers || 0}</div>
            <div className="text-dark text-sm mt-2">Active Users</div>
          </div>
          <div className="retro-box p-6">
            <div className="text-3xl font-bold text-green-dark">{stats.totalSubmissions || 0}</div>
            <div className="text-dark text-sm mt-2">Submissions</div>
          </div>
          <div className="retro-box p-6">
            <div className="text-3xl font-bold text-green-dark">{stats.avgScore || 0}</div>
            <div className="text-dark text-sm mt-2">Avg Score</div>
          </div>
          <div className="retro-box p-6">
            <div className="text-3xl font-bold text-green-dark">{stats.topCreators?.length || 0}</div>
            <div className="text-dark text-sm mt-2">Top Creators</div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="mb-8 flex gap-4 flex-wrap">
          {(['all', 'beginner', 'intermediate', 'advanced'] as const).map((difficulty) => (
            <button
              key={difficulty}
              onClick={() => setFilter(difficulty)}
              className={`px-6 py-3 border-3 border-dark font-mono font-bold transition-colors ${
                filter === difficulty
                  ? 'retro-btn-primary'
                  : 'retro-btn'
              }`}
            >
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </button>
          ))}
        </div>

        {/* Challenges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <p className="text-dark text-lg">No challenges found</p>
            </div>
          ) : (
            challenges
              .filter((c) => filter === 'all' || c.difficulty === filter)
              .map((challenge) => (
                <div
                  key={challenge.id}
                  onClick={() => navigate(`/challenges/${challenge.id}`)}
                  className="retro-box p-6 cursor-pointer hover:retro-box-green transition-all"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-dark">{challenge.title}</h3>
                    {challenge.completedByUser && (
                      <span className="text-2xl">✓</span>
                    )}
                  </div>
                  <div className="flex gap-2 mb-4">
                    <span className="px-3 py-1 border-2 border-dark text-sm font-mono text-dark">
                      {challenge.difficulty}
                    </span>
                    <span className="px-3 py-1 border-2 border-dark text-sm font-mono text-dark">
                      +{challenge.points} pts
                    </span>
                  </div>
                  <p className="text-dark text-sm">{challenge.category}</p>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
}
