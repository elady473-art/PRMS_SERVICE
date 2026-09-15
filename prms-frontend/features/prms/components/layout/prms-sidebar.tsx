"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home,
  Users,
  FileText,
  CheckSquare,
  FileSearch,
  Quote,
  Scale,
  ShoppingCart,
  FileCheck,
  Package,
  Receipt,
  BarChart3,
  Shield,
  Settings,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  LogOut,
  Menu,
  X,
  Bell,
  PanelLeftClose,
  PanelLeftOpen,
  GripVertical,
  type LucideIcon,
} from "lucide-react";
import { useAuth } from "@/features/auth/contexts/auth-context";
import { ROLES, getRoleDisplayName, type PRMSRole } from "@/features/auth/types/roles";
import { useSidebar } from "./prms-layout";

// ─── Navigation configuration ─────────────────────────────────────────────────

interface NavItem {
  label: string;
  icon: LucideIcon;
  href: string;
}

const ALL_NAV_ITEMS: NavItem[] = [
  { label: "Dashboard",         icon: Home,        href: "/prms" },
  { label: "Suppliers",         icon: Users,       href: "/prms/suppliers" },
  { label: "Purchase Requests", icon: FileText,    href: "/prms/purchase-requests" },
  { label: "Approvals",         icon: CheckSquare, href: "/prms/approvals" },
  { label: "RFQ",               icon: FileSearch,  href: "/prms/rfq" },
  { label: "Quotations",        icon: Quote,       href: "/prms/quotations" },
  { label: "Evaluation",        icon: Scale,       href: "/prms/evaluation" },
  { label: "Purchase Orders",   icon: ShoppingCart,href: "/prms/purchase-orders" },
  { label: "Contracts",         icon: FileCheck,   href: "/prms/contracts" },
  { label: "Goods Receipt",     icon: Package,     href: "/prms/goods-receipt" },
  { label: "Invoices",          icon: Receipt,     href: "/prms/invoices" },
  { label: "Reports",           icon: BarChart3,   href: "/prms/reports" },
  { label: "Audit Logs",        icon: Shield,      href: "/prms/audit" },
  { label: "Settings",          icon: Settings,    href: "/prms/settings" },
];

const ROLE_NAV_HREFS: Record<PRMSRole, string[]> = {
  [ROLES.PROCUREMENT_ADMIN]: [
    "/prms", "/prms/suppliers", "/prms/purchase-requests", "/prms/approvals",
    "/prms/rfq", "/prms/quotations", "/prms/evaluation", "/prms/purchase-orders",
    "/prms/contracts", "/prms/goods-receipt", "/prms/invoices",
    "/prms/reports", "/prms/audit", "/prms/settings",
  ],
  [ROLES.REQUESTER]: ["/prms", "/prms/purchase-requests"],
  [ROLES.SUPPLIER]: [
    "/prms", "/prms/rfq", "/prms/quotations", "/prms/purchase-orders",
    "/prms/contracts", "/prms/goods-receipt", "/prms/invoices",
  ],
};

function getNavItemsForRole(role: PRMSRole | null): NavItem[] {
  if (!role) return [];
  const allowed = ROLE_NAV_HREFS[role] ?? [];
  return ALL_NAV_ITEMS.filter((item) => allowed.includes(item.href));
}

export function PRMSSidebar() {
  const [prmsExpanded, setPrmsExpanded] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(256); // Default width
  const sidebarRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { user, role, logout } = useAuth();
  const { collapsed, toggleSidebar, mobileOpen, setMobileOpen } = useSidebar();

  // Dragging functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    if (collapsed) return;
    setIsDragging(true);
    e.preventDefault();
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      const newWidth = Math.max(200, Math.min(400, e.clientX));
      setSidebarWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'ew-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging]);

  const navItems = getNavItemsForRole(role);
  const showHelp = role === ROLES.REQUESTER || role === ROLES.SUPPLIER;

  const displayName =
    user?.displayName ??
    (user ? `${user.firstName} ${user.lastName}`.trim() : null);
  const roleLabel = role ? getRoleDisplayName(role) : "";

  const getInitials = (): string => {
    if (user?.firstName && user?.lastName)
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    if (user?.username) return user.username[0].toUpperCase();
    return "U";
  };

  const sidebarBg = "#0a1f44";

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs md:hidden transition-opacity duration-300"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container with Smooth Transition and Draggable Width */}
      <aside
        ref={sidebarRef}
        className={cn(
          "relative fixed z-50 flex h-full flex-col transition-all duration-300 ease-in-out md:relative shadow-xl md:shadow-none select-none group",
          collapsed ? "w-20" : "",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
        style={{ 
          background: sidebarBg,
          width: collapsed ? '80px' : `${sidebarWidth}px`
        }}
      >
        {/* ── Logo & Desktop Collapse Toggle ── */}
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/10 shadow-xs">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/insa.jpg"
                alt="INSA"
                className="h-7 w-7 object-contain"
              />
            </div>
            {!collapsed && (
              <div className="min-w-0 animate-in fade-in-50 duration-200">
                <p className="truncate text-[11px] font-semibold leading-tight text-white">
                  Information Network Security Administration
                </p>
                <p className="text-[10px] text-white/50">Enterprise Resource Planning</p>
              </div>
            )}
          </div>

          <button
            onClick={toggleSidebar}
            className="hidden md:flex h-7 w-7 items-center justify-center rounded-lg text-white/60 hover:bg-white/10 hover:text-white transition-colors"
            title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
          </button>
        </div>

        {/* ── Nav Section Header ── */}
        {!collapsed && (
          <div className="px-4 pt-4 pb-1 animate-in fade-in-50 duration-200">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-white/35">
              Main Menu
            </span>
          </div>
        )}

        {/* ── Navigation List ── */}
        <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-1 custom-scrollbar">
          {!collapsed ? (
            <>
              <button
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium text-white/70 transition-colors hover:bg-white/10"
                onClick={() => setPrmsExpanded(!prmsExpanded)}
              >
                <div className="flex items-center gap-2.5">
                  <ShoppingCart size={16} className="text-white/60" />
                  <span>Procurement</span>
                </div>
                {prmsExpanded ? (
                  <ChevronDown size={14} className="text-white/40" />
                ) : (
                  <ChevronRight size={14} className="text-white/40" />
                )}
              </button>

              {prmsExpanded && (
                <div className="mt-1 space-y-0.5 pl-2">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive =
                      pathname === item.href ||
                      (item.href !== "/prms" && pathname.startsWith(item.href + "/"));

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs transition-all duration-200",
                          isActive
                            ? "bg-[#c1121f] font-semibold text-white shadow-xs"
                            : "text-white/70 hover:bg-white/10 hover:text-white"
                        )}
                      >
                        <Icon size={16} className="stroke-[1.75]" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </>
          ) : (
            /* Icon-Only Collapsed View */
            <div className="space-y-1 py-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/prms" && pathname.startsWith(item.href + "/"));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    title={item.label}
                    className={cn(
                      "flex h-10 w-10 mx-auto items-center justify-center rounded-xl transition-all duration-200",
                      isActive
                        ? "bg-[#c1121f] text-white shadow-xs"
                        : "text-white/70 hover:bg-white/10 hover:text-white"
                    )}
                  >
                    <Icon size={18} className="stroke-[1.75]" />
                  </Link>
                );
              })}
            </div>
          )}

          {/* Help */}
          {showHelp && !collapsed && (
            <div className="mt-3 border-t border-white/10 pt-3">
              <a
                href="/help"
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              >
                <HelpCircle size={15} />
                <span>Help &amp; Support</span>
              </a>
            </div>
          )}
        </nav>

        {/* ── Pending Approvals Alert Badge ── */}
        {role === ROLES.PROCUREMENT_ADMIN && !collapsed && (
          <div
            className="mx-3 mb-3 flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-300"
            style={{ background: "rgba(193,18,31,0.18)", border: "1px solid rgba(193,18,31,0.35)" }}
          >
            <Bell size={16} className="flex-shrink-0 text-[#c1121f] animate-pulse" />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white">5 Pending Approvals</p>
              <p className="text-[10px] text-white/60">Action required</p>
            </div>
          </div>
        )}

        {/* ── User Footer ── */}
        <div className="border-t border-white/10 px-3 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#c1121f] text-xs font-semibold text-white shadow-xs">
                {getInitials()}
              </div>
              {!collapsed && (
                <div className="min-w-0 animate-in fade-in-50 duration-200">
                  <p className="truncate text-xs font-semibold text-white">
                    {displayName ?? "—"}
                  </p>
                  <p className="truncate text-[10px] text-[#c1121f] font-medium">{roleLabel}</p>
                </div>
              )}
            </div>
            {!collapsed && (
              <button
                onClick={() => logout()}
                title="Sign out"
                className="ml-2 flex-shrink-0 rounded-md p-1.5 text-white/40 transition-colors hover:bg-white/10 hover:text-white"
              >
                <LogOut size={15} />
              </button>
            )}
          </div>
        </div>

        {/* Resize Handle */}
        {!collapsed && (
          <div
            className="absolute top-0 right-0 w-1 h-full cursor-ew-resize bg-gradient-to-r from-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gradient-to-r hover:from-transparent hover:to-white/20"
            onMouseDown={handleMouseDown}
            title="Drag to resize sidebar"
          >
            <div className="absolute top-1/2 right-0 transform -translate-y-1/2 w-2 h-8 bg-white/20 rounded-l-full flex items-center justify-center">
              <GripVertical size={12} className="text-white/60" />
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
