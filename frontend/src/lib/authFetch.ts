import { auth } from "./auth";

export const API_BASE_URL =
  (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_API_URL) ||
  "http://127.0.0.1:8000";

type FetchOptions = RequestInit & { auth?: boolean };

/**
 * authFetch — wraps fetch and automatically attaches `Authorization: Bearer <token>`.
 * Pass { auth: false } to skip the auth header (e.g. for /login, /signup).
 */
export async function authFetch(path: string, options: FetchOptions = {}): Promise<Response> {
  const { auth: useAuth = true, headers, ...rest } = options;

  const finalHeaders: Record<string, string> = {
    ...(headers as Record<string, string> | undefined),
  };

  // Only set JSON content-type when the body is not FormData.
  if (rest.body && !(rest.body instanceof FormData) && !finalHeaders["Content-Type"]) {
    finalHeaders["Content-Type"] = "application/json";
  }

  if (useAuth) {
    const token = auth.getToken();
    if (token) finalHeaders["Authorization"] = `Bearer ${token}`;
  }

  const url = path.startsWith("http") ? path : `${API_BASE_URL}${path}`;
  return fetch(url, { ...rest, headers: finalHeaders });
}
