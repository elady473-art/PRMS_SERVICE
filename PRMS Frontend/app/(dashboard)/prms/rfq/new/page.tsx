"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  Send,
  Upload,
  FileText,
  Calendar,
  DollarSign,
  Users,
  Package,
  FilePlus,
  Clock,
  Check
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { RFQItem, RFQItemRequest } from "@/features/prms/types/rfq";
import { useCreateRFQ } from "@/features/prms/hooks/use-rfq";
import { useVendors } from "@/features/prms/hooks/use-vendors";
import { handleApiError, isApiError } from "@/lib/prms-api";

export default function NewRFQPage() {
  const router = useRouter();
  const { toast } = useToast();
  const createRFQ = useCreateRFQ();
  const [activeTab, setActiveTab] = useState<"basic" | "items" | "suppliers" | "terms">("basic");
  const isSubmitting = createRFQ.isPending;

  // Basic Information
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    prId: "",
    submissionDeadline: "",
    validityDays: 30,
    currency: "ETB",
    evaluationCriteria: "",
    termsAndConditions: "",
  });

  // Items
  const [items, setItems] = useState<RFQItemRequest[]>([
    {
      itemCode: "ITEM-001",
      description: "Office Chair",
      quantity: 50,
      unit: "pcs",
      specifications: "Ergonomic mesh back, adjustable height",
      notes: "Executive model preferred",
    },
    {
      itemCode: "ITEM-002",
      description: "Desk",
      quantity: 25,
      unit: "pcs",
      specifications: "160x80cm, wooden finish",
      notes: "With cable management",
    },
  ]);

  const { data: vendorList } = useVendors();
  const vendors = vendorList || [];

  // Suppliers
  const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>([]);

  const tabs = [
    { id: "basic", label: "Basic Information", icon: FileText },
    { id: "items", label: "Items", icon: Package },
    { id: "suppliers", label: "Suppliers", icon: Users },
    { id: "terms", label: "Terms & Conditions", icon: Check },
  ];

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddItem = () => {
    setItems(prev => [...prev, {
      itemCode: `ITEM-${String(prev.length + 1).padStart(3, '0')}`,
      description: "",
      quantity: 1,
      unit: "pcs",
      specifications: "",
      notes: "",
    }]);
  };

  const handleUpdateItem = (index: number, field: string, value: string | number) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      [field]: value
    };
    setItems(newItems);
  };

  const handleRemoveItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleToggleSupplier = (supplierId: string) => {
    setSelectedSuppliers(prev => 
      prev.includes(supplierId)
        ? prev.filter(id => id !== supplierId)
        : [...prev, supplierId]
    );
  };

  const buildItemDetails = () =>
    items
      .map(
        (item) =>
          `${item.description} (${item.quantity} ${item.unit})` +
          (item.specifications ? ` — ${item.specifications}` : "")
      )
      .join("; ");

  const handleSaveDraft = () => {
    toast({
      title: "Draft not saved to backend",
      description: "The backend RFQ API creates published RFQs only. Complete required fields and use Publish RFQ.",
    });
  };

  const handlePublishRFQ = async () => {
    if (!formData.title.trim()) {
      toast({ title: "Title required", description: "Enter an RFQ title.", variant: "destructive" });
      return;
    }
    if (!formData.prId.trim()) {
      toast({
        title: "Purchase requisition required",
        description: "Enter the linked purchase requisition ID (numeric backend ID).",
        variant: "destructive",
      });
      return;
    }
    if (!formData.submissionDeadline) {
      toast({
        title: "Deadline required",
        description: "Select a submission deadline.",
        variant: "destructive",
      });
      return;
    }

    const purchaseRequisitionId = Number(formData.prId);
    if (!Number.isFinite(purchaseRequisitionId) || purchaseRequisitionId <= 0) {
      toast({
        title: "Invalid requisition ID",
        description: "Purchase requisition ID must be a positive number.",
        variant: "destructive",
      });
      return;
    }

    try {
      await createRFQ.mutateAsync({
        purchaseRequisitionId,
        title: formData.title.trim(),
        itemDetails: buildItemDetails() || formData.description || formData.title.trim(),
        submissionDeadline: formData.submissionDeadline,
      });
      router.push("/prms/rfq");
    } catch (error) {
      toast({
        title: "Failed to create RFQ",
        description: isApiError(error) ? handleApiError(error) : "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  const calculateEstimatedValue = () => {
    return 0; // Estimation removed due to real backend migration
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Create New RFQ</h2>
            <p className="text-gray-400 mt-2">
              Create a new Request for Quotation to send to suppliers
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
            onClick={handleSaveDraft}
            disabled={isSubmitting}
          >
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          <Button 
            className="bg-[#c1121f] hover:bg-[#a00f1a]"
            onClick={handlePublishRFQ}
            disabled={isSubmitting}
          >
            <Send className="h-4 w-4 mr-2" />
            {isSubmitting ? "Publishing..." : "Publish RFQ"}
          </Button>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div className="flex space-x-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-[#c1121f]/10 text-[#c1121f] border border-[#c1121f]/20' 
                    : 'text-gray-400 hover:text-gray-300 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
        <div className="text-sm text-gray-500">
          Estimated value: <span className="font-bold text-white ml-1">{calculateEstimatedValue().toLocaleString()} ETB</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          {activeTab === "basic" && (
            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900">
                  Basic Information
                </CardTitle>
                <p className="text-sm text-gray-500">
                  Enter the basic details for your RFQ
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title" className="text-gray-900">RFQ Title *</Label>
                      <Input
                        id="title"
                        placeholder="e.g., Annual Software Licenses"
                        className="mt-2 border-gray-300 text-gray-900"
                        value={formData.title}
                        onChange={(e) => handleInputChange("title", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="prId" className="text-gray-900">Purchase Request (Optional)</Label>
                      <Select value={formData.prId} onValueChange={(value) => handleInputChange("prId", value)}>
                        <SelectTrigger className="mt-2 border-gray-300 text-gray-900">
                          <SelectValue placeholder="Select PR" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-200">
                          <SelectItem value="PR-2024-001">PR-2024-001 - Laptops</SelectItem>
                          <SelectItem value="PR-2024-002">PR-2024-002 - Furniture</SelectItem>
                          <SelectItem value="PR-2024-003">PR-2024-003 - Software</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="submissionDeadline" className="text-gray-900">Submission Deadline *</Label>
                      <div className="relative mt-2">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
                        <Input
                          id="submissionDeadline"
                          type="datetime-local"
                          className="pl-10 border-gray-300 text-gray-900"
                          value={formData.submissionDeadline}
                          onChange={(e) => handleInputChange("submissionDeadline", e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="currency" className="text-gray-900">Currency *</Label>
                      <Select value={formData.currency} onValueChange={(value) => handleInputChange("currency", value)}>
                        <SelectTrigger className="mt-2 border-gray-300 text-gray-900">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-200">
                          <SelectItem value="ETB">ETB - Ethiopian Birr</SelectItem>
                          <SelectItem value="USD">USD - US Dollar</SelectItem>
                          <SelectItem value="EUR">EUR - Euro</SelectItem>
                          <SelectItem value="GBP">GBP - British Pound</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description" className="text-gray-900">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Brief description of the RFQ requirements..."
                    className="mt-2 border-gray-300 text-gray-900 min-h-[120px]"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="validityDays" className="text-gray-900">Quotation Validity (Days) *</Label>
                    <Input
                      id="validityDays"
                      type="number"
                      min="1"
                      className="mt-2 border-gray-300 text-gray-900"
                      value={formData.validityDays}
                      onChange={(e) => handleInputChange("validityDays", parseInt(e.target.value) || 30)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="preparedBy" className="text-gray-900">Prepared By *</Label>
                    <Input
                      id="preparedBy"
                      defaultValue="Admin User"
                      disabled
                      className="mt-2 border-gray-300 text-gray-900"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Items */}
          {activeTab === "items" && (
            <Card className="bg-white border border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-gray-900">
                    RFQ Items
                  </CardTitle>
                  <p className="text-sm text-gray-500">
                    Add items for which you need quotations
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  onClick={handleAddItem}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-[#c1121f]/20 flex items-center justify-center">
                          <Package className="h-4 w-4 text-[#c1121f]" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Item {index + 1}</h4>
                          <p className="text-xs text-gray-500">Item code: {item.itemCode}</p>
                        </div>
                      </div>
                      {items.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveItem(index)}
                          className="h-8 w-8 text-red-500 hover:text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <Label className="text-xs text-gray-500">Description *</Label>
                        <Input
                          value={item.description}
                          onChange={(e) => handleUpdateItem(index, "description", e.target.value)}
                          className="mt-1 border-gray-300 text-gray-900 text-sm"
                          placeholder="Item description"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500">Quantity *</Label>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleUpdateItem(index, "quantity", parseInt(e.target.value) || 1)}
                          className="mt-1 border-gray-300 text-gray-900 text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500">Unit *</Label>
                        <Select 
                          value={item.unit} 
                          onValueChange={(value) => handleUpdateItem(index, "unit", value)}
                        >
                          <SelectTrigger className="mt-1 border-gray-300 text-gray-900 text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-white border-gray-200">
                            <SelectItem value="pcs">Pieces</SelectItem>
                            <SelectItem value="kg">Kilograms</SelectItem>
                            <SelectItem value="l">Liters</SelectItem>
                            <SelectItem value="m">Meters</SelectItem>
                            <SelectItem value="set">Sets</SelectItem>
                            <SelectItem value="box">Boxes</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500">Item Code</Label>
                        <Input
                          value={item.itemCode}
                          onChange={(e) => handleUpdateItem(index, "itemCode", e.target.value)}
                          className="mt-1 border-gray-300 text-gray-900 text-sm"
                          placeholder="e.g., ITEM-001"
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <Label className="text-xs text-gray-500">Specifications</Label>
                      <Textarea
                        value={item.specifications}
                        onChange={(e) => handleUpdateItem(index, "specifications", e.target.value)}
                        className="mt-1 border-gray-300 text-gray-900 text-sm min-h-[80px]"
                        placeholder="Technical specifications, requirements..."
                      />
                    </div>

                    <div className="mt-3">
                      <Label className="text-xs text-gray-500">Notes (Optional)</Label>
                      <Textarea
                        value={item.notes || ""}
                        onChange={(e) => handleUpdateItem(index, "notes", e.target.value)}
                        className="mt-1 border-gray-300 text-gray-900 text-sm min-h-[60px]"
                        placeholder="Additional notes..."
                      />
                    </div>
                  </div>
                ))}

                {items.length === 0 && (
                  <div className="text-center py-12 border border-dashed border-gray-200 rounded-lg">
                    <Package className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-400 mb-2">No items added</h3>
                    <p className="text-gray-500 mb-4">Add items to create your RFQ</p>
                    <Button 
                      variant="outline" 
                      className="border-gray-300 text-gray-700 hover:bg-gray-50"
                      onClick={handleAddItem}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Item
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Suppliers */}
          {activeTab === "suppliers" && (
            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900">
                  Invite Suppliers
                </CardTitle>
                <p className="text-sm text-gray-500">
                  Select suppliers to invite for this RFQ
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Quick Actions</h4>
                        <p className="text-sm text-gray-500">Manage supplier invitations</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-gray-300 text-gray-700 hover:bg-gray-50"
                          onClick={() => setSelectedSuppliers(vendors.map(s => String(s.id)))}
                        >
                          Select All
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-gray-300 text-gray-700 hover:bg-gray-50"
                          onClick={() => setSelectedSuppliers([])}
                        >
                          Clear All
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {vendors.length > 0 ? (
                      vendors.map((supplier) => {
                        const supplierId = String(supplier.id);
                        const isSelected = selectedSuppliers.includes(supplierId);
                        return (
                          <div
                            key={supplierId}
                            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                              isSelected
                                ? 'border-prms-primary bg-[#c1121f]/10'
                                : 'border-gray-200 hover:border-gray-200'
                            }`}
                            onClick={() => handleToggleSupplier(supplierId)}
                          >
                            <div className="flex items-center space-x-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                isSelected ? 'bg-[#c1121f]' : 'bg-gray-800'
                              }`}>
                                <Users className={`h-5 w-5 ${isSelected ? 'text-white' : 'text-gray-400'}`} />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <h4 className={`font-medium ${isSelected ? 'text-[#c1121f]' : 'text-gray-900'}`}>
                                    {supplier.name}
                                  </h4>
                                  {isSelected && (
                                    <div className="w-6 h-6 rounded-full bg-[#c1121f] flex items-center justify-center">
                                      <Check className="h-3 w-3 text-white" />
                                    </div>
                                  )}
                                </div>
                                <p className="text-sm text-gray-400 mt-1">{supplier.email}</p>
                                <div className="flex items-center mt-2">
                                  <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                                    {supplier.vendorType}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="col-span-1 md:col-span-2 p-8 text-center border-2 border-dashed border-gray-200 rounded-lg">
                        <p className="text-gray-500">No suppliers found in the database.</p>
                      </div>
                    )}
                  </div>

                  <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Invitation Summary</h4>
                        <p className="text-sm text-gray-400 mt-1">
                          {selectedSuppliers.length} supplier{selectedSuppliers.length !== 1 ? 's' : ''} selected
                        </p>
                      </div>
                      <Button 
                        variant="outline"
                        className="border-gray-300 text-gray-700 hover:bg-gray-50"
                        asChild
                      >
                        <a href="/prms/suppliers">
                          View All Suppliers
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Terms & Conditions */}
          {activeTab === "terms" && (
            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900">
                  Terms & Conditions
                </CardTitle>
                <p className="text-sm text-gray-500">
                  Define the evaluation criteria and terms for this RFQ
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="evaluationCriteria" className="text-gray-900">Evaluation Criteria</Label>
                  <Textarea
                    id="evaluationCriteria"
                    placeholder="1. Price (40%)
2. Delivery Time (30%)
3. Quality Assurance (20%)
4. Warranty (10%)

Total: 100%"
                    className="mt-2 border-gray-300 text-gray-900 min-h-[200px] font-mono text-sm"
                    value={formData.evaluationCriteria}
                    onChange={(e) => handleInputChange("evaluationCriteria", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="termsAndConditions" className="text-gray-900">Terms & Conditions</Label>
                  <Textarea
                    id="termsAndConditions"
                    placeholder="1. Quotation must include all taxes and duties.
2. Delivery must be completed within the specified timeframe.
3. Payment terms: 30 days from delivery.
4. Warranty: Minimum 1 year required.
5. Late delivery penalties: 0.1% per day.
6. Submission must include company registration certificate.
7. Product samples may be requested for evaluation."
                    className="mt-2 border-gray-300 text-gray-900 min-h-[300px]"
                    value={formData.termsAndConditions}
                    onChange={(e) => handleInputChange("termsAndConditions", e.target.value)}
                  />
                </div>

                <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <h4 className="font-medium text-white mb-2">Attachments (Optional)</h4>
                  <p className="text-sm text-gray-400 mb-4">
                    Upload supporting documents like technical specifications, drawings, or reference documents
                  </p>
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
                    <Upload className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 mb-2">Drag & drop files here, or click to browse</p>
                    <p className="text-xs text-gray-500 mb-4">Maximum file size: 10MB per file</p>
                    <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                      <Upload className="h-4 w-4 mr-2" />
                      Browse Files
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Summary Sidebar */}
        <div className="space-y-6">
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900">
                RFQ Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Title:</span>
                  <span className="text-white font-medium">{formData.title || "Not set"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Items:</span>
                  <span className="text-white font-medium">{items.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Suppliers:</span>
                  <span className="text-white font-medium">{selectedSuppliers.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Currency:</span>
                  <span className="text-white font-medium">{formData.currency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Validity:</span>
                  <span className="text-white font-medium">{formData.validityDays} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Deadline:</span>
                  <span className="text-white font-medium">
                    {formData.submissionDeadline ? new Date(formData.submissionDeadline).toLocaleDateString() : "Not set"}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between">
                  <span className="text-gray-400">Estimated Value:</span>
                  <span className="text-xl font-bold text-[#c1121f]">
                    {calculateEstimatedValue().toLocaleString()} {formData.currency}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900">
                Progress Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {tabs.map((tab, index) => {
                  const isActive = activeTab === tab.id;
                  const isCompleted = tabs.findIndex(t => t.id === activeTab) > index;
                  return (
                    <div key={tab.id} className="flex items-center">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                        isActive 
                          ? 'bg-[#c1121f]' 
                          : isCompleted 
                            ? 'bg-green-500' 
                            : 'bg-gray-700'
                      }`}>
                        {isCompleted ? (
                          <Check className="h-3 w-3 text-gray-900" />
                        ) : (
                          <span className={`text-xs ${isActive ? 'text-white' : 'text-gray-400'}`}>
                            {index + 1}
                          </span>
                        )}
                      </div>
                      <span className={`${isActive ? 'text-white font-medium' : 'text-gray-400'}`}>
                        {tab.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-2 text-sm">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-400">Last saved: Just now</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200">
            <CardContent className="p-6">
              <h4 className="font-medium text-white mb-4">Quick Actions</h4>
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-gray-300 text-gray-700 hover:bg-gray-50"
                  onClick={handleSaveDraft}
                  disabled={isSubmitting}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save as Draft
                </Button>
                <Button 
                  className="w-full justify-start bg-[#c1121f] hover:bg-[#a00f1a]"
                  onClick={handlePublishRFQ}
                  disabled={isSubmitting}
                >
                  <Send className="h-4 w-4 mr-2" />
                  {isSubmitting ? "Publishing..." : "Publish RFQ"}
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-gray-300 text-gray-700 hover:bg-gray-50"
                  onClick={() => router.back()}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Cancel & Return
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


