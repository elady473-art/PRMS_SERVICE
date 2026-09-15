"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search, Plus, FileText, Clock, CheckCircle, Star,
  Loader2, AlertCircle, RefreshCw, Eye, Award, DollarSign
} from "lucide-react";
import { useQuotations, useSelectQuotation } from "@/features/prms/hooks/use-quotations";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function QuotationsPage() {
  const [search, setSearch] = useState("");
  const { data: quotations, isLoading, isError, refetch } = useQuotations();
  const selectQuotation = useSelectQuotation();

  const filtered = (quotations ?? []).filter((q) => {
    const s = search.toLowerCase();
    return !search || q.quotationNumber.toLowerCase().includes(s) || q.vendorName.toLowerCase().includes(s);
  });

  const stats = {
    total: quotations?.length ?? 0,
    selected: quotations?.filter((q) => q.selected).length ?? 0,
    totalValue: quotations?.reduce((sum, q) => sum + (q.totalAmount ?? 0), 0) ?? 0,
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Supplier Quotations</h2>
          <p className="text-xs text-gray-500 mt-0.5 font-medium">Bids & formal quotations received from registered vendors</p>
        </div>
        <Button className="bg-[#c1121f] hover:bg-[#a00f1a] text-white shadow-xs text-xs font-medium h-9 px-4 rounded-lg" asChild>
          <Link href="/prms/quotations/new"><Plus className="h-4 w-4 mr-1.5" />New Quotation</Link>
        </Button>
      </div>

      {isLoading && (
        <div className="flex items-center gap-2 text-xs text-[#1e50c8]">
          <Loader2 className="h-4 w-4 animate-spin text-[#c1121f]" /> Loading quotations from server…
        </div>
      )}
      {isError && (
        <div className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50/60 px-4 py-2.5 text-xs text-red-700">
          <div className="flex items-center gap-2"><AlertCircle className="h-4 w-4" /> Failed to load quotations.</div>
          <Button variant="ghost" size="sm" className="h-7 text-xs text-[#1e50c8]" onClick={() => refetch()}>
            <RefreshCw className="h-3.5 w-3.5 mr-1" /> Retry
          </Button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: "Total Quotations Submitted", value: stats.total, iconBg: "bg-blue-50/70 text-[#1e50c8]", icon: FileText },
          { label: "Selected for Award", value: stats.selected, iconBg: "bg-emerald-50/70 text-emerald-600", icon: CheckCircle },
          { label: "Total Bid Value", value: `${formatCurrency(stats.totalValue)} ETB`, iconBg: "bg-indigo-50/70 text-indigo-600", icon: DollarSign },
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
          placeholder="Search by quote # or supplier name..."
          className="pl-8.5 border-gray-200 text-gray-900 placeholder:text-gray-400 text-xs h-8.5 rounded-lg"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Card className="border border-gray-100/80 bg-white shadow-xs rounded-xl overflow-hidden">
        <CardHeader className="pb-2.5 border-b border-gray-100/80 bg-gray-50/40">
          <CardTitle className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Quotations ({filtered.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center py-16"><Loader2 className="h-5 w-5 animate-spin text-[#c1121f]" /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/60">
                    {["Quotation #", "RFQ #", "Supplier", "Amount", "Valid Until", "Award Status", "Actions"].map((h) => (
                      <th key={h} className="py-2.5 px-4 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((q) => (
                    <tr key={q.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-3 px-4 font-mono font-semibold text-[#1e50c8]">{q.quotationNumber}</td>
                      <td className="py-3 px-4 font-mono text-gray-600 text-xs">{q.rfqNumber || `RFQ-${q.rfqId}`}</td>
                      <td className="py-3 px-4">
                        <p className="font-semibold text-gray-900">{q.vendorName}</p>
                        <p className="text-[11px] text-gray-400">{formatDate(q.quotationDate)}</p>
                      </td>
                      <td className="py-3 px-4 font-semibold text-gray-900">{formatCurrency(q.totalAmount)} ETB</td>
                      <td className="py-3 px-4 text-xs text-gray-600">{q.validUntil}</td>
                      <td className="py-3 px-4">
                        <Badge className={`border-0 text-[10px] font-semibold ${q.selected ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                          {q.selected ? "AWARDED" : "PENDING REVIEW"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <Button size="sm" variant="ghost" className="h-7 px-2 text-[#1e50c8] hover:bg-blue-50 text-[11px] font-medium" asChild>
                            <Link href={`/prms/quotations/${q.id}`}><Eye className="h-3 w-3 mr-1" /> View</Link>
                          </Button>
                          {!q.selected && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 px-2 text-[#c1121f] hover:bg-red-50 text-[11px] font-medium"
                              onClick={() => selectQuotation.mutate(q.id)}
                              disabled={selectQuotation.isPending}
                              title="Award quotation"
                            >
                              <Award className="h-3 w-3 mr-1" /> Award
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && !isLoading && (
                    <tr><td colSpan={7} className="py-12 text-center text-gray-400 font-medium">
                      {quotations?.length === 0 ? "No quotations recorded yet." : "No quotations match your search."}
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
