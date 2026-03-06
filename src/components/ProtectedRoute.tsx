"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (user === null) {
      router.push("/login");
    } else if (
      allowedRoles &&
      !allowedRoles.includes(user.role)
    ) {
      router.push("/login");
    }

    setIsChecking(false);
  }, [user, router, allowedRoles]);

  if (isChecking) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-500 animate-pulse">
          Checking authentication...
        </p>
      </div>
    );
  }

  return <>{children}</>;
}