import LoginForm from "@/components/auth/LoginForm";

export const metadata = {
  title: "Login | Secure App"
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <LoginForm />
    </div>
  );
}
