import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/hooks/useUser';
import { useQuota } from '@/hooks/useQuota';
import { get } from '@/lib/api';
import { ChevronRight, Lock, Brain, Zap } from 'lucide-react';

interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'hard' | 'expert';
  category: string;
  points: number;
  is_premium: boolean;
  success_rate?: number;
  total_attempts?: number;
}

interface ChallengeResponse {
  data: Challenge[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: '#2D5F4F',
  intermediate: '#F59E0B',
  hard: '#EF4444',
  expert: '#8B5CF6',
};

const DIFFICULTY_LABELS: Record<string, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  hard: 'Hard',
  expert: 'Expert',
};

export function Challenges() {
  const { profile } = useUser();
  const { quota } = useQuota();
  const navigate = useNavigate();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [difficulties, setDifficulties] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    difficulty: 'all',
    category: 'all',
  });
  const [pagination, setPagination] = useState({
    offset: 0,
    limit: 20,
  });

  useEffect(() => {
    loadChallengesAndFilters();
  }, [filters, pagination.offset]);

  const loadChallengesAndFilters = async () => {
    try {
      setLoading(true);
      
      // Load filters
      try {
        const catRes = await get<{ categories: string[] }>('/api/challenges/categories');
        setCategories(catRes.categories.filter(Boolean));
        const diffRes = await get<{ difficulties: string[] }>('/api/challenges/difficulties');
        setDifficulties(diffRes.difficulties.filter(Boolean));
      } catch (e) {
        console.error('Error loading filters:', e);
      }

      // Load challenges
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.difficulty !== 'all') params.append('difficulty', filters.difficulty);
      if (filters.category !== 'all') params.append('category', filters.category);
      params.append('limit', pagination.limit.toString());
      params.append('offset', pagination.offset.toString());

      const response = await get<ChallengeResponse>(
        `/api/challenges?${params.toString()}`
      );
      setChallenges(response.data);
      setPagination((prev) => ({
        ...prev,
        limit: response.pagination.limit,
      }));
    } catch (error) {
      console.error('Error loading challenges:', error);
      setChallenges([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value });
    setPagination({ ...pagination, offset: 0 }); // Reset to first page
  };

  const handleChallengeClick = (id: string) => {
    navigate(`/challenges/${id}`);
  };

  const getDifficultyColor = (difficulty: string) => {
    return DIFFICULTY_COLORS[difficulty] || '#2D5F4F';
  };

  return (
    <div className="w-full min-h-screen bg-cream p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Challenges</h1>
          <p className="text-gray-700">
            Refine your prompt engineering skills with {challenges.length} challenges
          </p>
        </div>

        {/* Filter Bar */}
        <div className="retro-box p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Search challenges..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full p-3 border-2 border-black focus:outline-none bg-white"
            />
            <select
              value={filters.difficulty}
              onChange={(e) => handleFilterChange('difficulty', e.target.value)}
              className="w-full p-3 border-2 border-black focus:outline-none bg-white font-mono"
            >
              <option value="all">All Difficulties</option>
              {difficulties.map((d) => (
                <option key={d} value={d}>
                  {DIFFICULTY_LABELS[d] || d}
                </option>
              ))}
            </select>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full p-3 border-2 border-black focus:outline-none bg-white font-mono"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {quota && (
              <div className="retro-box-green p-3 font-mono text-sm flex items-center justify-between">
                <span>Credits: {quota.remaining}/{quota.monthly_limit}</span>
              </div>
            )}
          </div>
        </div>

        {/* Challenges Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="font-mono text-lg">Loading challenges...</p>
          </div>
        ) : challenges.length === 0 ? (
          <div className="retro-box p-12 text-center">
            <p className="font-mono text-lg">No challenges found matching your filters.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {challenges.map((challenge) => (
                <div
                  key={challenge.id}
                  className="retro-box p-6 cursor-pointer hover:bg-black hover:text-cream transition-colors duration-200 group"
                  onClick={() => handleChallengeClick(challenge.id)}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2 group-hover:text-cream">
                        {challenge.title}
                      </h3>
                      <div className="flex gap-2 flex-wrap">
                        <span
                          className="px-3 py-1 text-xs font-mono text-white border-2 border-black"
                          style={{
                            backgroundColor: getDifficultyColor(challenge.difficulty),
                          }}
                        >
                          {DIFFICULTY_LABELS[challenge.difficulty]}
                        </span>
                        {challenge.is_premium && (
                          <span className="px-3 py-1 text-xs font-mono bg-black text-cream border-2 border-black flex items-center gap-1">
                            <Lock size={12} /> Premium
                          </span>
                        )}
                      </div>
                    </div>
                    <ChevronRight
                      size={24}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </div>

                  {/* Description */}
                  <p className="text-sm mb-4 line-clamp-2 group-hover:text-cream">
                    {challenge.description}
                  </p>

                  {/* Stats */}
                  <div className="flex justify-between items-center text-xs font-mono border-t-2 border-black pt-4">
                    <div className="flex items-center gap-2">
                      <Zap size={14} /> {challenge.points} points
                    </div>
                    {challenge.success_rate !== undefined && (
                      <div className="flex items-center gap-2">
                        <Brain size={14} /> {challenge.success_rate}% success
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="retro-box p-4 flex justify-between items-center">
              <button
                onClick={() =>
                  setPagination({
                    ...pagination,
                    offset: Math.max(0, pagination.offset - pagination.limit),
                  })
                }
                disabled={pagination.offset === 0}
                className="px-6 py-2 border-2 border-black font-mono disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black hover:text-cream transition-colors"
              >
                Previous
              </button>
              <span className="font-mono">
                Page {Math.floor(pagination.offset / pagination.limit) + 1}
              </span>
              <button
                onClick={() =>
                  setPagination({
                    ...pagination,
                    offset: pagination.offset + pagination.limit,
                  })
                }
                className="px-6 py-2 border-2 border-black font-mono hover:bg-black hover:text-cream transition-colors"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
          </select>
          <select
            value={filters.completion}
            onChange={(e) => setFilters({ ...filters, completion: e.target.value })}
            className="w-full"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="incomplete">Incomplete</option>
          </select>
        </div>

        {/* Empty state */}
        <div className="retro-box p-12 text-center">
          <p className="text-lg mb-4">Loading challenges...</p>
          <p className="text-sm text-gray-600">Quota: {quota?.used_this_month || 0} / {quota?.monthly_limit || 5}</p>
        </div>
      </div>
    </div>
  );
}
