"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search, Plus, Clock, DollarSign, Loader2, AlertCircle, RefreshCw,
  MoreVertical, Eye, FileSearch, CheckCircle
} from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRFQs } from "@/features/prms/hooks/use-rfq";
import type { RFQResponse } from "@/lib/prms-api";
import { formatDate } from "@/lib/utils";

function daysLeft(d: string) {
  return Math.ceil((new Date(d).getTime() - Date.now()) / 86400000);
}

export default function RFQPage() {
  const [search, setSearch] = useState("");
  const { data: rfqs, isLoading, isError, refetch } = useRFQs();

  const filtered = (rfqs ?? []).filter((r: RFQResponse) => {
    const q = search.toLowerCase();
    return !search || r.title.toLowerCase().includes(q) || r.rfqNumber.toLowerCase().includes(q);
  });

  const open = rfqs?.filter((r) => r.active).length ?? 0;

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Request for Quotation (RFQ)</h2>
          <p className="text-sm text-gray-500 mt-0.5 font-medium font-sans">Formal quotation solicitations & vendor bidding management</p>
        </div>
        <Button className="bg-[#c1121f] hover:bg-[#a00f1a] text-white shadow-sm text-xs font-semibold h-10 px-4" asChild>
          <Link href="/prms/rfq/new"><Plus className="h-4 w-4 mr-2" />New RFQ</Link>
        </Button>
      </div>

      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-[#1e50c8]">
          <Loader2 className="h-4 w-4 animate-spin text-[#c1121f]" /> Loading RFQs…
        </div>
      )}
      {isError && (
        <div className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
          <div className="flex items-center gap-2"><AlertCircle className="h-4 w-4" /> Failed to load RFQs.</div>
          <Button variant="ghost" size="sm" className="h-7 text-xs text-[#1e50c8]" onClick={() => refetch()}>
            <RefreshCw className="h-3.5 w-3.5 mr-1" /> Retry
          </Button>
        </div>
      )}

      {/* KPI Cards styled with Soft Pastels */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: "Total RFQs Issued", value: rfqs?.length ?? 0, iconBg: "bg-blue-50 text-[#1e50c8]", icon: FileSearch },
          { label: "Active Solicitations", value: open, iconBg: "bg-red-50 text-[#c1121f]", icon: Clock },
          { label: "Filtered Results", value: filtered.length, iconBg: "bg-[#1e50c8]/10 text-[#1e50c8]", icon: CheckCircle },
        ].map(({ label, value, iconBg, icon: Icon }) => (
          <Card key={label} className="border border-gray-100 bg-white shadow-sm rounded-2xl">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">{label}</p>
                <p className="text-xl font-bold text-gray-900 mt-1">{value}</p>
              </div>
              <div className={`h-11 w-11 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
                <Icon className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <Input
          placeholder="Search RFQs by title or number…"
          className="pl-9 border-gray-300 text-gray-900 placeholder:text-gray-400 text-xs h-9 rounded-lg"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Card className="border border-gray-100 bg-white shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="pb-3 border-b border-gray-100 bg-gray-50/50">
          <CardTitle className="text-xs font-bold text-gray-700 uppercase tracking-wider">RFQs ({filtered.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-[#c1121f]" /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/80">
                    {["RFQ Number", "Title", "Requisition Reference", "Deadline", "Status", "Actions"].map((h) => (
                      <th key={h} className="py-3 px-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((rfq: RFQResponse) => {
                    const days = daysLeft(rfq.submissionDeadline);
                    const overdue = days < 0;
                    return (
                      <tr key={rfq.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-[#1e50c8]">{rfq.rfqNumber}</td>
                        <td className="py-3 px-4">
                          <p className="font-bold text-gray-900">{rfq.title}</p>
                          <p className="text-[11px] text-gray-400">Created: {formatDate(rfq.createdAt)}</p>
                        </td>
                        <td className="py-3 px-4 font-mono text-xs text-gray-600">{rfq.requisitionNumber ?? `PR #${rfq.purchaseRequisitionId}`}</td>
                        <td className="py-3 px-4">
                          <p className={`text-xs ${overdue ? "text-[#c1121f] font-bold" : "text-gray-800"}`}>{rfq.submissionDeadline}</p>
                          <p className={`text-[10px] ${overdue ? "text-[#c1121f] font-bold" : "text-gray-400"}`}>
                            {overdue ? `${Math.abs(days)}d overdue` : `${days}d left`}
                          </p>
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={`border-0 text-[10px] font-bold ${rfq.active ? "bg-blue-50 text-[#1e50c8]" : "bg-gray-100 text-gray-500"}`}>
                            {rfq.active ? "ACTIVE SOLICITATION" : "CLOSED"}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-gray-700"><MoreVertical className="h-4 w-4" /></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-white border-gray-200 shadow-lg rounded-xl">
                              <DropdownMenuLabel className="text-xs text-gray-700">Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator className="bg-gray-100" />
                              <DropdownMenuItem className="text-xs text-gray-700 hover:bg-gray-50 cursor-pointer"><Eye className="h-3.5 w-3.5 mr-2 text-[#1e50c8]" />View RFQ</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    );
                  })}
                  {filtered.length === 0 && !isLoading && (
                    <tr><td colSpan={6} className="py-16 text-center text-gray-400 font-medium">
                      {rfqs?.length === 0 ? "No RFQs yet. Create the first one." : "No RFQs match your search."}
                    </td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
