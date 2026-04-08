import { getCsrfToken } from "./csrf";

interface FetchError extends Error {
  response?: {
    status: number;
    data: unknown;
  };
}

export async function secureFetch(url: string, options: RequestInit = {}) {
  const csrfToken = getCsrfToken();
  const defaultHeaders: Record<string, string> = {
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
      ...(options.headers as Record<string, string>),
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
    const error = new Error(errorData.message || response.statusText) as FetchError;
    error.response = {
      status: response.status,
      data: errorData,
    };
    throw error;
  }

  return response.json();
}
