import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/hooks/useUser';
import { useQuota } from '@/hooks/useQuota';
import { get } from '@/lib/api';
import { Brain, Filter, Lock, Search, Sparkles, X, Zap } from 'lucide-react';

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

const REFERENCE_CHALLENGES: Challenge[] = [
  {
    id: 'sample-1',
    title: 'Smart Grocery List Generator',
    description:
      "Create an AI prompt that generates a customized grocery list based on a week's meal plan provided by the user. The prompt should take into account dietary preferences, number of servings, and ingredients to avoid.",
    difficulty: 'intermediate',
    category: 'Productivity',
    points: 250,
    is_premium: false,
    success_rate: 0,
  },
  {
    id: 'sample-2',
    title: 'Precision Prompt Construction for AI Response Optimization',
    description:
      'Design a complex multi-part prompt aimed at eliciting highly specific and relevant responses from an AI model. Guide the AI toward advanced reasoning and contextual understanding.',
    difficulty: 'expert',
    category: 'Reasoning',
    points: 400,
    is_premium: false,
    success_rate: 0,
  },
  {
    id: 'sample-3',
    title: 'Crafting a Marketing Campaign Prompt',
    description:
      'Design a prompt that elicits creative marketing campaign ideas for a new eco-friendly product. Emphasize clarity and specificity so ideas are actionable and aligned.',
    difficulty: 'intermediate',
    category: 'Marketing',
    points: 200,
    is_premium: false,
    success_rate: 0,
  },
];

export function Challenges() {
  const { profile } = useUser();
  const { quota } = useQuota();
  const navigate = useNavigate();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [difficulties, setDifficulties] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
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

  const visibleChallenges = challenges.length ? challenges : REFERENCE_CHALLENGES;
  const activeFiltersCount = Number(filters.difficulty !== 'all') + Number(filters.category !== 'all');
  const difficultyOptions = difficulties.length ? difficulties : ['beginner', 'intermediate', 'expert'];
  const categoryOptions = categories.length ? categories : ['Productivity', 'Reasoning', 'Marketing'];

  return (
    <div className="argen-page">
      <div className="argen-page-inner">
        {/* Header */}
        <div className="mb-12 flex items-center justify-between gap-4">
          <div>
            <h1 className="argen-page-title challenges-title">
              Structured
              <br />
              Challenges
            </h1>
            <p className="argen-page-subtitle">
              {visibleChallenges.length || pagination.limit} available
            </p>
          </div>
          <button className="argen-action challenges-generate">
            <Sparkles size={17} />
            Generate
          </button>
        </div>

        {/* Filter Bar */}
        <div className="mb-12 space-y-4">
          <div className="challenges-search-row">
            <div className="challenges-search-box">
              <Search size={22} />
              <input
                type="text"
                placeholder="Search challenges..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`challenges-filter-btn ${activeFiltersCount > 0 ? 'is-active' : ''}`}
            >
              <Filter size={22} />
              FILTERS {activeFiltersCount > 0 && `(${activeFiltersCount})`}
            </button>
          </div>

          {showFilters && (
            <div className="challenges-filter-panel">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-black">Filter Results</h3>
                <button onClick={() => setShowFilters(false)} className="retro-btn px-3 py-2">
                  <X size={16} />
                </button>
              </div>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                <div className="filter-group">
                  <h4>STATUS</h4>
                  <div>
                    {['ALL', 'COMPLETED', 'TODO'].map((status) => (
                      <button key={status} className={status === 'ALL' ? 'is-selected' : ''}>
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="filter-group">
                  <h4>DIFFICULTY</h4>
                  <div>
                    <button
                      onClick={() => handleFilterChange('difficulty', 'all')}
                      className={filters.difficulty === 'all' ? 'is-selected' : ''}
                    >
                      ALL
                    </button>
                    {difficultyOptions.map((d) => (
                      <button
                        key={d}
                        onClick={() => handleFilterChange('difficulty', d)}
                        className={filters.difficulty === d ? 'is-selected' : ''}
                      >
                        {(DIFFICULTY_LABELS[d] || d).toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="filter-group">
                  <h4>CATEGORY</h4>
                  <div>
                    <button
                      onClick={() => handleFilterChange('category', 'all')}
                      className={filters.category === 'all' ? 'is-selected' : ''}
                    >
                      ALL
                    </button>
                    {categoryOptions.map((c) => (
                      <button
                        key={c}
                        onClick={() => handleFilterChange('category', c)}
                        className={filters.category === c ? 'is-selected' : ''}
                      >
                        {c.replace(/_/g, ' ').toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
                {quota && (
                  <div className="retro-box-green p-3 font-mono text-sm flex items-center justify-between md:col-span-3">
                    <span>Credits: {quota.remaining}/{quota.monthly_limit}</span>
                  </div>
                )}
              </div>
          </div>
          )}
        </div>

        {/* Challenges Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="font-mono text-lg">Loading challenges...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2">
              {visibleChallenges.map((challenge) => (
                <div
                  key={challenge.id}
                  className="challenge-card group"
                  onClick={() => handleChallengeClick(challenge.id)}
                >
                  <div className="mb-8 flex gap-2">
                    <span className="challenge-badge">
                      {DIFFICULTY_LABELS[challenge.difficulty]?.toUpperCase()}
                    </span>
                    {challenge.is_premium && (
                      <span className="challenge-badge flex items-center gap-1">
                        <Lock size={12} /> PREMIUM
                      </span>
                    )}
                  </div>

                  <h3 className="challenge-card-title">
                    {challenge.title}
                  </h3>

                  <p className="challenge-card-description">
                    {challenge.description}
                  </p>

                  {/* Stats */}
                  <div className="challenge-card-stats">
                    <span>
                      <Brain size={14} />
                      {challenge.success_rate || 0}% success rate
                    </span>
                    <span>
                      <Zap size={14} />
                      {challenge.points} points
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
