import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthGatekeeper } from '@/components/auth/AuthGatekeeper';
import { Header } from '@/components/layout/Header';
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
import { AuthForm } from '@/components/auth/AuthForm';
import { AboutPage, ContactPage, DownloadPage, PrivacyPage, TermsPage } from '@/pages/StaticReferencePages';

function App() {
  return (
    <Router>
      <AuthGatekeeper>
        <Header />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/login" element={<div className="min-h-screen bg-cream flex items-center justify-center p-6"><AuthForm mode="login" /></div>} />
          <Route path="/signup" element={<div className="min-h-screen bg-cream flex items-center justify-center p-6"><AuthForm mode="signup" /></div>} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/About" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/Contact" element={<ContactPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/Privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/Terms" element={<TermsPage />} />
          <Route path="/download" element={<DownloadPage />} />
          <Route path="/Download" element={<DownloadPage />} />
          <Route path="/MobileGuide" element={<DownloadPage />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/Blog" element={<Blog />} />
          <Route path="/documentation" element={<Documentation />} />
          <Route path="/Documentation" element={<Documentation />} />
          <Route path="/tutorials" element={<Tutorials />} />
          <Route path="/Tutorials" element={<Tutorials />} />

          {/* Protected routes - Core Features */}
          <Route path="/challenges" element={<Challenges />} />
          <Route path="/Challenges" element={<Challenges />} />
          <Route path="/challenges/:id" element={<ChallengeDetailNew />} />
          <Route path="/ChallengeDetail" element={<ChallengeDetailNew />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/Explore" element={<Explore />} />
          <Route path="/Evaluate" element={<Challenges />} />

          {/* Teams */}
          <Route path="/teams" element={<Teams />} />
          <Route path="/Teams" element={<Teams />} />
          <Route path="/teams/:id" element={<TeamDetail />} />
          <Route path="/TeamDetail" element={<TeamDetail />} />
          <Route path="/join-team" element={<JoinTeam />} />
          <Route path="/JoinTeam" element={<JoinTeam />} />

          {/* Courses */}
          <Route path="/create-course" element={<CreateCourse />} />
          <Route path="/Certifications" element={<Tutorials />} />

          {/* Business */}
          <Route path="/business-onboarding" element={<BusinessOnboarding />} />
          <Route path="/BusinessOnboarding" element={<BusinessOnboarding />} />
          <Route path="/TeamOnboarding" element={<BusinessOnboarding />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/Billing" element={<Billing />} />

          {/* Governance & Admin */}
          <Route path="/governance" element={<Governance />} />
          <Route path="/Governance" element={<Governance />} />
          <Route path="/Compliance" element={<Governance />} />
          <Route path="/audit-log" element={<AuditLog />} />
          <Route path="/AuditLog" element={<AuditLog />} />
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
