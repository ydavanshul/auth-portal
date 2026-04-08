import { getCsrfToken } from "./csrf";

export async function secureFetch(url: string, options: RequestInit = {}) {
  const csrfToken = getCsrfToken();
  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (csrfToken) {
    defaultHeaders["x-csrf-token"] = csrfToken;
  }

  // Prevent overwriting multipart bounds when uploading files natively via FormData
  if (options.body instanceof FormData) {
    delete defaultHeaders["Content-Type"];
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
    if (response.status === 401 && !url.includes("/api/auth/session")) {
       // logic for refresh token or redirect to login
       if (typeof window !== "undefined") {
         // window.location.href = "/login";
       }
    }
    const errorData = await response.json().catch(() => ({ message: "An error occurred" }));
    throw new Error(errorData.message || response.statusText);
  }

  return response.json();
}
