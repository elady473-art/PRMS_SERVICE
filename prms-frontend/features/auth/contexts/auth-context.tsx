"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { type PRMSRole, type AuthenticatedUser, ROLES } from '@/features/auth/types/roles';
import { authService } from '@/features/auth/services/auth-service';

export interface AuthContextValue {
  user: AuthenticatedUser | null;
  role: PRMSRole | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasRole: (role: PRMSRole) => boolean;
  hasAnyRole: (roles: PRMSRole[]) => boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [role, setRole] = useState<PRMSRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const session = authService.getSession();
    if (session) {
      setUser(session.user);
      setRole(session.role);
    }
    setIsLoading(false);

    const interval = setInterval(() => {
      authService.refreshSessionIfNeeded().then((ok) => {
        if (!ok) {
          setUser(null);
          setRole(null);
        } else {
          const refreshed = authService.getSession();
          if (refreshed) {
            setUser(refreshed.user);
            setRole(refreshed.role);
          }
        }
      });
    }, 4 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
    setRole(null);
  }, []);

  const hasRole = useCallback((r: PRMSRole) => role === r, [role]);
  const hasAnyRole = useCallback((rs: PRMSRole[]) => rs.some((r) => r === role), [role]);

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isLoading,
        isAuthenticated: !isLoading && !!user && !!role,
        hasRole,
        hasAnyRole,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth() must be used within <AuthProvider>.');
  return ctx;
}
