"use client";

import { useState, useEffect } from "react";
import { secureFetch } from "@/lib/api/client";
import { useAuth } from "@/context/AuthContext";

export function ProfileForm() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  useEffect(() => {
    if (user) {
      secureFetch(`${backendUrl}/api/profile`)
        .then((res) => {
          setProfile(res.data);
          setUsername(res.data.username || "");
          setDisplayName(res.data.displayName || "");
        })
        .catch(() => setError("Failed to load profile"));
    }
  }, [user, backendUrl]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      await secureFetch(`${backendUrl}/api/profile`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, displayName })
      });
      setMessage("Profile updated successfully!");
    } catch (err: any) {
      setError(err.message || "Failed to update profile.");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const res = await secureFetch(`${backendUrl}/api/profile/image`, {
        method: "POST",
        body: formData // Fetch will automatically set multipart/form-data with bounds here
      });
      setProfile((prev: any) => ({ ...prev, profileImage: res.data.profileImage }));
      setMessage("Avatar uploaded successfully!");
    } catch (err: any) {
      setError(err.message || "Failed to upload image.");
    }
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>
      
      {message && <div className="p-4 mb-4 text-green-700 bg-green-100 rounded">{message}</div>}
      {error && <div className="p-4 mb-4 text-red-700 bg-red-100 rounded">{error}</div>}

      <div className="mb-8 flex items-center space-x-6">
        <div className="flex-shrink-0">
          <img
            className="h-24 w-24 object-cover rounded-full border border-gray-200"
            src={profile.profileImage || "https://via.placeholder.com/150"}
            alt="Profile avatar"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Change Avatar</label>
          <input 
            type="file" 
            accept="image/png, image/jpeg, image/webp" 
            onChange={handleImageUpload} 
            className="text-sm cursor-pointer"
          />
        </div>
      </div>

      <form onSubmit={handleUpdate} className="space-y-6">
        <div>
           <label className="block text-sm font-medium text-gray-700">Email Address (Read-only)</label>
           <input 
              type="email" 
              readOnly 
              value={profile.email} 
              className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm sm:text-sm" 
           />
        </div>

        <div>
           <label className="block text-sm font-medium text-gray-700">Username</label>
           <input 
              type="text" 
              value={username} 
              onChange={e => setUsername(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" 
           />
        </div>

        <div>
           <label className="block text-sm font-medium text-gray-700">Display Name</label>
           <input 
              type="text" 
              value={displayName} 
              onChange={e => setDisplayName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" 
           />
        </div>

        <button 
           type="submit" 
           className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
           Save Changes
        </button>
      </form>
    </div>
  );
}
