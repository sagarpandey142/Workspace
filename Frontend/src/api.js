const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';
import axios from "axios"

async function safeFetch(url, opts = {}) {
  // Add token automatically if present
  const token = localStorage.getItem("token");
  const headers = { ...(opts.headers || {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) };
  const r = await fetch(`${BASE}${url}`, { ...opts, headers });
  const text = await r.text();
  try {
    const json = text ? JSON.parse(text) : null;
    return { ok: r.ok, status: r.status, data: json };
  } catch {
    return { ok: r.ok, status: r.status, data: text };
  }

}

export async function signup(name, email, password, admin) {
  const res = await safeFetch('/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, role: admin })
  });

  // (Optionally) handle token if returned on signup
  if ( res.data?.token) {
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", res.data.user.role);
  }

  return res;
}

export async function login(email, password) {
  const res = await safeFetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  if (res.data?.token) {
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", res.data.user.role);
  }
  return res;
}

export function getToken() {
  return localStorage.getItem("token");
}

export function getUser() {
  return localStorage.getItem("user");
}

export async function getRooms() {
  return (await safeFetch('/api/rooms/')).data || [];
}

export async function seedRooms() {
  return (await safeFetch('/api/rooms/seed')).data;
}

export async function postBooking(payload) {
  return (await safeFetch('/api/bookings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }));
}

export async function getBookings() {
  return (await safeFetch('/api/bookings')).data || [];
}

export async function GetMyBooking() {
  return (await safeFetch('/api/bookings/ListBookingBasedOnId')).data || [];
}



export async function cancelBooking(id) {
  return (await safeFetch(`/api/bookings/${id}/cancel`, { method: 'POST' }));
}

export async function getAnalytics(from, to) {
  return (await safeFetch(`/api/bookings/analytics?from=${from}&to=${to}`)).data || [];
}
