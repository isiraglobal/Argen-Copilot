import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import { fetchApi } from '../lib/api';

export default function TeamDetail() {
  const { id: teamId } = useParams();
  const { user } = useUser();
  const navigate = useNavigate();
  const [team, setTeam] = useState<TeamDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);

  useEffect(() => {
    loadTeam();
  }, [teamId]);

  const loadTeam = async () => {
    try {
      setLoading(true);
      const data = await fetchApi(`/api/teams/${teamId}`);
      setTeam(data);
    } catch (error) {
      console.error('Failed to load team:', error);
      navigate('/teams');
    } finally {
      setLoading(false);
    }
  };

  const handleInviteMember = async () => {
    if (!inviteEmail.trim()) return;

    try {
      await fetchApi(`/api/teams/${teamId}/members`, {
        method: 'POST',
        body: JSON.stringify({ email: inviteEmail, role: 'member' }),
      });
      setInviteEmail('');
      setShowInviteModal(false);
      loadTeam();
    } catch (error) {
      console.error('Failed to invite member:', error);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (!team) return <div className="p-8">Team not found</div>;

  const isOwner = user?.id === team.owner_id;
  const poolUsagePercent = (team.ai_pool_used / team.ai_pool_monthly) * 100;

  return (
    <div className="min-h-screen bg-cream p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <button
          onClick={() => navigate('/teams')}
          className="mb-6 px-4 py-2 border-2 border-dark font-mono text-dark hover:bg-dark/10"
        >
          ← Back to Teams
        </button>

        <div className="border-4 border-dark p-8 retro-box mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-4xl font-bold font-mono text-dark">{team.name}</h1>
              <p className="text-dark mt-2">{team.description}</p>
            </div>
            {isOwner && (
              <button className="retro-btn-primary px-6 py-3 font-bold">
                Team Settings
              </button>
            )}
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-dark">{team.member_count}</div>
              <div className="text-sm text-dark">Members</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-dark">{team.plan_type}</div>
              <div className="text-sm text-dark">Plan</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-dark">{poolUsagePercent.toFixed(0)}%</div>
              <div className="text-sm text-dark">Pool Used</div>
            </div>
          </div>
        </div>

        {/* AI Pool Progress */}
        <div className="border-4 border-dark p-6 retro-box mb-8">
          <h2 className="text-2xl font-bold text-dark mb-4">AI Evaluation Pool</h2>
          <div className="mb-4">
            <div className="w-full h-8 border-3 border-dark bg-cream">
              <div
                className="h-full bg-green-dark transition-all"
                style={{ width: `${poolUsagePercent}%` }}
              />
            </div>
          </div>
          <p className="text-dark font-mono">
            {team.ai_pool_used} / {team.ai_pool_monthly} evaluations used this month
          </p>
        </div>

        {/* Members Section */}
        <div className="border-4 border-dark p-6 retro-box">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-dark">Team Members</h2>
            {isOwner && (
              <button
                onClick={() => setShowInviteModal(true)}
                className="retro-btn-primary px-6 py-2 font-bold"
              >
                + Invite
              </button>
            )}
          </div>

          {/* Members List */}
          <div className="space-y-4">
            {team.members.map((member) => (
              <div key={member.id} className="flex justify-between items-center p-4 border-2 border-dark">
                <div>
                  <p className="font-bold text-dark">{member.email}</p>
                  <p className="text-sm text-dark/70">{member.role}</p>
                </div>
                {isOwner && member.role !== 'owner' && (
                  <button className="px-3 py-1 text-sm border-2 border-dark text-dark hover:bg-dark/10">
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Invite Modal */}
        {showInviteModal && (
          <div className="fixed inset-0 bg-dark/50 flex items-center justify-center z-50 p-4">
            <div className="bg-cream border-4 border-dark p-8 retro-box max-w-md w-full">
              <h2 className="text-2xl font-bold text-dark mb-6">Invite Team Member</h2>
              <input
                type="email"
                placeholder="Email address"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="w-full mb-6 p-3 border-3 border-dark font-mono"
              />
              <div className="flex gap-4">
                <button
                  onClick={handleInviteMember}
                  className="flex-1 retro-btn-primary py-2 font-bold"
                >
                  Send Invite
                </button>
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="flex-1 retro-btn py-2 font-bold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
