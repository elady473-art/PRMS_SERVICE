"use client";

import { ROLES, type PRMSRole, type AuthenticatedUser } from '@/features/auth/types/roles';
import {
  keycloakLogin,
  keycloakRefresh,
  saveTokens,
  clearTokens,
  getStoredTokens,
  getPrmsRoleFromToken,
  isTokenExpired,
  type KeycloakTokenResponse,
} from '@/lib/keycloak';

export type { PRMSRole, AuthenticatedUser };

export interface PRMSSession {
  user: AuthenticatedUser;
  role: PRMSRole;
  accessToken: string;
}

export interface LoginResult {
  success: boolean;
  error?: { message: string };
}

function buildUserFromToken(accessToken: string): AuthenticatedUser | null {
  try {
    const base64 = accessToken.split('.')[1];
    const decoded = atob(base64.replace(/-/g, '+').replace(/_/g, '/'));
    const payload = JSON.parse(decoded) as Record<string, unknown>;
    return {
      id: String(payload['sub'] ?? ''),
      username: String(payload['preferred_username'] ?? ''),
      firstName: String(payload['given_name'] ?? ''),
      lastName: String(payload['family_name'] ?? ''),
      email: String(payload['email'] ?? ''),
      displayName:
        payload['given_name'] && payload['family_name']
          ? `${payload['given_name']} ${payload['family_name']}`
          : String(payload['preferred_username'] ?? ''),
    };
  } catch {
    return null;
  }
}

function saveSession(session: PRMSSession): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('prms_dev_session', JSON.stringify({ user: session.user, role: session.role }));
  localStorage.setItem('isAuthenticated', 'true');
}

function clearSession(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('prms_dev_session');
  localStorage.removeItem('isAuthenticated');
  clearTokens();
}

export class AuthService {
  async login(username: string, password: string): Promise<LoginResult> {
    try {
      const tokens: KeycloakTokenResponse = await keycloakLogin(username, password);
      const role = getPrmsRoleFromToken(tokens.access_token);
      if (!role || !Object.values(ROLES).includes(role as PRMSRole)) {
        return { success: false, error: { message: 'Your account has no PRMS role assigned.' } };
      }
      const user = buildUserFromToken(tokens.access_token);
      if (!user) {
        return { success: false, error: { message: 'Could not read user info from token.' } };
      }
      saveTokens(tokens);
      saveSession({ user, role: role as PRMSRole, accessToken: tokens.access_token });
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed. Please check your credentials.';
      return { success: false, error: { message: msg } };
    }
  }

  async logout(): Promise<void> {
    clearSession();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }

  async refreshSessionIfNeeded(): Promise<boolean> {
    const { accessToken, refreshToken } = getStoredTokens();
    if (!accessToken || !refreshToken) return false;
    if (!isTokenExpired(accessToken)) return true;
    try {
      const tokens = await keycloakRefresh(refreshToken);
      const role = getPrmsRoleFromToken(tokens.access_token);
      const user = buildUserFromToken(tokens.access_token);
      if (!role || !user) { clearSession(); return false; }
      saveTokens(tokens);
      saveSession({ user, role: role as PRMSRole, accessToken: tokens.access_token });
      return true;
    } catch {
      clearSession();
      return false;
    }
  }

  getSession(): { user: AuthenticatedUser; role: PRMSRole } | null {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem('prms_dev_session');
      if (!raw) return null;
      const parsed = JSON.parse(raw) as Partial<{ user: AuthenticatedUser; role: PRMSRole }>;
      if (!parsed?.user || !parsed?.role) return null;
      if (!Object.values(ROLES).includes(parsed.role)) return null;
      const { accessToken } = getStoredTokens();
      if (accessToken && isTokenExpired(accessToken)) return null;
      return { user: parsed.user, role: parsed.role };
    } catch {
      return null;
    }
  }

  isAuthenticated(): boolean {
    return this.getSession() !== null;
  }

  getRole(): PRMSRole | null {
    return this.getSession()?.role ?? null;
  }

  getUser(): AuthenticatedUser | null {
    return this.getSession()?.user ?? null;
  }

  // All authentication now goes through real Keycloak - no more dev/mock credentials
  // But keeping this method for login page convenience
  getDevCredentials() {
    return [
      { username: 'procurement_admin', password: 'admin123', role: ROLES.PROCUREMENT_ADMIN },
      { username: 'requester', password: 'requester123', role: ROLES.REQUESTER },
      { username: 'supplier', password: 'supplier123', role: ROLES.SUPPLIER },
    ];
  }
}

export const authService = new AuthService();
