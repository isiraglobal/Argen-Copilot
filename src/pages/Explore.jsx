import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

const quotes = [
  ['The best way to predict the future is to create it.', 'Peter Drucker'],
  ['Excellence is not a skill, it is an attitude.', 'Ralph Marston'],
  ['Success is the sum of small efforts repeated daily.', 'Robert Collier'],
  ['Skill comes from consistent practice and refinement.', 'Anonymous'],
];

const courses = [
  {
    id: 'prompt-foundations',
    title: 'Prompt Engineering Foundations',
    total: 18,
    points: 1800,
    completed: 4,
    premium: false,
  },
  {
    id: 'workplace-writing',
    title: 'Workplace Writing With AI',
    total: 22,
    points: 2400,
    completed: 0,
    premium: false,
  },
  {
    id: 'analysis-summarization',
    title: 'Analysis & Summarization Systems',
    total: 16,
    points: 2100,
    completed: 0,
    premium: true,
  },
  {
    id: 'ai-governance',
    title: 'AI Governance Decision Practice',
    total: 12,
    points: 1600,
    completed: 0,
    premium: true,
  },
];

function CourseCard({ course }) {
  const percentage = Math.round((course.completed / course.total) * 100);

  return (
    <Link to={`/Challenges?course=${course.id}`} className="course-card">
      <div className="course-eyebrow">Training Course</div>
      <h3>{course.title}</h3>

      {course.completed > 0 && (
        <div className="course-progress">
          <div className="course-progress-track">
            <div style={{ width: `${percentage}%` }} />
          </div>
          <div className="course-progress-label">
            <CheckCircle2 size={13} />
            {percentage}% COMPLETE
          </div>
        </div>
      )}

      <div className="course-stats">
        <div>
          <strong>{course.total}</strong>
          <span>Challenges</span>
        </div>
        <div>
          <strong>{course.points}</strong>
          <span>Points</span>
        </div>
        {course.completed > 0 && (
          <div>
            <strong>{course.completed}</strong>
            <span>Completed</span>
          </div>
        )}
      </div>

      {course.premium && <div className="course-pro">PRO</div>}
    </Link>
  );
}

export default function Explore() {
  const [quote, author] = useMemo(() => {
    const index = Math.floor(Date.now() / 86400000) % quotes.length;
    return quotes[index];
  }, []);

  return (
    <main className="argen-page explore-page">
      <div className="argen-page-inner explore-inner">
        <section className="explore-hero">
          <h1>Good afternoon, Learner</h1>
          <div className="quote-card">
            <Sparkles size={26} />
            <p>"{quote}"</p>
            <span>— {author}</span>
          </div>
        </section>

        <section className="explore-metrics">
          <article>
            <span>Progress</span>
            <strong>420</strong>
            <small>Points</small>
          </article>
          <article>
            <span>Consistency</span>
            <strong>3</strong>
            <small>Current Streak</small>
            <em>Best: 8 days</em>
          </article>
          <article className="plan-card">
            <span>Plan</span>
            <strong>Individual</strong>
            <small>4 Completed</small>
          </article>
        </section>

        <section className="continue-section">
          <h2>Continue Training</h2>
          <Link to="/Challenges?course=prompt-foundations" className="continue-card">
            <div>
              <span>In Progress</span>
              <h3>Prompt Engineering Foundations</h3>
            </div>
            <ArrowRight size={34} />
            <div className="continue-progress">
              <div><span style={{ width: '22%' }} /></div>
              <p>4/18 COMPLETED</p>
            </div>
          </Link>
        </section>

        <section className="courses-section">
          <div className="section-heading-row">
            <div>
              <h2>Training Courses</h2>
              <p>Structured prompt engineering frameworks and practice paths</p>
            </div>
            <Link to="/Challenges" className="argen-action">
              View All
            </Link>
          </div>

          <div className="course-grid">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
