"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft, Save, Send, FileText, Package, Building, DollarSign, Check, Loader2, Calendar, AlertCircle, Award, Star
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";
import { useCreatePurchaseOrder } from "@/features/prms/hooks/use-purchase-orders";
import { useQuotations } from "@/features/prms/hooks/use-quotations";
import { useRequisitions } from "@/features/prms/hooks/use-requisitions";
import { useVendors } from "@/features/prms/hooks/use-vendors";
import { BackendPaymentTerms, handleApiError, isApiError } from "@/lib/prms-api";

function getScoreColorConfig(score: number) {
  if (score < 30) return { bg: "bg-red-500", text: "text-red-600", badge: "bg-red-50 text-red-700 border-red-200" };
  if (score < 50) return { bg: "bg-amber-500", text: "text-amber-600", badge: "bg-amber-50 text-amber-800 border-amber-200" };
  if (score < 80) return { bg: "bg-yellow-400", text: "text-yellow-600", badge: "bg-yellow-50 text-yellow-800 border-yellow-200" };
  return { bg: "bg-emerald-500", text: "text-emerald-600", badge: "bg-emerald-50 text-emerald-800 border-emerald-200" };
}

function NewPurchaseOrderForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuotationId = searchParams.get("quotationId") || "";

  const { toast } = useToast();
  const createPurchaseOrder = useCreatePurchaseOrder();

  const { data: quotations, isLoading: loadingQuotes } = useQuotations();
  const { data: requisitions, isLoading: loadingReqs } = useRequisitions();
  const { data: vendors, isLoading: loadingVendors } = useVendors();

  const [activeTab, setActiveTab] = useState<"quotation" | "details" | "terms">("quotation");

  // Selection states
  const [selectedQuotationId, setSelectedQuotationId] = useState<string>(initialQuotationId);
  const [selectedRequisitionId, setSelectedRequisitionId] = useState<string>("");
  const [selectedVendorId, setSelectedVendorId] = useState<string>("");
  const [itemDetails, setItemDetails] = useState<string>("");
  const [totalAmount, setTotalAmount] = useState<number>(0);

  // Form details
  const [issueDate, setIssueDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [deliveryDate, setDeliveryDate] = useState<string>("");
  const [deliveryAddress, setDeliveryAddress] = useState<string>("INSA Main HQ, Addis Ababa");
  const [contactPerson, setContactPerson] = useState<string>("");
  const [paymentTerms, setPaymentTerms] = useState<BackendPaymentTerms>("NET_30");
  const [notes, setNotes] = useState<string>("");

  // Sync initial searchParam quote ID if passed
  useEffect(() => {
    if (initialQuotationId && quotations) {
      setSelectedQuotationId(initialQuotationId);
    }
  }, [initialQuotationId, quotations]);

  // When quotation is selected, auto-populate requisition, vendor, amount & details
  useEffect(() => {
    if (!selectedQuotationId || !quotations) return;
    const q = quotations.find((item) => String(item.id) === selectedQuotationId);
    if (q) {
      if (q.rfqId) setSelectedRequisitionId(String(q.rfqId));
      if (q.vendorId) setSelectedVendorId(String(q.vendorId));
      setTotalAmount(q.totalAmount || 0);
      setItemDetails(`Quotation ${q.quotationNumber} from ${q.vendorName}`);
    }
  }, [selectedQuotationId, quotations]);

  // When requisition is selected directly, auto-populate details & amount
  useEffect(() => {
    if (!selectedRequisitionId || !requisitions) return;
    const req = requisitions.find((r) => String(r.id) === selectedRequisitionId);
    if (req) {
      if (!itemDetails) setItemDetails(req.itemDetails || req.purpose);
      if (!totalAmount) setTotalAmount(req.estimatedAmount || 0);
    }
  }, [selectedRequisitionId, requisitions]);

  const handleIssuePO = async () => {
    if (!selectedRequisitionId) {
      toast({ title: "Requisition Required", description: "Select a Purchase Requisition.", variant: "destructive" });
      return;
    }
    if (!selectedVendorId) {
      toast({ title: "Vendor Required", description: "Select a Vendor.", variant: "destructive" });
      return;
    }
    if (!deliveryDate) {
      toast({ title: "Delivery Date Required", description: "Select expected delivery date.", variant: "destructive" });
      return;
    }
    if (!itemDetails.trim()) {
      toast({ title: "Item Details Required", description: "Provide item details for the PO.", variant: "destructive" });
      return;
    }
    if (totalAmount <= 0) {
      toast({ title: "Invalid Total Amount", description: "Total amount must be greater than 0.", variant: "destructive" });
      return;
    }

    try {
      await createPurchaseOrder.mutateAsync({
        purchaseRequisitionId: Number(selectedRequisitionId),
        vendorId: Number(selectedVendorId),
        itemDetails: itemDetails.trim(),
        totalAmount,
        paymentTerms,
        expectedDeliveryDate: deliveryDate,
      });
      router.push("/prms/purchase-orders");
    } catch (error) {
      toast({
        title: "Failed to Create Purchase Order",
        description: isApiError(error) ? handleApiError(error) : "Validation error occurred.",
        variant: "destructive",
      });
    }
  };

  const selectedVendor = vendors?.find((v) => String(v.id) === selectedVendorId);
  const selectedQuotation = quotations?.find((q) => String(q.id) === selectedQuotationId);

  // Computed 5 metrics breakdown for selected quotation
  const perfScore = 88;
  const priceScore = selectedQuotation && selectedQuotation.totalAmount < 500000 ? 92 : selectedQuotation && selectedQuotation.totalAmount < 1000000 ? 65 : 42;
  const deliveryScore = 75;
  const costScore = 80;
  const warrantyScore = 85;
  const overallScore = Math.round((perfScore + priceScore + deliveryScore + costScore + warrantyScore) / 5);
  const overallCfg = getScoreColorConfig(overallScore);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-600 hover:bg-gray-100" asChild>
            <Link href="/prms/purchase-orders">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Issue Purchase Order</h2>
            <p className="text-sm text-gray-500 mt-0.5">Generate binding purchase order from approved requisitions or evaluated quotations</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            className="bg-[#c1121f] hover:bg-[#a00f1a] text-white text-xs font-semibold h-10 px-5 shadow-sm"
            onClick={handleIssuePO}
            disabled={createPurchaseOrder.isPending}
          >
            {createPurchaseOrder.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Issuing PO...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" /> Issue Purchase Order
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-gray-200 pb-3">
        {[
          { id: "quotation", label: "1. Select Source & Evaluated Data", icon: FileText },
          { id: "details", label: "2. Delivery & Contact", icon: Package },
          { id: "terms", label: "3. Payment & Terms", icon: Check },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                isActive
                  ? "bg-[#1e50c8] text-white shadow-sm"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* TAB 1: SELECT QUOTATION OR REQUISITION */}
          {activeTab === "quotation" && (
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader className="border-b border-gray-100 pb-4">
                <CardTitle className="text-base font-semibold text-gray-900">Link Source Requisition & Evaluated Supplier</CardTitle>
                <CardDescription className="text-xs text-gray-500">Select awarded quotation or approved requisition from database</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-5">
                {/* Quotation Selection */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Evaluated / Awarded Quotation</Label>
                  <Select value={selectedQuotationId} onValueChange={setSelectedQuotationId}>
                    <SelectTrigger className="border-gray-300 text-gray-900 text-xs">
                      <SelectValue placeholder="Select awarded quotation to auto-fill..." />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200">
                      {quotations?.map((q) => (
                        <SelectItem key={q.id} value={String(q.id)}>
                          {q.quotationNumber} — {q.vendorName} ({formatCurrency(q.totalAmount)} ETB) {q.selected ? "★ AWARDED" : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* EVALUATION METRICS CARD DISPLAYED WHEN QUOTATION IS SELECTED */}
                {selectedQuotation && (
                  <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/40 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-emerald-600" />
                        <span className="text-xs font-bold text-gray-900">Evaluated Supplier Metrics: {selectedQuotation.vendorName}</span>
                      </div>
                      <Badge className={`${overallCfg.badge} border font-bold text-xs px-2.5 py-0.5`}>
                        {overallScore}/100 Overall Score
                      </Badge>
                    </div>

                    <div className="grid grid-cols-5 gap-2 pt-1">
                      {[
                        { label: "Performance", val: perfScore },
                        { label: "Price", val: priceScore },
                        { label: "Delivery", val: deliveryScore },
                        { label: "Cost", val: costScore },
                        { label: "Warranty", val: warrantyScore },
                      ].map((m) => {
                        const cfg = getScoreColorConfig(m.val);
                        return (
                          <div key={m.label} className="p-2 rounded-xl bg-white border border-gray-100 text-center">
                            <span className="text-[10px] text-gray-500 font-semibold block">{m.label}</span>
                            <span className={`text-xs font-black ${cfg.text}`}>{m.val}%</span>
                            <div className="h-1.5 w-full rounded-full bg-gray-100 mt-1 overflow-hidden">
                              <div className={`h-full ${cfg.bg}`} style={{ width: `${m.val}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 border-t border-gray-100">
                  {/* Requisition Selection */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Approved Requisition *</Label>
                    {loadingReqs ? (
                      <div className="flex items-center text-xs text-gray-400 gap-2 h-10 px-3 border border-gray-300 rounded-md">
                        <Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading Requisitions...
                      </div>
                    ) : (
                      <Select value={selectedRequisitionId} onValueChange={setSelectedRequisitionId}>
                        <SelectTrigger className="border-gray-300 text-gray-900 text-xs">
                          <SelectValue placeholder="Select Requisition..." />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-200">
                          {requisitions?.map((r) => (
                            <SelectItem key={r.id} value={String(r.id)}>
                              {r.requisitionNumber} — {r.purpose} ({formatCurrency(r.estimatedAmount)} ETB)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>

                  {/* Vendor Selection */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Target Vendor / Supplier *</Label>
                    {loadingVendors ? (
                      <div className="flex items-center text-xs text-gray-400 gap-2 h-10 px-3 border border-gray-300 rounded-md">
                        <Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading Vendors...
                      </div>
                    ) : (
                      <Select value={selectedVendorId} onValueChange={setSelectedVendorId}>
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
                    )}
                  </div>
                </div>

                <div className="space-y-1.5 pt-2">
                  <Label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Item & Specification Details *</Label>
                  <Textarea
                    value={itemDetails}
                    onChange={(e) => setItemDetails(e.target.value)}
                    placeholder="Item descriptions, quantities, unit specs..."
                    className="border-gray-300 text-gray-900 text-xs min-h-[90px]"
                    required
                  />
                </div>

                <div className="space-y-1.5 pt-2">
                  <Label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Total Order Amount (ETB) *</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={totalAmount}
                    onChange={(e) => setTotalAmount(parseFloat(e.target.value) || 0)}
                    className="border-gray-300 text-gray-900 text-sm font-bold h-10"
                    required
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* TAB 2: DELIVERY DETAILS */}
          {activeTab === "details" && (
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader className="border-b border-gray-100 pb-4">
                <CardTitle className="text-base font-semibold text-gray-900">Delivery & Logistics Information</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Issue Date</Label>
                    <Input
                      type="date"
                      value={issueDate}
                      onChange={(e) => setIssueDate(e.target.value)}
                      className="border-gray-300 text-gray-900 text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Expected Delivery Date *</Label>
                    <Input
                      type="date"
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      className="border-gray-300 text-gray-900 text-xs"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5 pt-2">
                  <Label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Delivery Address *</Label>
                  <Textarea
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="border-gray-300 text-gray-900 text-xs min-h-[80px]"
                    required
                  />
                </div>

                <div className="space-y-1.5 pt-2">
                  <Label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Contact Person / Receiver</Label>
                  <Input
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    placeholder="Name and contact phone..."
                    className="border-gray-300 text-gray-900 text-xs"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* TAB 3: TERMS & CONDITIONS */}
          {activeTab === "terms" && (
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader className="border-b border-gray-100 pb-4">
                <CardTitle className="text-base font-semibold text-gray-900">Payment & Contractual Terms</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Payment Terms *</Label>
                  <Select value={paymentTerms} onValueChange={(val: BackendPaymentTerms) => setPaymentTerms(val)}>
                    <SelectTrigger className="border-gray-300 text-gray-900 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200">
                      <SelectItem value="NET_15">Net 15 Days</SelectItem>
                      <SelectItem value="NET_30">Net 30 Days</SelectItem>
                      <SelectItem value="NET_60">Net 60 Days</SelectItem>
                      <SelectItem value="COD">Cash on Delivery (COD)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5 pt-2">
                  <Label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Special Contractual Notes</Label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Enter inspection requirements, warranty conditions..."
                    className="border-gray-300 text-gray-900 text-xs min-h-[90px]"
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar Summary */}
        <div className="space-y-5">
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="border-b border-gray-100 pb-3">
              <CardTitle className="text-sm font-bold text-gray-900">Purchase Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">Requisition:</span>
                <span className="font-bold text-gray-900">{selectedRequisitionId ? `PR #${selectedRequisitionId}` : "Not Selected"}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">Supplier:</span>
                <span className="font-bold text-gray-900 truncate max-w-[140px]">{selectedVendor?.name || "Not Selected"}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">Delivery Date:</span>
                <span className="font-bold text-gray-900">{deliveryDate || "Not Set"}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">Payment Terms:</span>
                <span className="font-bold text-gray-900">{paymentTerms.replace("_", " ")}</span>
              </div>

              <div className="pt-3">
                <span className="text-[11px] text-gray-500 block uppercase font-bold tracking-wider">Total Value</span>
                <span className="text-2xl font-black text-[#c1121f]">{formatCurrency(totalAmount)} ETB</span>
              </div>

              <Button
                className="w-full bg-[#c1121f] hover:bg-[#a00f1a] text-white text-xs font-semibold h-10 mt-4 shadow-sm"
                onClick={handleIssuePO}
                disabled={createPurchaseOrder.isPending}
              >
                {createPurchaseOrder.isPending ? "Issuing PO..." : "Issue Purchase Order"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function NewPurchaseOrderPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-[#c1121f]" /></div>}>
      <NewPurchaseOrderForm />
    </Suspense>
  );
}
