import { ProfileForm } from "@/components/profile/ProfileForm";

export default function ProfilePage() {
  return (
    <div className="py-10">
      <header>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">User Settings</h1>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 mt-8">
          <ProfileForm />
        </div>
      </main>
    </div>
  );
}
