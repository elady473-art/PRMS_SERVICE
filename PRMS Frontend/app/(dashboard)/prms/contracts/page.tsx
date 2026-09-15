"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search, Plus, FileCheck, CheckCircle, Clock, AlertTriangle,
  DollarSign, Loader2, AlertCircle, RefreshCw, MoreVertical, Eye
} from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatCurrency } from "@/lib/utils";
import { useContracts } from "@/features/prms/hooks/use-contracts";

function statusBadge(status: string) {
  switch (status) {
    case "ACTIVE":
      return "bg-emerald-50 text-emerald-800 border border-emerald-200/80";
    case "EXPIRING_SOON":
      return "bg-amber-50 text-amber-800 border border-amber-200/80";
    case "EXPIRED":
      return "bg-red-50 text-red-700 border border-red-200/80";
    default:
      return "bg-gray-50 text-gray-700 border border-gray-200/80";
  }
}

export default function ContractsPage() {
  const [search, setSearch] = useState("");
  const { data: contracts, isLoading, isError, refetch } = useContracts();

  const filtered = (contracts ?? []).filter((c) => {
    const q = search.toLowerCase();
    return (
      !search ||
      c.contractNumber.toLowerCase().includes(q) ||
      c.vendorName.toLowerCase().includes(q) ||
      (c.termsAndConditions && c.termsAndConditions.toLowerCase().includes(q))
    );
  });

  const totalVal = (contracts ?? []).reduce((s, c) => s + (c.contractValue ?? 0), 0);

  return (
    <div className="space-y-6 pb-12 font-sans">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Contracts Lifecycle Management</h2>
          <p className="text-xs text-gray-500 mt-0.5 font-medium">Monitor vendor service level agreements, commitments & expiry dates</p>
        </div>
        <Button className="bg-[#c1121f] hover:bg-[#a00f1a] text-white shadow-md text-xs font-medium h-9 px-4 rounded-xl transition-all hover:-translate-y-0.5" asChild>
          <Link href="/prms/contracts/new">
            <Plus className="h-4 w-4 mr-1.5" />New Contract
          </Link>
        </Button>
      </div>

      {isLoading && (
        <div className="flex items-center gap-2 text-xs text-[#1e50c8]">
          <Loader2 className="h-4 w-4 animate-spin text-[#c1121f]" />
          Fetching contract records from database…
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: "Active Contracts", value: contracts?.length ?? 0, iconBg: "bg-blue-50/90 text-[#1e50c8]", icon: FileCheck },
          { label: "Expiring Soon", value: 0, iconBg: "bg-amber-50/90 text-amber-600", icon: Clock },
          { label: "Total Contract Value", value: `${formatCurrency(totalVal)} ETB`, iconBg: "bg-indigo-50/90 text-indigo-600", icon: DollarSign },
        ].map(({ label, value, iconBg, icon: Icon }) => (
          <div key={label} className="group rounded-2xl bg-white p-5 shadow-md shadow-slate-200/60 border border-gray-200/90 flex items-center justify-between hover:-translate-y-1.5 hover:shadow-xl hover:border-blue-400/60 transition-all duration-300 cursor-pointer">
            <div>
              <p className="text-xs font-medium text-gray-500">{label}</p>
              <p className="text-xl font-bold text-gray-900 mt-1">{value}</p>
            </div>
            <div className={`h-12 w-12 rounded-2xl ${iconBg} shadow-md flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
              <Icon className="h-6 w-6 stroke-[1.75]" />
            </div>
          </div>
        ))}
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
        <Input
          placeholder="Search contracts by # or vendor..."
          className="pl-8.5 border-gray-200 text-gray-900 placeholder:text-gray-400 text-xs h-8.5 rounded-lg"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Card className="border border-gray-200/90 bg-white shadow-md shadow-slate-200/60 rounded-2xl overflow-hidden">
        <CardHeader className="pb-2.5 border-b border-gray-100 bg-gray-50/50">
          <CardTitle className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Contracts Registry ({filtered.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60">
                  {["Contract #", "Vendor", "Terms & Scope", "Value", "Validity Period", "Status", "Actions"].map((h) => (
                    <th key={h} className="py-2.5 px-4 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3 px-4 font-mono font-semibold text-[#1e50c8]">{c.contractNumber}</td>
                    <td className="py-3 px-4 font-semibold text-gray-900">{c.vendorName}</td>
                    <td className="py-3 px-4 text-gray-700 font-medium max-w-[220px] truncate">{c.termsAndConditions || 'Standard Contract Terms'}</td>
                    <td className="py-3 px-4 font-semibold text-gray-900">{formatCurrency(c.contractValue ?? 0)} ETB</td>
                    <td className="py-3 px-4 text-gray-500 text-[11px]">
                      {c.startDate} to {c.endDate}
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={`${statusBadge('ACTIVE')} text-[10px] font-semibold`}>
                        ACTIVE
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-gray-600"><MoreVertical className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white border-gray-200 shadow-md rounded-lg">
                          <DropdownMenuLabel className="text-xs text-gray-600 font-medium">Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator className="bg-gray-100" />
                          <DropdownMenuItem className="text-xs text-gray-700 hover:bg-gray-50 cursor-pointer">
                            <Eye className="h-3.5 w-3.5 mr-2 text-[#1e50c8]" />View Contract Details
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && !isLoading && (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-gray-400 font-medium">
                      No contract records found in database.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
