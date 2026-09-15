"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/features/auth/contexts/auth-context";
import { type PRMSRole } from "@/features/auth/types/roles";
import { Loader2, Shield } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** If provided, the user must hold at least one of these PRMS roles. */
  requiredRoles?: PRMSRole[];
  /** Where to send unauthenticated users (defaults to /login). */
  fallbackUrl?: string;
}

/**
 * ProtectedRoute wraps a page and checks whether the current user (supplied
 * by the shared ERP auth system via AuthProvider) is authenticated and holds
 * a required PRMS role.
 *
 * It does NOT implement authentication itself — it only reads the role from
 * the AuthContext, which is the integration point with the shared ERP/Keycloak
 * system.
 */
export function ProtectedRoute({
  children,
  requiredRoles = [],
  fallbackUrl = "/login",
}: ProtectedRouteProps) {
  const { user, role, isAuthenticated, isLoading, hasAnyRole } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      const returnUrl = encodeURIComponent(pathname);
      router.replace(`${fallbackUrl}?returnUrl=${returnUrl}`);
      return;
    }

    if (requiredRoles.length > 0 && !hasAnyRole(requiredRoles)) {
      router.replace("/unauthorized");
    }
  }, [isLoading, isAuthenticated, requiredRoles, hasAnyRole, router, pathname, fallbackUrl]);

  // While the auth state is resolving, show a neutral loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-red-600 rounded-lg flex items-center justify-center shadow-md">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="h-5 w-5 animate-spin text-red-600" />
              <span className="text-gray-700 font-medium">Verifying session…</span>
            </div>
            <p className="text-gray-500 text-sm">Please wait</p>
          </div>
        </div>
      </div>
    );
  }

  // Not authenticated or wrong role — redirect is in flight, render nothing
  if (!isAuthenticated) return null;
  if (requiredRoles.length > 0 && !hasAnyRole(requiredRoles)) return null;

  return <>{children}</>;
}
