import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Award, Lock, CheckCircle2, Target, Sparkles } from "lucide-react";

export default function Certifications() {
  const [user, setUser] = useState(null);
  const [certifications, setCertifications] = useState([]);
  const [progress, setProgress] = useState({
    operator: { met: false, challenges: 0, required: 20, avgScore: 0 },
    architect: { met: false, challenges: 0, required: 50, avgScore: 0 },
    thinker: { met: false, challenges: 0, required: 100, avgScore: 0 }
  });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const currentUser = await base44.auth.me();
    setUser(currentUser);
    const certs = await base44.entities.SkillCertification.filter({ user_email: currentUser.email });
    setCertifications(certs);
    const userProgress = await base44.entities.UserProgress.filter({ user_email: currentUser.email, completed: true });
    const avgScore = userProgress.length > 0 ? userProgress.reduce((sum, p) => sum + (p.best_score || 0), 0) / userProgress.length : 0;
    setProgress({
      operator: { met: userProgress.length >= 20 && avgScore >= 70, challenges: userProgress.length, required: 20, avgScore: Math.round(avgScore) },
      architect: { met: userProgress.length >= 50 && avgScore >= 80, challenges: userProgress.length, required: 50, avgScore: Math.round(avgScore) },
      thinker: { met: userProgress.length >= 100 && avgScore >= 85, challenges: userProgress.length, required: 100, avgScore: Math.round(avgScore) }
    });
  };

  const hasCert = (level) => certifications.some(c => c.certification_level === level);
  const isPremium = user?.subscription?.planType !== 'free';
  const levels = [
    { id: "operator", name: "Prompt Operator", description: "Foundational prompt engineering competence", requirements: "20 challenges • 70% avg score", color: "retro-box-green" },
    { id: "architect", name: "Prompt Architect", description: "Advanced systematic prompting and pattern recognition", requirements: "50 challenges • 80% avg score", color: "retro-box-dark", premium: true },
    { id: "thinker", name: "AI Systems Thinker", description: "Mastery of AI decision frameworks and governance", requirements: "100 challenges • 85% avg score", color: "retro-box-dark", premium: true }
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-2">Skill Certifications</h1>
        <p className="opacity-60 mb-8">Internal mastery levels - reputation through rigor, not badges</p>
        <div className="space-y-8">
          {levels.map(level => {
            const prog = progress[level.id];
            const earned = hasCert(level.id);
            const isLocked = level.premium && !isPremium;
            return (
              <div key={level.id} className={`${level.color} p-8 relative ${isLocked ? 'opacity-50' : ''}`} style={isLocked ? { filter: 'blur(2px)' } : {}}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2"><h2 className="text-2xl font-bold">{level.name}</h2>{earned && <CheckCircle2 className="w-6 h-6 text-[#4A7C6B]" />}{level.premium && <Lock className="w-5 h-5 opacity-60" />}</div>
                    <p className="opacity-80 mb-3">{level.description}</p>
                    <div className="text-sm opacity-60">{level.requirements}</div>
                  </div>
                  {earned && <div className="retro-box px-4 py-2"><Award className="w-8 h-8 mx-auto mb-1" /><div className="text-xs">EARNED</div></div>}
                </div>
                {!earned && !isLocked && (
                  <div className="mt-6">
                    <div className="text-xs opacity-60 mb-2">YOUR PROGRESS</div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="retro-box p-4"><div className="text-xs opacity-60 mb-1">Challenges Completed</div><div className="text-2xl font-bold">{prog.challenges}/{prog.required}</div><div className="h-2 retro-box mt-2"><div className="h-full bg-[#2D5F4F]" style={{ width: `${Math.min(100, (prog.challenges / prog.required) * 100)}%` }} /></div></div>
                      <div className="retro-box p-4"><div className="text-xs opacity-60 mb-1">Average Score</div><div className="text-2xl font-bold">{prog.avgScore}%</div></div>
                    </div>
                  </div>
                )}
                {isLocked && <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30"><div className="retro-box-dark px-6 py-3 font-bold"><Lock className="w-4 h-4 inline mr-2" />UPGRADE TO UNLOCK</div></div>}
              </div>
            );
          })}
        </div>
        {!isPremium && (
          <div className="retro-box-dark p-8 text-center mt-12">
            <Sparkles className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">UNLOCK ALL CERTIFICATIONS</h3>
            <p className="opacity-80 mb-6">Access Architect & Systems Thinker levels • Advanced challenges • Professional recognition</p>
            <button className="retro-btn-primary px-8 py-3">UPGRADE NOW</button>
          </div>
        )}
      </div>
    </div>
  );
}