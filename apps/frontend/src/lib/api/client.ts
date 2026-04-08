import { getCsrfToken } from "./csrf";

export async function secureFetch(url: string, options: RequestInit = {}) {
  const csrfToken = getCsrfToken();
  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (csrfToken) {
    defaultHeaders["x-csrf-token"] = csrfToken;
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    credentials: "include", // Essential for HttpOnly cookies
  });

  if (!response.ok) {
    // Interceptor-like behavior could handle 401s here to trigger token refresh
    if (response.status === 401) {
       // logic for refresh token or redirect to login
    }
    const error = await response.json().catch(() => ({ message: "An error occurred" }));
    throw new Error(error.message || response.statusText);
  }

  return response.json();
}
