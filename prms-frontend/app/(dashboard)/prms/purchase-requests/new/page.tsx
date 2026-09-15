"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Plus, Trash2, Save, X, Calculator, Calendar as CalendarIcon, FileText, Loader2 } from "lucide-react";
import { PurchaseRequestPriority, PurchaseRequestItemRequest } from "@/features/prms/types/purchase-request";
import { formatCurrency } from "@/lib/utils";
import { useAuth } from "@/features/auth/contexts/auth-context";
import { useCreateRequisition, useSubmitRequisition } from "@/features/prms/hooks/use-requisitions";
import { handleApiError, isApiError } from "@/lib/prms-api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function NewPurchaseRequestPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  const createRequisition = useCreateRequisition();
  const submitRequisition = useSubmitRequisition();
  const loading = createRequisition.isPending || submitRequisition.isPending;
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "MEDIUM" as PurchaseRequestPriority,
    departmentId: "",
    costCenterId: "",
    budgetLineId: "",
    requiredDate: "",
    justification: "",
    currency: "ETB",
  });

  const [items, setItems] = useState<PurchaseRequestItemRequest[]>([
    { 
      itemCode: "ITEM-001", 
      description: "", 
      quantity: 1, 
      unit: "PCS", 
      estimatedUnitPrice: 0, 
      requiredDate: "", 
      specification: "" 
    },
  ]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleItemChange = (index: number, field: keyof PurchaseRequestItemRequest, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Calculate total if unit price or quantity changes
    if (field === 'estimatedUnitPrice' || field === 'quantity') {
      const quantity = typeof newItems[index].quantity === 'string' ? 
        parseFloat(newItems[index].quantity as string) || 0 : newItems[index].quantity;
      const unitPrice = typeof newItems[index].estimatedUnitPrice === 'string' ? 
        parseFloat(newItems[index].estimatedUnitPrice as string) || 0 : newItems[index].estimatedUnitPrice;
    }
    
    setItems(newItems);
  };

  const addItem = () => {
    setItems([
      ...items,
      { 
        itemCode: `ITEM-${(items.length + 1).toString().padStart(3, '0')}`, 
        description: "", 
        quantity: 1, 
        unit: "PCS", 
        estimatedUnitPrice: 0, 
        requiredDate: formData.requiredDate, 
        specification: "" 
      }
    ]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      const newItems = items.filter((_, i) => i !== index);
      setItems(newItems);
    }
  };

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + ((item.quantity || 0) * (item.estimatedUnitPrice || 0)), 0);
    const tax = subtotal * 0.15; // Assuming 15% tax
    const total = subtotal + tax;
    
    return { subtotal, tax, total };
  };

  const buildItemDetails = () =>
    items
      .map(
        (item) =>
          `${item.description} (${item.quantity} ${item.unit} @ ${item.estimatedUnitPrice})` +
          (item.specification ? ` — ${item.specification}` : "")
      )
      .join("; ");

  const handleSubmit = async (e: React.FormEvent, submitForApproval = true) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a title for the purchase request.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.requiredDate) {
      toast({
        title: "Error",
        description: "Please select a required date.",
        variant: "destructive",
      });
      return;
    }

    const requesterEmployeeId = user?.username ?? user?.id;
    if (!requesterEmployeeId) {
      toast({
        title: "Authentication required",
        description: "Sign in before creating a purchase request.",
        variant: "destructive",
      });
      return;
    }

    // Validate items
    const invalidItems = items.filter(item => !item.description.trim() || item.estimatedUnitPrice <= 0);
    if (invalidItems.length > 0) {
      toast({
        title: "Error",
        description: "Please fill all item descriptions and enter valid prices.",
        variant: "destructive",
      });
      return;
    }

    const totals = calculateTotals();

    try {
      const created = await createRequisition.mutateAsync({
        requesterEmployeeId,
        departmentCode: formData.departmentId || "GENERAL",
        purpose: formData.title.trim(),
        itemDetails: buildItemDetails(),
        estimatedAmount: totals.subtotal,
        requiredByDate: formData.requiredDate,
      });

      if (submitForApproval) {
        await submitRequisition.mutateAsync(created.id);
      }

      router.push("/prms/purchase-requests");
    } catch (error) {
      toast({
        title: "Error",
        description: isApiError(error) ? handleApiError(error) : "Failed to create purchase request. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSaveDraft = (e: React.MouseEvent) => {
    handleSubmit(e as unknown as React.FormEvent, false);
  };

  const { subtotal, tax, total } = calculateTotals();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
              <a href="/prms/purchase-requests">
                <ArrowLeft className="h-4 w-4" />
              </a>
            </Button>
            <h2 className="text-2xl font-bold text-gray-900">New Purchase Request</h2>
          </div>
          <p className="text-gray-400 mt-2">
            Create a new purchase requisition for approval
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900">Basic Information</CardTitle>
                <CardDescription className="text-gray-400">
                  General details about the purchase request
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-gray-700 font-medium">
                    Title *
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className="border-gray-300 text-gray-900"
                    placeholder="e.g., Laptop Computers for IT Department"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-gray-700 font-medium">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    className="border-gray-300 text-gray-900 min-h-[100px]"
                    placeholder="Detailed description of what needs to be purchased and why"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="priority" className="text-gray-700 font-medium">
                      Priority *
                    </Label>
                    <Select
                      value={formData.priority}
                      onValueChange={(value: PurchaseRequestPriority) => handleInputChange("priority", value)}
                    >
                      <SelectTrigger className="border-gray-300 text-gray-900">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-200">
                        <SelectItem value="LOW">Low</SelectItem>
                        <SelectItem value="MEDIUM">Medium</SelectItem>
                        <SelectItem value="HIGH">High</SelectItem>
                        <SelectItem value="URGENT">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="requiredDate" className="text-gray-700 font-medium">
                      Required Date *
                    </Label>
                    <div className="relative">
                      <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="requiredDate"
                        type="date"
                        value={formData.requiredDate}
                        onChange={(e) => handleInputChange("requiredDate", e.target.value)}
                        className="border-gray-300 text-gray-900 pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="departmentId" className="text-gray-700 font-medium">
                      Department
                    </Label>
                    <Select
                      value={formData.departmentId}
                      onValueChange={(value) => handleInputChange("departmentId", value)}
                    >
                      <SelectTrigger className="border-gray-300 text-gray-900">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-200">
                        <SelectItem value="IT">IT Department</SelectItem>
                        <SelectItem value="HR">Human Resources</SelectItem>
                        <SelectItem value="FINANCE">Finance</SelectItem>
                        <SelectItem value="MARKETING">Marketing</SelectItem>
                        <SelectItem value="ADMIN">Administration</SelectItem>
                        <SelectItem value="RND">Research & Development</SelectItem>
                        <SelectItem value="FACILITIES">Facilities</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="costCenterId" className="text-gray-700 font-medium">
                      Cost Center
                    </Label>
                    <Select
                      value={formData.costCenterId}
                      onValueChange={(value) => handleInputChange("costCenterId", value)}
                    >
                      <SelectTrigger className="border-gray-300 text-gray-900">
                        <SelectValue placeholder="Select cost center" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-200">
                        <SelectItem value="CC-001">CC-001 - IT Infrastructure</SelectItem>
                        <SelectItem value="CC-002">CC-002 - Office Supplies</SelectItem>
                        <SelectItem value="CC-003">CC-003 - Marketing Materials</SelectItem>
                        <SelectItem value="CC-004">CC-004 - Training & Development</SelectItem>
                        <SelectItem value="CC-005">CC-005 - Equipment Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="budgetLineId" className="text-gray-700 font-medium">
                      Budget Line
                    </Label>
                    <Select
                      value={formData.budgetLineId}
                      onValueChange={(value) => handleInputChange("budgetLineId", value)}
                    >
                      <SelectTrigger className="border-gray-300 text-gray-900">
                        <SelectValue placeholder="Select budget line" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-200">
                        <SelectItem value="BL-001">BL-001 - Capital Equipment</SelectItem>
                        <SelectItem value="BL-002">BL-002 - Operating Expenses</SelectItem>
                        <SelectItem value="BL-003">BL-003 - Software Licenses</SelectItem>
                        <SelectItem value="BL-004">BL-004 - Training Budget</SelectItem>
                        <SelectItem value="BL-005">BL-005 - Maintenance Budget</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="justification" className="text-gray-700 font-medium">
                    Justification
                  </Label>
                  <Textarea
                    id="justification"
                    value={formData.justification}
                    onChange={(e) => handleInputChange("justification", e.target.value)}
                    className="border-gray-300 text-gray-900 min-h-[80px]"
                    placeholder="Explain why this purchase is necessary and how it aligns with business objectives"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Items Section */}
            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-gray-900">Items</CardTitle>
                    <CardDescription className="text-gray-400">
                      List of items to be purchased
                    </CardDescription>
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={addItem}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {items.map((item, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-500">Item {index + 1}</span>
                          <span className="text-xs text-gray-500 font-mono">{item.itemCode}</span>
                        </div>
                        {items.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(index)}
                            className="h-8 w-8 text-red-500 hover:text-red-400 hover:bg-red-500/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`item-description-${index}`} className="text-gray-300">
                            Description *
                          </Label>
                          <Input
                            id={`item-description-${index}`}
                            value={item.description}
                            onChange={(e) => handleItemChange(index, "description", e.target.value)}
                            className="border-gray-300 text-gray-900"
                            placeholder="Item description"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`item-specification-${index}`} className="text-gray-300">
                            Specification
                          </Label>
                          <Input
                            id={`item-specification-${index}`}
                            value={item.specification || ""}
                            onChange={(e) => handleItemChange(index, "specification", e.target.value)}
                            className="border-gray-300 text-gray-900"
                            placeholder="Technical specifications, brand, model, etc."
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`item-quantity-${index}`} className="text-gray-300">
                            Quantity *
                          </Label>
                          <Input
                            id={`item-quantity-${index}`}
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(index, "quantity", parseFloat(e.target.value) || 1)}
                            className="border-gray-300 text-gray-900"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`item-unit-${index}`} className="text-gray-300">
                            Unit
                          </Label>
                          <Select
                            value={item.unit}
                            onValueChange={(value) => handleItemChange(index, "unit", value)}
                          >
                            <SelectTrigger className="border-gray-300 text-gray-900">
                              <SelectValue placeholder="Select unit" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-gray-200">
                              <SelectItem value="PCS">Pieces</SelectItem>
                              <SelectItem value="SET">Sets</SelectItem>
                              <SelectItem value="KG">Kilograms</SelectItem>
                              <SelectItem value="L">Liters</SelectItem>
                              <SelectItem value="M">Meters</SelectItem>
                              <SelectItem value="HR">Hours</SelectItem>
                              <SelectItem value="DAY">Days</SelectItem>
                              <SelectItem value="MONTH">Months</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`item-unitprice-${index}`} className="text-gray-300">
                            Unit Price *
                          </Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                              ETB
                            </span>
                            <Input
                              id={`item-unitprice-${index}`}
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.estimatedUnitPrice}
                              onChange={(e) => handleItemChange(index, "estimatedUnitPrice", parseFloat(e.target.value) || 0)}
                              className="border-gray-300 text-gray-900 pl-12"
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`item-requireddate-${index}`} className="text-gray-300">
                            Required Date
                          </Label>
                          <div className="relative">
                            <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                              id={`item-requireddate-${index}`}
                              type="date"
                              value={item.requiredDate}
                              onChange={(e) => handleItemChange(index, "requiredDate", e.target.value)}
                              className="border-gray-300 text-gray-900 pl-10"
                            />
                          </div>
                        </div>
                      </div>

                      {((item.quantity || 0) * (item.estimatedUnitPrice || 0)) > 0 && (
                        <div className="pt-2 border-t border-gray-200">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">Item Total:</span>
                            <span className="font-medium text-gray-900">
                              {formatCurrency((item.quantity || 0) * (item.estimatedUnitPrice || 0))}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {items.length === 0 && (
                  <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                    <FileText className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-400 mb-2">No items added</h3>
                    <p className="text-gray-500 mb-4">Add items to your purchase request</p>
                    <Button type="button" variant="outline" onClick={addItem}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Item
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Summary Card */}
            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900">Financial Summary</CardTitle>
                <CardDescription className="text-gray-400">
                  Estimated costs and totals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Subtotal</span>
                    <span className="text-white font-medium">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Tax (15%)</span>
                    <span className="text-white font-medium">{formatCurrency(tax)}</span>
                  </div>
                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex justify-between">
                      <span className="text-gray-400 font-medium">Estimated Total</span>
                      <span className="text-xl font-bold text-gray-900">{formatCurrency(total)}</span>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calculator className="h-4 w-4 mr-2" />
                      {items.length} item(s) total
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Currency Selection */}
            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900">Currency</CardTitle>
              </CardHeader>
              <CardContent>
                <Select
                  value={formData.currency}
                  onValueChange={(value) => handleInputChange("currency", value)}
                >
                  <SelectTrigger className="border-gray-300 text-gray-900">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200">
                    <SelectItem value="ETB">ETB - Ethiopian Birr</SelectItem>
                    <SelectItem value="USD">USD - US Dollar</SelectItem>
                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                    <SelectItem value="GBP">GBP - British Pound</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-2">
                  All amounts will be calculated in this currency
                </p>
              </CardContent>
            </Card>

            {/* Form Actions */}
            <Card className="bg-white border border-gray-200">
              <CardContent className="p-6">
                <div className="space-y-3">
                  <Button
                    type="submit"
                    className="w-full bg-[#c1121f] hover:bg-[#a00f1a]"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Submitting…
                      </>
                    ) : (
                      "Submit for Approval"
                    )}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                    onClick={handleSaveDraft}
                    disabled={loading}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save as Draft
                  </Button>
                  
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full text-gray-400 hover:text-gray-900 hover:bg-gray-100"
                    onClick={() => router.back()}
                    disabled={loading}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>

                <div className="pt-4 mt-4 border-t border-gray-200">
                  <div className="text-xs text-gray-500 space-y-2">
                    <p className="flex items-start">
                      <span className="w-2 h-2 rounded-full bg-amber-500 mr-2 mt-1"></span>
                      <span>Draft requests can be edited later</span>
                    </p>
                    <p className="flex items-start">
                      <span className="w-2 h-2 rounded-full bg-blue-500 mr-2 mt-1"></span>
                      <span>Submitted requests go through approval workflow</span>
                    </p>
                    <p className="flex items-start">
                      <span className="w-2 h-2 rounded-full bg-green-500 mr-2 mt-1"></span>
                      <span>Approved requests can be converted to purchase orders</span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}

