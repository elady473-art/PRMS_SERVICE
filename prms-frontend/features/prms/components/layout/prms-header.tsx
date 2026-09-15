"use client";

import { useState, useRef, useEffect } from "react";
import {
  Search, HelpCircle, Menu, BookOpen, MessageCircle, Settings, ExternalLink, X,
  FileText, Building2, ShoppingCart, CheckSquare, MessageSquare, ArrowRight, ShieldCheck,
  Package, Receipt, Scale, FileCheck, Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserMenu } from "@/features/auth/components/user-menu";
import { NotificationPanel } from "@/features/prms/components/notifications/notification-panel";
import { useAuth } from "@/features/auth/contexts/auth-context";
import { ROLES } from "@/features/auth/types/roles";
import { usePathname, useRouter } from "next/navigation";
import { useSidebar } from "./prms-layout";
import { usePurchaseOrders } from "@/features/prms/hooks/use-purchase-orders";
import { useVendors } from "@/features/prms/hooks/use-vendors";
import { useRequisitions } from "@/features/prms/hooks/use-requisitions";
import { useRFQs } from "@/features/prms/hooks/use-rfq";
import { formatCurrency } from "@/lib/utils";

function useBreadcrumb() {
  const pathname = usePathname();
  const segments = pathname
    .replace(/^\/prms\/?/, "")
    .split("/")
    .filter(Boolean);

  const label = segments.length
    ? segments[0]
        .split("-")
        .map((w) => w[0].toUpperCase() + w.slice(1))
        .join(" ")
    : "Dashboard";

  return { top: "Procurement & Resource Management", sub: label };
}

// System Modules for First-Letter Search
const SYSTEM_MODULES = [
  { name: "Dashboard", href: "/prms", icon: FileText, category: "Module" },
  { name: "Suppliers Registry", href: "/prms/suppliers", icon: Building2, category: "Module" },
  { name: "Purchase Requests", href: "/prms/purchase-requests", icon: FileText, category: "Module" },
  { name: "Approvals Center", href: "/prms/approvals", icon: CheckSquare, category: "Module" },
  { name: "RFQs & Solicitations", href: "/prms/rfq", icon: MessageSquare, category: "Module" },
  { name: "Quotations Matrix", href: "/prms/quotations", icon: Award, category: "Module" },
  { name: "Supplier Evaluation", href: "/prms/evaluation", icon: Scale, category: "Module" },
  { name: "Purchase Orders", href: "/prms/purchase-orders", icon: ShoppingCart, category: "Module" },
  { name: "Contracts Lifecycle", href: "/prms/contracts", icon: FileCheck, category: "Module" },
  { name: "Goods Receipt (GRN)", href: "/prms/goods-receipt", icon: Package, category: "Module" },
  { name: "Invoices & Payments", href: "/prms/invoices", icon: Receipt, category: "Module" },
];

function HelpPanel() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function close(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const items = [
    { icon: BookOpen,       label: "User Guide",            sub: "How to use PRMS",               action: () => { window.open("https://insa.gov.et", "_blank"); setOpen(false); } },
    { icon: MessageCircle,  label: "Contact Support",       sub: "support@insa.gov.et",            action: () => { window.location.href = "mailto:support@insa.gov.et"; setOpen(false); } },
    { icon: Settings,       label: "System Settings",       sub: "Configure PRMS preferences",    action: () => { router.push("/prms/settings"); setOpen(false); } },
    { icon: ExternalLink,   label: "INSA Portal",           sub: "insa.gov.et",                   action: () => { window.open("https://insa.gov.et", "_blank"); setOpen(false); } },
  ];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className={`flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800 ${open ? "bg-gray-100 text-gray-800" : ""}`}
        aria-label="Help"
      >
        <HelpCircle size={18} />
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-50 w-72 rounded-2xl border border-gray-200 bg-white shadow-2xl animate-in fade-in-50 duration-200">
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <span className="text-sm font-bold text-gray-900">Help &amp; Support</span>
            <button onClick={() => setOpen(false)} className="rounded p-0.5 text-gray-400 hover:text-gray-700"><X size={14} /></button>
          </div>

          <div className="p-2">
            {items.map(({ icon: Icon, label, sub, action }) => (
              <button
                key={label}
                onClick={action}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100">
                  <Icon className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{label}</p>
                  <p className="text-xs text-gray-400">{sub}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="border-t border-gray-100 px-4 py-2.5 text-center">
            <p className="text-xs text-gray-400">PRMS v1.0 · INSA ERP System</p>
          </div>
        </div>
      )}
    </div>
  );
}

export function PRMSHeader() {
  const { role } = useAuth();
  const { top, sub } = useBreadcrumb();
  const { toggleSidebar } = useSidebar();
  const router = useRouter();

  // Search state & real DB queries
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const { data: purchaseOrders } = usePurchaseOrders();
  const { data: vendors } = useVendors();
  const { data: requisitions } = useRequisitions();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // FIRST-LETTER MATCHING ALGORITHM
  const query = searchQuery.trim().toLowerCase();

  const matchingPOs = (purchaseOrders ?? []).filter((po) => {
    if (!query) return false;
    const num = po.purchaseOrderNumber.toLowerCase();
    const v = po.vendorName.toLowerCase();
    return num.startsWith(query) || v.startsWith(query) || num.includes(query) || v.includes(query);
  }).slice(0, 4);

  const matchingVendors = (vendors ?? []).filter((v) => {
    if (!query) return false;
    const n = v.name.toLowerCase();
    const code = v.vendorCode.toLowerCase();
    return n.startsWith(query) || code.startsWith(query) || n.includes(query);
  }).slice(0, 4);

  const matchingPRs = (requisitions ?? []).filter((pr) => {
    if (!query) return false;
    const num = pr.requisitionNumber.toLowerCase();
    const p = pr.purpose.toLowerCase();
    return num.startsWith(query) || p.startsWith(query) || num.includes(query) || p.includes(query);
  }).slice(0, 4);

  const matchingModules = SYSTEM_MODULES.filter((m) => {
    if (!query) return false;
    const name = m.name.toLowerCase();
    return name.startsWith(query) || name.includes(query);
  }).slice(0, 4);

  const hasResults =
    matchingPOs.length > 0 ||
    matchingVendors.length > 0 ||
    matchingPRs.length > 0 ||
    matchingModules.length > 0;

  const showSearch =
    role === ROLES.PROCUREMENT_ADMIN || role === ROLES.SUPPLIER || role === ROLES.REQUESTER;

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200/80 bg-white/95 backdrop-blur-xs shadow-xs">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3">
        {/* Left — Hamburger & title */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-9 w-9 text-gray-600 hover:bg-gray-100/80 rounded-lg transition-colors"
            title="Toggle Navigation Menu"
          >
            <Menu size={20} />
          </Button>

          <div>
            <p className="text-xs font-semibold text-gray-900">{top}</p>
            <p className="text-[11px] text-gray-400 font-medium">INSA Enterprise Resource Planning System</p>
          </div>
        </div>

        {/* Right — First-Letter Search + Actions */}
        <div className="flex items-center gap-2">
          {showSearch && (
            <div className="relative hidden md:block" ref={searchRef}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                <Input
                  type="search"
                  placeholder="Search by first letter (e.g. P, E, Tech)…"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSearchOpen(true);
                  }}
                  onFocus={() => setSearchOpen(true)}
                  className="h-9 w-64 lg:w-80 rounded-full border-gray-200 bg-gray-50/80 pl-9 pr-4 text-xs text-gray-900 placeholder:text-gray-400 focus:bg-white focus:ring-1 focus:ring-[#1e50c8] transition-all"
                />
              </div>

              {/* FIRST-LETTER INSTANT SEARCH DROPDOWN RESULT */}
              {searchOpen && query.length > 0 && (
                <div className="absolute right-0 top-11 z-50 w-96 rounded-2xl border border-gray-200 bg-white shadow-2xl overflow-hidden animate-in fade-in-50 slide-in-from-top-2 duration-200">
                  <div className="p-3 bg-gray-50/60 border-b border-gray-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-600">
                      Search Results for &quot;<span className="text-[#1e50c8] font-bold">{searchQuery}</span>&quot;
                    </span>
                    <button onClick={() => setSearchOpen(false)} className="text-gray-400 hover:text-gray-600 text-xs">Esc</button>
                  </div>

                  {!hasResults ? (
                    <div className="p-6 text-center text-xs text-gray-400 font-medium">
                      No matching records starting with &quot;{searchQuery}&quot; found.
                    </div>
                  ) : (
                    <div className="max-h-96 overflow-y-auto p-2 space-y-3">
                      {/* Purchase Orders */}
                      {matchingPOs.length > 0 && (
                        <div>
                          <p className="px-2 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Purchase Orders</p>
                          {matchingPOs.map((po) => (
                            <button
                              key={po.id}
                              onClick={() => {
                                router.push(`/prms/purchase-orders/${po.id}`);
                                setSearchOpen(false);
                              }}
                              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left hover:bg-blue-50/60 transition-colors"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <ShoppingCart className="h-3.5 w-3.5 text-[#1e50c8] flex-shrink-0" />
                                <div>
                                  <p className="text-xs font-semibold text-gray-900 truncate">{po.purchaseOrderNumber} — {po.vendorName}</p>
                                  <p className="text-[10px] text-gray-400">{formatCurrency(po.totalAmount)} ETB</p>
                                </div>
                              </div>
                              <ArrowRight className="h-3 w-3 text-gray-400" />
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Suppliers */}
                      {matchingVendors.length > 0 && (
                        <div>
                          <p className="px-2 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Suppliers</p>
                          {matchingVendors.map((v) => (
                            <button
                              key={v.id}
                              onClick={() => {
                                router.push(`/prms/suppliers/${v.id}`);
                                setSearchOpen(false);
                              }}
                              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left hover:bg-red-50/60 transition-colors"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <Building2 className="h-3.5 w-3.5 text-[#c1121f] flex-shrink-0" />
                                <div>
                                  <p className="text-xs font-semibold text-gray-900 truncate">{v.name}</p>
                                  <p className="text-[10px] text-gray-400">{v.vendorCode} · {v.vendorType}</p>
                                </div>
                              </div>
                              <ArrowRight className="h-3 w-3 text-gray-400" />
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Purchase Requests */}
                      {matchingPRs.length > 0 && (
                        <div>
                          <p className="px-2 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Purchase Requests</p>
                          {matchingPRs.map((pr) => (
                            <button
                              key={pr.id}
                              onClick={() => {
                                router.push(`/prms/purchase-requests/${pr.id}`);
                                setSearchOpen(false);
                              }}
                              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left hover:bg-emerald-50/60 transition-colors"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <FileText className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
                                <div>
                                  <p className="text-xs font-semibold text-gray-900 truncate">{pr.requisitionNumber} — {pr.purpose}</p>
                                  <p className="text-[10px] text-gray-400">{formatCurrency(pr.estimatedAmount ?? 0)} ETB</p>
                                </div>
                              </div>
                              <ArrowRight className="h-3 w-3 text-gray-400" />
                            </button>
                          ))}
                        </div>
                      )}

                      {/* System Modules */}
                      {matchingModules.length > 0 && (
                        <div>
                          <p className="px-2 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">System Modules</p>
                          {matchingModules.map((m) => {
                            const Icon = m.icon;
                            return (
                              <button
                                key={m.href}
                                onClick={() => {
                                  router.push(m.href);
                                  setSearchOpen(false);
                                }}
                                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left hover:bg-gray-100/80 transition-colors"
                              >
                                <div className="flex items-center gap-2">
                                  <Icon className="h-3.5 w-3.5 text-indigo-600" />
                                  <span className="text-xs font-semibold text-gray-800">{m.name}</span>
                                </div>
                                <ArrowRight className="h-3 w-3 text-gray-400" />
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <NotificationPanel />

          <HelpPanel />

          <div className="ml-1 border-l border-gray-200 pl-3">
            <UserMenu />
          </div>
        </div>
      </div>

      {/* Live Data Stat Chips */}
      {role === ROLES.PROCUREMENT_ADMIN && (
        <div className="flex items-center gap-6 overflow-x-auto border-t border-gray-100 px-6 py-1.5 no-scrollbar">
          <StatChip dot="bg-emerald-500" label="System: Online" />
          <StatChip label="Total POs:" value={String(purchaseOrders?.length ?? 0)} />
          <StatChip label="Registered Suppliers:" value={String(vendors?.length ?? 0)} />
          <StatChip label="Open PRs:" value={String(requisitions?.length ?? 0)} valueClass="text-[#1e50c8] font-semibold" />
        </div>
      )}
    </header>
  );
}

function StatChip({
  dot,
  label,
  value,
  valueClass = "text-gray-800 font-semibold",
}: {
  dot?: string;
  label: string;
  value?: string;
  valueClass?: string;
}) {
  return (
    <div className="flex flex-shrink-0 items-center gap-1.5">
      {dot && <span className={`h-2 w-2 rounded-full ${dot}`} />}
      <span className="text-xs text-gray-500 font-medium">{label}</span>
      {value && <span className={`text-xs ${valueClass}`}>{value}</span>}
    </div>
  );
}
