import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import { fetchApi } from '../lib/api';

export default function CreateCourse() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    difficulty: 'beginner',
    content: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleCreate = async () => {
    if (!formData.title.trim()) {
      alert('Please enter a course title');
      return;
    }

    try {
      setSubmitting(true);
      const newCourse = await fetchApi('/api/courses', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      navigate(`/courses/${newCourse.id}`);
    } catch (error) {
      console.error('Failed to create course:', error);
      alert('Failed to create course');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <button
          onClick={() => navigate('/courses')}
          className="mb-6 px-4 py-2 border-2 border-dark font-mono text-dark hover:bg-dark/10"
        >
          ← Back to Courses
        </button>

        <div className="border-4 border-dark p-6 retro-box mb-12">
          <h1 className="text-4xl font-bold font-mono text-dark mb-2">Create a Course</h1>
          <p className="text-dark">Share your expertise with the community</p>
        </div>

        {/* Progress */}
        <div className="flex gap-4 mb-12">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`flex-1 h-2 border-2 border-dark ${
                s <= step ? 'bg-green-dark' : 'bg-cream'
              }`}
            />
          ))}
        </div>

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="border-4 border-dark p-8 retro-box">
            <h2 className="text-2xl font-bold text-dark mb-6">Course Information</h2>
            <input
              type="text"
              placeholder="Course Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full mb-4 p-3 border-3 border-dark font-mono"
            />
            <textarea
              placeholder="Course Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full mb-4 p-3 border-3 border-dark font-mono"
              rows={5}
            />
          </div>
        )}

        {/* Step 2: Category & Level */}
        {step === 2 && (
          <div className="border-4 border-dark p-8 retro-box">
            <h2 className="text-2xl font-bold text-dark mb-6">Course Details</h2>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full mb-4 p-3 border-3 border-dark font-mono"
            >
              <option value="">Select Category</option>
              <option value="prompting">Prompt Engineering</option>
              <option value="ai">AI Fundamentals</option>
              <option value="governance">AI Governance</option>
              <option value="advanced">Advanced Topics</option>
            </select>
            <select
              value={formData.difficulty}
              onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
              className="w-full mb-6 p-3 border-3 border-dark font-mono"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        )}

        {/* Step 3: Content */}
        {step === 3 && (
          <div className="border-4 border-dark p-8 retro-box">
            <h2 className="text-2xl font-bold text-dark mb-6">Content</h2>
            <textarea
              placeholder="Course content (Markdown supported)"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full mb-6 p-3 border-3 border-dark font-mono"
              rows={10}
            />
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-4 mt-8">
          <button
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
            className={`flex-1 py-4 border-3 border-dark font-bold font-mono ${
              step === 1 ? 'opacity-50 cursor-not-allowed' : 'retro-btn'
            }`}
          >
            ← Previous
          </button>
          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="flex-1 py-4 retro-btn-primary font-bold font-mono"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handleCreate}
              disabled={submitting}
              className="flex-1 py-4 retro-btn-primary font-bold font-mono"
            >
              {submitting ? 'Creating...' : 'Create Course'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
