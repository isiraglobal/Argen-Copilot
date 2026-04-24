export function Home() {
  return (
    <div className="w-full min-h-screen bg-cream">
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="retro-box p-8 mb-8">
          <h1 className="text-4xl font-bold mb-4">Welcome to ArGen</h1>
          <p className="text-lg mb-6">
            Master AI prompt engineering and governance with hands-on challenges
          </p>
          <button className="retro-btn-primary">
            Get Started
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="retro-box p-6">
            <h3 className="font-bold text-lg mb-2">Learn</h3>
            <p>Master prompt engineering fundamentals</p>
          </div>
          <div className="retro-box p-6">
            <h3 className="font-bold text-lg mb-2">Practice</h3>
            <p>Solve real-world challenges</p>
          </div>
          <div className="retro-box p-6">
            <h3 className="font-bold text-lg mb-2">Govern</h3>
            <p>Implement AI governance practices</p>
          </div>
        </div>
      </div>
    </div>
  );
}
