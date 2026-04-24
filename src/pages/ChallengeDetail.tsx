import { useState, useRef } from 'react';
import { analyzePrompt, getReadinessColor } from '@/lib/engines/PromptAnalyzer';
import { generateSimulatedOutput, detectIntent } from '@/lib/engines/SimulatedOutputEngine';
import { routeToCredit } from '@/lib/engines/creditRouter';
import { calculateSimilarity } from '@/lib/utils';
import { useQuota } from '@/hooks/useQuota';
import { post } from '@/lib/api';

interface ChallengeDetailProps {
  challengeId?: string;
}

export function ChallengeDetail({ challengeId = 'sample-1' }: ChallengeDetailProps) {
  const { quota } = useQuota();
  const [prompt, setPrompt] = useState('');
  const [hasRun, setHasRun] = useState(false);
  const [output, setOutput] = useState('');
  const [scores, setScores] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'desc' | 'guide'>('desc');
  const [outputTab, setOutputTab] = useState<'output' | 'analysis'>('output');
  const [showAIChat, setShowAIChat] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Desktop layout state
  const [leftWidth, setLeftWidth] = useState(33);
  const [middleWidth, setMiddleWidth] = useState(34);
  const [resizing, setResizing] = useState<string | null>(null);

  const analysis = analyzePrompt(prompt);
  const isMobile = window.innerWidth < 768;

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    alert('Paste is disabled for prompt security');
  };

  const handleRun = async () => {
    setLoading(true);
    try {
      const intent = detectIntent(prompt);
      const result = generateSimulatedOutput(prompt, intent);
      setOutput(result.output);
      setHasRun(true);
      
      // Set mock scores
      setScores({
        clarity: 75,
        completeness: 80,
        creativity: 70,
        effectiveness: 72,
        overall: 74,
        feedback: 'Good prompt structure with clear intent. Consider adding more specific constraints.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!hasRun) {
      alert('Please run your prompt first');
      return;
    }

    // Anti-cheat check
    const similarity = calculateSimilarity(prompt, 'Sample challenge description');
    if (similarity > 0.8) {
      alert('Prompt too similar to description. Please create original content.');
      return;
    }

    setLoading(true);
    try {
      // Route through 4-layer credit system
      if (!quota) {
        alert('Unable to determine quota');
        return;
      }

      const route = await routeToCredit(
        prompt,
        challengeId,
        {
          monthly_limit: quota.monthly_limit,
          used_this_month: quota.used_this_month,
        }
      );

      // Submit to API
      const response = await post('/api/submissions', {
        challenge_id: challengeId,
        prompt_text: prompt,
        route_mode: route.mode,
      });

      alert(`Submitted! Score: ${response.overall_score}%`);
      if (response.overall_score >= 70) {
        alert('Challenge solved!');
      }
    } catch (error) {
      alert('Failed to submit');
    } finally {
      setLoading(false);
    }
  };

  if (isMobile) {
    return (
      <div className="w-full h-screen flex flex-col bg-cream">
        {/* Header */}
        <div className="retro-box p-4 flex justify-between items-center">
          <button className="retro-btn">← Back</button>
          <div className="font-bold">Challenge 1</div>
          <div className="text-sm">Attempt 1</div>
        </div>

        {/* Tabs */}
        <div className="flex border-b-4 border-dark">
          <button
            onClick={() => setActiveTab('desc')}
            className={`flex-1 p-4 font-bold ${activeTab === 'desc' ? 'retro-box-green' : 'retro-box'}`}
          >
            DESC
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`flex-1 p-4 font-bold ${activeTab === 'guide' ? 'retro-box-green' : 'retro-box'}`}
          >
            GUIDE
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'desc' ? (
            <>
              <div className="retro-box p-4 mb-4">
                <h2 className="font-bold text-lg mb-2">Challenge Title</h2>
                <p className="text-sm mb-4">This is a sample challenge description.</p>
                <div className="retro-box-green p-2 text-sm mb-2">Beginner</div>
                <p className="text-sm mb-4">Points: 100</p>
              </div>

              <div className="mb-4">
                <label className="font-bold block mb-2">Your Prompt</label>
                <textarea
                  ref={textareaRef}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onPaste={handlePaste}
                  placeholder="Enter your prompt here..."
                  rows={8}
                  className="w-full"
                />
                <div className="text-xs mt-2">
                  Words: {prompt.split(/\s+/).length} | Chars: {prompt.length}
                </div>
              </div>

              {/* Readiness score dot */}
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="w-4 h-4"
                  style={{ backgroundColor: getReadinessColor(analysis.readiness_score) }}
                />
                <span className="font-bold">{analysis.readiness_score}%</span>
              </div>

              {analysis.readiness_score < 70 && (
                <div className="retro-box-dark p-3 mb-4">
                  <p className="text-sm">Below 70% - won't mark as solved</p>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={handleRun}
                  disabled={loading}
                  className="flex-1 retro-btn-primary"
                >
                  {loading ? 'Running...' : 'RUN'}
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!hasRun || loading}
                  className={`flex-1 ${hasRun ? 'retro-btn-primary' : 'retro-btn'}`}
                >
                  {!hasRun ? '↑ Run first' : 'SUBMIT'}
                </button>
              </div>
            </>
          ) : (
            <div className="retro-box p-4">
              <h3 className="font-bold mb-2">Guide</h3>
              <p className="text-sm mb-4">1. Understand the challenge</p>
              <p className="text-sm mb-4">2. Structure your response</p>
              <p className="text-sm mb-4">3. Check constraints</p>
              <p className="text-sm mb-4">4. Consider tone</p>
              <p className="text-sm">5. Avoid common mistakes</p>
            </div>
          )}
        </div>

        {/* Output section */}
        {hasRun && (
          <div className="retro-box p-4 max-h-96 overflow-y-auto">
            <h3 className="font-bold mb-2">Output</h3>
            <pre className="text-xs whitespace-pre-wrap">{output}</pre>
            {scores && (
              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="retro-box p-2 text-center">
                  <div className="font-bold">{scores.clarity}</div>
                  <div className="text-xs">Clarity</div>
                </div>
                <div className="retro-box p-2 text-center">
                  <div className="font-bold">{scores.completeness}</div>
                  <div className="text-xs">Complete</div>
                </div>
                <div className="retro-box p-2 text-center">
                  <div className="font-bold">{scores.creativity}</div>
                  <div className="text-xs">Creative</div>
                </div>
                <div className="retro-box p-2 text-center">
                  <div className="font-bold">{scores.effectiveness}</div>
                  <div className="text-xs">Effect</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // Desktop 3-panel layout
  return (
    <div className="w-full h-screen flex flex-col bg-cream">
      {/* Header */}
      <div className="retro-box p-4 flex justify-between items-center border-b-4 border-dark">
        <div className="flex items-center gap-4">
          <button className="retro-btn">← Back</button>
          <h1 className="text-2xl font-bold">Sample Challenge</h1>
        </div>
        <div className="text-sm">
          {scores?.overall >= 70 ? '✓ SOLVED' : 'ATTEMPT 1'}
        </div>
        <div className="flex gap-2">
          <button onClick={handleRun} disabled={loading} className="retro-btn-primary">
            RUN
          </button>
          <button
            onClick={handleSubmit}
            disabled={!hasRun || loading}
            className={hasRun ? 'retro-btn-primary' : 'retro-btn'}
          >
            {!hasRun ? '↑ Run first' : 'SUBMIT'}
          </button>
        </div>
      </div>

      {/* 3-panel layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left panel - Description */}
        <div style={{ width: `${leftWidth}%` }} className="retro-box overflow-y-auto p-4 border-r-4 border-dark">
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setActiveTab('desc')}
              className={`flex-1 ${activeTab === 'desc' ? 'retro-box-green' : 'retro-box'} p-2 text-sm font-bold`}
            >
              DESC
            </button>
            <button
              onClick={() => setActiveTab('guide')}
              className={`flex-1 ${activeTab === 'guide' ? 'retro-box-green' : 'retro-box'} p-2 text-sm font-bold`}
            >
              GUIDE
            </button>
          </div>

          {activeTab === 'desc' ? (
            <>
              <h2 className="font-bold text-lg mb-2">Challenge Description</h2>
              <p className="mb-4">This is a sample challenge to demonstrate the prompt engineering system.</p>
              <div className="retro-box p-3 mb-4">
                <p className="text-sm"><strong>Difficulty:</strong> Beginner</p>
                <p className="text-sm"><strong>Category:</strong> Reasoning</p>
                <p className="text-sm"><strong>Points:</strong> 100</p>
              </div>
              <h3 className="font-bold mb-2">Expected Output</h3>
              <p className="mb-4 text-sm">A structured response demonstrating clear thinking.</p>
            </>
          ) : (
            <>
              <h2 className="font-bold mb-2">Guide</h2>
              <div className="space-y-3">
                <div>
                  <h4 className="font-bold">1. Understand</h4>
                  <p className="text-sm">Read and comprehend the challenge</p>
                </div>
                <div>
                  <h4 className="font-bold">2. Structure</h4>
                  <p className="text-sm">Organize your response logically</p>
                </div>
                <div>
                  <h4 className="font-bold">3. Constraints</h4>
                  <p className="text-sm">Follow all given constraints</p>
                </div>
                <div>
                  <h4 className="font-bold">4. Tips</h4>
                  <p className="text-sm">Use best practices and patterns</p>
                </div>
                <div>
                  <h4 className="font-bold">5. Avoid</h4>
                  <p className="text-sm">Don't make common mistakes</p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Resize handle 1 */}
        <div
          onMouseDown={() => setResizing('left')}
          className="w-1 bg-dark cursor-col-resize hover:bg-green transition-colors"
        />

        {/* Middle panel - Editor */}
        <div style={{ width: `${middleWidth}%` }} className="retro-box overflow-y-auto p-4 border-r-4 border-dark flex flex-col">
          <label className="font-bold mb-2">Your Prompt</label>
          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onPaste={handlePaste}
            placeholder="Write your prompt here... (paste disabled for security)"
            className="flex-1 mb-4"
          />
          <div className="flex justify-between text-xs mb-4">
            <span>Words: {prompt.split(/\s+/).length} | Chars: {prompt.length}</span>
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3"
                style={{ backgroundColor: getReadinessColor(analysis.readiness_score) }}
              />
              <span className="font-bold">{analysis.readiness_score}%</span>
            </div>
          </div>

          {analysis.readiness_score < 70 && (
            <div className="retro-box-dark p-3 mb-4">
              <p className="text-sm">Below 70% - won't mark as solved</p>
            </div>
          )}

          {/* Expandable AI Analysis */}
          <details className="mb-4">
            <summary className="font-bold cursor-pointer retro-box p-2">AI Analysis</summary>
            <div className="retro-box p-3 mt-2">
              <h4 className="font-bold mb-2">Strengths:</h4>
              <ul className="text-sm mb-3">
                {analysis.strengths.map((s, i) => (
                  <li key={i}>• {s}</li>
                ))}
              </ul>
              <h4 className="font-bold mb-2">Improve:</h4>
              <ul className="text-sm">
                {analysis.suggestions.map((s, i) => (
                  <li key={i}>• {s}</li>
                ))}
              </ul>
            </div>
          </details>

          {/* AI Chat toggle */}
          <button
            onClick={() => setShowAIChat(!showAIChat)}
            className="retro-btn w-full mb-2"
          >
            {showAIChat ? '✕ Close AI Chat' : '💬 AI Chat'}
          </button>

          {showAIChat && (
            <div className="retro-box p-3 h-48 flex flex-col">
              <div className="flex-1 overflow-y-auto mb-2 text-sm">
                <p className="mb-2">Ask me anything about your prompt!</p>
              </div>
              <input
                type="text"
                placeholder="Ask AI..."
                className="w-full"
              />
            </div>
          )}
        </div>

        {/* Resize handle 2 */}
        <div
          onMouseDown={() => setResizing('right')}
          className="w-1 bg-dark cursor-col-resize hover:bg-green transition-colors"
        />

        {/* Right panel - Output */}
        <div style={{ width: `${100 - leftWidth - middleWidth}%` }} className="retro-box overflow-y-auto p-4 flex flex-col">
          {!hasRun ? (
            <div className="flex flex-col items-center justify-center flex-1">
              <div className="text-4xl mb-4">▶</div>
              <p className="font-bold">Click RUN to see output</p>
            </div>
          ) : (
            <>
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setOutputTab('output')}
                  className={`${outputTab === 'output' ? 'retro-box-green' : 'retro-box'} p-2 font-bold`}
                >
                  Output
                </button>
                <button
                  onClick={() => setOutputTab('analysis')}
                  className={`${outputTab === 'analysis' ? 'retro-box-green' : 'retro-box'} p-2 font-bold`}
                >
                  Analysis
                </button>
              </div>

              {outputTab === 'output' ? (
                <pre className="text-xs whitespace-pre-wrap font-mono mb-4 flex-1">{output}</pre>
              ) : (
                scores && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="retro-box p-4 text-center">
                        <div className="text-2xl font-bold">{scores.clarity}</div>
                        <div className="text-xs">Clarity</div>
                      </div>
                      <div className="retro-box p-4 text-center">
                        <div className="text-2xl font-bold">{scores.completeness}</div>
                        <div className="text-xs">Completeness</div>
                      </div>
                      <div className="retro-box p-4 text-center">
                        <div className="text-2xl font-bold">{scores.creativity}</div>
                        <div className="text-xs">Creativity</div>
                      </div>
                      <div className="retro-box p-4 text-center">
                        <div className="text-2xl font-bold">{scores.effectiveness}</div>
                        <div className="text-xs">Effectiveness</div>
                      </div>
                    </div>
                    <div className="retro-box p-4">
                      <p className="font-bold mb-2">Feedback</p>
                      <p className="text-sm">{scores.feedback}</p>
                    </div>
                  </div>
                )
              )}
            </>
          )}
        </div>
      </div>

      {/* Global resize handler */}
      {resizing && (
        <div
          onMouseMove={(e) => {
            const container = document.querySelector('[role="main"]') as HTMLDivElement;
            if (!container) return;
            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const totalWidth = rect.width;
            const percent = (x / totalWidth) * 100;

            if (resizing === 'left' && percent > 20 && percent < 50) {
              setLeftWidth(percent);
              setMiddleWidth(100 - percent - (100 - leftWidth - middleWidth));
            }
          }}
          onMouseUp={() => setResizing(null)}
          onMouseLeave={() => setResizing(null)}
          style={{ cursor: 'col-resize' }}
        />
      )}
    </div>
  );
}
