"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Plus, Trash2, Save, X, Loader2 } from "lucide-react";
import { SupplierRequest, SupplierCategory, CurrencyCode } from "@/features/prms/types/supplier";
import { useCreateVendor } from "@/features/prms/hooks/use-vendors";
import {
  BackendPaymentTerms,
  BackendVendorType,
  VendorCreateRequest,
  handleApiError,
  isApiError,
} from "@/lib/prms-api";

export default function NewSupplierPage() {
  const router = useRouter();
  const { toast } = useToast();
  const createVendor = useCreateVendor();
  const loading = createVendor.isPending;
  const [formData, setFormData] = useState<SupplierRequest>({
    companyName: "",
    category: "GOODS",
    email: "",
    country: "ET",
    paymentTermsDays: 30,
    currency: "ETB",
  });

  const [contacts, setContacts] = useState([
    { id: 1, name: "", email: "", phone: "", position: "", isPrimary: true },
  ]);

  const handleInputChange = (field: keyof SupplierRequest, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleContactChange = (index: number, field: string, value: string | boolean) => {
    const newContacts = [...contacts];
    if (field === "isPrimary") {
      newContacts.forEach((contact, i) => {
        newContacts[i].isPrimary = i === index;
      });
    } else {
      newContacts[index] = { ...newContacts[index], [field]: value };
    }
    setContacts(newContacts);
  };

  const addContact = () => {
    setContacts([...contacts, { id: contacts.length + 1, name: "", email: "", phone: "", position: "", isPrimary: false }]);
  };

  const removeContact = (index: number) => {
    const newContacts = contacts.filter((_, i) => i !== index);
    if (contacts[index].isPrimary && newContacts.length > 0) {
      newContacts[0].isPrimary = true;
    }
    setContacts(newContacts);
  };

  const mapPaymentTerms = (days: number): BackendPaymentTerms => {
    if (days <= 15) return "NET_15";
    if (days <= 30) return "NET_30";
    if (days <= 60) return "NET_60";
    return "COD";
  };

  const mapVendorType = (_category: SupplierCategory): BackendVendorType => "CORPORATE";

  const buildAddress = () => {
    const parts = [
      formData.addressLine1,
      formData.addressLine2,
      formData.city,
      formData.stateProvince,
      formData.postalCode,
      formData.country,
    ].filter(Boolean);
    return parts.join(", ") || "Not provided";
  };

  const buildVendorRequest = (): VendorCreateRequest => ({
    vendorCode: `VEN-${Date.now().toString().slice(-6)}`,
    name: formData.companyName.trim(),
    vendorType: mapVendorType(formData.category),
    taxIdentificationNumber: formData.taxId?.trim() || "PENDING",
    email: formData.email.trim(),
    phone: formData.phone?.trim() || "N/A",
    address: buildAddress(),
    paymentTerms: mapPaymentTerms(formData.paymentTermsDays ?? 30),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.companyName.trim() || !formData.email.trim()) {
      toast({
        title: "Error",
        description: "Company name and email are required.",
        variant: "destructive",
      });
      return;
    }

    try {
      await createVendor.mutateAsync(buildVendorRequest());
      router.push("/prms/suppliers");
    } catch (error) {
      toast({
        title: "Error",
        description: isApiError(error) ? handleApiError(error) : "Failed to create supplier. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
              <a href="/prms/suppliers">
                <ArrowLeft className="h-4 w-4" />
              </a>
            </Button>
            <h2 className="text-2xl font-bold text-gray-900">Register New Supplier</h2>
          </div>
          <p className="text-gray-400 mt-2">
            Add a new supplier to the procurement system
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="bg-gray-100 border border-gray-200">
            <TabsTrigger value="basic" className="data-[state=active]:bg-[#c1121f] data-[state=active]:text-white">
              Basic Information
            </TabsTrigger>
            <TabsTrigger value="contact" className="data-[state=active]:bg-[#c1121f] data-[state=active]:text-white">
              Contact Information
            </TabsTrigger>
            <TabsTrigger value="banking" className="data-[state=active]:bg-[#c1121f] data-[state=active]:text-white">
              Banking & Finance
            </TabsTrigger>
            <TabsTrigger value="documents" className="data-[state=active]:bg-[#c1121f] data-[state=active]:text-white">
              Documents
            </TabsTrigger>
          </TabsList>

          {/* Basic Information Tab */}
          <TabsContent value="basic" className="space-y-6">
            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900">Company Details</CardTitle>
                <CardDescription className="text-gray-400">
                  Basic information about the supplier company
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName" className="text-gray-300">
                      Company Name *
                    </Label>
                    <Input
                      id="companyName"
                      value={formData.companyName}
                      onChange={(e) => handleInputChange("companyName", e.target.value)}
                      className="border-gray-300 text-gray-900"
                      placeholder="Enter company name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tradingName" className="text-gray-300">
                      Trading Name
                    </Label>
                    <Input
                      id="tradingName"
                      value={formData.tradingName || ""}
                      onChange={(e) => handleInputChange("tradingName", e.target.value)}
                      className="border-gray-300 text-gray-900"
                      placeholder="Enter trading name (if different)"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-gray-300">
                      Category *
                    </Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value: SupplierCategory) => handleInputChange("category", value)}
                    >
                      <SelectTrigger className="border-gray-300 text-gray-900">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-200">
                        <SelectItem value="GOODS">Goods</SelectItem>
                        <SelectItem value="SERVICES">Services</SelectItem>
                        <SelectItem value="WORKS">Works</SelectItem>
                        <SelectItem value="CONSULTANCY">Consultancy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="taxId" className="text-gray-300">
                      Tax Identification Number
                    </Label>
                    <Input
                      id="taxId"
                      value={formData.taxId || ""}
                      onChange={(e) => handleInputChange("taxId", e.target.value)}
                      className="border-gray-300 text-gray-900"
                      placeholder="Enter tax ID"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="registrationNumber" className="text-gray-300">
                      Registration Number
                    </Label>
                    <Input
                      id="registrationNumber"
                      value={formData.registrationNumber || ""}
                      onChange={(e) => handleInputChange("registrationNumber", e.target.value)}
                      className="border-gray-300 text-gray-900"
                      placeholder="Enter registration number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website" className="text-gray-300">
                      Website
                    </Label>
                    <Input
                      id="website"
                      value={formData.website || ""}
                      onChange={(e) => handleInputChange("website", e.target.value)}
                      className="border-gray-300 text-gray-900"
                      placeholder="https://example.com"
                      type="url"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-gray-300">
                    Notes
                  </Label>
                  <Textarea
                    id="notes"
                    value={formData.notes || ""}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    className="border-gray-300 text-gray-900 min-h-[100px]"
                    placeholder="Additional notes about this supplier"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900">Address Information</CardTitle>
                <CardDescription className="text-gray-400">
                  Physical location and contact address
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="addressLine1" className="text-gray-300">
                    Address Line 1
                  </Label>
                  <Input
                    id="addressLine1"
                    value={formData.addressLine1 || ""}
                    onChange={(e) => handleInputChange("addressLine1", e.target.value)}
                    className="border-gray-300 text-gray-900"
                    placeholder="Street address, P.O. Box"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="addressLine2" className="text-gray-300">
                    Address Line 2
                  </Label>
                  <Input
                    id="addressLine2"
                    value={formData.addressLine2 || ""}
                    onChange={(e) => handleInputChange("addressLine2", e.target.value)}
                    className="border-gray-300 text-gray-900"
                    placeholder="Apartment, suite, unit, building, floor, etc."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-gray-300">
                      City
                    </Label>
                    <Input
                      id="city"
                      value={formData.city || ""}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      className="border-gray-300 text-gray-900"
                      placeholder="City"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stateProvince" className="text-gray-300">
                      State/Province
                    </Label>
                    <Input
                      id="stateProvince"
                      value={formData.stateProvince || ""}
                      onChange={(e) => handleInputChange("stateProvince", e.target.value)}
                      className="border-gray-300 text-gray-900"
                      placeholder="State or province"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode" className="text-gray-300">
                      Postal Code
                    </Label>
                    <Input
                      id="postalCode"
                      value={formData.postalCode || ""}
                      onChange={(e) => handleInputChange("postalCode", e.target.value)}
                      className="border-gray-300 text-gray-900"
                      placeholder="Postal code"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country" className="text-gray-300">
                    Country
                  </Label>
                  <Select
                    value={formData.country}
                    onValueChange={(value) => handleInputChange("country", value)}
                  >
                    <SelectTrigger className="border-gray-300 text-gray-900">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200 max-h-60">
                      <SelectItem value="ET">Ethiopia</SelectItem>
                      <SelectItem value="US">United States</SelectItem>
                      <SelectItem value="GB">United Kingdom</SelectItem>
                      <SelectItem value="CN">China</SelectItem>
                      <SelectItem value="IN">India</SelectItem>
                      <SelectItem value="KE">Kenya</SelectItem>
                      <SelectItem value="TZ">Tanzania</SelectItem>
                      <SelectItem value="UG">Uganda</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Information Tab */}
          <TabsContent value="contact" className="space-y-6">
            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900">Contact Information</CardTitle>
                <CardDescription className="text-gray-400">
                  Primary contact details for the supplier
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-300">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="border-gray-300 text-gray-900"
                      placeholder="contact@company.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-gray-300">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      value={formData.phone || ""}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="border-gray-300 text-gray-900"
                      placeholder="+251 11 123 4567"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-gray-900">Vendor Contacts</CardTitle>
                    <CardDescription className="text-gray-400">
                      Individual contacts within the supplier organization
                    </CardDescription>
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={addContact}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Contact
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {contacts.map((contact, index) => (
                  <div key={contact.id} className="p-4 border border-gray-200 rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {contact.isPrimary && (
                          <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                            Primary Contact
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleContactChange(index, "isPrimary", true)}
                          disabled={contact.isPrimary}
                          className="h-8 w-8"
                        >
                          <span className="text-xs">⭐</span>
                        </Button>
                        {contacts.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeContact(index)}
                            className="h-8 w-8 text-red-500 hover:text-red-400 hover:bg-red-500/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`contact-name-${index}`} className="text-gray-300">
                          Contact Name
                        </Label>
                        <Input
                          id={`contact-name-${index}`}
                          value={contact.name}
                          onChange={(e) => handleContactChange(index, "name", e.target.value)}
                          className="border-gray-300 text-gray-900"
                          placeholder="John Doe"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`contact-position-${index}`} className="text-gray-300">
                          Position
                        </Label>
                        <Input
                          id={`contact-position-${index}`}
                          value={contact.position}
                          onChange={(e) => handleContactChange(index, "position", e.target.value)}
                          className="border-gray-300 text-gray-900"
                          placeholder="Sales Manager"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`contact-email-${index}`} className="text-gray-300">
                          Email
                        </Label>
                        <Input
                          id={`contact-email-${index}`}
                          type="email"
                          value={contact.email}
                          onChange={(e) => handleContactChange(index, "email", e.target.value)}
                          className="border-gray-300 text-gray-900"
                          placeholder="john@company.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`contact-phone-${index}`} className="text-gray-300">
                          Phone
                        </Label>
                        <Input
                          id={`contact-phone-${index}`}
                          value={contact.phone}
                          onChange={(e) => handleContactChange(index, "phone", e.target.value)}
                          className="border-gray-300 text-gray-900"
                          placeholder="+251 11 123 4567"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Banking & Finance Tab */}
          <TabsContent value="banking" className="space-y-6">
            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900">Banking Information</CardTitle>
                <CardDescription className="text-gray-400">
                  Bank account details for payments
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bankName" className="text-gray-300">
                      Bank Name
                    </Label>
                    <Input
                      id="bankName"
                      value={formData.bankName || ""}
                      onChange={(e) => handleInputChange("bankName", e.target.value)}
                      className="border-gray-300 text-gray-900"
                      placeholder="Commercial Bank of Ethiopia"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bankAccountNumber" className="text-gray-300">
                      Account Number
                    </Label>
                    <Input
                      id="bankAccountNumber"
                      value={formData.bankAccountNumber || ""}
                      onChange={(e) => handleInputChange("bankAccountNumber", e.target.value)}
                      className="border-gray-300 text-gray-900"
                      placeholder="1234567890"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bankRoutingNumber" className="text-gray-300">
                    Routing Number / Swift Code
                  </Label>
                  <Input
                    id="bankRoutingNumber"
                    value={formData.bankRoutingNumber || ""}
                    onChange={(e) => handleInputChange("bankRoutingNumber", e.target.value)}
                    className="border-gray-300 text-gray-900"
                    placeholder="CBETETAA"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900">Financial Terms</CardTitle>
                <CardDescription className="text-gray-400">
                  Payment terms and credit information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="paymentTermsDays" className="text-gray-300">
                      Payment Terms (Days)
                    </Label>
                    <Input
                      id="paymentTermsDays"
                      type="number"
                      min="0"
                      max="365"
                      value={formData.paymentTermsDays}
                      onChange={(e) => handleInputChange("paymentTermsDays", parseInt(e.target.value) || 30)}
                      className="border-gray-300 text-gray-900"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency" className="text-gray-300">
                      Currency
                    </Label>
                    <Select
                      value={formData.currency}
                      onValueChange={(value: CurrencyCode) => handleInputChange("currency", value)}
                    >
                      <SelectTrigger className="border-gray-300 text-gray-900">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-200">
                        <SelectItem value="ETB">ETB - Ethiopian Birr</SelectItem>
                        <SelectItem value="USD">USD - US Dollar</SelectItem>
                        <SelectItem value="EUR">EUR - Euro</SelectItem>
                        <SelectItem value="GBP">GBP - British Pound</SelectItem>
                        <SelectItem value="KES">KES - Kenyan Shilling</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="creditLimit" className="text-gray-300">
                    Credit Limit
                  </Label>
                  <Input
                    id="creditLimit"
                    type="number"
                    min="0"
                    value={formData.creditLimit || ""}
                    onChange={(e) => handleInputChange("creditLimit", parseFloat(e.target.value) || 0)}
                    className="border-gray-300 text-gray-900"
                    placeholder="0.00"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-6">
            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900">Supplier Documents</CardTitle>
                <CardDescription className="text-gray-400">
                  Upload relevant documents for this supplier
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
                  <div className="mx-auto max-w-sm">
                    <div className="rounded-full bg-white w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <svg className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-white mb-2">Upload Documents</h3>
                    <p className="text-gray-400 mb-4">
                      Drag and drop files here, or click to browse
                    </p>
                    <Button type="button" variant="outline" className="border-gray-200">
                      Browse Files
                    </Button>
                    <p className="text-xs text-gray-500 mt-4">
                      Supported files: PDF, DOC, DOCX, JPG, PNG (Max 10MB each)
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-300 mb-3">Required Documents</h4>
                  <ul className="space-y-2 text-sm text-gray-500">
                    <li className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-amber-500 mr-2"></div>
                      Business Registration Certificate
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-amber-500 mr-2"></div>
                      Tax Identification Certificate
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-amber-500 mr-2"></div>
                      Bank Account Confirmation Letter
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Form Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
            onClick={() => router.back()}
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <div className="flex items-center space-x-3">
            <Button
              type="button"
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
            <Button
              type="submit"
              className="bg-[#c1121f] hover:bg-[#a00f1a]"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating…
                </>
              ) : (
                "Create Supplier"
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}


