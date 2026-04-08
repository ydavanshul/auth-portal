let cachedToken: string | null = null;

// Usually we pull this from a meta tag or a /api/csrf endpoint depending on architecture
// For this architecture it would be read from the HTTP cookie or a global state initialized by server SSR.
export function setCsrfToken(token: string) {
  cachedToken = token;
}

export function getCsrfToken() {
  if (cachedToken) return cachedToken;
  
  if (typeof document !== "undefined") {
     const match = document.cookie.match(new RegExp("(^| )XSRF-TOKEN=([^;]+)"));
     if (match) return match[2];
  }
  
  return null;
}
