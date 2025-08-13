// Central auth utilities for token management and guards

export function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

export function setToken(token: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('token', token);
}

export function removeToken() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('token');
}

export function isLoggedIn() {
  return !!getToken();
}

export function getUserRole(): string | null {
  const token = getToken();
  if (!token) return null;
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    if (decoded.role === 'super_admin') {
      return 'admin';
    }
    return decoded.role || null;
  } catch {
    return null;
  }
}

export function getUserID(): string | null {
  const token = getToken();
  if (!token) return null;
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return decoded.id || null;
  } catch {
    return null;
  }
}
export function getUserExpiryTime(): number {
  const token = getToken();
  if (!token) return 0;
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return decoded.exp ? decoded.exp * 1000 : 0; // Convert to milliseconds
  } catch {
    return 0;
  }
}

export function redirectByRole() {
  const role = getUserRole();
  if (role === 'admin') {
    window.location.href = '/admin';
  } else {
    window.location.href = '/home/posts';
  }
}
