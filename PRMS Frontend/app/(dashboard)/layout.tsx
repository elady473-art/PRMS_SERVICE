"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PRMSLayout } from "@/features/prms/components/layout/prms-layout";
import { AuthProvider } from "@/features/auth/contexts/auth-context";
import { useAuth } from "@/features/auth/contexts/auth-context";
import { Loader2, Shield } from "lucide-react";

function DashboardGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="mx-auto w-14 h-14 bg-[#c1121f] rounded-xl flex items-center justify-center shadow-xs">
            <Shield className="h-7 w-7 text-white" />
          </div>
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="h-5 w-5 animate-spin text-[#c1121f]" />
            <span className="text-gray-700 font-medium text-xs">Loading…</span>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <PRMSLayout>{children}</PRMSLayout>;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <DashboardGuard>{children}</DashboardGuard>
    </AuthProvider>
  );
}
