"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search, CheckCircle, XCircle, MessageSquare, ExternalLink,
  Loader2, AlertCircle, RefreshCw, Clock, DollarSign, CheckSquare
} from "lucide-react";
import { usePendingApprovals, useDecideOnRequisition } from "@/features/prms/hooks/use-approvals";
import { prStatusBadge, prStatusLabel, type RequisitionResponse } from "@/lib/prms-api";
import { formatCurrency } from "@/lib/utils";

export default function ApprovalsPage() {
  const [search, setSearch] = useState("");
  const { data: pending, isLoading, isError, refetch } = usePendingApprovals();
  const decide = useDecideOnRequisition();

  const filtered = (pending ?? []).filter((r) => {
    const q = search.toLowerCase();
    return (
      !search ||
      r.purpose.toLowerCase().includes(q) ||
      r.requisitionNumber.toLowerCase().includes(q) ||
      r.requesterEmployeeId.toLowerCase().includes(q)
    );
  });

  const totalValue = (pending ?? []).reduce((s, r) => s + (r.estimatedAmount ?? 0), 0);

  return (
    <div className="space-y-6 pb-12 font-sans">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Approval Center</h2>
          <p className="text-xs text-gray-500 mt-0.5 font-medium">Requisitions awaiting executive & procurement approval</p>
        </div>
        <Button variant="outline" className="border-gray-200 text-[#1e50c8] h-8.5 text-xs font-medium rounded-lg" onClick={() => refetch()}>
          <RefreshCw className="h-3.5 w-3.5 mr-1.5 text-gray-400" />Refresh Queue
        </Button>
      </div>

      {isLoading && (
        <div className="flex items-center gap-2 text-xs text-[#1e50c8]">
          <Loader2 className="h-4 w-4 animate-spin text-[#c1121f]" /> Loading pending approvals…
        </div>
      )}
      {isError && (
        <div className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50/60 px-4 py-2.5 text-xs text-red-700">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Failed to load approvals. Ensure you are logged in with the PROCUREMENT_ADMIN role.
          </div>
          <Button variant="ghost" size="sm" className="h-7 text-xs text-[#1e50c8]" onClick={() => refetch()}>
            <RefreshCw className="h-3.5 w-3.5 mr-1" />Retry
          </Button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Pending Approvals", value: pending?.length ?? 0, icon: Clock, iconBg: "bg-amber-50/70 text-amber-600" },
          { label: "Pending Portfolio Value", value: `${formatCurrency(totalValue)} ETB`, icon: DollarSign, iconBg: "bg-blue-50/70 text-[#1e50c8]" },
          { label: "Filtered Requests", value: filtered.length, icon: CheckSquare, iconBg: "bg-indigo-50/70 text-indigo-600" },
        ].map(({ label, value, icon: Icon, iconBg }) => (
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
          placeholder="Search by PR #, purpose, or employee ID…"
          className="pl-8.5 border-gray-200 text-gray-900 placeholder:text-gray-400 text-xs h-8.5 rounded-lg"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-5 w-5 animate-spin text-[#c1121f]" />
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((req: RequisitionResponse) => (
            <Card key={req.id} className="border border-gray-100/80 bg-white hover:border-gray-200 hover:shadow-xs transition-all rounded-xl overflow-hidden">
              <CardContent className="p-0">
                <div className="flex items-stretch">
                  <div className="w-1 flex-shrink-0 bg-amber-400" />
                  <div className="flex-1 p-4.5">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-mono text-xs font-semibold text-[#1e50c8]">{req.requisitionNumber}</span>
                          <Badge className={`${prStatusBadge(req.status)} border-0 text-[10px] font-medium`}>
                            {prStatusLabel(req.status)}
                          </Badge>
                        </div>
                        <p className="font-semibold text-gray-900 text-xs">{req.purpose}</p>
                        <div className="flex items-center gap-4 mt-1 text-[11px] text-gray-500 flex-wrap">
                          <span>Requester: <strong className="text-gray-700 font-semibold">{req.requesterEmployeeId}</strong></span>
                          <span>Dept: <strong className="text-gray-700 font-semibold">{req.departmentCode}</strong></span>
                          <span>Required by: <strong>{req.requiredByDate}</strong></span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-base font-bold text-gray-900">{formatCurrency(req.estimatedAmount ?? 0)} ETB</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-3.5 pt-3 border-t border-gray-100">
                      <Button
                        size="sm"
                        className="h-7.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium px-3.5 shadow-xs rounded-lg"
                        onClick={() => decide.mutate({ requisitionId: req.id, action: "APPROVE" })}
                        disabled={decide.isPending}
                      >
                        <CheckCircle className="h-3.5 w-3.5 mr-1" />Approve PR
                      </Button>
                      <Button
                        size="sm"
                        className="h-7.5 bg-[#c1121f] hover:bg-[#a00f1a] text-white text-xs font-medium px-3.5 shadow-xs rounded-lg"
                        onClick={() => decide.mutate({ requisitionId: req.id, action: "REJECT", comments: "Rejected via approval center" })}
                        disabled={decide.isPending}
                      >
                        <XCircle className="h-3.5 w-3.5 mr-1" />Reject
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7.5 border-gray-200 text-gray-700 text-xs font-medium rounded-lg"
                        onClick={() => decide.mutate({ requisitionId: req.id, action: "RETURN", comments: "Changes requested" })}
                        disabled={decide.isPending}
                      >
                        <MessageSquare className="h-3.5 w-3.5 mr-1" />Return
                      </Button>
                      <Button size="sm" variant="ghost" className="h-7.5 text-[#1e50c8] text-xs font-medium hover:bg-blue-50/50 rounded-lg" asChild>
                        <Link href={`/prms/purchase-requests/${req.id}`}>
                          <ExternalLink className="h-3.5 w-3.5 mr-1" />Details
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filtered.length === 0 && !isLoading && (
            <Card className="border border-gray-100/80 bg-white shadow-xs rounded-xl">
              <CardContent className="py-12 text-center text-gray-400 font-medium text-xs">
                {pending?.length === 0
                  ? "No requisitions pending approval."
                  : "No results match your search."}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
