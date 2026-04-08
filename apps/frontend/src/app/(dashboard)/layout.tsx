import { AuthGuard } from "@/components/guards/AuthGuard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-white">
        <nav className="border-b px-6 py-4 flex justify-between items-center bg-gray-50">
          <span className="font-bold text-lg">Secure App</span>
        </nav>
        <main>{children}</main>
      </div>
    </AuthGuard>
  );
}
