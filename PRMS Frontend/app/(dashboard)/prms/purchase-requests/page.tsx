"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Search, Plus, MoreVertical, Eye, FileText, CheckCircle,
  Clock, XCircle, DollarSign, ArrowUpRight, Loader2, AlertCircle, RefreshCw, User,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/features/auth/contexts/auth-context";
import { useRequisitionsByRequester, useSubmitRequisition } from "@/features/prms/hooks/use-requisitions";
import { prStatusBadge, prStatusLabel, type BackendPRStatus } from "@/lib/prms-api";
import { formatCurrency } from "@/lib/utils";

export default function PurchaseRequestsPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const employeeId = user?.username ?? "procurement_admin";
  const { data: requisitions, isLoading, isError, refetch } = useRequisitionsByRequester(employeeId);
  const submitRequisition = useSubmitRequisition();

  const filtered = (requisitions ?? []).filter((r) => {
    const q = search.toLowerCase();
    const matchSearch =
      !search ||
      r.purpose.toLowerCase().includes(q) ||
      r.requisitionNumber.toLowerCase().includes(q) ||
      r.requesterEmployeeId.toLowerCase().includes(q);
    const matchStatus = statusFilter === "all" || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: requisitions?.length ?? 0,
    pending: requisitions?.filter((r) => r.status === "PENDING_APPROVAL").length ?? 0,
    approved: requisitions?.filter((r) => r.status === "APPROVED").length ?? 0,
    totalAmt: requisitions?.reduce((s, r) => s + (r.estimatedAmount ?? 0), 0) ?? 0,
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Purchase Requests</h2>
          <p className="text-xs text-gray-500 mt-0.5 font-medium">Requisition submission & approval tracking portal</p>
        </div>
        <Button className="bg-[#c1121f] hover:bg-[#a00f1a] text-white shadow-xs text-xs font-medium h-9 px-4 rounded-lg" asChild>
          <Link href="/prms/purchase-requests/new">
            <Plus className="h-4 w-4 mr-1.5" />New Purchase Request
          </Link>
        </Button>
      </div>

      {isLoading && (
        <div className="flex items-center gap-2 text-xs text-[#1e50c8]">
          <Loader2 className="h-4 w-4 animate-spin text-[#c1121f]" />
          Loading requisitions from backend…
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "Total Requisitions", value: stats.total, icon: FileText, iconBg: "bg-blue-50/70 text-[#1e50c8]" },
          { label: "Pending Approval", value: stats.pending, icon: Clock, iconBg: "bg-amber-50/70 text-amber-600" },
          { label: "Approved PRs", value: stats.approved, icon: CheckCircle, iconBg: "bg-emerald-50/70 text-emerald-600" },
          { label: "Total Budget", value: `${formatCurrency(stats.totalAmt)} ETB`, icon: DollarSign, iconBg: "bg-indigo-50/70 text-indigo-600" },
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

      <Card className="border border-gray-100/80 bg-white shadow-xs rounded-xl">
        <CardContent className="p-3.5 flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
            <Input
              placeholder="Search by number, title, or requester…"
              className="pl-8.5 border-gray-200 text-gray-900 placeholder:text-gray-400 text-xs h-8.5 rounded-lg"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40 border-gray-200 text-gray-900 text-xs h-8.5 rounded-lg"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent className="bg-white border-gray-200">
              {["all", "DRAFT", "PENDING_APPROVAL", "APPROVED", "REJECTED", "PO_CREATED"].map((v) => (
                <SelectItem key={v} value={v}>{v === "all" ? "All Status" : prStatusLabel(v as BackendPRStatus)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card className="border border-gray-100/80 bg-white shadow-xs rounded-xl overflow-hidden">
        <CardHeader className="pb-2.5 border-b border-gray-100/80 bg-gray-50/40">
          <CardTitle className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Purchase Requests ({filtered.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-5 w-5 animate-spin text-[#c1121f]" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/60">
                    {["PR Number", "Purpose", "Department", "Required By", "Amount", "Status", "Actions"].map((h) => (
                      <th key={h} className="py-2.5 px-4 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-mono text-xs font-semibold text-[#1e50c8]">{r.requisitionNumber}</span>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-semibold text-gray-900 max-w-[200px] truncate">{r.purpose}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5 flex items-center gap-1">
                          <User className="h-3 w-3" />{r.requesterEmployeeId}
                        </p>
                      </td>
                      <td className="py-3 px-4 text-gray-600 font-medium">{r.departmentCode}</td>
                      <td className="py-3 px-4 text-gray-600 text-xs">{r.requiredByDate}</td>
                      <td className="py-3 px-4 font-semibold text-gray-900">{formatCurrency(r.estimatedAmount ?? 0)} ETB</td>
                      <td className="py-3 px-4">
                        <Badge className={`${prStatusBadge(r.status)} border-0 text-[10px] font-medium`}>
                          {prStatusLabel(r.status)}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-gray-600">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-white border-gray-200 shadow-md rounded-lg">
                            <DropdownMenuLabel className="text-gray-600 text-xs font-medium">Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-gray-100" />
                            <DropdownMenuItem className="text-xs text-gray-700 hover:bg-gray-50 cursor-pointer" asChild>
                              <Link href={`/prms/purchase-requests/${r.id}`}>
                                <Eye className="h-3.5 w-3.5 mr-2 text-[#1e50c8]" />View Details
                              </Link>
                            </DropdownMenuItem>
                            {r.status === "DRAFT" && (
                              <DropdownMenuItem
                                className="text-xs text-[#c1121f] hover:bg-red-50 cursor-pointer font-medium"
                                disabled={submitRequisition.isPending}
                                onClick={() => submitRequisition.mutate(r.id)}
                              >
                                <ArrowUpRight className="h-3.5 w-3.5 mr-2" />
                                {submitRequisition.isPending ? "Submitting…" : "Submit for Approval"}
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && !isLoading && (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-gray-400 font-medium">
                        {requisitions?.length === 0
                          ? "No purchase requests yet. Create your first one."
                          : "No requests match your filter."}
                      </td>
                    </tr>
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
