// Simple API wrapper for SkillSync frontend
// Uses Vite env var VITE_API_URL if provided, else defaults to local backend

import { getAuthToken } from "../auth";

export const API_BASE = "http://192.168.8.245:3001/api"; // import.meta.env.VITE_API_URL ||

function buildQuery(params) {
  if (!params) return "";
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") return;
    q.set(k, String(v));
  });
  const s = q.toString();
  return s ? `?${s}` : "";
}

async function request(path, { method = "GET", body, auth = false, params } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_BASE}${path}${buildQuery(params)}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const contentType = res.headers.get("content-type") || "";
    const data = contentType.includes("application/json") ? await res.json() : await res.text();

    // Return standardized response format
    const response = {
      ok: res.ok && (!data.ok || data.ok === true), // Consider both HTTP status and API response
      status: res.status,
      data: data.data || data,
      message: data.message || res.statusText,
      error: data.error || null
    };

    if (!response.ok) {
      const error = new Error(response.error || response.message || 'Request failed');
      error.response = response;
      throw error;
    }

    return response;
  } catch (error) {
    if (error.response) {
      throw error; // Rethrow our formatted error
    }
    // Network or other errors
    throw new Error(error.message || 'Network error');
  }
}

export const ProjectsAPI = {
  list(params) {
    return request("/projects", { params });
  },
  stats() {
    return request("/projects/stats");
  },
  get(id) {
    return request(`/projects/${id}`);
  },
  create(payload) {
    return request("/projects", { method: "POST", body: payload, auth: true });
  },
  update(id, payload) {
    return request(`/projects/${id}`, { method: "PUT", body: payload, auth: true });
  },
  remove(id) {
    return request(`/projects/${id}`, { method: "DELETE", auth: true });
  },
  join(id) {
    return request(`/projects/${id}/join`, { method: "POST", auth: true });
  },
  leave(id) {
    return request(`/projects/${id}/leave`, { method: "POST", auth: true });
  },
  userProjects() {
    return request(`/projects/user/projects`, { auth: true });
  },
  getProjectMessages(id, params) {
    return request(`/projects/${id}/chat`, { params, auth: true });
  },
  sendProjectMessage(id, payload) {
    return request(`/projects/${id}/chat`, { method: "POST", body: payload, auth: true });
  },
  deleteProjectMessage(projectId, messageId) {
    return request(`/projects/${projectId}/chat/${messageId}`, { method: "DELETE", auth: true });
  }
};

export const UsersAPI = {
  upsert(payload) {
    return request("/users/upsert", { method: "POST", body: payload });
  },
  profile() {
    return request("/users/profile", { auth: true });
  },
  updateProfile(payload) {
    return request("/users/profile", { method: "PUT", body: payload, auth: true });
  },
  deleteProfile() {
    return request("/users/profile", { method: "DELETE", auth: true });
  }
};

export const SkillsAPI = {
  list() {
    return request("/skills", { auth: true });
  },
  create(payload) {
    return request("/skills", { method: "POST", body: payload, auth: true });
  },
  get(id) {
    return request(`/skills/${id}`, { auth: true });
  },
  update(id, payload) {
    return request(`/skills/${id}`, { method: "PUT", body: payload, auth: true });
  },
  remove(id) {
    return request(`/skills/${id}`, { method: "DELETE", auth: true });
  },
  categories() {
    return request("/skills/categories", { auth: true });
  },
  byCategory(category) {
    return request(`/skills/category/${encodeURIComponent(category)}`, { auth: true });
  },
  search(q) {
    return request(`/skills/search`, { params: { q }, auth: true });
  }
};

export const DashboardAPI = {
  stats() {
    return request("/dashboard/stats", { auth: true });
  },
  activities() {
    return request("/dashboard/activities", { auth: true });
  },
  tasks() {
    return request("/dashboard/tasks", { auth: true });
  },
  skills() {
    return request("/dashboard/skills", { auth: true });
  }
};

export const NotificationsAPI = {
  list(params) {
    return request("/notifications", { params, auth: true });
  },
  unreadCount() {
    return request("/notifications/unread-count", { auth: true });
  },
  get(id) {
    return request(`/notifications/${id}`, { auth: true });
  },
  markAsRead(id) {
    return request(`/notifications/${id}/read`, { method: "PUT", auth: true });
  },
  markAllAsRead() {
    return request(`/notifications/mark-all-read`, { method: "PUT", auth: true });
  },
  remove(id) {
    return request(`/notifications/${id}`, { method: "DELETE", auth: true });
  }
};
