"use client";

import { useAuth } from "@/hooks/useAuth";

export default function ProfilePage() {
  const { user } = useAuth();
  
  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">User Profile</h1>
      <div className="p-6 border rounded-lg shadow-sm">
        <p className="mb-2"><strong>Email:</strong> {user?.email || "Loading..."}</p>
        <p className="mb-2"><strong>Role:</strong> {user?.role || "Loading..."}</p>
      </div>
    </div>
  );
}
