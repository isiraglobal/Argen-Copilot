import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { analyzePrompt, getReadinessColor } from '@/lib/engines/PromptAnalyzer';
import { generateSimulatedOutput, detectIntent } from '@/lib/engines/SimulatedOutputEngine';
import { routeToCredit } from '@/lib/engines/creditRouter';
import { calculateSimilarity } from '@/lib/utils';
import { useQuota } from '@/hooks/useQuota';
import { get, post } from '@/lib/api';
import { ArrowLeft, Lock, Zap, Brain } from 'lucide-react';

interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'hard' | 'expert';
  category: string;
  points: number;
  expected_output?: string;
  constraints?: string;
  example_prompt?: string;
  is_premium: boolean;
  user_progress?: {
    best_score: number;
    attempts: number;
    is_completed: number;
  };
}

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: '#2D5F4F',
  intermediate: '#F59E0B',
  hard: '#EF4444',
  expert: '#8B5CF6',
};

export function ChallengeDetailNew() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { quota } = useQuota();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [hasRun, setHasRun] = useState(false);
  const [output, setOutput] = useState('');
  const [scores, setScores] = useState<any>(null);
  const [submitError, setSubmitError] = useState('');
  const [submittedScore, setSubmittedScore] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'desc' | 'guide'>('desc');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    if (!id) {
      navigate('/challenges');
      return;
    }
    loadChallenge();
    window.addEventListener('resize', () => setIsMobile(window.innerWidth < 768));
    return () => window.removeEventListener('resize', () => setIsMobile(window.innerWidth < 768));
  }, [id]);

  const loadChallenge = async () => {
    try {
      setLoading(true);
      const data = await get<Challenge>(`/api/challenges/${id}`);
      setChallenge(data);
    } catch (error) {
      console.error('Error loading challenge:', error);
      navigate('/challenges');
    } finally {
      setLoading(false);
    }
  };

  const analysis = analyzePrompt(prompt);

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    alert('Paste is disabled for prompt security');
  };

  const handleRun = async () => {
    if (!prompt.trim()) {
      alert('Please enter a prompt');
      return;
    }

    try {
      setSubmitting(true);
      const intent = detectIntent(prompt);
      const result = generateSimulatedOutput(prompt, intent);
      setOutput(result.output);
      setHasRun(true);

      // Generate mock scores
      setScores({
        clarity: Math.min(99, 60 + Math.random() * 40),
        completeness: Math.min(99, 65 + Math.random() * 35),
        creativity: Math.min(99, 55 + Math.random() * 45),
        effectiveness: Math.min(99, 60 + Math.random() * 40),
        overall: Math.min(99, 60 + Math.random() * 40),
        feedback: 'Good prompt structure. Consider adding more specific constraints.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    if (!hasRun) {
      alert('Please run your prompt first');
      return;
    }

    if (!challenge || !scores) {
      alert('Something went wrong');
      return;
    }

    // Anti-cheat check
    const similarity = calculateSimilarity(prompt, challenge.description);
    if (similarity > 0.8) {
      alert('Prompt too similar to description. Please create original content.');
      return;
    }

    try {
      setSubmitting(true);

      // Route through credit system
      if (!quota) {
        alert('Unable to determine quota');
        return;
      }

      const route = await routeToCredit(prompt, challenge.id, {
        monthly_limit: quota.monthly_limit,
        used_this_month: quota.used_this_month,
      });

      // Submit
      const response = await post<any>('/api/submissions', {
        challenge_id: challenge.id,
        prompt_text: prompt,
        mode: route.mode === 'api' ? 'api' : 'offline',
      });

      setScores({
        clarity: response.clarity_score,
        completeness: response.completeness_score,
        creativity: response.creativity_score,
        effectiveness: response.effectiveness_score,
        overall: response.overall_score,
        feedback: response.feedback,
      });
      setSubmittedScore(response.overall_score);
      setSubmitError('');

      if (response.is_solved) {
        loadChallenge();
      }
    } catch (error) {
      console.error('Error submitting:', error);
      setSubmitError('Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-cream flex items-center justify-center">
        <div className="font-mono text-lg">Loading challenge...</div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="w-full min-h-screen bg-cream flex items-center justify-center">
        <div className="font-mono text-lg">Challenge not found</div>
      </div>
    );
  }

  const isSolved = challenge.user_progress?.is_completed === 1;

  if (isMobile) {
    return (
      <div className="w-full h-screen flex flex-col bg-cream">
        {/* Header */}
        <div className="retro-box p-4 border-b-4 border-black">
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={() => navigate('/challenges')}
              className="p-2 hover:bg-black hover:text-cream transition"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold">{challenge.title}</h1>
              <p className="text-xs font-mono text-gray-600">
                {challenge.difficulty} • {challenge.category}
              </p>
            </div>
            {challenge.is_premium && <Lock size={16} />}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b-4 border-black">
          <button
            onClick={() => setActiveTab('desc')}
            className={`flex-1 p-3 font-bold ${
              activeTab === 'desc'
                ? 'bg-green-600 text-white border-b-4 border-black'
                : 'bg-cream border-r-4 border-black'
            }`}
          >
            DESC
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`flex-1 p-3 font-bold ${
              activeTab === 'guide'
                ? 'bg-green-600 text-white border-b-4 border-black'
                : 'bg-cream'
            }`}
          >
            GUIDE
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'desc' ? (
            <div>
              <div className="retro-box p-4 mb-4">
                <div className="flex gap-2 mb-2 flex-wrap">
                  <span
                    className="px-3 py-1 text-xs font-mono text-white border-2 border-black"
                    style={{
                      backgroundColor: DIFFICULTY_COLORS[challenge.difficulty],
                    }}
                  >
                    {challenge.difficulty}
                  </span>
                  <span className="px-3 py-1 text-xs font-mono bg-cream border-2 border-black">
                    <Zap size={12} className="inline mr-1" /> {challenge.points}
                  </span>
                </div>
                <p className="text-sm mb-4">{challenge.description}</p>

                {challenge.constraints && (
                  <>
                    <h4 className="font-bold mb-2">Constraints</h4>
                    <p className="text-sm mb-4">{challenge.constraints}</p>
                  </>
                )}

                {challenge.expected_output && (
                  <>
                    <h4 className="font-bold mb-2">Expected Output</h4>
                    <p className="text-sm">{challenge.expected_output}</p>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="retro-box p-3">
                  <h4 className="font-bold mb-1">Step {i}</h4>
                  <p className="text-sm">Follow this step to improve your response.</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Prompt Input */}
        <div className="retro-box p-4 border-t-4 border-black">
          <label className="font-bold block mb-2">Your Prompt</label>
          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onPaste={handlePaste}
            placeholder="Enter your prompt..."
            rows={4}
            className="w-full p-3 border-2 border-black font-mono text-sm resize-none"
          />
          <div className="flex justify-between items-center mt-2 mb-3">
            <span className="text-xs font-mono">
              Words: {prompt.split(/\s+/).filter(Boolean).length} | Chars: {prompt.length}
            </span>
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 border-2 border-black"
                style={{ backgroundColor: getReadinessColor(analysis.readiness_score) }}
              />
              <span className="text-xs font-bold">{analysis.readiness_score}%</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleRun}
              disabled={submitting || !prompt.trim()}
              className="flex-1 retro-btn-primary disabled:opacity-50"
            >
              {submitting ? '...' : 'RUN'}
            </button>
            <button
              onClick={handleSubmit}
              disabled={!hasRun || submitting}
              className={`flex-1 ${hasRun && !submitting ? 'retro-btn-primary' : 'retro-btn opacity-50'}`}
            >
              {!hasRun ? 'RUN FIRST' : 'SUBMIT'}
            </button>
          </div>
          {submitError && <p className="text-xs font-bold text-red-600 mt-2">{submitError}</p>}
          {submittedScore !== null && (
            <p className="text-xs font-bold text-green-700 mt-2">Saved score: {submittedScore}%</p>
          )}
        </div>

        {/* Output */}
        {hasRun && (
          <div className="retro-box p-4 max-h-64 overflow-y-auto border-t-4 border-black">
            <h4 className="font-bold mb-2">Output</h4>
            <pre className="text-xs whitespace-pre-wrap mb-3">{output}</pre>

              {scores && (
                <div className="grid grid-cols-2 gap-2">
                  <div className="retro-box-green p-2 text-center col-span-2">
                    <div className="font-bold">{Math.round(scores.overall)}%</div>
                    <div className="text-xs">Overall</div>
                  </div>
                <div className="retro-box p-2 text-center">
                  <div className="font-bold">{Math.round(scores.clarity)}</div>
                  <div className="text-xs">Clarity</div>
                </div>
                <div className="retro-box p-2 text-center">
                  <div className="font-bold">{Math.round(scores.completeness)}</div>
                  <div className="text-xs">Complete</div>
                </div>
                <div className="retro-box p-2 text-center">
                  <div className="font-bold">{Math.round(scores.creativity)}</div>
                  <div className="text-xs">Creative</div>
                </div>
                <div className="retro-box p-2 text-center">
                  <div className="font-bold">{Math.round(scores.effectiveness)}</div>
                  <div className="text-xs">Effective</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // Desktop Layout (3-panel)
  return (
    <div className="w-full h-screen flex flex-col bg-cream">
      {/* Header */}
      <div className="retro-box p-4 flex justify-between items-center border-b-4 border-black">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/challenges')}
            className="retro-btn flex items-center gap-2"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <h1 className="text-2xl font-bold">{challenge.title}</h1>
        </div>
        <div className="flex items-center gap-4">
          {isSolved && <span className="font-mono font-bold text-green-600">✓ SOLVED</span>}
          {challenge.user_progress && (
            <span className="text-sm font-mono">
              Attempts: {challenge.user_progress.attempts} | Best: {challenge.user_progress.best_score}%
            </span>
          )}
          <div className="flex gap-2">
            <button
              onClick={handleRun}
              disabled={submitting || !prompt.trim()}
              className="retro-btn-primary disabled:opacity-50"
            >
              RUN
            </button>
            <button
              onClick={handleSubmit}
              disabled={!hasRun || submitting}
              className={hasRun && !submitting ? 'retro-btn-primary' : 'retro-btn opacity-50'}
            >
              SUBMIT
            </button>
          </div>
          {submitError && <p className="text-sm font-bold text-red-600">{submitError}</p>}
          {submittedScore !== null && (
            <div className="retro-box-green px-3 py-2 text-sm font-bold">Saved score: {submittedScore}%</div>
          )}
        </div>
      </div>

      {/* 3-panel layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Description */}
        <div className="w-1/3 retro-box overflow-y-auto p-6 border-r-4 border-black">
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab('desc')}
              className={`flex-1 p-2 font-bold ${
                activeTab === 'desc' ? 'bg-green-600 text-white' : 'retro-box'
              }`}
            >
              DESC
            </button>
            <button
              onClick={() => setActiveTab('guide')}
              className={`flex-1 p-2 font-bold ${
                activeTab === 'guide' ? 'bg-green-600 text-white' : 'retro-box'
              }`}
            >
              GUIDE
            </button>
          </div>

          {activeTab === 'desc' ? (
            <>
              <h2 className="text-lg font-bold mb-4">Challenge Description</h2>

              <div className="retro-box p-4 mb-6">
                <div className="flex gap-2 mb-3 flex-wrap">
                  <span
                    className="px-3 py-1 text-xs font-mono text-white border-2 border-black"
                    style={{
                      backgroundColor: DIFFICULTY_COLORS[challenge.difficulty],
                    }}
                  >
                    {challenge.difficulty}
                  </span>
                  <span className="px-3 py-1 text-xs font-mono bg-cream border-2 border-black">
                    {challenge.category}
                  </span>
                  <span className="px-3 py-1 text-xs font-mono bg-cream border-2 border-black flex items-center gap-1">
                    <Zap size={12} /> {challenge.points}
                  </span>
                </div>
              </div>

              <p className="mb-6">{challenge.description}</p>

              {challenge.constraints && (
                <>
                  <h4 className="font-bold mb-2">Constraints</h4>
                  <p className="mb-6 text-sm">{challenge.constraints}</p>
                </>
              )}

              {challenge.example_prompt && (
                <>
                  <h4 className="font-bold mb-2">Example Prompt</h4>
                  <div className="retro-box p-3 mb-6">
                    <p className="text-sm font-mono">{challenge.example_prompt}</p>
                  </div>
                </>
              )}

              {challenge.expected_output && (
                <>
                  <h4 className="font-bold mb-2">Expected Output</h4>
                  <p className="text-sm">{challenge.expected_output}</p>
                </>
              )}
            </>
          ) : (
            <>
              <h2 className="text-lg font-bold mb-4">Guide</h2>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="retro-box p-3">
                    <h4 className="font-bold">Step {i}</h4>
                    <p className="text-sm">Follow this step to improve your response quality and clarity.</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Middle Panel - Input */}
        <div className="w-1/3 retro-box overflow-y-auto p-6 border-r-4 border-black flex flex-col">
          <label className="font-bold block mb-3">Your Prompt</label>
          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onPaste={handlePaste}
            placeholder="Enter your prompt here..."
            className="flex-1 p-4 border-2 border-black font-mono text-sm resize-none mb-3"
          />

          <div className="flex justify-between items-center mb-3 text-xs font-mono">
            <span>Words: {prompt.split(/\s+/).filter(Boolean).length} | Chars: {prompt.length}</span>
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 border-2 border-black"
                style={{ backgroundColor: getReadinessColor(analysis.readiness_score) }}
              />
              <span className="font-bold">{analysis.readiness_score}%</span>
            </div>
          </div>

          {analysis.readiness_score < 70 && (
            <div className="retro-box-dark p-3 mb-3">
              <p className="text-xs">⚠️ Below 70% readiness - may not mark as solved</p>
            </div>
          )}
        </div>

        {/* Right Panel - Output */}
        <div className="w-1/3 retro-box overflow-y-auto p-6 flex flex-col">
          {!hasRun ? (
            <div className="flex items-center justify-center h-full">
              <p className="font-mono text-gray-600">Run your prompt to see output</p>
            </div>
          ) : (
            <>
              <h3 className="font-bold mb-4">Output & Analysis</h3>
              <div className="retro-box p-3 mb-4 flex-1 overflow-y-auto">
                <pre className="text-xs whitespace-pre-wrap font-mono">{output}</pre>
              </div>

              {scores && (
                <div className="space-y-2">
                  <div className="text-sm font-mono">Overall Score: <span className="font-bold">{Math.round(scores.overall)}%</span></div>
                  {submittedScore !== null && (
                    <div className="retro-box-green p-3 text-sm font-bold">Saved score: {submittedScore}%</div>
                  )}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="retro-box p-3 text-center">
                      <div className="font-bold">{Math.round(scores.clarity)}</div>
                      <div className="text-xs">Clarity</div>
                    </div>
                    <div className="retro-box p-3 text-center">
                      <div className="font-bold">{Math.round(scores.completeness)}</div>
                      <div className="text-xs">Complete</div>
                    </div>
                    <div className="retro-box p-3 text-center">
                      <div className="font-bold">{Math.round(scores.creativity)}</div>
                      <div className="text-xs">Creative</div>
                    </div>
                    <div className="retro-box p-3 text-center">
                      <div className="font-bold">{Math.round(scores.effectiveness)}</div>
                      <div className="text-xs">Effective</div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChallengeDetailNew;
