import { API_BASE } from './api';
import { getAuthToken } from '../auth';

async function request(path, { method = "GET", body, params } = {}) {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };

  try {
    const res = await fetch(`${API_BASE}${path}${params ? `?${new URLSearchParams(params)}` : ''}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      credentials: 'include' // Include cookies if needed
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
    }

    const data = await res.json();

    if (!data.ok) {
      throw new Error(data.message || 'Request failed');
    }

    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

export const MessagesAPI = {
  async getConversations() {
    const response = await request("/messages/conversations");
    return response;
  },

  async getConversation(partnerId) {
    const response = await request(`/messages/conversations/${partnerId}/messages`);
    return response;
  },

  async sendMessage(partnerId, content) {
    const response = await request(`/messages/conversations/${partnerId}/messages`, {
      method: "POST",
      body: { content }
    });
    return response;
  },

  async getUnreadCount() {
    const response = await request("/messages/conversations/unread");
    return response;
  },

  async getTeamChat(projectId) {
    const response = await request(`/messages/team/${projectId}`);
    return response;
  },

  async sendTeamMessage(projectId, content) {
    const response = await request(`/messages/team/${projectId}`, {
      method: "POST",
      body: { content }
    });
    return response;
  }
};