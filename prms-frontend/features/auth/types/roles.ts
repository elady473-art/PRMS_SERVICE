/**
 * PRMS Role Definitions
 *
 * These are the three official PRMS roles as agreed with the shared ERP
 * authentication / Keycloak team.  The actual authentication, JWT handling,
 * and role-assignment are owned by that team.  This file only defines the
 * role identifiers the PRMS frontend uses to drive navigation and access
 * control once a role has been delivered by the shared auth layer.
 */

// ─── Role constants ───────────────────────────────────────────────────────────

export const ROLES = {
  PROCUREMENT_ADMIN: "PROCUREMENT_ADMIN",
  REQUESTER: "REQUESTER",
  SUPPLIER: "SUPPLIER",
} as const;

// ─── Types ───────────────────────────────────────────────────────────────────

/** Union of all valid PRMS role strings. */
export type PRMSRole = (typeof ROLES)[keyof typeof ROLES];

/**
 * Represents the authenticated user as the PRMS frontend expects to receive
 * it from the shared ERP / Keycloak authentication system.
 *
 * NOTE: The actual shape delivered by Keycloak may differ slightly; adjust
 * this interface once the shared-auth team finalises the contract.
 */
export interface AuthenticatedUser {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  /** Full display name derived from firstName + lastName. */
  displayName?: string;
}

/**
 * The session object the PRMS frontend works with.
 * Produced by the shared ERP authentication layer.
 */
export interface PRMSSession {
  user: AuthenticatedUser;
  /** One of the three PRMS roles supplied by the Keycloak/ERP auth system. */
  role: PRMSRole;
  isAuthenticated: boolean;
}

// ─── Display helpers ─────────────────────────────────────────────────────────

/** Maps a role identifier to a human-readable label for display in the UI. */
export function getRoleDisplayName(role: PRMSRole | string): string {
  switch (role) {
    case ROLES.PROCUREMENT_ADMIN:
      return "Procurement Admin";
    case ROLES.REQUESTER:
      return "Requester";
    case ROLES.SUPPLIER:
      return "Supplier";
    default:
      return role;
  }
}

// ─── Role-check utilities ─────────────────────────────────────────────────────

/**
 * Returns true if the given role matches the required role.
 * Designed to be connected to the shared auth session.
 */
export function hasRole(userRole: PRMSRole | string | null | undefined, requiredRole: PRMSRole): boolean {
  return userRole === requiredRole;
}

/**
 * Returns true if the given role is one of the allowed roles.
 * Designed to be connected to the shared auth session.
 */
export function hasAnyRole(
  userRole: PRMSRole | string | null | undefined,
  allowedRoles: PRMSRole[]
): boolean {
  return allowedRoles.some((r) => r === userRole);
}

// ─── Navigation access matrix ─────────────────────────────────────────────────

/** The set of route paths each role is permitted to navigate to. */
export const ROLE_ALLOWED_ROUTES: Record<PRMSRole, string[]> = {
  PROCUREMENT_ADMIN: [
    "/prms",
    "/prms/suppliers",
    "/prms/purchase-requests",
    "/prms/approvals",
    "/prms/rfq",
    "/prms/quotations",
    "/prms/evaluation",
    "/prms/purchase-orders",
    "/prms/contracts",
    "/prms/goods-receipt",
    "/prms/invoices",
    "/prms/reports",
    "/prms/audit",
    "/prms/settings",
  ],
  REQUESTER: [
    "/prms",
    "/prms/purchase-requests",
  ],
  SUPPLIER: [
    "/prms",
    "/prms/rfq",
    "/prms/quotations",
    "/prms/purchase-orders",
    "/prms/contracts",
    "/prms/goods-receipt",
    "/prms/invoices",
  ],
};

/** Returns true when a role is allowed to visit a given pathname. */
export function isRouteAllowed(role: PRMSRole | string | null | undefined, pathname: string): boolean {
  if (!role) return false;
  const allowed = ROLE_ALLOWED_ROUTES[role as PRMSRole];
  if (!allowed) return false;
  return allowed.some((route) => {
    // Exact match: /prms/rfq === /prms/rfq
    if (pathname === route) return true;
    // Sub-path match: only allow if route is NOT just the root dashboard "/prms"
    // This prevents "/prms" from acting as a wildcard prefix for all sub-paths.
    if (route !== "/prms" && pathname.startsWith(route + "/")) return true;
    return false;
  });
}
