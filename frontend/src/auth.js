const AUTH_STORAGE_KEY = "skillsync_token";

export function setAuthToken(token) {
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, token);
    window.dispatchEvent(new Event("auth-change"));
  } catch(e) {
    console.log(e,"Can't Set Access Token POST")
  }
}

export function clearAuthToken() {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    window.dispatchEvent(new Event("auth-change"));
  } catch(e) {
    console.log(e,"Can't Find the Token to remove CLEAR")
  }
}

export function getAuthToken() {
  try {
    const token = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!token) return null;
    return token;
  } catch(e) {
    console.error("Error fetching token:", e);
    return null;
  }
}

export function isAuthenticated() {
  return Boolean(getAuthToken());
}


