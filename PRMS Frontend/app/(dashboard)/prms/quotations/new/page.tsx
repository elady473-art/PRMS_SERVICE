"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Plus, Trash2, Save, FileText, DollarSign, Calendar, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateQuotation } from "@/features/prms/hooks/use-quotations";
import { useRFQs } from "@/features/prms/hooks/use-rfq";
import { useVendors } from "@/features/prms/hooks/use-vendors";
import { formatCurrency } from "@/lib/utils";

interface LineItem {
  id: string;
  itemCode: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
}

export default function NewQuotationPage() {
  const router = useRouter();
  const { toast } = useToast();
  const createQuotation = useCreateQuotation();

  const { data: rfqs, isLoading: loadingRfqs } = useRFQs();
  const { data: vendors, isLoading: loadingVendors } = useVendors();

  const [rfqId, setRfqId] = useState<string>("");
  const [vendorId, setVendorId] = useState<string>("");
  const [quotationDate, setQuotationDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [validUntil, setValidUntil] = useState<string>("");
  const [currency, setCurrency] = useState<string>("ETB");
  const [notes, setNotes] = useState<string>("");

  const [items, setItems] = useState<LineItem[]>([
    { id: "1", itemCode: "", description: "", quantity: 1, unit: "PCS", unitPrice: 0 },
  ]);

  const handleItemChange = (id: string, field: keyof LineItem, value: string | number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        return {
          ...item,
          [field]: value,
        };
      })
    );
  };

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        itemCode: "",
        description: "",
        quantity: 1,
        unit: "PCS",
        unitPrice: 0,
      },
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length <= 1) {
      toast({
        title: "Cannot remove",
        description: "Quotation must have at least one line item.",
        variant: "destructive",
      });
      return;
    }
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const totalAmount = items.reduce((sum, item) => sum + (item.quantity || 0) * (item.unitPrice || 0), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!rfqId) {
      toast({ title: "Validation Error", description: "Please select or enter an RFQ.", variant: "destructive" });
      return;
    }
    if (!vendorId) {
      toast({ title: "Validation Error", description: "Please select a supplier.", variant: "destructive" });
      return;
    }
    if (!validUntil) {
      toast({ title: "Validation Error", description: "Please select valid until date.", variant: "destructive" });
      return;
    }
    if (totalAmount <= 0) {
      toast({ title: "Validation Error", description: "Quotation total amount must be greater than 0.", variant: "destructive" });
      return;
    }

    try {
      await createQuotation.mutateAsync({
        rfqId: Number(rfqId),
        vendorId: Number(vendorId),
        quotationDate,
        validUntil,
        totalAmount,
      });
      router.push("/prms/quotations");
    } catch (err) {
      // Toast error is handled by mutation hook
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-600 hover:bg-gray-100" asChild>
            <Link href="/prms/quotations">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Create Supplier Quotation</h2>
            <p className="text-sm text-gray-500 mt-0.5">Submit official supplier pricing against open RFQs</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info Card */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-100 pb-4">
            <CardTitle className="text-base font-semibold text-gray-900">Quotation Information</CardTitle>
            <CardDescription className="text-xs text-gray-500">
              Select RFQ and Supplier to link this quotation in PostgreSQL
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <Label htmlFor="rfqId" className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  Target RFQ *
                </Label>
                {loadingRfqs ? (
                  <div className="flex items-center text-xs text-gray-400 gap-2 h-10 px-3 border border-gray-300 rounded-md">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading RFQs...
                  </div>
                ) : (
                  <Select value={rfqId} onValueChange={setRfqId}>
                    <SelectTrigger id="rfqId" className="border-gray-300 text-gray-900">
                      <SelectValue placeholder="Select RFQ..." />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200">
                      {rfqs && rfqs.length > 0 ? (
                        rfqs.map((rfq) => (
                          <SelectItem key={rfq.id} value={String(rfq.id)}>
                            {rfq.rfqNumber} — {rfq.title}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="1">RFQ-2024-001 (Default)</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="vendorId" className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  Supplier / Vendor *
                </Label>
                {loadingVendors ? (
                  <div className="flex items-center text-xs text-gray-400 gap-2 h-10 px-3 border border-gray-300 rounded-md">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading Vendors...
                  </div>
                ) : (
                  <Select value={vendorId} onValueChange={setVendorId}>
                    <SelectTrigger id="vendorId" className="border-gray-300 text-gray-900">
                      <SelectValue placeholder="Select Supplier..." />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200">
                      {vendors && vendors.length > 0 ? (
                        vendors.map((v) => (
                          <SelectItem key={v.id} value={String(v.id)}>
                            {v.name} ({v.vendorCode})
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="1">Tech Solutions Ltd.</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
              <div className="space-y-1.5">
                <Label htmlFor="quotationDate" className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  Quotation Date
                </Label>
                <Input
                  id="quotationDate"
                  type="date"
                  value={quotationDate}
                  onChange={(e) => setQuotationDate(e.target.value)}
                  className="border-gray-300 text-gray-900"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="validUntil" className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  Valid Until *
                </Label>
                <Input
                  id="validUntil"
                  type="date"
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                  className="border-gray-300 text-gray-900"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="currency" className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  Currency
                </Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger id="currency" className="border-gray-300 text-gray-900">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200">
                    <SelectItem value="ETB">ETB (Ethiopian Birr)</SelectItem>
                    <SelectItem value="USD">USD (US Dollar)</SelectItem>
                    <SelectItem value="EUR">EUR (Euro)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <Label htmlFor="notes" className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Special Conditions / Notes
              </Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter warranty details, payment expectations, delivery timeline..."
                className="border-gray-300 text-gray-900 text-sm min-h-[80px]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Line Items Card */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-100 pb-4 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold text-gray-900">Quotation Line Items</CardTitle>
              <CardDescription className="text-xs text-gray-500">Enter item details, quantities, and unit pricing</CardDescription>
            </div>
            <Button
              type="button"
              size="sm"
              className="bg-[#c1121f] hover:bg-[#a00f1a] text-white text-xs h-8"
              onClick={addItem}
            >
              <Plus className="h-3.5 w-3.5 mr-1.5" /> Add Line Item
            </Button>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {items.map((item, idx) => {
              const lineTotal = (item.quantity || 0) * (item.unitPrice || 0);
              return (
                <div key={item.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Line Item #{idx + 1}</span>
                    {items.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-red-600 hover:text-red-700 hover:bg-red-50 text-xs"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-1" /> Remove
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs text-gray-600 font-medium">Item Code</Label>
                      <Input
                        value={item.itemCode}
                        onChange={(e) => handleItemChange(item.id, "itemCode", e.target.value)}
                        placeholder="e.g. IT-PRN-01"
                        className="border-gray-300 text-gray-900 text-xs h-9 bg-white"
                      />
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <Label className="text-xs text-gray-600 font-medium">Description *</Label>
                      <Input
                        value={item.description}
                        onChange={(e) => handleItemChange(item.id, "description", e.target.value)}
                        placeholder="Item description or service details..."
                        className="border-gray-300 text-gray-900 text-xs h-9 bg-white"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-gray-600 font-medium">Unit</Label>
                      <Input
                        value={item.unit}
                        onChange={(e) => handleItemChange(item.id, "unit", e.target.value)}
                        placeholder="PCS / SET / KG"
                        className="border-gray-300 text-gray-900 text-xs h-9 bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                    <div className="space-y-1">
                      <Label className="text-xs text-gray-600 font-medium">Quantity *</Label>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(item.id, "quantity", parseFloat(e.target.value) || 0)}
                        className="border-gray-300 text-gray-900 text-xs h-9 bg-white"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-gray-600 font-medium">Unit Price ({currency}) *</Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) => handleItemChange(item.id, "unitPrice", parseFloat(e.target.value) || 0)}
                        className="border-gray-300 text-gray-900 text-xs h-9 bg-white"
                        required
                      />
                    </div>
                    <div className="space-y-1 flex flex-col justify-end">
                      <Label className="text-xs text-gray-500 font-medium mb-1">Line Total</Label>
                      <div className="h-9 px-3 flex items-center justify-end font-bold text-gray-900 bg-white border border-gray-200 rounded-md text-sm">
                        {formatCurrency(lineTotal)} {currency}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Total summary */}
            <div className="mt-4 p-4 rounded-xl border border-gray-200 bg-blue-50/50 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-[#1e50c8]" />
                <span className="font-semibold text-gray-700 text-sm">Calculated Quotation Total:</span>
              </div>
              <span className="text-2xl font-black text-[#1e50c8]">
                {formatCurrency(totalAmount)} <span className="text-sm font-normal text-gray-600">{currency}</span>
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2">
          <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100 text-xs h-10 px-5" asChild>
            <Link href="/prms/quotations">Cancel</Link>
          </Button>
          <Button
            type="submit"
            className="bg-[#c1121f] hover:bg-[#a00f1a] text-white text-xs h-10 px-6 font-semibold shadow-sm"
            disabled={createQuotation.isPending}
          >
            {createQuotation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Submitting Quotation...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" /> Submit Quotation
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
