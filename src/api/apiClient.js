import { supabase } from '../lib/supabase';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787';

async function authHeaders() {
  const session = supabase ? (await supabase.auth.getSession()).data.session : null;
  return {
    ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` }),
    "Content-Type": "application/json",
  };
}

export const auth = {
  me: async () => {
    if (!supabase) throw new Error("Not authenticated");
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");
    const res = await fetch(`${BASE_URL}/api/user/profile`, { headers: await authHeaders() });
    if (!res.ok) throw new Error("Auth failed");
    const profile = await res.json();
    return { ...profile, email: user.email, full_name: profile.name || user.email };
  },
  logout: (redirectUrl) => {
    supabase?.auth.signOut().finally(() => {
      window.location.href = redirectUrl || "/";
    });
  },
  redirectToLogin: (nextUrl) => {
    window.location.href = `/login?next=${encodeURIComponent(nextUrl || "/")}`;
  },
  isAuthenticated: async () => {
    try { await auth.me(); return true; } catch { return false; }
  },
  updateMe: async (data) => {
    const res = await fetch(`${BASE_URL}/api/user/profile`, {
      method: "PATCH",
      headers: await authHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },
};

function makeEntity(name) {
  const base = `${BASE_URL}/entities/${name}`;
  return {
    list: async (sort, limit) => {
      const res = await fetch(`${base}?sort=${sort || ""}&limit=${limit || 50}`, { headers: await authHeaders() });
      return res.json();
    },
    filter: async (query, sort, limit) => {
      const params = new URLSearchParams({ filter: JSON.stringify(query), sort: sort || "", limit: limit || 50 });
      const res = await fetch(`${base}?${params}`, { headers: await authHeaders() });
      return res.json();
    },
    create: async (data) => {
      const res = await fetch(base, { method: "POST", headers: await authHeaders(), body: JSON.stringify(data) });
      return res.json();
    },
    update: async (id, data) => {
      const res = await fetch(`${base}/${id}`, { method: "PATCH", headers: await authHeaders(), body: JSON.stringify(data) });
      return res.json();
    },
    delete: async (id) => {
      const res = await fetch(`${base}/${id}`, { method: "DELETE", headers: await authHeaders() });
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
    const res = await fetch(`${BASE_URL}/functions/${name}`, {
      method: "POST",
      headers: await authHeaders(),
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
