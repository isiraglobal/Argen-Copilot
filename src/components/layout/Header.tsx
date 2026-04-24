import { Link } from 'react-router-dom';
import { useUser } from '@/hooks/useUser';

export function Header() {
  const { isAuthenticated } = useUser();

  return (
    <header className="bg-cream border-b-4 border-black">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <img 
            src="/logo.svg" 
            alt="ArGen Logo" 
            className="h-10 w-auto"
            onError={(e) => {
              // Fallback if logo not found - just show text
              e.currentTarget.style.display = 'none';
            }}
          />
          <span className="font-bold text-xl">ArGen</span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-6">
          <Link to="/challenges" className="font-bold hover:underline">
            Challenges
          </Link>
          <Link to="/explore" className="font-bold hover:underline">
            Explore
          </Link>
          <Link to="/teams" className="font-bold hover:underline">
            Teams
          </Link>

          {isAuthenticated ? (
            <Link to="/profile" className="retro-btn">
              Profile
            </Link>
          ) : (
            <Link to="/" className="retro-btn-primary">
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
