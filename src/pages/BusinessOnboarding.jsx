import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchApi } from '../lib/api';

export default function BusinessOnboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    companyName: '',
    teamSize: '',
    industry: '',
    useCase: '',
    phone: '',
    budget: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      // TODO: Submit business onboarding request
      console.log('Submitting:', formData);
      navigate('/teams');
    } catch (error) {
      console.error('Failed to submit onboarding:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="border-4 border-dark p-6 retro-box mb-12">
          <h1 className="text-4xl font-bold font-mono text-dark mb-2">
            Business Onboarding
          </h1>
          <p className="text-dark">Get your team set up for success</p>
        </div>

        {/* Progress Indicator */}
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

        {/* Step 1: Company Info */}
        {step === 1 && (
          <div className="border-4 border-dark p-8 retro-box">
            <h2 className="text-2xl font-bold text-dark mb-6">Company Information</h2>
            <input
              type="text"
              placeholder="Company Name"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              className="w-full mb-4 p-3 border-3 border-dark font-mono"
            />
            <select
              value={formData.teamSize}
              onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
              className="w-full mb-4 p-3 border-3 border-dark font-mono"
            >
              <option value="">Team Size</option>
              <option value="1-10">1-10 people</option>
              <option value="11-50">11-50 people</option>
              <option value="51-200">51-200 people</option>
              <option value="200+">200+ people</option>
            </select>
            <select
              value={formData.industry}
              onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              className="w-full mb-6 p-3 border-3 border-dark font-mono"
            >
              <option value="">Industry</option>
              <option value="tech">Technology</option>
              <option value="finance">Finance</option>
              <option value="healthcare">Healthcare</option>
              <option value="education">Education</option>
              <option value="other">Other</option>
            </select>
          </div>
        )}

        {/* Step 2: Use Case */}
        {step === 2 && (
          <div className="border-4 border-dark p-8 retro-box">
            <h2 className="text-2xl font-bold text-dark mb-6">Use Case</h2>
            <textarea
              placeholder="Describe how your team will use ArGen..."
              value={formData.useCase}
              onChange={(e) => setFormData({ ...formData, useCase: e.target.value })}
              className="w-full mb-4 p-3 border-3 border-dark font-mono"
              rows={6}
            />
          </div>
        )}

        {/* Step 3: Contact & Budget */}
        {step === 3 && (
          <div className="border-4 border-dark p-8 retro-box">
            <h2 className="text-2xl font-bold text-dark mb-6">Contact & Budget</h2>
            <input
              type="tel"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full mb-4 p-3 border-3 border-dark font-mono"
            />
            <select
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              className="w-full mb-6 p-3 border-3 border-dark font-mono"
            >
              <option value="">Monthly Budget</option>
              <option value="0-100">$0-100</option>
              <option value="100-500">$100-500</option>
              <option value="500-2000">$500-2,000</option>
              <option value="2000+">$2,000+</option>
            </select>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-4 mt-8">
          <button
            onClick={() => setStep(Math.max(1, step - 1))}
            className={`flex-1 py-4 border-3 border-dark font-bold font-mono ${
              step === 1 ? 'opacity-50 cursor-not-allowed' : 'retro-btn'
            }`}
            disabled={step === 1}
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
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 py-4 retro-btn-primary font-bold font-mono"
            >
              {submitting ? 'Submitting...' : 'Complete Onboarding'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
