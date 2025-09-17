// src/apiClient.ts
import { getAuth } from "firebase/auth";

const BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

export async function apiFetch(path: string, opts: RequestInit = {}) {
  const auth = getAuth();
  const user = auth.currentUser;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(opts.headers as Record<string, string> || {})
  };
  if (user) {
    const token = await user.getIdToken();
    headers.Authorization = `Bearer ${token}`;
  }
  const res = await fetch(`${BASE}${path}`, { ...opts, headers });
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  return res.json();
}
