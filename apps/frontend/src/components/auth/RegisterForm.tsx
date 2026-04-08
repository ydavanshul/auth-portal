"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase/config";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Basic firebase register stub
      await createUserWithEmailAndPassword(auth, email, password);
      window.location.href = "/login";
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleRegister} className="flex flex-col space-y-4 max-w-sm w-full mx-auto p-6 border rounded-lg bg-white shadow-sm">
      <h2 className="text-xl font-bold text-center">Register</h2>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required className="border p-2 rounded" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required className="border p-2 rounded" />
      <button type="submit" className="bg-green-600 text-white p-2 rounded">Register</button>
    </form>
  );
}
