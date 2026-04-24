import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { ArrowRight, FileCheck, Users, Lock, Code, Compass } from "lucide-react";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ evaluations_this_week: 0, limit: 10 });
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      setStats({ evaluations_this_week: 3, limit: 10 });
    } catch (error) { console.error("Error loading data:", error); }
    finally { setLoading(false); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}><div className="text-xl font-bold">LOADING...</div></div>;

  const isBusinessAccount = user?.role === "business";
  const hasTeamAccess = user?.team_id;
  const dashboardMode = user?.dashboard_mode || (isBusinessAccount ? 'business' : 'basic');
  const showAsBasic = dashboardMode === 'basic';

  return (
    <div className="min-h-screen py-8 px-4" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{isBusinessAccount && !showAsBasic ? "Team Management Dashboard" : "Dashboard"}</h1>
              <p className="opacity-80">{isBusinessAccount && !showAsBasic ? "Monitor team progress and manage members" : "Verify AI output and practice your skills"}</p>
            </div>
            {isBusinessAccount && (
              <button onClick={async () => { const newMode = showAsBasic ? 'business' : 'basic'; await base44.auth.updateMe({ dashboard_mode: newMode }); window.location.reload(); }} className="retro-btn px-4 py-2 text-sm">
                {showAsBasic ? 'Team View' : 'Personal View'}
              </button>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="retro-box p-6"><div className="text-xs opacity-60 uppercase mb-2">This Week</div><div className="text-3xl font-bold mb-1">{stats.evaluations_this_week}</div><div className="text-sm opacity-80">Evaluations</div></div>
          <div className="retro-box p-6"><div className="text-xs opacity-60 uppercase mb-2">Remaining</div><div className="text-3xl font-bold mb-1">{stats.limit - stats.evaluations_this_week}</div><div className="text-sm opacity-80">of {stats.limit} weekly limit</div></div>
          <div className="retro-box p-6"><div className="text-xs opacity-60 uppercase mb-2">Mode</div><div className="text-xl font-bold mb-1">{hasTeamAccess ? "Team" : "Individual"}</div><div className="text-sm opacity-80">Workspace</div></div>
        </div>

        <div className="space-y-6">
          <Link to={createPageUrl("Evaluate")}>
            <div className="retro-box-green p-8 transition-opacity hover:opacity-95">
              <div className="flex items-center justify-between">
                <div><div className="flex items-center gap-3 mb-3"><FileCheck className="w-8 h-8" /><h2 className="text-2xl font-bold">Review AI Output</h2></div><p className="opacity-90">Verify reliability before using AI-generated content in your work.</p></div>
                <ArrowRight className="w-8 h-8" />
              </div>
            </div>
          </Link>

          <div className="retro-box p-6">
            <h3 className="text-xl font-bold mb-4">Practice & Learn</h3>
            <p className="text-sm opacity-80 mb-6">Improve your AI interaction skills through structured challenges and courses.</p>
            <div className="grid md:grid-cols-2 gap-4">
              <Link to={createPageUrl("Challenges")}><div className="retro-box p-4 transition-opacity hover:opacity-90 flex items-center gap-3"><Code className="w-6 h-6" /><div><div className="font-bold">Challenges</div><div className="text-xs opacity-60">Practical exercises</div></div></div></Link>
              <Link to={createPageUrl("Explore")}><div className="retro-box p-4 transition-opacity hover:opacity-90 flex items-center gap-3"><Compass className="w-6 h-6" /><div><div className="font-bold">Courses</div><div className="text-xs opacity-60">Structured learning</div></div></div></Link>
            </div>
          </div>

          {!isBusinessAccount && (
            <div className="retro-box p-8">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 retro-box-dark rounded-full flex items-center justify-center flex-shrink-0"><Users className="w-8 h-8 text-[#F5F1E8]" /></div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">Business Account</h3>
                  <p className="opacity-80 mb-4">Manage teams, track member progress, and access all premium features.</p>
                  <Link to={createPageUrl("BusinessOnboarding")}><button className="retro-btn-primary px-6 py-3">Apply for Business Access</button></Link>
                </div>
                <Lock className="w-6 h-6 opacity-40" />
              </div>
            </div>
          )}
        </div>

        <div className="mt-12 retro-box-dark p-6 text-sm opacity-90">
          <p className="mb-2"><strong>Privacy Notice:</strong> Your data is not used to train models. Content is not stored beyond processing.</p>
          <p>Safe for professional use.</p>
        </div>
      </div>
    </div>
  );
}