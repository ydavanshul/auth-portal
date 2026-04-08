import { secureFetch } from "./client";

export const api = {
  get: (url: string, options?: RequestInit) =>
    secureFetch(url, { ...options, method: "GET" }),
  
  post: (url: string, body: unknown, options?: RequestInit) =>
    secureFetch(url, {
      ...options,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      body: JSON.stringify(body),
    }),
  
  put: (url: string, body: unknown, options?: RequestInit) =>
    secureFetch(url, {
      ...options,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      body: JSON.stringify(body),
    }),
  
  delete: (url: string, options?: RequestInit) =>
    secureFetch(url, { ...options, method: "DELETE" }),
};
