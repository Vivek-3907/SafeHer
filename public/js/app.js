if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

function api(path, options = {}) {
  return fetch(`/api${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  }).then(async (response) => {
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.error || 'Request failed');
    }
    return data;
  });
}

function getCurrentUser() {
  const user = localStorage.getItem('safeher-user');
  return user ? JSON.parse(user) : null;
}

function setCurrentUser(user) {
  localStorage.setItem('safeher-user', JSON.stringify(user));
}

function logout() {
  localStorage.removeItem('safeher-user');
  window.location.href = '/login';
}

window.addEventListener('DOMContentLoaded', () => {
  const user = getCurrentUser();
  const path = window.location.pathname;

  if ((path === '/login' || path === '/register') && user) {
    window.location.href = '/dashboard';
  }

  if (['/dashboard', '/sos', '/grievance', '/empowerment', '/awareness', '/admin'].includes(path) && !user) {
    window.location.href = '/login';
  }
});
