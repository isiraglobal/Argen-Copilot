export function createPageUrl(pageName: string): string {
  const routes: Record<string, string> = {
    Home: "/", Explore: "/explore", Dashboard: "/dashboard",
    Challenges: "/challenges", ChallengeDetail: "/challenge",
    Profile: "/profile", Teams: "/teams", Analytics: "/analytics",
    Admin: "/admin", Blog: "/blog", Documentation: "/docs",
    Tutorials: "/tutorials", About: "/about", Contact: "/contact",
    Privacy: "/privacy", Terms: "/terms", Certifications: "/certifications",
    Billing: "/billing", APIAccess: "/api-access", Evaluate: "/evaluate",
    AuditLog: "/audit-log", Governance: "/governance", Compliance: "/compliance",
    BusinessOnboarding: "/business", Download: "/download",
  };
  return routes[pageName] ?? `/${pageName.toLowerCase()}`;
}
