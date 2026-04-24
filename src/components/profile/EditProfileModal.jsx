import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { X, Save } from "lucide-react";

export default function EditProfileModal({ isOpen, onClose, user, onUpdate }) {
  const [formData, setFormData] = useState({ full_name: user?.full_name || "", username: user?.username || "", bio: user?.bio || "", location: user?.location || "", website: user?.website || "", profile_visibility: user?.profile_visibility || "public" });
  const [saving, setSaving] = useState(false);
  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    try { await base44.auth.updateMe(formData); await onUpdate(); onClose(); }
    catch (error) { console.error("Error updating profile:", error); alert("Failed to update profile"); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="retro-box max-w-2xl w-full p-8">
        <div className="flex items-center justify-between mb-6"><h2 className="text-2xl font-bold">EDIT PROFILE</h2><button onClick={onClose} className="retro-btn px-2 py-2"><X className="w-5 h-5" /></button></div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div><label className="block text-sm font-bold mb-2">FULL NAME</label><input type="text" value={formData.full_name} onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} className="retro-box w-full px-4 py-2 outline-none font-bold" placeholder="Your full name" /></div>
          <div><label className="block text-sm font-bold mb-2">USERNAME</label><input type="text" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} className="retro-box w-full px-4 py-2 outline-none font-bold" placeholder="@username" /></div>
          <div><label className="block text-sm font-bold mb-2">BIO</label><textarea value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} className="retro-box w-full px-4 py-2 outline-none font-bold h-24 resize-none" placeholder="Tell us about yourself" /></div>
          <div className="flex gap-4 justify-end">
            <button type="button" onClick={onClose} className="retro-btn px-6 py-3" disabled={saving}>CANCEL</button>
            <button type="submit" className="retro-btn-primary px-6 py-3" disabled={saving}><Save className="w-4 h-4 inline mr-2" />{saving ? 'SAVING...' : 'SAVE CHANGES'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}