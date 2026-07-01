import { API_BASE } from "../config";

export const analyzeRequest = async (payload) => {
  const token = localStorage.getItem("medscan_token");
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  // If image is included, route to the mode-specific endpoint
  // If text only, use the unified /api/analyze endpoint
  const endpoint = payload.imageBase64
    ? `${API_BASE}/api/analyze/${payload.mode === "lab" ? "lab-report" : payload.mode}`
    : `${API_BASE}/api/analyze`;

  const res = await fetch(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || err.message || "Request failed");
  }

  return res.json();
};

export const authRequest = async (endpoint, body) => {
  const res = await fetch(`${API_BASE}/api/auth/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || err.message || "Request failed");
  }

  return res.json();
};

export const meRequest = async () => {
  const token = localStorage.getItem("medscan_token");
  const res = await fetch(`${API_BASE}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || err.message || "Session expired");
  }

  return res.json();
};