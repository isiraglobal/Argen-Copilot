import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { User, Edit, Settings, Award, Shield, Trash2 } from "lucide-react";
// Replace with your own modal components
// import EditProfileModal from "../components/profile/EditProfileModal";
// import ManagePlanModal from "../components/subscription/ManagePlanModal";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [subscription, setSubscription] = useState({ planType: "free", planName: "Individual", status: "active" });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [userProgress, setUserProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadProfileData(); }, []);

  const loadProfileData = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      setSubscription(currentUser?.subscription || { planType: "free", planName: "Individual", status: "active" });
      const progress = await base44.entities.UserProgress.filter({ user_email: currentUser.email });
      setUserProgress(progress);
    } catch (error) { console.error("Error loading profile data:", error); }
    finally { setLoading(false); }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") { alert("Please type DELETE to confirm"); return; }
    setDeleting(true);
    try {
      await Promise.all([
        base44.entities.UserProgress.filter({ user_email: user.email }).then(records => Promise.all(records.map(r => base44.entities.UserProgress.delete(r.id)))),
        base44.entities.Submission.filter({ user_email: user.email }).then(records => Promise.all(records.map(r => base44.entities.Submission.delete(r.id))))
      ]);
      await base44.auth.logout("/");
    } catch (error) { console.error("Error deleting account:", error); alert("Failed to delete account. Please contact support."); }
    finally { setDeleting(false); }
  };

  if (loading || !user) return <div className="min-h-screen flex items-center justify-center"><div className="retro-box-dark px-6 py-3 animate-pulse">LOADING...</div></div>;

  const totalSolved = (user.easy_solved || 0) + (user.medium_solved || 0) + (user.hard_solved || 0);
  const activityData = user.activity_data || [];
  const displayName = user.full_name || user.username || user.email.split('@')[0];

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="retro-box p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 retro-box-dark flex items-center justify-center"><User className="w-10 h-10 text-[#F5F1E8]" /></div>
              <div><h1 className="text-3xl font-bold mb-2">{displayName}</h1><p className="opacity-60">{user.email}</p></div>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="retro-box p-6 text-center"><Award className="w-8 h-8 mx-auto mb-2" /><div className="text-3xl font-bold mb-1">{user.xp_points || 0}</div><div className="text-sm opacity-60">XP POINTS</div></div>
            <div className="retro-box p-6 text-center"><Award className="w-8 h-8 mx-auto mb-2" /><div className="text-3xl font-bold mb-1">{user.current_streak || 0}</div><div className="text-sm opacity-60">DAY STREAK</div></div>
            <div className="retro-box p-6 text-center"><Award className="w-8 h-8 mx-auto mb-2" /><div className="text-3xl font-bold mb-1">{userProgress.filter(p => p.completed).length}</div><div className="text-sm opacity-60">COMPLETED</div></div>
          </div>
        </div>

        <div className="retro-box p-8 mb-8">
          <h2 className="font-bold text-2xl mb-6">Subscription</h2>
          <div className={`${subscription.planType === "free" ? "retro-box" : subscription.planType === "creator" ? "retro-box-green" : "retro-box-dark"} p-6 text-center mb-6`}>
            <div className="text-2xl font-bold mb-1">{subscription.planName || subscription.planType?.toUpperCase() || "INDIVIDUAL"}</div>
            <div className="text-sm opacity-80">{subscription.billingCycle || ""}</div>
          </div>
        </div>

        <div className="retro-box p-8 mb-8">
          <div className="flex items-center gap-2 mb-6"><Shield className="w-5 h-5" /><h2 className="font-bold text-2xl">Security & Privacy</h2></div>
          <div className="border-t-2 border-black pt-4">
            <h4 className="font-bold mb-2 text-red-600">Delete Account</h4>
            <p className="text-sm opacity-80 mb-4">Permanently delete your account and all associated data. This cannot be undone.</p>
            <button onClick={() => setShowDeleteConfirm(true)} className="retro-btn px-4 py-2 border-red-600 text-red-600">
              <Trash2 className="w-4 h-4 inline mr-2" />DELETE ACCOUNT
            </button>
          </div>
        </div>

        <div className="retro-box p-8">
          <h2 className="font-bold text-2xl mb-8">Performance Overview</h2>
          <div className="grid md:grid-cols-4 gap-6 mb-10">
            <div className="retro-box-dark p-6 text-center"><div className="text-3xl font-bold mb-1">{totalSolved}</div><div className="text-xs opacity-80">Completed</div></div>
            <div className="retro-box-dark p-6 text-center"><div className="text-3xl font-bold">{user.total_submissions || 0}</div><div className="text-xs opacity-80">Attempts</div></div>
            <div className="retro-box-dark p-6 text-center"><div className="text-3xl font-bold">{user.avg_score || 0}</div><div className="text-xs opacity-80">Avg Score</div></div>
            <div className="retro-box-dark p-6 text-center"><div className="text-3xl font-bold">{user.longest_streak || 0}</div><div className="text-xs opacity-80">Best Streak</div></div>
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="retro-box max-w-md w-full p-8">
            <h3 className="text-xl font-bold mb-4 text-red-600">Delete Account?</h3>
            <p className="text-sm mb-4">This will permanently delete your account, all progress, submissions, and data. This cannot be undone.</p>
            <p className="text-sm font-bold mb-2">Type "DELETE" to confirm:</p>
            <input type="text" value={deleteConfirmText} onChange={(e) => setDeleteConfirmText(e.target.value)} className="retro-box w-full px-4 py-2 mb-4 outline-none" placeholder="DELETE" />
            <div className="flex gap-3">
              <button onClick={() => { setShowDeleteConfirm(false); setDeleteConfirmText(""); }} className="retro-btn flex-1" disabled={deleting}>CANCEL</button>
              <button onClick={handleDeleteAccount} disabled={deleteConfirmText !== "DELETE" || deleting} className="retro-btn flex-1 border-red-600 text-red-600">
                {deleting ? "DELETING..." : "DELETE"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}