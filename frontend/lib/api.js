// Small client-side API helper. All calls go to this app's own /api/* proxy,
// which forwards them to the backend (see app/api/[...path]/route.js).

export function getSession() {
  if (typeof window === 'undefined') return null;
  try {
    return JSON.parse(localStorage.getItem('sab-session'));
  } catch {
    return null;
  }
}

export function saveSession(session) {
  localStorage.setItem('sab-session', JSON.stringify(session));
}

export function clearSession() {
  localStorage.removeItem('sab-session');
}

export async function api(path, options = {}) {
  const session = getSession();
  const res = await fetch(`/api/${path}`, {
    ...options,
    headers: {
      'content-type': 'application/json',
      ...(session ? { authorization: `Bearer ${session.token}` } : {}),
    },
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401 && typeof window !== 'undefined') {
      clearSession();
      window.location.href = '/login';
    }
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data;
}

export function formatNPR(value) {
  return `NPR ${Number(value).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatDate(isoDate) {
  return new Date(`${isoDate}T00:00:00`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
