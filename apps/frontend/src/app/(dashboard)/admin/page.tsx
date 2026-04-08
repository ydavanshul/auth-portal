"use client";

export default function AdminPage() {
  return (
    <div className="max-w-6xl mx-auto py-10">
      <h1 className="text-3xl font-bold text-red-600 mb-6">Admin Dashboard</h1>
      <div className="p-6 border border-red-200 bg-red-50 rounded-lg">
        <p className="font-medium">Welcome to the restricted administrative area.</p>
      </div>
    </div>
  );
}
