const KEYCLOAK_URL = process.env.NEXT_PUBLIC_KEYCLOAK_URL || 'http://localhost:8180';
const REALM = process.env.NEXT_PUBLIC_KEYCLOAK_REALM || 'prms';
const CLIENT_ID = process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || 'prms-frontend';

export const KEYCLOAK_CONFIG = { KEYCLOAK_URL, REALM, CLIENT_ID };

export const KC_ENDPOINTS = {
  token: `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/token`,
  userinfo: `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/userinfo`,
  logout: `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/logout`,
  jwks: `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/certs`,
};

export interface KeycloakTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  refresh_expires_in: number;
  token_type: string;
  session_state: string;
}

function parseJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const base64 = token.split('.')[1];
    const decoded = atob(base64.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

export function getPrmsRoleFromToken(token: string): string | null {
  const payload = parseJwtPayload(token);
  if (!payload) return null;
  const realmAccess = payload['realm_access'] as { roles?: string[] } | undefined;
  const roles = realmAccess?.roles ?? [];
  for (const role of ['PROCUREMENT_ADMIN', 'REQUESTER', 'SUPPLIER']) {
    if (roles.includes(role)) return role;
  }
  return null;
}

export function isTokenExpired(token: string): boolean {
  const payload = parseJwtPayload(token);
  if (!payload || typeof payload['exp'] !== 'number') return true;
  return Date.now() >= payload['exp'] * 1000 - 30_000;
}

export async function keycloakLogin(username: string, password: string): Promise<KeycloakTokenResponse> {
  const body = new URLSearchParams({
    grant_type: 'password',
    client_id: CLIENT_ID,
    username,
    password,
  });

  const res = await fetch(KC_ENDPOINTS.token, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error_description?: string }).error_description || 'Invalid credentials');
  }

  return res.json() as Promise<KeycloakTokenResponse>;
}

export async function keycloakRefresh(refreshToken: string): Promise<KeycloakTokenResponse> {
  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: CLIENT_ID,
    refresh_token: refreshToken,
  });

  const res = await fetch(KC_ENDPOINTS.token, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  if (!res.ok) throw new Error('Session expired — please log in again');
  return res.json() as Promise<KeycloakTokenResponse>;
}

export function saveTokens(tokens: KeycloakTokenResponse): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('access_token', tokens.access_token);
  localStorage.setItem('refresh_token', tokens.refresh_token);
  localStorage.setItem('token_expires_at', String(Date.now() + tokens.expires_in * 1000));
}

export function clearTokens(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('token_expires_at');
}

export function getStoredTokens(): { accessToken: string | null; refreshToken: string | null } {
  if (typeof window === 'undefined') return { accessToken: null, refreshToken: null };
  return {
    accessToken: localStorage.getItem('access_token'),
    refreshToken: localStorage.getItem('refresh_token'),
  };
}
