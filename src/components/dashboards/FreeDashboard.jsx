import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowRight, Lock, Award } from "lucide-react";

export default function FreeDashboard({ user, courses, challenges, userProgress, continueProgress, getCourseProgress }) {
  const progress = userProgress || [];
  const xpPoints = user?.xp_points || 0;
  const currentStreak = user?.current_streak || 0;

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-3 gap-6 mb-12">
        <div className="retro-box p-6 text-center"><div className="text-4xl font-bold mb-2">{xpPoints}</div><div className="text-sm opacity-80">XP Points</div></div>
        <div className="retro-box p-6 text-center"><div className="text-4xl font-bold mb-2">{currentStreak}</div><div className="text-sm opacity-80">Day Streak</div></div>
        <div className="retro-box p-6 text-center"><div className="text-4xl font-bold mb-2">{progress.filter(p => p.completed).length}</div><div className="text-sm opacity-80">Completed</div></div>
      </div>
      {continueProgress && (
        <div><h2 className="text-2xl font-bold mb-6">CONTINUE LEARNING</h2>
          <Link to={`${createPageUrl("Challenges")}?course=${continueProgress.id}`}>
            <div className="retro-box-green p-8 transition-opacity hover:opacity-95">
              <div className="flex items-center justify-between">
                <div><h3 className="text-2xl font-bold mb-2">{continueProgress.title}</h3><div className="text-sm opacity-90">{getCourseProgress(continueProgress.id).completed}/{getCourseProgress(continueProgress.id).total} COMPLETED</div></div>
                <ArrowRight className="w-8 h-8" />
              </div>
            </div>
          </Link>
        </div>
      )}
      <div>
        <h2 className="text-2xl font-bold mb-6">TRAINING COURSES</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {courses.map((course) => {
            if (!course.is_premium) return (
              <Link key={course.id} to={`${createPageUrl("Challenges")}?course=${course.id}`}>
                <div className="retro-box-green p-6 h-64 flex flex-col transition-opacity hover:opacity-95">
                  <h3 className="text-lg font-bold mb-auto">{course.title}</h3>
                  <div className="flex items-center justify-between text-sm mt-4">
                    <div><div className="text-2xl font-bold">{course.total_challenges}</div><div className="opacity-80">Challenges</div></div>
                    <div><div className="text-2xl font-bold">{getCourseProgress(course.id).percentage}%</div><div className="opacity-80">Complete</div></div>
                  </div>
                </div>
              </Link>
            );
            return (
              <div key={course.id} className="retro-box-green p-6 h-64 flex flex-col relative">
                <div style={{ filter: 'blur(5px)', pointerEvents: 'none' }}><h3 className="text-lg font-bold mb-auto">{course.title}</h3></div>
                <Link to={createPageUrl("Profile")} className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10 cursor-pointer"><div className="retro-box-dark px-6 py-3 font-bold text-[#F5F1E8] text-center"><Lock className="w-5 h-5 inline mr-2" />UPGRADE FOR MORE</div></Link>
              </div>
            );
          })}
        </div>
      </div>
      <div className="retro-box p-6 text-center">
        <Award className="w-8 h-8 mx-auto mb-3 opacity-60" />
        <h2 className="text-xl font-bold mb-2">Want More?</h2>
        <p className="opacity-80 mb-4 text-sm">Unlock all challenges, unlimited prompts, and advanced features</p>
        <Link to={createPageUrl("Profile")}><button className="retro-btn-primary px-6 py-2">UPGRADE</button></Link>
      </div>
    </div>
  );
}