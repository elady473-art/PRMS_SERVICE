"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import {
  Search, CreditCard, Clock, CheckCircle, DollarSign,
  Loader2, AlertCircle, RefreshCw, Eye, Download, Plus, Send
} from "lucide-react";
import { useInvoices, useSubmitInvoice } from "@/features/prms/hooks/use-invoices";
import { usePurchaseOrders } from "@/features/prms/hooks/use-purchase-orders";
import { useVendors } from "@/features/prms/hooks/use-vendors";
import { useToast } from "@/hooks/use-toast";
import type { InvoiceResponse } from "@/lib/prms-api";
import { formatCurrency } from "@/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700",
  SUBMITTED_TO_FMS: "bg-blue-50 text-[#1e50c8]",
  PAID: "bg-emerald-50 text-emerald-700",
  OVERDUE: "bg-red-50 text-[#c1121f]",
};

export default function InvoicesPage() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);

  const { data: invoices, isLoading, isError, refetch } = useInvoices();
  const { data: purchaseOrders } = usePurchaseOrders();
  const { data: vendors } = useVendors();
  const submitInvoice = useSubmitInvoice();

  // Invoice Form State
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [purchaseOrderId, setPurchaseOrderId] = useState("");
  const [vendorId, setVendorId] = useState("");
  const [invoiceAmount, setInvoiceAmount] = useState<number>(0);
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split("T")[0]);
  const [dueDate, setDueDate] = useState("");
  const [itemDetails, setItemDetails] = useState("");

  const handlePoChange = (poId: string) => {
    setPurchaseOrderId(poId);
    const po = purchaseOrders?.find((p) => String(p.id) === poId);
    if (po) {
      if (po.vendorId) setVendorId(String(po.vendorId));
      if (po.totalAmount) setInvoiceAmount(po.totalAmount);
      if (po.itemDetails) setItemDetails(po.itemDetails);
    }
  };

  const handleSubmitNewInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoiceNumber.trim()) {
      toast({ title: "Validation Error", description: "Please enter invoice number.", variant: "destructive" });
      return;
    }
    if (!purchaseOrderId) {
      toast({ title: "Validation Error", description: "Please select a purchase order.", variant: "destructive" });
      return;
    }
    if (!vendorId) {
      toast({ title: "Validation Error", description: "Please select a vendor.", variant: "destructive" });
      return;
    }
    if (invoiceAmount <= 0) {
      toast({ title: "Validation Error", description: "Invoice amount must be greater than 0.", variant: "destructive" });
      return;
    }
    if (!dueDate) {
      toast({ title: "Validation Error", description: "Please select due date.", variant: "destructive" });
      return;
    }

    try {
      await submitInvoice.mutateAsync({
        invoiceNumber: invoiceNumber.trim(),
        purchaseOrderId: Number(purchaseOrderId),
        vendorId: Number(vendorId),
        invoiceAmount,
        invoiceDate,
        dueDate,
        itemDetails: itemDetails.trim() || undefined,
      });
      setOpenModal(false);
      setInvoiceNumber("");
      setPurchaseOrderId("");
      setVendorId("");
      setInvoiceAmount(0);
      setItemDetails("");
    } catch (err) {
      // Toast handled by mutation hook
    }
  };

  const filtered = (invoices ?? []).filter((inv: InvoiceResponse) => {
    const q = search.toLowerCase();
    return (
      !search ||
      inv.invoiceNumber.toLowerCase().includes(q) ||
      inv.vendorName.toLowerCase().includes(q) ||
      inv.purchaseOrderNumber.toLowerCase().includes(q)
    );
  });

  const stats = {
    total: invoices?.length ?? 0,
    pending: invoices?.filter((i) => i.processingStatus === "PENDING").length ?? 0,
    paid: invoices?.filter((i) => i.processingStatus === "PAID").length ?? 0,
    totalAmt: invoices?.reduce((s, i) => s + (i.invoiceAmount ?? 0), 0) ?? 0,
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Invoice Management</h2>
          <p className="text-sm text-gray-500 mt-0.5 font-medium">Supplier invoices & FMS payment processing pipeline</p>
        </div>
        <Button
          className="bg-[#c1121f] hover:bg-[#a00f1a] text-white shadow-sm text-xs font-semibold h-10 px-4"
          onClick={() => setOpenModal(true)}
        >
          <Plus className="h-4 w-4 mr-2" /> Submit New Invoice
        </Button>
      </div>

      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-[#1e50c8]">
          <Loader2 className="h-4 w-4 animate-spin text-[#c1121f]" /> Loading invoices from server...
        </div>
      )}
      {isError && (
        <div className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
          <div className="flex items-center gap-2"><AlertCircle className="h-4 w-4" /> Failed to load invoices.</div>
          <Button variant="ghost" size="sm" className="h-7 text-xs text-[#1e50c8]" onClick={() => refetch()}>
            <RefreshCw className="h-3.5 w-3.5 mr-1" /> Retry
          </Button>
        </div>
      )}

      {/* KPI Cards styled with Soft Pastels */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "Total Invoices", value: stats.total, iconBg: "bg-blue-50 text-[#1e50c8]", icon: CreditCard },
          { label: "Pending Processing", value: stats.pending, iconBg: "bg-[#c1121f]/10 text-[#c1121f]", icon: Clock },
          { label: "Paid Invoices", value: stats.paid, iconBg: "bg-emerald-50 text-emerald-600", icon: CheckCircle },
          { label: "Total Invoice Portfolio", value: `${formatCurrency(stats.totalAmt)} ETB`, iconBg: "bg-[#1e50c8]/10 text-[#1e50c8]", icon: DollarSign },
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
          placeholder="Search by invoice #, vendor, or PO #..."
          className="pl-9 border-gray-300 text-gray-900 placeholder:text-gray-400 text-xs h-9 rounded-lg"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Card className="border border-gray-100 bg-white shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="pb-3 border-b border-gray-100 bg-gray-50/50">
          <CardTitle className="text-xs font-bold text-gray-700 uppercase tracking-wider">Invoices ({filtered.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-[#c1121f]" /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/80">
                    {["Invoice Number", "Vendor", "PO Number", "Amount", "Invoice Date", "Due Date", "Status", "Actions"].map((h) => (
                      <th key={h} className="py-3 px-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((inv: InvoiceResponse) => (
                    <tr key={inv.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-[#1e50c8]">{inv.invoiceNumber}</td>
                      <td className="py-3 px-4 font-bold text-gray-900">{inv.vendorName}</td>
                      <td className="py-3 px-4 font-mono text-emerald-700 font-semibold">{inv.purchaseOrderNumber}</td>
                      <td className="py-3 px-4 font-bold text-gray-900">{formatCurrency(inv.invoiceAmount)} ETB</td>
                      <td className="py-3 px-4 text-gray-700">{inv.invoiceDate}</td>
                      <td className="py-3 px-4 text-gray-700">{inv.dueDate}</td>
                      <td className="py-3 px-4">
                        <Badge className={`${STATUS_STYLES[inv.processingStatus] ?? "bg-gray-100 text-gray-600"} border-0 text-[10px] font-bold`}>
                          {inv.processingStatus.replace(/_/g, " ")}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 px-2 text-[#1e50c8] hover:bg-blue-50 text-[11px] font-semibold"
                            onClick={() => toast({ title: `Processing invoice ${inv.invoiceNumber}`, description: "Submitting to FMS..." })}
                          >
                            <Send className="h-3 w-3 mr-1 text-[#c1121f]" /> Process
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 text-gray-500 hover:bg-gray-100 p-0"
                            onClick={() => toast({ title: "Invoice Details", description: `Details for ${inv.invoiceNumber}` })}
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 text-gray-500 hover:bg-gray-100 p-0"
                            onClick={() => toast({ title: "Exporting PDF", description: `Downloading invoice ${inv.invoiceNumber}` })}
                          >
                            <Download className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && !isLoading && (
                    <tr>
                      <td colSpan={8} className="py-16 text-center text-gray-400 font-medium">
                        {invoices?.length === 0 ? "No invoices recorded yet. Click 'Submit New Invoice' to create one." : "No invoices match your search."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* SUBMIT INVOICE DIALOG MODAL */}
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="bg-white max-w-lg border-gray-200 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-gray-900">Submit Supplier Invoice</DialogTitle>
            <DialogDescription className="text-xs text-gray-500">Record supplier invoice against a purchase order for FMS payment</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitNewInvoice} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Invoice Number *</Label>
              <Input
                placeholder="e.g. INV-2024-901"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="border-gray-300 text-gray-900 text-xs"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Purchase Order *</Label>
              <Select value={purchaseOrderId} onValueChange={handlePoChange}>
                <SelectTrigger className="border-gray-300 text-gray-900 text-xs">
                  <SelectValue placeholder="Select PO..." />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200">
                  {purchaseOrders?.map((po) => (
                    <SelectItem key={po.id} value={String(po.id)}>
                      {po.purchaseOrderNumber} — {po.vendorName} ({formatCurrency(po.totalAmount)} ETB)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Vendor / Supplier *</Label>
              <Select value={vendorId} onValueChange={setVendorId}>
                <SelectTrigger className="border-gray-300 text-gray-900 text-xs">
                  <SelectValue placeholder="Select Vendor..." />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200">
                  {vendors?.map((v) => (
                    <SelectItem key={v.id} value={String(v.id)}>
                      {v.name} ({v.vendorCode})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Invoice Date *</Label>
                <Input
                  type="date"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                  className="border-gray-300 text-gray-900 text-xs"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Due Date *</Label>
                <Input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="border-gray-300 text-gray-900 text-xs"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Invoice Amount (ETB) *</Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={invoiceAmount}
                onChange={(e) => setInvoiceAmount(parseFloat(e.target.value) || 0)}
                className="border-gray-300 text-gray-900 text-sm font-bold"
                required
              />
            </div>

            <DialogFooter className="pt-3">
              <Button type="button" variant="outline" size="sm" onClick={() => setOpenModal(false)} className="text-xs border-gray-300">
                Cancel
              </Button>
              <Button type="submit" size="sm" className="bg-[#c1121f] hover:bg-[#a00f1a] text-white text-xs font-semibold" disabled={submitInvoice.isPending}>
                {submitInvoice.isPending ? "Submitting..." : "Submit Invoice"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
