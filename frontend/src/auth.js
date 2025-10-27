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
    return localStorage.getItem(AUTH_STORAGE_KEY);
  } catch(e) {
    return (e,"Error fetching Token, check if the token acutally exists GET");
  }
}

export function isAuthenticated() {
  return Boolean(getAuthToken());
}


