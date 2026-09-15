"use client";

export const dynamic = "force-dynamic";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldX, ArrowLeft, Home } from "lucide-react";

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center mb-4">
            <ShieldX className="h-8 w-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-500">You don&apos;t have permission to access this page.</p>
        </div>

        <Card className="border border-gray-200 bg-white">
          <CardContent className="pt-6 space-y-4">
            <p className="text-sm text-gray-600 text-center">
              The page you&apos;re trying to access requires higher privileges.
              Contact your system administrator if you believe this is an error.
            </p>
            <div className="space-y-2">
              <Button
                className="w-full bg-[#c1121f] hover:bg-[#a00f1a] text-white"
                onClick={() => router.push("/prms")}
              >
                <Home className="mr-2 h-4 w-4" />
                Go to Dashboard
              </Button>
              <Button
                variant="ghost"
                className="w-full text-gray-600 hover:bg-gray-100"
                onClick={() => router.back()}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-gray-400">
          &copy; {new Date().getFullYear()} Information Network Security Administration
        </p>
      </div>
    </div>
  );
}
