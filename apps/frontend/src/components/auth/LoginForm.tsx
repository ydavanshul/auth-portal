"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../lib/firebase/config";
import { useRouter } from "next/navigation";
import { api } from "../../lib/api";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await cred.user.getIdToken();

      await api.post("/api/auth/login", { idToken });

      router.push("/");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to login";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6 bg-zinc-50 font-sans">
      <div className="w-full max-w-md bg-white p-10 rounded-[2.5rem] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.1)] border border-zinc-100">
        <div className="mb-10">
          <h2 className="text-4xl font-black text-zinc-900 tracking-tighter">Login</h2>
          <p className="text-zinc-500 font-medium mt-2">Access your secure workspace.</p>
        </div>

        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-zinc-400 mb-2 ml-1">Email Address</label>
            <input
              type="email"
              required
              className="w-full px-6 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 transition-all outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-zinc-400 mb-2 ml-1">Password</label>
            <input
              type="password"
              required
              className="w-full px-6 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 transition-all outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold border border-red-100">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-zinc-900 text-white rounded-2xl font-bold hover:bg-black active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
};
