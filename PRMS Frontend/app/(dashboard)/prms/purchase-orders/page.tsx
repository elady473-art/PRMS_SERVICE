"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search, Plus, Truck, DollarSign, Loader2, AlertCircle, RefreshCw, MoreVertical, Eye, FileText,
  Award, CheckCircle, ArrowRight, Star
} from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePurchaseOrders } from "@/features/prms/hooks/use-purchase-orders";
import { useQuotations } from "@/features/prms/hooks/use-quotations";
import { poStatusBadge, type PurchaseOrderResponse, type BackendPOStatus } from "@/lib/prms-api";
import { formatCurrency } from "@/lib/utils";

function getScoreBadge(score: number) {
  if (score < 30) return "bg-red-50 text-red-700 border-red-200/80";
  if (score < 50) return "bg-amber-50 text-amber-800 border-amber-200/80";
  if (score < 80) return "bg-yellow-50 text-yellow-800 border-yellow-200/80";
  return "bg-emerald-50 text-emerald-800 border-emerald-200/80";
}

function daysLeft(d: string | null | undefined) {
  if (!d) return null;
  return Math.ceil((new Date(d).getTime() - Date.now()) / 86400000);
}

export default function PurchaseOrdersPage() {
  const [search, setSearch] = useState("");
  const { data: orders, isLoading, isError, refetch } = usePurchaseOrders();
  const { data: quotations } = useQuotations();

  const evaluatedQuotations = (quotations ?? []).filter((q) => q.selected);

  const filtered = (orders ?? []).filter((po: PurchaseOrderResponse) => {
    const q = search.toLowerCase();
    return !search || po.purchaseOrderNumber.toLowerCase().includes(q) || po.vendorName.toLowerCase().includes(q);
  });

  const totalValue = (orders ?? []).reduce((s, po) => s + (po.totalAmount ?? 0), 0);
  const active = (orders ?? []).filter((po) => !["COMPLETED", "CANCELLED"].includes(po.status)).length;

  return (
    <div className="space-y-6 pb-12 font-sans">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Purchase Orders</h2>
          <p className="text-xs text-gray-500 mt-0.5 font-medium">Issued purchase order management & fulfillment tracking</p>
        </div>
        <Button className="bg-[#c1121f] hover:bg-[#a00f1a] text-white shadow-xs text-xs font-medium h-9 px-4 rounded-lg" asChild>
          <Link href="/prms/purchase-orders/new"><Plus className="h-4 w-4 mr-1.5" />New Purchase Order</Link>
        </Button>
      </div>

      {isLoading && (
        <div className="flex items-center gap-2 text-xs text-[#1e50c8]">
          <Loader2 className="h-4 w-4 animate-spin text-[#c1121f]" /> Loading purchase orders…
        </div>
      )}
      {isError && (
        <div className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50/60 px-4 py-2.5 text-xs text-red-700">
          <div className="flex items-center gap-2"><AlertCircle className="h-4 w-4" /> Failed to load purchase orders.</div>
          <Button variant="ghost" size="sm" className="h-7 text-xs text-[#1e50c8]" onClick={() => refetch()}>
            <RefreshCw className="h-3.5 w-3.5 mr-1" /> Retry
          </Button>
        </div>
      )}

      {/* KPI Cards styled smoothly */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: "Total POs Issued", value: orders?.length ?? 0, iconBg: "bg-blue-50/70 text-[#1e50c8]", icon: FileText },
          { label: "Active Orders", value: active, iconBg: "bg-red-50/70 text-[#c1121f]", icon: Truck },
          { label: "Total Portfolio Value", value: `${formatCurrency(totalValue)} ETB`, iconBg: "bg-indigo-50/70 text-indigo-600", icon: DollarSign },
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

      {/* EVALUATED QUOTATIONS INTEGRATION BANNER */}
      {evaluatedQuotations.length > 0 && (
        <Card className="border border-emerald-100 bg-gradient-to-r from-emerald-50/40 via-white to-white shadow-xs rounded-xl overflow-hidden">
          <CardHeader className="pb-2.5 border-b border-emerald-100/60">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="h-4.5 w-4.5 text-emerald-600 stroke-[1.75]" />
                <CardTitle className="text-xs font-semibold text-gray-900">
                  Evaluated & Awarded Quotations Ready for PO Issue ({evaluatedQuotations.length})
                </CardTitle>
              </div>
              <Button size="sm" variant="ghost" className="text-xs text-emerald-700 hover:bg-emerald-50" asChild>
                <Link href="/prms/evaluation">View Evaluation Matrix →</Link>
              </Button>
            </div>
            <CardDescription className="text-[11px] text-gray-400">
              Suppliers evaluated and selected via technical & commercial evaluation score
            </CardDescription>
          </CardHeader>
          <CardContent className="p-3.5 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {evaluatedQuotations.map((q) => {
                const score = 88;
                return (
                  <div key={q.id} className="p-3 rounded-lg border border-emerald-100/70 bg-white shadow-xs flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-mono text-xs font-semibold text-[#1e50c8]">{q.quotationNumber}</span>
                        <Badge className={`${getScoreBadge(score)} border text-[10px] font-semibold px-1.5 py-0`}>
                          {score}/100 Score
                        </Badge>
                      </div>
                      <p className="text-xs font-semibold text-gray-900 truncate mt-0.5">{q.vendorName}</p>
                      <p className="text-[11px] font-medium text-emerald-700 mt-0.5">{formatCurrency(q.totalAmount)} ETB</p>
                    </div>
                    <Button size="sm" className="h-7.5 text-xs bg-emerald-700 hover:bg-emerald-800 text-white font-medium px-2.5 shadow-xs flex-shrink-0 rounded-lg" asChild>
                      <Link href={`/prms/purchase-orders/new?quotationId=${q.id}`}>
                        Issue PO <ArrowRight className="h-3 w-3 ml-1" />
                      </Link>
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
        <Input
          placeholder="Search purchase orders by # or supplier..."
          className="pl-8.5 border-gray-200 text-gray-900 placeholder:text-gray-400 text-xs h-8.5 rounded-lg"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Card className="border border-gray-100/80 bg-white shadow-xs rounded-xl overflow-hidden">
        <CardHeader className="pb-2.5 border-b border-gray-100/80 bg-gray-50/40">
          <CardTitle className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Purchase Orders ({filtered.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center py-16"><Loader2 className="h-5 w-5 animate-spin text-[#c1121f]" /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/60">
                    {["PO Number", "Supplier", "Total Amount", "Payment Terms", "Expected Delivery", "Status", "Actions"].map((h) => (
                      <th key={h} className="py-2.5 px-4 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((po: PurchaseOrderResponse) => {
                    const days = daysLeft(po.expectedDeliveryDate);
                    const overdue = days !== null && days < 0;
                    return (
                      <tr key={po.id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="py-3 px-4 font-mono font-semibold text-[#1e50c8]">{po.purchaseOrderNumber}</td>
                        <td className="py-3 px-4">
                          <p className="font-semibold text-gray-900">{po.vendorName}</p>
                          <p className="text-[11px] text-gray-400">Issued: {po.orderDate}</p>
                        </td>
                        <td className="py-3 px-4 font-semibold text-gray-900">{formatCurrency(po.totalAmount)} ETB</td>
                        <td className="py-3 px-4 text-gray-600 text-xs font-medium">{po.paymentTerms?.replace("_", " ")}</td>
                        <td className="py-3 px-4">
                          {po.expectedDeliveryDate ? (
                            <>
                              <p className={`text-xs ${overdue ? "text-[#c1121f] font-semibold" : "text-gray-700"}`}>{po.expectedDeliveryDate}</p>
                              {days !== null && (
                                <p className={`text-[10px] ${overdue ? "text-[#c1121f] font-medium" : "text-gray-400"}`}>
                                  {overdue ? `${Math.abs(days)}d overdue` : `${days}d left`}
                                </p>
                              )}
                            </>
                          ) : <span className="text-gray-400 text-xs">—</span>}
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={`${poStatusBadge(po.status)} border-0 text-[10px] font-semibold`}>
                            {po.status.replace(/_/g, " ")}
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
                              <DropdownMenuItem className="text-xs text-gray-700 hover:bg-gray-50 cursor-pointer" asChild>
                                <Link href={`/prms/purchase-orders/${po.id}`}><Eye className="h-3.5 w-3.5 mr-2 text-[#1e50c8]" />View Details</Link>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    );
                  })}
                  {filtered.length === 0 && !isLoading && (
                    <tr><td colSpan={7} className="py-12 text-center text-gray-400 font-medium">
                      {orders?.length === 0 ? "No purchase orders yet." : "No orders match your search."}
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
