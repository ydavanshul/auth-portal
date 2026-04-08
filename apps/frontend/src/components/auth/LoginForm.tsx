"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase/config";
import { secureFetch } from "@/lib/api/client";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. Firebase Login
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();

      // 2. Backend Verify & Issue Session Cookies
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const response = await secureFetch(`${backendUrl}/api/auth/login`, {
        method: "POST",
        body: JSON.stringify({ idToken }),
      });

      if (response.status === "success") {
        const userRole = response.data.user.role;
        // Redirect based on role
        if (userRole === "ADMIN") {
          router.push("/admin");
        } else {
          router.push("/user/profile");
        }
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to login securely.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="flex flex-col space-y-4 w-full max-w-sm mx-auto p-6 border rounded-lg shadow-sm">
      <h2 className="text-xl font-bold text-center">Secure Login</h2>
      
      {error && <div className="text-red-500 text-sm p-2 bg-red-50 rounded">{error}</div>}

      <div className="flex flex-col space-y-1">
        <label className="text-sm font-medium">Email</label>
        <input 
          type="email" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          className="border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" 
          required 
        />
      </div>
      
      <div className="flex flex-col space-y-1">
        <label className="text-sm font-medium">Password</label>
        <input 
          type="password" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          className="border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" 
          required 
        />
      </div>

      <button 
        type="submit" 
        disabled={loading} 
        className="bg-blue-600 text-white p-2 rounded font-medium disabled:opacity-50 hover:bg-blue-700 transition"
      >
        {loading ? "Authenticating..." : "Sign In"}
      </button>
    </form>
  );
}
