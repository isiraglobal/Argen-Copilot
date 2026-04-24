import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthGatekeeper } from '@/components/auth/AuthGatekeeper';
import { Home } from '@/pages/Home';
import { Challenges } from '@/pages/Challenges';
import ChallengeDetailNew from '@/pages/ChallengeDetailNew';
import Profile from '@/pages/Profile';
import Explore from '@/pages/Explore';
import Teams from '@/pages/Teams';
import TeamDetail from '@/pages/TeamDetail';
import JoinTeam from '@/pages/JoinTeam';
import BusinessOnboarding from '@/pages/BusinessOnboarding';
import Billing from '@/pages/Billing';
import Governance from '@/pages/Governance';
import AuditLog from '@/pages/AuditLog';
import Analytics from '@/pages/Analytics';
import Admin from '@/pages/Admin';
import CreateCourse from '@/pages/CreateCourse';
import APIAccess from '@/pages/APIAccess';
import Blog from '@/pages/Blog';
import Documentation from '@/pages/Documentation';
import Tutorials from '@/pages/Tutorials';

function App() {
  return (
    <Router>
      <AuthGatekeeper>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<div className="p-8 bg-cream min-h-screen retro-box">About page</div>} />
          <Route path="/contact" element={<div className="p-8 bg-cream min-h-screen retro-box">Contact page</div>} />
          <Route path="/privacy" element={<div className="p-8 bg-cream min-h-screen retro-box">Privacy page</div>} />
          <Route path="/terms" element={<div className="p-8 bg-cream min-h-screen retro-box">Terms page</div>} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/documentation" element={<Documentation />} />
          <Route path="/tutorials" element={<Tutorials />} />

          {/* Protected routes - Core Features */}
          <Route path="/challenges" element={<Challenges />} />
          <Route path="/challenges/:id" element={<ChallengeDetailNew />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/explore" element={<Explore />} />

          {/* Teams */}
          <Route path="/teams" element={<Teams />} />
          <Route path="/teams/:id" element={<TeamDetail />} />
          <Route path="/join-team" element={<JoinTeam />} />

          {/* Courses */}
          <Route path="/create-course" element={<CreateCourse />} />

          {/* Business */}
          <Route path="/business-onboarding" element={<BusinessOnboarding />} />
          <Route path="/billing" element={<Billing />} />

          {/* Governance & Admin */}
          <Route path="/governance" element={<Governance />} />
          <Route path="/audit-log" element={<AuditLog />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/api-access" element={<APIAccess />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthGatekeeper>
    </Router>
  );
}

export default App;
