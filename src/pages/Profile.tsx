import { useUser } from '@/hooks/useUser';

export function Profile() {
  const { profile } = useUser();

  if (!profile) {
    return <div className="retro-box p-4">Loading profile...</div>;
  }

  return (
    <div className="w-full min-h-screen bg-cream p-4">
      <div className="max-w-3xl mx-auto">
        <div className="retro-box p-8 mb-6">
          <h1 className="text-3xl font-bold mb-4">{profile.name}</h1>
          <p className="text-lg mb-4">{profile.email}</p>
          <div className="retro-box-green p-4 inline-block">
            Plan: {profile.plan_name}
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="retro-box p-6 text-center">
            <div className="text-2xl font-bold">0</div>
            <div className="text-sm">Submissions</div>
          </div>
          <div className="retro-box p-6 text-center">
            <div className="text-2xl font-bold">0</div>
            <div className="text-sm">Current Streak</div>
          </div>
          <div className="retro-box p-6 text-center">
            <div className="text-2xl font-bold">0</div>
            <div className="text-sm">Best Streak</div>
          </div>
        </div>

        {/* Difficulty progress */}
        <div className="retro-box p-6">
          <h2 className="text-xl font-bold mb-4">Difficulty Progress</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-2">Beginner</label>
              <div className="w-full retro-box-dark h-4 relative">
                <div className="h-full retro-box-green" style={{ width: '0%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
