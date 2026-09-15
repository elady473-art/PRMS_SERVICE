"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Phone, Mail, MapPin, Star, Eye, Plus, Search,
  Loader2, AlertCircle, RefreshCw, Building2, CheckCircle
} from "lucide-react";
import { useVendors } from "@/features/prms/hooks/use-vendors";
import type { VendorResponse, BackendPaymentTerms } from "@/lib/prms-api";

function paymentTermsLabel(pt: BackendPaymentTerms): string {
  return { NET_15: "Net 15", NET_30: "Net 30", NET_60: "Net 60", COD: "COD" }[pt] ?? pt;
}

function initials(name: string): string {
  const w = name.toUpperCase().split(" ");
  return w.length >= 2 ? w[0][0] + w[1][0] : w[0].slice(0, 2);
}

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const empty = 5 - Math.ceil(rating);
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: full }).map((_, i) => (
        <Star key={`f${i}`} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
      ))}
      {rating % 1 >= 0.5 && (
        <span className="relative inline-block h-3.5 w-3.5">
          <Star className="absolute h-3.5 w-3.5 fill-gray-200 text-gray-200" />
          <span className="absolute inset-0 w-1/2 overflow-hidden">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          </span>
        </span>
      )}
      {Array.from({ length: empty }).map((_, i) => (
        <Star key={`e${i}`} className="h-3.5 w-3.5 fill-gray-200 text-gray-200" />
      ))}
      <span className="ml-1 text-xs font-semibold text-gray-700">{rating.toFixed(1)}</span>
    </div>
  );
}

function statusLabel(v: VendorResponse): string {
  if (v.blacklisted) return "Blacklisted";
  if (v.performanceScore != null && v.performanceScore >= 4.5) return "Preferred";
  return "Active";
}

const STATUS_STYLES: Record<string, string> = {
  Preferred: "text-[#1e50c8] font-bold",
  Active: "text-emerald-700 font-semibold",
  Blacklisted: "text-[#c1121f] font-semibold",
};

export default function SuppliersPage() {
  const [search, setSearch] = useState("");
  const { data: vendors, isLoading, isError, error, refetch } = useVendors();

  const filtered = (vendors ?? []).filter((v) => {
    const q = search.toLowerCase();
    return (
      !search ||
      v.name.toLowerCase().includes(q) ||
      v.email.toLowerCase().includes(q) ||
      v.vendorType.toLowerCase().includes(q)
    );
  });

  const stats = {
    total: vendors?.length ?? 0,
    preferred: vendors?.filter((v) => v.performanceScore != null && v.performanceScore >= 4.5 && !v.blacklisted).length ?? 0,
    active: vendors?.filter((v) => !v.blacklisted).length ?? 0,
  };

  if (isLoading) {
    return (
      <div className="flex min-h-64 items-center justify-center font-sans">
        <Loader2 className="h-5 w-5 animate-spin text-[#c1121f]" />
        <span className="ml-2 text-xs text-gray-500">Loading suppliers…</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 font-sans">
        <AlertCircle className="h-8 w-8 text-[#c1121f]" />
        <p className="text-xs text-gray-600 font-medium">
          {error instanceof Error ? error.message : "Failed to load suppliers."}
        </p>
        <Button variant="outline" className="border-gray-200 text-[#1e50c8] h-8 text-xs font-medium rounded-lg" onClick={() => refetch()}>
          <RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 font-sans">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Suppliers Registry</h2>
          <p className="mt-0.5 text-xs text-gray-500 font-medium">Registered vendors, compliance status, and performance ratings</p>
        </div>
        <Button className="bg-[#c1121f] hover:bg-[#a00f1a] text-white shadow-xs text-xs font-medium h-9 px-4 rounded-lg" asChild>
          <Link href="/prms/suppliers/new">
            <Plus className="mr-1.5 h-4 w-4" />Register Supplier
          </Link>
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Registered Suppliers", value: stats.total, iconBg: "bg-blue-50/70 text-[#1e50c8]", icon: Building2 },
          { label: "Preferred Tier Vendors", value: stats.preferred, iconBg: "bg-amber-50/70 text-amber-600", icon: Star },
          { label: "Active Suppliers", value: stats.active, iconBg: "bg-emerald-50/70 text-emerald-600", icon: CheckCircle },
        ].map(({ label, value, iconBg, icon: Icon }) => (
          <Card key={label} className="border border-gray-100/80 bg-white shadow-xs rounded-xl">
            <CardContent className="p-4.5 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500">{label}</p>
                <p className="text-xl font-semibold text-gray-900 mt-1">{value}</p>
              </div>
              <div className={`h-10 w-10 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
                <Icon className="h-4.5 w-4.5 stroke-[1.75]" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
        <Input
          placeholder="Search suppliers by name, email, or category…"
          className="pl-8.5 border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 text-xs h-8.5 rounded-lg"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filtered.length === 0 && !isLoading && (
        <div className="py-12 text-center text-gray-400 font-medium text-xs">
          {vendors?.length === 0
            ? "No suppliers registered yet. Click 'Register Supplier' to add the first one."
            : "No suppliers match your search."}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((v) => {
          const status = statusLabel(v);
          const score = v.performanceScore ?? 3.5;
          return (
            <Card key={v.id} className="border border-gray-100/80 bg-white hover:border-gray-200 hover:shadow-xs transition-all rounded-xl overflow-hidden">
              <CardContent className="p-4.5">
                <div className="flex items-start gap-3 mb-2.5">
                  <div className="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold text-[#1e50c8] bg-blue-50/70">
                    {initials(v.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-gray-900 text-xs truncate">{v.name}</p>
                      <span className={`text-[11px] ${STATUS_STYLES[status] ?? "text-gray-500"}`}>{status}</span>
                    </div>
                    <p className="text-[11px] text-gray-400 capitalize">{v.vendorType.toLowerCase().replace("_", " ")}</p>
                  </div>
                </div>

                <div className="mb-3">
                  <StarRating rating={score} />
                </div>

                <div className="space-y-1.5 mb-3.5">
                  <p className="flex items-center gap-2 text-xs text-gray-600">
                    <Phone className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />{v.phone}
                  </p>
                  <p className="flex items-center gap-2 text-xs text-gray-600 truncate">
                    <Mail className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />{v.email}
                  </p>
                  <p className="flex items-center gap-2 text-xs text-gray-500">
                    <MapPin className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                    {v.address} · TIN: {v.taxIdentificationNumber}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 py-2 border-t border-b border-gray-100 mb-3.5 bg-gray-50/40 rounded-lg px-2">
                  <div className="text-center">
                    <p className="text-xs font-semibold text-[#1e50c8] font-mono">{v.vendorCode}</p>
                    <p className="text-[10px] text-gray-400 uppercase font-medium">Code</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-semibold text-[#c1121f]">{paymentTermsLabel(v.paymentTerms)}</p>
                    <p className="text-[10px] text-gray-400 uppercase font-medium">Terms</p>
                  </div>
                </div>

                <Button variant="outline" size="sm" className="w-full h-8 border-gray-200 text-[#1e50c8] hover:bg-blue-50/50 font-medium text-xs rounded-lg" asChild>
                  <Link href={`/prms/suppliers/${v.id}`}>
                    <Eye className="h-3.5 w-3.5 mr-1.5" />View Details
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
