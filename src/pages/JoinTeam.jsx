import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import { fetchApi } from '../lib/api';

export default function JoinTeam() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [invitationCode, setInvitationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleJoinTeam = async () => {
    if (!invitationCode.trim()) {
      setError('Please enter an invitation code');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const result = await fetchApi('/api/teams/join', {
        method: 'POST',
        body: JSON.stringify({ invitation_code: invitationCode }),
      });
      navigate(`/teams/${result.team_id}`);
    } catch (err) {
      setError('Invalid invitation code');
      console.error('Failed to join team:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream p-8 flex items-center justify-center">
      <div className="max-w-md w-full">
        <div className="border-4 border-dark p-8 retro-box">
          <h1 className="text-3xl font-bold font-mono text-dark mb-2">Join a Team</h1>
          <p className="text-dark mb-8">Enter the invitation code to join a team</p>

          {error && (
            <div className="mb-6 p-4 border-3 border-red-600 bg-cream">
              <p className="text-red-600 font-mono">{error}</p>
            </div>
          )}

          <input
            type="text"
            placeholder="Invitation Code"
            value={invitationCode}
            onChange={(e) => setInvitationCode(e.target.value)}
            className="w-full mb-6 p-4 border-3 border-dark font-mono text-lg"
          />

          <button
            onClick={handleJoinTeam}
            disabled={loading}
            className="w-full py-4 retro-btn-primary font-bold font-mono text-lg mb-4"
          >
            {loading ? 'Joining...' : 'Join Team'}
          </button>

          <button
            onClick={() => navigate('/teams')}
            className="w-full py-4 retro-btn font-bold font-mono text-lg"
          >
            Back to Teams
          </button>
        </div>
      </div>
    </div>
  );
}
