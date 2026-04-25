import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '@/hooks/useUser';

interface AuthGatekeeperProps {
  children: React.ReactNode;
  publicRoutes?: string[];
}

const defaultPublicRoutes = [
  '/',
  '/Home',
  '/login',
  '/signup',
  '/about',
  '/About',
  '/contact',
  '/Contact',
  '/privacy',
  '/Privacy',
  '/terms',
  '/Terms',
  '/blog',
  '/Blog',
  '/documentation',
  '/Documentation',
  '/tutorials',
  '/Tutorials',
  '/challenges',
  '/Challenges',
  '/ChallengeDetail',
  '/explore',
  '/Explore',
  '/Evaluate',
  '/teams',
  '/Teams',
  '/TeamDetail',
  '/join-team',
  '/JoinTeam',
  '/business-onboarding',
  '/BusinessOnboarding',
  '/TeamOnboarding',
  '/billing',
  '/Billing',
  '/governance',
  '/Governance',
  '/Compliance',
  '/audit-log',
  '/AuditLog',
  '/download',
  '/Download',
  '/MobileGuide',
  '/Certifications',
];

export function AuthGatekeeper({
  children,
  publicRoutes = defaultPublicRoutes,
}: AuthGatekeeperProps) {
  const { isAuthenticated, loading } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (loading) return;

    const isPublicRoute = publicRoutes.some(
      (route) =>
        location.pathname === route ||
        location.pathname.startsWith(route + '/')
    );

    if (!isAuthenticated && !isPublicRoute) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, loading, location.pathname, navigate, publicRoutes]);

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-screen retro-box">
        <div>Loading...</div>
      </div>
    );
  }

  return <>{children}</>;
}
