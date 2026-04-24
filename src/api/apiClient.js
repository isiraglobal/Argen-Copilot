/**
 * apiClient.js — Drop-in replacement for Base44 SDK
 * Replace BASE_URL with your own backend URL.
 * Replace auth methods with your own auth provider (Supabase, Firebase, Auth0, etc.)
 */

const BASE_URL = "https://your-api.example.com";

export const auth = {
  me: async () => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Not authenticated");
    const res = await fetch(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Auth failed");
    return res.json();
  },
  logout: (redirectUrl) => {
    localStorage.removeItem("token");
    window.location.href = redirectUrl || "/";
  },
  redirectToLogin: (nextUrl) => {
    window.location.href = `/login?next=${encodeURIComponent(nextUrl || "/")}`;
  },
  isAuthenticated: async () => {
    try { await auth.me(); return true; } catch { return false; }
  },
  updateMe: async (data) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${BASE_URL}/auth/me`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },
};

function makeEntity(name) {
  const base = `${BASE_URL}/entities/${name}`;
  const headers = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json",
  });
  return {
    list: async (sort, limit) => {
      const res = await fetch(`${base}?sort=${sort || ""}&limit=${limit || 50}`, { headers: headers() });
      return res.json();
    },
    filter: async (query, sort, limit) => {
      const params = new URLSearchParams({ filter: JSON.stringify(query), sort: sort || "", limit: limit || 50 });
      const res = await fetch(`${base}?${params}`, { headers: headers() });
      return res.json();
    },
    create: async (data) => {
      const res = await fetch(base, { method: "POST", headers: headers(), body: JSON.stringify(data) });
      return res.json();
    },
    update: async (id, data) => {
      const res = await fetch(`${base}/${id}`, { method: "PATCH", headers: headers(), body: JSON.stringify(data) });
      return res.json();
    },
    delete: async (id) => {
      const res = await fetch(`${base}/${id}`, { method: "DELETE", headers: headers() });
      return res.json();
    },
  };
}

export const entities = {
  Challenge: makeEntity("Challenge"),
  Course: makeEntity("Course"),
  Submission: makeEntity("Submission"),
  UserProgress: makeEntity("UserProgress"),
  Team: makeEntity("Team"),
  InviteCode: makeEntity("InviteCode"),
  Notification: makeEntity("Notification"),
  Feedback: makeEntity("Feedback"),
  BlogPost: makeEntity("BlogPost"),
  Tutorial: makeEntity("Tutorial"),
  Documentation: makeEntity("Documentation"),
  SystemSettings: makeEntity("SystemSettings"),
  AIDecision: makeEntity("AIDecision"),
  AIIncident: makeEntity("AIIncident"),
  UserReputation: makeEntity("UserReputation"),
  OrganizationGovernance: makeEntity("OrganizationGovernance"),
  BusinessOnboardingRequest: makeEntity("BusinessOnboardingRequest"),
  TeamPricingConfig: makeEntity("TeamPricingConfig"),
  SubscriptionTransaction: makeEntity("SubscriptionTransaction"),
  SkillCertification: makeEntity("SkillCertification"),
  CourseRequest: makeEntity("CourseRequest"),
  ExecutiveDashboardMetric: makeEntity("ExecutiveDashboardMetric"),
  User: makeEntity("User"),
};

export const integrations = {
  Core: {
    SendEmail: async ({ to, subject, body, from_name }) => {
      const res = await fetch(`${BASE_URL}/email/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to, subject, body, from_name }),
      });
      return res.json();
    },
    InvokeLLM: async ({ prompt, response_json_schema, model }) => {
      const res = await fetch(`${BASE_URL}/ai/invoke`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, response_json_schema, model }),
      });
      return res.json();
    },
    UploadFile: async ({ file }) => {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch(`${BASE_URL}/files/upload`, { method: "POST", body: form });
      return res.json();
    },
  },
};

export const functions = {
  invoke: async (name, payload) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${BASE_URL}/functions/${name}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(payload || {}),
    });
    const data = await res.json();
    return { data };
  },
};

export const analytics = {
  track: ({ eventName, properties }) => {
    console.log("[analytics]", eventName, properties);
  },
};

export const base44 = { auth, entities, integrations, functions, analytics };
export default base44;
