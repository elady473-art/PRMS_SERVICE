"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, X, CheckCircle2, Clock, AlertCircle, Loader2 } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import { usePendingApprovals } from "@/features/prms/hooks/use-approvals";
import Link from "next/link";

interface NotificationItem {
  id: string;
  title: string;
  subtitle: string;
  time: string;
  read: boolean;
  type: "approval" | "alert" | "info";
  href: string;
}

export function NotificationPanel() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Fetch real database pending approvals from PostgreSQL
  const { data: pendingRequisitions, isLoading } = usePendingApprovals();
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  // Map real PostgreSQL pending requisitions to notifications
  const notifications: NotificationItem[] = (pendingRequisitions ?? []).map((r) => ({
    id: String(r.id),
    title: `PR #${r.requisitionNumber} awaiting approval`,
    subtitle: r.purpose || "Purchase Request",
    time: r.createdAt ? formatDate(r.createdAt) : "Recently",
    read: readIds.has(String(r.id)),
    type: "approval",
    href: "/prms/approvals",
  }));

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close dropdown on outside click
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  const markAllRead = () => {
    const allIds = new Set(notifications.map((n) => n.id));
    setReadIds(allIds);
  };

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800"
        aria-label="Notifications"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#c1121f] text-[10px] font-bold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute right-0 top-11 z-50 w-[340px] rounded-2xl border border-gray-200 bg-white shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 bg-gray-50/50">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-gray-900">Database Notifications</span>
              {unreadCount > 0 && (
                <span className="rounded-full bg-[#c1121f] px-2 py-0.5 text-[10px] font-bold text-white">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs font-medium text-[#1e50c8] hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Notification List */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-gray-50">
            {isLoading ? (
              <div className="py-8 flex items-center justify-center text-xs text-gray-400 gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-[#c1121f]" /> Querying live database events...
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-10 text-center text-xs text-gray-400 font-medium">
                No active pending approval notifications in database.
              </div>
            ) : (
              notifications.map((n) => (
                <Link
                  key={n.id}
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "group relative flex items-start gap-3 px-4 py-3 transition-colors hover:bg-gray-50",
                    !n.read && "bg-red-50/20"
                  )}
                >
                  <span className="mt-1.5 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-[#c1121f]" />

                  <div className="min-w-0 flex-1">
                    <p
                      className={cn(
                        "text-xs leading-snug",
                        n.read ? "font-normal text-gray-600" : "font-bold text-gray-900"
                      )}
                    >
                      {n.title}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="rounded bg-red-100 text-[#c1121f] px-1.5 py-0.5 text-[10px] font-bold">
                        {n.subtitle}
                      </span>
                      <span className="text-[10px] text-gray-400">{n.time}</span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-100 px-4 py-2.5 text-center bg-gray-50/50">
            <Link
              href="/prms/approvals"
              className="text-xs font-bold text-[#c1121f] hover:underline"
              onClick={() => setOpen(false)}
            >
              View pending approval queue →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
