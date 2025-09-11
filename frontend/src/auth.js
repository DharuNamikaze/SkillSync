const AUTH_STORAGE_KEY = "skillsync_token";

export function setAuthToken(token) {
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, token);
    window.dispatchEvent(new Event("auth-change"));
  } catch {}
}

export function clearAuthToken() {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    window.dispatchEvent(new Event("auth-change"));
  } catch {}
}

export function getAuthToken() {
  try {
    return localStorage.getItem(AUTH_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function isAuthenticated() {
  return Boolean(getAuthToken());
}


