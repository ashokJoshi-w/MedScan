import { API_BASE } from "../config";

export const analyzeRequest = async (payload) => {
  const token = localStorage.getItem("medscan_token");

  // ── Image upload → use FormData + multer ────────────────────────────────────
  if (payload.imageBase64) {
    const headers = {};
    if (token) headers.Authorization = `Bearer ${token}`;

    // Convert base64 back to a Blob so multer can receive it as a file
    const byteString = atob(payload.imageBase64);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: payload.mimeType || "image/jpeg" });

    const formData = new FormData();
    formData.append("document", blob, "upload." + (payload.mimeType?.split("/")[1] || "jpg"));
    if (payload.mode) formData.append("mode", payload.mode);

    // Route to correct endpoint based on mode
    const endpointMap = {
      prescription: "prescription",
      lab: "lab-report",
      vitals: "vitals",
    };
    const route = endpointMap[payload.mode] || "auto";
    const endpoint = `${API_BASE}/api/analyze/${route}`;

    const res = await fetch(endpoint, {
      method: "POST",
      headers, // ← DO NOT set Content-Type for FormData, browser sets it automatically
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || err.message || "Request failed");
    }

    const data = await res.json();
    // Unwrap analysis from server response
    return data?.analysis ?? data;
  }

  // ── Text only → use JSON ────────────────────────────────────────────────────
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}/api/analyze`, {
    method: "POST",
    headers,
    body: JSON.stringify({ text: payload.text, mode: payload.mode }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || err.message || "Request failed");
  }

  const data = await res.json();
  return data?.analysis ?? data;
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