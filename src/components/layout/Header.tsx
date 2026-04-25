import { Link, useLocation } from 'react-router-dom';
import { Bell, LogIn, LogOut, Menu, ScanLine, User } from 'lucide-react';
import { useUser } from '@/hooks/useUser';

export function Header() {
  const { isAuthenticated } = useUser();
  const location = useLocation();
  const isHome = location.pathname === '/' || location.pathname.toLowerCase() === '/home';

  if (isHome) return null;

  return (
    <>
      <header className="argen-app-header">
        <div className="argen-left-actions">
          <button className="argen-icon-btn" aria-label="Open menu">
            <Menu size={24} />
          </button>

          <Link to="/" className="argen-logo-link" aria-label="ArGen home">
            <img src="/logo.png" alt="ArGen" />
          </Link>
        </div>

        <div className="argen-header-actions">
          <button className="argen-icon-btn" aria-label="Notifications">
            <Bell size={20} />
          </button>
          <Link to="/profile" className="argen-icon-btn argen-icon-btn-dark" aria-label="Profile">
            <User size={22} />
          </Link>
          <Link to={isAuthenticated ? '/profile' : '/login'} className="argen-icon-btn" aria-label={isAuthenticated ? 'Account' : 'Sign in'}>
            {isAuthenticated ? <LogOut size={22} /> : <LogIn size={22} />}
          </Link>
        </div>
      </header>

      <nav className="argen-bottom-nav" aria-label="Primary">
        <Link to="/">
          <ScanLine size={24} />
          <span>Home</span>
        </Link>
        <Link to="/challenges">
          <ScanLine size={24} />
          <span>Evaluate</span>
        </Link>
        <Link to="/profile">
          <User size={24} />
          <span>Profile</span>
        </Link>
      </nav>
    </>
  );
}
