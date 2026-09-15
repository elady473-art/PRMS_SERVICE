"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Eye, EyeOff, Lock, User, Shield, AlertCircle, Loader2, Info,
} from "lucide-react";
import { authService } from "@/features/auth/services/auth-service";
import { getRoleDisplayName } from "@/features/auth/types/roles";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username.trim() || !formData.password.trim()) {
      setError("Please enter both username and password.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const result = await authService.login(formData.username.trim(), formData.password);
      if (result.success) {
        router.replace("/prms");
      } else {
        setError(result.error?.message ?? "Invalid username or password.");
      }
    } catch {
      setError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fillCredentials = (username: string, password: string) => {
    setFormData({ username, password });
    setError(null);
  };

  const devCredentials = authService.getDevCredentials();

  return (
    <div className="flex min-h-screen">
      <aside
        className="relative hidden flex-1 flex-col items-center justify-center overflow-hidden md:flex"
        style={{
          background:
            "radial-gradient(1200px 600px at 30% 40%, #0d2a5c 0%, #0a1f44 60%, #071634 100%)",
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 45% 45%, transparent 0 118px, rgba(255,255,255,0.05) 118px 120px, transparent 120px 218px, rgba(255,255,255,0.04) 218px 220px, transparent 220px 330px, rgba(255,255,255,0.03) 330px 332px, transparent 332px)",
          }}
        />
        <div className="relative max-w-[480px] text-center px-12">
          <div className="mx-auto mb-8 grid h-[190px] w-[190px] place-items-center rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/insa.jpg" alt="INSA" className="h-[74%] w-[74%] object-contain" />
          </div>
          <div className="mb-6 flex items-center justify-center gap-1.5">
            <span className="h-[3px] w-11 rounded-sm bg-[#c1121f]" />
            <span className="h-[9px] w-[9px] rounded-full bg-[#c1121f]" />
            <span className="h-[3px] w-11 rounded-sm bg-[#1e50c8]" />
          </div>
          <h1 className="mb-3 text-[2.2rem] font-extrabold leading-tight text-white">
            Information Network Security Administration
          </h1>
          <p className="text-white/55">Addis Ababa, Ethiopia</p>
        </div>
        <footer className="absolute inset-x-0 bottom-6 text-center text-xs text-white/40">
          © 2026 Information Network Security Administration
        </footer>
      </aside>

      <main className="grid flex-1 place-items-center bg-[#f4f6fb] p-8">
        <div className="w-full max-w-[440px] space-y-5">
          <div className="flex flex-col items-center gap-2 md:hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/insa.jpg" alt="INSA" className="h-[72px] w-[72px] object-contain" />
            <span className="text-lg font-bold text-[#0a1f44]">INSA ERP System</span>
          </div>
          <div className="hidden flex-col items-center gap-2 md:flex">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/insa.jpg" alt="INSA" className="h-[88px] w-[88px] object-contain" />
            <span className="text-xl font-bold text-[#0a1f44]">INSA ERP System</span>
          </div>

          <div className="rounded-2xl bg-white p-8 shadow-[0_12px_40px_rgba(10,31,68,0.1)]">
            <h2 className="mb-1 flex items-center gap-2 text-2xl font-semibold text-[#14213d]">
              <Shield className="h-5 w-5 text-[#c1121f]" />
              Sign In
            </h2>
            <p className="mb-6 text-sm text-gray-500">
              Enter your credentials to access PRMS
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="username" className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Username
                </Label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    autoComplete="username"
                    className="h-11 border-gray-300 pl-10 text-gray-900 focus:border-[#c1121f] focus:ring-[#c1121f]"
                    value={formData.username}
                    onChange={(e) => handleInputChange("username", e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="h-11 border-gray-300 pl-10 pr-10 text-gray-900 focus:border-[#c1121f] focus:ring-[#c1121f]"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <Button
                type="submit"
                size="lg"
                className="w-full bg-[#c1121f] hover:bg-[#a00f1a] text-white font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Signing in…</>
                ) : (
                  <><Shield className="mr-2 h-4 w-4" />Sign In Securely</>
                )}
              </Button>
            </form>

            <div className="my-5 h-px bg-gray-200" />
            <p className="flex items-start gap-2 text-xs leading-relaxed text-gray-500">
              <Lock className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
              This system is protected under the INSA Security Policy. Unauthorized access attempts are logged and monitored.
            </p>
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
            <div className="mb-3 flex items-center gap-2">
              <Info className="h-4 w-4 text-amber-600" />
              <span className="text-xs font-semibold text-amber-700">
                Test accounts — click to fill
              </span>
            </div>
            <div className="space-y-2">
              {devCredentials.map((cred) => (
                <button
                  key={cred.username}
                  type="button"
                  onClick={() => fillCredentials(cred.username, cred.password)}
                  className="flex w-full items-center justify-between rounded-lg border border-amber-200 bg-white px-3 py-2 text-left hover:border-[#c1121f] hover:bg-red-50 transition-colors"
                >
                  <div>
                    <span className="font-mono text-sm font-medium text-gray-800">{cred.username}</span>
                    <span className="ml-2 font-mono text-xs text-gray-400">/ {cred.password}</span>
                  </div>
                  <span className="text-xs font-semibold text-[#c1121f]">
                    {getRoleDisplayName(cred.role)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <p className="text-center text-xs text-gray-400">
            © {new Date().getFullYear()} Information Network Security Administration
          </p>
        </div>
      </main>
    </div>
  );
}
