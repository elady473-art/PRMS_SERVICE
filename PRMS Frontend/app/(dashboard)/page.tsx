"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardHomePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/prms");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-red-600 border-t-transparent mx-auto mb-4" />
        <p className="text-gray-500 text-sm">Redirecting…</p>
      </div>
    </div>
  );
}
