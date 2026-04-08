"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { secureFetch } from "@/lib/api/client";

interface AuthUser {
  id: string;
  email: string;
  role: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  isLoading: boolean;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthState>({
  isAuthenticated: false,
  user: null,
  isLoading: true,
  logout: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Fetch our backend /me session to get the DB user and role
          const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
          const res = await secureFetch(`${backendUrl}/api/auth/session`);
          if (res.status === "success") {
            setUser(res.data.user);
          } else {
            setUser(null);
          }
        } catch (error) {
          console.error("Session verification failed", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await auth.signOut();
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      await secureFetch(`${backendUrl}/api/auth/logout`, { method: "POST" });
      setUser(null);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, isLoading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
