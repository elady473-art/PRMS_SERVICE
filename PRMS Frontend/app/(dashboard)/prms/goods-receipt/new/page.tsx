"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save, Package, CheckCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCreateGoodsReceipt } from "@/features/prms/hooks/use-goods-receipts";
import { usePurchaseOrders } from "@/features/prms/hooks/use-purchase-orders";
import { useAuth } from "@/features/auth/contexts/auth-context";

export default function NewGoodsReceiptPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  const createGoodsReceipt = useCreateGoodsReceipt();

  const { data: purchaseOrders, isLoading: loadingPOs } = usePurchaseOrders();

  const [purchaseOrderId, setPurchaseOrderId] = useState<string>("");
  const [receiptDate, setReceiptDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [receivedByEmployeeId, setReceivedByEmployeeId] = useState<string>(user?.username || user?.id || "EMP-001");
  const [receiptDetails, setReceiptDetails] = useState<string>("");
  const [inspectionNotes, setInspectionNotes] = useState<string>("");
  const [accepted, setAccepted] = useState<boolean>(true);

  const selectedPO = purchaseOrders?.find((po) => String(po.id) === purchaseOrderId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!purchaseOrderId) {
      toast({ title: "PO Required", description: "Select a Purchase Order for this GRN.", variant: "destructive" });
      return;
    }
    if (!receiptDetails.trim()) {
      toast({ title: "Receipt Details Required", description: "Enter quantity and received item details.", variant: "destructive" });
      return;
    }

    try {
      await createGoodsReceipt.mutateAsync({
        purchaseOrderId: Number(purchaseOrderId),
        receiptDate,
        receivedByEmployeeId,
        receiptDetails: receiptDetails.trim(),
        inspectionNotes: inspectionNotes.trim() || undefined,
        accepted,
      });
      router.push("/prms/goods-receipt");
    } catch (err) {
      // Error toast handled by mutation hook
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-600 hover:bg-gray-100" asChild>
            <Link href="/prms/goods-receipt">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Record Goods Receipt Note (GRN)</h2>
            <p className="text-sm text-gray-500 mt-0.5">Directly inspect and record incoming physical items against purchase orders</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-100 pb-4">
            <CardTitle className="text-base font-semibold text-gray-900">Goods Receipt Details</CardTitle>
            <CardDescription className="text-xs text-gray-500">Link purchase order and submit warehouse receiving record</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-5">
            {/* Purchase Order Selection */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Target Purchase Order *</Label>
              {loadingPOs ? (
                <div className="flex items-center text-xs text-gray-400 gap-2 h-10 px-3 border border-gray-300 rounded-md">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading Purchase Orders...
                </div>
              ) : (
                <Select value={purchaseOrderId} onValueChange={setPurchaseOrderId}>
                  <SelectTrigger className="border-gray-300 text-gray-900 text-xs">
                    <SelectValue placeholder="Select Purchase Order..." />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200">
                    {purchaseOrders && purchaseOrders.length > 0 ? (
                      purchaseOrders.map((po) => (
                        <SelectItem key={po.id} value={String(po.id)}>
                          {po.purchaseOrderNumber} — {po.vendorName} ({po.itemDetails})
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="1">PO-2024-001 (Default)</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              )}
            </div>

            {selectedPO && (
              <div className="p-3.5 rounded-lg border border-blue-100 bg-blue-50/50 space-y-1 text-xs text-gray-700">
                <p><strong>Supplier:</strong> {selectedPO.vendorName}</p>
                <p><strong>PO Item Specs:</strong> {selectedPO.itemDetails}</p>
                <p><strong>Expected Delivery:</strong> {selectedPO.expectedDeliveryDate}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Receipt Date *</Label>
                <Input
                  type="date"
                  value={receiptDate}
                  onChange={(e) => setReceiptDate(e.target.value)}
                  className="border-gray-300 text-gray-900 text-xs"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Received By Employee ID *</Label>
                <Input
                  value={receivedByEmployeeId}
                  onChange={(e) => setReceivedByEmployeeId(e.target.value)}
                  placeholder="e.g. EMP-9021"
                  className="border-gray-300 text-gray-900 text-xs"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <Label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Received Item Quantity & Packaging Details *</Label>
              <Textarea
                value={receiptDetails}
                onChange={(e) => setReceiptDetails(e.target.value)}
                placeholder="Enter received quantities, serial numbers, box counts..."
                className="border-gray-300 text-gray-900 text-xs min-h-[90px]"
                required
              />
            </div>

            <div className="space-y-1.5 pt-2">
              <Label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Quality Inspection Notes</Label>
              <Textarea
                value={inspectionNotes}
                onChange={(e) => setInspectionNotes(e.target.value)}
                placeholder="Notes on physical condition, damage checks, testing outcome..."
                className="border-gray-300 text-gray-900 text-xs min-h-[80px]"
              />
            </div>

            {/* Inspection Acceptance Switch */}
            <div className="p-4 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-between">
              <div>
                <Label className="text-xs font-bold text-gray-900 block">Quality Inspection Result</Label>
                <p className="text-xs text-gray-500 mt-0.5">Toggle whether items passed quality standards and are accepted into inventory</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-bold ${accepted ? "text-green-700" : "text-amber-700"}`}>
                  {accepted ? "ACCEPTED" : "PENDING / REJECTED"}
                </span>
                <Switch checked={accepted} onCheckedChange={setAccepted} />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between pt-2">
          <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100 text-xs h-10 px-5" asChild>
            <Link href="/prms/goods-receipt">Cancel</Link>
          </Button>
          <Button
            type="submit"
            className="bg-[#c1121f] hover:bg-[#a00f1a] text-white text-xs h-10 px-6 font-semibold shadow-sm"
            disabled={createGoodsReceipt.isPending}
          >
            {createGoodsReceipt.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Recording Receipt...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" /> Record Goods Receipt
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
