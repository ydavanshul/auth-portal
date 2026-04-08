"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export function RoleGuard({ children, allowedRoles }: { children: ReactNode, allowedRoles: string[] }) {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  if (isLoading) return <div>Checking permissions...</div>;

  if (!user || !allowedRoles.includes(user.role)) {
    // Redirect unauthorized appropriately
    router.replace("/user/profile"); 
    return null;
  }

  return <>{children}</>;
}
