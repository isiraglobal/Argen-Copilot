import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Tutorials() {
  const navigate = useNavigate();
  const [tutorials] = useState([
    {
      id: 'intro',
      title: 'Introduction to Prompting',
      description: 'Learn the basics of effective prompt engineering',
      duration: 15,
      difficulty: 'beginner',
      steps: 5,
      completed: false,
    },
    {
      id: 'structure',
      title: 'Structuring Complex Prompts',
      description: 'Master prompt organization and formatting',
      duration: 25,
      difficulty: 'intermediate',
      steps: 8,
      completed: false,
    },
    {
      id: 'chain',
      title: 'Prompt Chaining & Workflows',
      description: 'Combine multiple prompts for advanced tasks',
      duration: 40,
      difficulty: 'advanced',
      steps: 12,
      completed: false,
    },
  ]);

  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  const filtered = tutorials.filter(
    (t) => selectedDifficulty === 'all' || t.difficulty === selectedDifficulty
  );

  const difficultyColor = {
    beginner: 'bg-green-dark',
    intermediate: 'bg-yellow-600',
    advanced: 'bg-red-600',
  };

  return (
    <div className="min-h-screen bg-cream p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="border-4 border-dark p-6 retro-box mb-12">
          <h1 className="text-4xl font-bold font-mono text-dark mb-2">Interactive Tutorials</h1>
          <p className="text-dark">Learn prompt engineering step by step</p>
        </div>

        {/* Filter */}
        <div className="flex gap-4 mb-12 flex-wrap">
          {['all', 'beginner', 'intermediate', 'advanced'].map((level) => (
            <button
              key={level}
              onClick={() => setSelectedDifficulty(level)}
              className={`px-6 py-3 border-3 border-dark font-mono font-bold transition-colors ${
                selectedDifficulty === level
                  ? 'retro-btn-primary'
                  : 'retro-btn'
              }`}
            >
              {level === 'all' ? 'All Levels' : level.charAt(0).toUpperCase() + level.slice(1)}
            </button>
          ))}
        </div>

        {/* Tutorials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((tutorial) => (
            <div
              key={tutorial.id}
              onClick={() => navigate(`/tutorials/${tutorial.id}`)}
              className="border-4 border-dark p-6 retro-box cursor-pointer hover:bg-green-dark/5 transition-colors"
            >
              {/* Difficulty Badge */}
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 text-cream font-mono font-bold text-sm ${
                  difficultyColor[tutorial.difficulty]
                }`}>
                  {tutorial.difficulty.toUpperCase()}
                </span>
                {tutorial.completed && (
                  <span className="text-2xl">✓</span>
                )}
              </div>

              <h3 className="text-xl font-bold text-dark mb-2">{tutorial.title}</h3>
              <p className="text-dark text-sm mb-4">{tutorial.description}</p>

              {/* Progress Bar */}
              <div className="w-full h-4 border-2 border-dark bg-cream mb-4">
                <div className="h-full bg-green-dark" style={{
                  width: tutorial.completed ? '100%' : '0%'
                }} />
              </div>

              {/* Meta Info */}
              <div className="flex gap-4 text-xs text-dark/70 font-mono">
                <span>⏱ {tutorial.duration} min</span>
                <span>📚 {tutorial.steps} steps</span>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filtered.length === 0 && (
          <div className="text-center py-16 retro-box p-8">
            <p className="text-dark text-lg">No tutorials found</p>
          </div>
        )}

        {/* Learning Path */}
        <div className="mt-16 border-4 border-dark p-8 retro-box">
          <h2 className="text-2xl font-bold text-dark mb-6">Recommended Learning Path</h2>
          <div className="space-y-4">
            {[
              { step: 1, title: 'Introduction to Prompting', duration: '15 min' },
              { step: 2, title: 'Structuring Complex Prompts', duration: '25 min' },
              { step: 3, title: 'Prompt Chaining & Workflows', duration: '40 min' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 p-4 border-3 border-dark">
                <div className="w-8 h-8 border-3 border-dark bg-green-dark text-cream font-bold flex items-center justify-center">
                  {item.step}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-dark">{item.title}</p>
                  <p className="text-sm text-dark/70">{item.duration}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
