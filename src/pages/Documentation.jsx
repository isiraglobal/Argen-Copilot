import React, { useState } from 'react';

interface DocSection {
  id: string;
  title: string;
  content: string;
  subsections: string[];
}

export default function Documentation() {
  const [selectedSection, setSelectedSection] = useState('getting-started');

  const sections: Record<string, DocSection> = {
    'getting-started': {
      id: 'getting-started',
      title: 'Getting Started',
      content: `Welcome to ArGen! This guide will help you get started with prompt engineering challenges.

## What is ArGen?

ArGen is a platform designed to help you master prompt engineering through structured challenges and evaluations.

## Your First Challenge

1. Navigate to the Challenges page
2. Select a beginner-level challenge
3. Read the challenge description
4. Write and test your prompt
5. Submit when ready

## Key Concepts

### Readiness Score
Your readiness score reflects how well-structured your prompt is, on a scale of 0-100.

### Challenge Completion
You complete a challenge when your overall score reaches 70% or higher.`,
      subsections: ['Getting Started', 'Basic Concepts', 'Your First Challenge'],
    },
    'prompting': {
      id: 'prompting',
      title: 'Prompt Engineering',
      content: `Learn the fundamentals of effective prompt engineering.

## Best Practices

### 1. Be Specific
Provide clear instructions and examples in your prompts.

### 2. Define Roles
Use role-playing to set context: "You are a marketing expert..."

### 3. Specify Format
Tell the AI how to format the output.

### 4. Set Constraints
Specify length, tone, and other limitations.`,
      subsections: ['Best Practices', 'Techniques', 'Common Mistakes'],
    },
    'teams': {
      id: 'teams',
      title: 'Teams & Collaboration',
      content: `Work together with your team on shared challenges.

## Creating a Team

1. Click "Create Team" on the Teams page
2. Enter your team name and description
3. Invite members using their email addresses
4. Share your team's invitation code

## Team Features

- Shared AI evaluation pool
- Collaborative challenge solving
- Team analytics and progress tracking`,
      subsections: ['Creating Teams', 'Inviting Members', 'Team Features'],
    },
    'api': {
      id: 'api',
      title: 'API Reference',
      content: `Use our API to integrate ArGen into your applications.

## Authentication

All API requests require an API key in the Authorization header:

\`\`\`
Authorization: Bearer YOUR_API_KEY
\`\`\`

## Endpoints

### List Challenges
\`GET /api/challenges\`

### Get Challenge
\`GET /api/challenges/{id}\`

### Submit Prompt
\`POST /api/submissions\``,
      subsections: ['Authentication', 'Endpoints', 'Rate Limits'],
    },
  };

  const section = sections[selectedSection];

  return (
    <div className="min-h-screen bg-cream p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="border-4 border-dark p-6 retro-box h-fit">
          <h2 className="text-xl font-bold text-dark mb-6 border-b-3 border-dark pb-4">
            Documentation
          </h2>
          <nav className="space-y-2">
            {Object.values(sections).map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedSection(s.id)}
                className={`w-full text-left px-4 py-3 border-2 border-dark font-mono font-bold transition-colors ${
                  selectedSection === s.id
                    ? 'bg-green-dark text-cream'
                    : 'bg-cream text-dark hover:bg-dark/5'
                }`}
              >
                {s.title}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="md:col-span-3 border-4 border-dark p-8 retro-box">
          <h1 className="text-4xl font-bold text-dark mb-8">{section.title}</h1>
          <div className="prose prose-invert max-w-none text-dark whitespace-pre-line">
            {section.content}
          </div>

          {/* Subsections */}
          {section.subsections.length > 0 && (
            <div className="mt-12 pt-8 border-t-3 border-dark">
              <h2 className="text-2xl font-bold text-dark mb-4">Sections</h2>
              <ul className="space-y-2">
                {section.subsections.map((sub) => (
                  <li key={sub} className="flex items-center gap-2">
                    <span className="text-green-dark">→</span>
                    <span className="text-dark font-mono">{sub}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
