"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Search, Package, CheckCircle, Clock,
  Loader2, AlertCircle, RefreshCw, Eye, Radio, Server
} from "lucide-react";
import { useGoodsReceipts } from "@/features/prms/hooks/use-goods-receipts";
import type { GoodsReceiptResponse } from "@/lib/prms-api";

export default function GoodsReceiptPage() {
  const [search, setSearch] = useState("");
  const { data: receipts, isLoading, isError, refetch } = useGoodsReceipts();

  const filtered = (receipts ?? []).filter((r: GoodsReceiptResponse) => {
    const q = search.toLowerCase();
    return (
      !search ||
      r.receiptNumber.toLowerCase().includes(q) ||
      r.vendorName.toLowerCase().includes(q) ||
      r.purchaseOrderNumber.toLowerCase().includes(q)
    );
  });

  const accepted = receipts?.filter((r) => r.accepted).length ?? 0;
  const pending = receipts?.filter((r) => !r.accepted).length ?? 0;

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Goods Receipt Notes (MMS Synced)</h2>
          <p className="text-sm text-gray-500 mt-0.5 font-medium">Automatic goods inspection and receipt feed from MMS via RabbitMQ</p>
        </div>
        <Button variant="outline" className="border-gray-300 text-gray-700 h-9 text-xs" onClick={() => refetch()}>
          <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> Refresh MMS Stream
        </Button>
      </div>

      {/* MMS RabbitMQ Streaming Notice Banner */}
      <Card className="border border-indigo-100 bg-gradient-to-r from-indigo-50/80 via-white to-slate-50 shadow-sm rounded-2xl">
        <CardContent className="p-4 flex items-start gap-3.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white flex-shrink-0 mt-0.5">
            <Radio className="h-5 w-5 animate-pulse" />
          </div>
          <div className="space-y-0.5">
            <h4 className="text-xs font-bold text-indigo-950 uppercase tracking-wider flex items-center gap-2">
              Automated MMS Event Integration Active <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            </h4>
            <p className="text-xs text-indigo-800 leading-relaxed">
              Goods receipts are generated automatically when the Material Management System (MMS) receives physical shipments and dispatches events via RabbitMQ messaging queue. Manual receipt creation is disabled.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="border border-gray-100 bg-white shadow-sm rounded-2xl">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500">Total MMS Receipts</p>
              <p className="text-2xl font-black text-gray-900 mt-1">{receipts?.length ?? 0}</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Package className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-100 bg-white shadow-sm rounded-2xl">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500">Inspected & Accepted</p>
              <p className="text-2xl font-black text-green-600 mt-1">{accepted}</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
              <CheckCircle className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-100 bg-white shadow-sm rounded-2xl">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500">Pending Warehouse Inspection</p>
              <p className="text-2xl font-black text-amber-600 mt-1">{pending}</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <Input
          placeholder="Search GRNs by number, PO#, or supplier..."
          className="pl-9 border-gray-300 text-gray-900 placeholder:text-gray-400 h-9 text-xs rounded-lg"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <Card className="border border-gray-100 bg-white shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="pb-3 border-b border-gray-100 bg-gray-50/50">
          <CardTitle className="text-xs font-bold text-gray-700 uppercase tracking-wider">
            Received Stream Records ({filtered.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center py-16 text-xs text-gray-500 gap-2 items-center">
              <Loader2 className="h-5 w-5 animate-spin text-[#c1121f]" /> Fetching goods receipts from PostgreSQL...
            </div>
          ) : isError ? (
            <div className="p-6 text-center text-xs text-red-600">Failed to connect to database or RabbitMQ queue feed.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/80">
                    {["GRN Number", "PO Number", "Supplier", "Receipt Date", "Received By", "Inspection Status", "Actions"].map((h) => (
                      <th key={h} className="py-3 px-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((r: GoodsReceiptResponse) => (
                    <tr key={r.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono text-xs font-bold text-[#1e50c8]">{r.receiptNumber}</td>
                      <td className="py-3 px-4 font-mono text-xs text-green-700 font-semibold">{r.purchaseOrderNumber}</td>
                      <td className="py-3 px-4 font-semibold text-gray-900 text-xs">{r.vendorName}</td>
                      <td className="py-3 px-4 text-gray-600 text-xs">{r.receiptDate}</td>
                      <td className="py-3 px-4 text-gray-600 text-xs">{r.receivedByEmployeeId || "System MMS Consumer"}</td>
                      <td className="py-3 px-4">
                        <Badge className={`border-0 text-xs font-semibold ${r.accepted ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                          {r.accepted ? "ACCEPTED" : "PENDING INSPECTION"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Button size="sm" variant="ghost" className="h-7 w-7 text-[#1e50c8] hover:bg-blue-50 p-0">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && !isLoading && (
                    <tr>
                      <td colSpan={7} className="py-16 text-center text-xs text-gray-400">
                        {receipts?.length === 0 ? "No goods receipt events published from MMS yet." : "No receipts match your search filter."}
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
