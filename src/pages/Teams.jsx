import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Users, Copy, CheckCircle2, TrendingUp, Award, BookOpen, Plus } from "lucide-react";

export default function Teams() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joinCode, setJoinCode] = useState("");
  const [joining, setJoining] = useState(false);
  const [team, setTeam] = useState(null);
  const [members, setMembers] = useState([]);
  const [memberProgress, setMemberProgress] = useState([]);
  const [copiedCode, setCopiedCode] = useState(false);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [courseDescription, setCourseDescription] = useState("");
  const [numChallenges, setNumChallenges] = useState(10);
  const [creatingCourse, setCreatingCourse] = useState(false);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      if (currentUser.role === 'business') {
        let teams = await base44.entities.Team.filter({ admin_email: currentUser.email });
        if (teams.length === 0) {
          const inviteCode = Math.random().toString(36).substring(2, 10).toUpperCase();
          const newTeam = await base44.entities.Team.create({ company_name: currentUser.full_name + "'s Team", admin_email: currentUser.email, invite_code: inviteCode, members: [currentUser.email], seat_limit: 50 });
          teams = [newTeam];
        }
        const teamData = teams[0];
        setTeam(teamData);
        const allUsers = await base44.entities.User.list();
        const teamMembers = allUsers.filter(u => teamData.members?.includes(u.email));
        setMembers(teamMembers);
        const progressData = await Promise.all(teamMembers.map(async (member) => {
          const progress = await base44.entities.UserProgress.filter({ user_email: member.email });
          return { email: member.email, name: member.full_name || member.email.split('@')[0], xp: member.xp_points || 0, completed: progress.filter(p => p.completed).length, streak: member.current_streak || 0 };
        }));
        setMemberProgress(progressData);
      }
    } catch (error) { console.error("Error loading data:", error); }
    finally { setLoading(false); }
  };

  const handleJoinTeam = async () => {
    if (!joinCode.trim()) return;
    setJoining(true);
    try {
      const teams = await base44.entities.Team.filter({ invite_code: joinCode.toUpperCase() });
      if (teams.length === 0) { alert("Invalid team code"); return; }
      const targetTeam = teams[0];
      if (targetTeam.members?.includes(user.email)) { alert("You're already in this team"); return; }
      await base44.entities.Team.update(targetTeam.id, { members: [...(targetTeam.members || []), user.email] });
      await base44.auth.updateMe({ team_id: targetTeam.id, subscription: { planType: "architect", planName: "Architect", status: "active" } });
      alert("✓ Joined team! You now have Architect plan benefits.");
      window.location.reload();
    } catch (error) { console.error("Error joining team:", error); alert("Failed to join team"); }
    finally { setJoining(false); }
  };

  const copyInviteCode = () => { navigator.clipboard.writeText(team.invite_code); setCopiedCode(true); setTimeout(() => setCopiedCode(false), 2000); };

  const handleCreateCourse = async () => {
    if (!courseDescription.trim()) { alert("Please describe the course"); return; }
    setCreatingCourse(true);
    try {
      await base44.entities.CourseRequest.create({ user_email: user.email, team_id: team.id, course_description: courseDescription, num_challenges: numChallenges, status: "pending" });
      alert("✓ Course request sent to admin for review");
      setCourseDescription(""); setShowCourseModal(false);
    } catch (error) { console.error("Error creating request:", error); alert("Failed to send request"); }
    finally { setCreatingCourse(false); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="retro-box-dark px-6 py-3 animate-pulse">LOADING...</div></div>;

  if (user?.role !== 'business') {
    return (
      <div className="min-h-screen py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12"><Users className="w-16 h-16 mx-auto mb-4 opacity-80" /><h1 className="text-4xl font-bold mb-3">JOIN A TEAM</h1><p className="text-lg opacity-80">Enter your team's invite code to unlock full Architect plan benefits</p></div>
          <div className="retro-box p-8 mb-8">
            <h3 className="font-bold mb-4 text-lg">ENTER TEAM CODE</h3>
            <div className="flex gap-3">
              <input type="text" placeholder="ENTER CODE..." value={joinCode} onChange={(e) => setJoinCode(e.target.value.toUpperCase())} className="flex-1 retro-box px-4 py-3 text-lg uppercase text-center tracking-widest" maxLength={8} />
              <button onClick={handleJoinTeam} disabled={!joinCode.trim() || joining} className="retro-btn-primary px-8">{joining ? "JOINING..." : "JOIN"}</button>
            </div>
          </div>
          <div className="retro-box-green p-6"><h3 className="font-bold mb-3">✨ TEAM BENEFITS</h3><ul className="space-y-2 text-sm"><li>• Full Architect plan access</li><li>• Unlimited challenges and courses</li><li>• Custom team courses</li><li>• Team leaderboards</li><li>• Progress tracking</li></ul></div>
        </div>
      </div>
    );
  }

  if (!team) return <div className="min-h-screen flex items-center justify-center"><div className="retro-box p-8 max-w-md text-center"><h2 className="text-2xl font-bold mb-4">NO TEAM FOUND</h2><p className="opacity-80">Contact support to set up your business team.</p></div></div>;

  const totalXP = memberProgress.reduce((sum, m) => sum + m.xp, 0);
  const avgCompletion = memberProgress.length > 0 ? Math.round(memberProgress.reduce((sum, m) => sum + m.completed, 0) / memberProgress.length) : 0;

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div><h1 className="text-4xl font-bold mb-2">{team.company_name}</h1><p className="opacity-80">{members.length} team members</p></div>
          <button onClick={() => setShowCourseModal(true)} className="retro-btn-primary"><Plus className="w-4 h-4 inline mr-2" />REQUEST COURSE</button>
        </div>
        <div className="retro-box-green p-6 mb-8">
          <div className="flex items-center justify-between">
            <div><div className="text-sm opacity-90 mb-1">TEAM INVITE CODE</div><div className="text-3xl font-bold tracking-widest">{team.invite_code}</div></div>
            <button onClick={copyInviteCode} className="retro-btn">{copiedCode ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}</button>
          </div>
        </div>
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="retro-box-dark p-6 text-center"><Users className="w-8 h-8 mx-auto mb-3" /><div className="text-3xl font-bold mb-1">{members.length}</div><div className="text-sm opacity-80">MEMBERS</div></div>
          <div className="retro-box-dark p-6 text-center"><TrendingUp className="w-8 h-8 mx-auto mb-3" /><div className="text-3xl font-bold mb-1">{totalXP}</div><div className="text-sm opacity-80">TOTAL XP</div></div>
          <div className="retro-box-dark p-6 text-center"><Award className="w-8 h-8 mx-auto mb-3" /><div className="text-3xl font-bold mb-1">{avgCompletion}</div><div className="text-sm opacity-80">AVG COMPLETED</div></div>
          <div className="retro-box-dark p-6 text-center"><BookOpen className="w-8 h-8 mx-auto mb-3" /><div className="text-3xl font-bold mb-1">{team.custom_courses?.length || 0}</div><div className="text-sm opacity-80">CUSTOM COURSES</div></div>
        </div>
        <div className="retro-box p-8">
          <h2 className="text-2xl font-bold mb-6">TEAM MEMBERS</h2>
          {memberProgress.length === 0 ? (
            <div className="text-center py-12 opacity-60"><Users className="w-12 h-12 mx-auto mb-4 opacity-40" /><p>No members yet. Share the invite code above.</p></div>
          ) : (
            <div className="space-y-3">{memberProgress.map((member, idx) => (
              <div key={idx} className="retro-box p-4 flex items-center justify-between">
                <div className="flex-1"><div className="font-bold mb-1">{member.name}</div><div className="text-sm opacity-60">{member.email}</div></div>
                <div className="flex gap-6 text-center">
                  <div><div className="text-2xl font-bold">{member.xp}</div><div className="text-xs opacity-60">XP</div></div>
                  <div><div className="text-2xl font-bold">{member.completed}</div><div className="text-xs opacity-60">COMPLETED</div></div>
                  <div><div className="text-2xl font-bold">{member.streak}</div><div className="text-xs opacity-60">STREAK</div></div>
                </div>
              </div>
            ))}</div>
          )}
        </div>
      </div>
      {showCourseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="retro-box max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-6"><h2 className="text-2xl font-bold">REQUEST CUSTOM COURSE</h2><button onClick={() => setShowCourseModal(false)} className="retro-btn px-2 py-2">✕</button></div>
            <div className="space-y-4">
              <textarea value={courseDescription} onChange={(e) => setCourseDescription(e.target.value)} placeholder="E.g., 'Advanced AI prompting for customer service teams'" className="w-full retro-box p-4 min-h-[120px] resize-none" />
              <input type="number" min="5" max="30" value={numChallenges} onChange={(e) => setNumChallenges(parseInt(e.target.value) || 10)} className="w-full retro-box p-3" />
              <div className="flex gap-3 pt-4">
                <button onClick={() => setShowCourseModal(false)} className="retro-btn flex-1">CANCEL</button>
                <button onClick={handleCreateCourse} disabled={creatingCourse || !courseDescription.trim()} className="retro-btn-primary flex-1">{creatingCourse ? "SENDING..." : "SEND REQUEST"}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}