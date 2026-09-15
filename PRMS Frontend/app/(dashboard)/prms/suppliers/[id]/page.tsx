"use client";

import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  Edit, 
  Download, 
  Printer, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Building, 
  User, 
  FileText, 
  ShoppingCart, 
  Receipt,
  Calendar,
  CreditCard,
  Star,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  BarChart3,
  Loader2,
  WifiOff,
  RefreshCw,
} from "lucide-react";
import { Supplier, SupplierContact } from "@/features/prms/types/supplier";
import { formatCurrency } from "@/lib/utils";
import { useVendor } from "@/features/prms/hooks/use-vendors";

export default function SupplierDetailsPage() {
  const params = useParams();
  const { toast } = useToast();
  const vendorId = params?.id as string | undefined;
  const { data: apiVendor, isLoading, isError, refetch } = useVendor(vendorId);

  const supplier: Supplier | undefined = apiVendor
    ? {
        id: String(apiVendor.id),
        supplierCode: apiVendor.vendorCode,
        companyName: apiVendor.name,
        category: apiVendor.vendorType === "GOVERNMENT" ? "CONSULTANCY" : "GOODS",
        status: apiVendor.blacklisted ? "BLACKLISTED" : "ACTIVE",
        taxId: apiVendor.taxIdentificationNumber,
        email: apiVendor.email,
        phone: apiVendor.phone,
        addressLine1: apiVendor.address,
        country: "ET",
        paymentTermsDays: apiVendor.paymentTerms === "NET_15" ? 15 : apiVendor.paymentTerms === "NET_60" ? 60 : 30,
        currency: "ETB",
        rating: apiVendor.performanceScore ?? undefined,
        contacts: [] as SupplierContact[],
        documents: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: "system",
      }
    : undefined;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-500/20 text-green-400';
      case 'INACTIVE': return 'bg-gray-500/20 text-gray-400';
      case 'BLACKLISTED': return 'bg-red-500/20 text-red-400';
      case 'PENDING_APPROVAL': return 'bg-amber-500/20 text-amber-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'GOODS': return 'bg-blue-500/20 text-blue-400';
      case 'SERVICES': return 'bg-purple-500/20 text-purple-400';
      case 'WORKS': return 'bg-amber-500/20 text-amber-400';
      case 'CONSULTANCY': return 'bg-teal-500/20 text-teal-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {isLoading && (
        <div className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm text-blue-700">
          <Loader2 className="h-4 w-4 animate-spin flex-shrink-0" />
          Fetching vendor from <code className="font-mono text-xs">GET /api/v1/vendors/{vendorId}</code>…
        </div>
      )}
      {isError && (
        <div className="flex items-center justify-between gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
          <div className="flex items-center gap-2">
            <WifiOff className="h-4 w-4 flex-shrink-0" />
            Could not load supplier from backend.
          </div>
          <Button variant="ghost" size="sm" className="text-amber-700 hover:bg-amber-100 h-7 text-xs" onClick={() => refetch()}>
            <RefreshCw className="h-3.5 w-3.5 mr-1" />Retry
          </Button>
        </div>
      )}
      {apiVendor && (
        <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-2.5 text-sm text-green-700">
          <span className="h-2 w-2 rounded-full bg-green-500 flex-shrink-0" />
          Live data — {supplier?.companyName} loaded from backend
        </div>
      )}
      
      {!supplier && !isLoading && (
        <div className="p-8 text-center bg-gray-50 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Supplier Not Found</h3>
          <p className="text-gray-500 mb-4">The requested supplier could not be found or failed to load.</p>
          <Button asChild>
            <a href="/prms/suppliers">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Suppliers
            </a>
          </Button>
        </div>
      )}

      {supplier && (
        <>
          {/* Page Header */}
          <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
              <a href="/prms/suppliers">
                <ArrowLeft className="h-4 w-4" />
              </a>
            </Button>
            <h2 className="text-2xl font-bold text-gray-900">{supplier.companyName}</h2>
            <Badge className={`ml-2 ${getStatusColor(supplier.status)}`}>
              {supplier.status.replace('_', ' ')}
            </Badge>
          </div>
          <p className="text-gray-400 mt-2">
            Supplier Code: <span className="text-blue-400 font-mono">{supplier.supplierCode}</span>
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button className="bg-[#c1121f] hover:bg-[#a00f1a]" asChild>
            <a href={`/prms/suppliers/${supplier.id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Supplier
            </a>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Orders</p>
                <p className="text-2xl font-bold text-white mt-1">24</p>
              </div>
              <ShoppingCart className="h-10 w-10 text-blue-500" />
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500">+12%</span>
              <span className="text-gray-500 ml-2">from last month</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Spending</p>
                <p className="text-2xl font-bold text-white mt-1">{formatCurrency(1250000)}</p>
              </div>
              <CreditCard className="h-10 w-10 text-green-500" />
            </div>
            <div className="mt-4 text-sm text-gray-500">YTD spending</div>
          </CardContent>
        </Card>
        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Active Contracts</p>
                <p className="text-2xl font-bold text-white mt-1">3</p>
              </div>
              <FileText className="h-10 w-10 text-purple-500" />
            </div>
            <div className="mt-4 text-sm text-gray-500">2 expiring soon</div>
          </CardContent>
        </Card>
        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Performance Score</p>
                <div className="flex items-baseline mt-1">
                  <span className="text-2xl font-bold text-gray-900">{supplier.rating?.toFixed(1) || 'N/A'}</span>
                  <span className="text-gray-500 text-sm ml-1">/5.0</span>
                </div>
              </div>
              <div className="relative">
                <Star className="h-10 w-10 text-amber-500" fill="currentColor" />
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-bold">{supplier.rating?.toFixed(1) || '0'}</span>
                </div>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-500 flex items-center">
              {supplier.rating && supplier.rating >= 4 ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-500">Excellent</span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4 text-amber-500 mr-1" />
                  <span className="text-amber-500">Needs improvement</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-white border border-gray-200">
          <TabsTrigger value="overview" className="data-[state=active]:bg-[#c1121f]">
            Overview
          </TabsTrigger>
          <TabsTrigger value="contacts" className="data-[state=active]:bg-[#c1121f]">
            Contacts
          </TabsTrigger>
          <TabsTrigger value="performance" className="data-[state=active]:bg-[#c1121f]">
            Performance
          </TabsTrigger>
          <TabsTrigger value="documents" className="data-[state=active]:bg-[#c1121f]">
            Documents
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-[#c1121f]">
            Purchase History
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Company Information */}
            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900">Company Information</CardTitle>
                <CardDescription className="text-gray-400">
                  Basic details and registration information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start">
                    <Building className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{supplier.companyName}</p>
                      {supplier.tradingName && (
                        <p className="text-sm text-gray-400">Trading as: {supplier.tradingName}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Badge className={getCategoryColor(supplier.category)}>
                      {supplier.category}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                    <div>
                      <p className="text-xs text-gray-500">Supplier Code</p>
                      <p className="text-sm font-medium text-gray-900">{supplier.supplierCode}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Tax ID</p>
                      <p className="text-sm text-gray-700">{supplier.taxId || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Registration No.</p>
                      <p className="text-sm text-gray-700">{supplier.registrationNumber || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Registered</p>
                      <p className="text-sm text-gray-700">
                        {new Date(supplier.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900">Contact Information</CardTitle>
                <CardDescription className="text-gray-400">
                  Primary contact details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{supplier.email}</p>
                      <p className="text-xs text-gray-500">Email Address</p>
                    </div>
                  </div>
                  
                  {supplier.phone && (
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-gray-500 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{supplier.phone}</p>
                        <p className="text-xs text-gray-500">Phone Number</p>
                      </div>
                    </div>
                  )}
                  
                  {supplier.website && (
                    <div className="flex items-center">
                      <Globe className="h-5 w-5 text-gray-500 mr-3" />
                      <div>
                        <a href={supplier.website} className="text-sm text-blue-400 hover:text-blue-300">
                          {supplier.website}
                        </a>
                        <p className="text-xs text-gray-500">Website</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Address */}
                {(supplier.addressLine1 || supplier.city) && (
                  <>
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-start mb-3">
                        <MapPin className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-white mb-1">Address</p>
                        </div>
                      </div>
                      <div className="space-y-1 pl-8">
                        {supplier.addressLine1 && (
                          <p className="text-sm text-gray-700">{supplier.addressLine1}</p>
                        )}
                        {supplier.addressLine2 && (
                          <p className="text-sm text-gray-700">{supplier.addressLine2}</p>
                        )}
                        <p className="text-sm text-gray-700">
                          {[supplier.city, supplier.stateProvince, supplier.postalCode, supplier.country]
                            .filter(Boolean)
                            .join(', ')}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Financial Information */}
            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900">Financial Information</CardTitle>
                <CardDescription className="text-gray-400">
                  Banking and payment terms
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Currency</p>
                    <p className="text-sm font-medium text-gray-900">{supplier.currency}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Payment Terms</p>
                    <p className="text-sm font-medium text-gray-900">{supplier.paymentTermsDays} days</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Credit Limit</p>
                    <p className="text-sm font-medium text-gray-900">
                      {supplier.creditLimit ? formatCurrency(supplier.creditLimit) : 'Not set'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Bank Name</p>
                    <p className="text-sm text-gray-700">{supplier.bankName || 'Not provided'}</p>
                  </div>
                </div>
                
                {supplier.bankAccountNumber && (
                  <div className="pt-4 border-t border-gray-200">
                    <div>
                      <p className="text-xs text-gray-500">Bank Account</p>
                      <p className="text-sm font-medium text-gray-900">{supplier.bankAccountNumber}</p>
                      {supplier.bankRoutingNumber && (
                        <p className="text-xs text-gray-500 mt-1">
                          Routing: {supplier.bankRoutingNumber}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {supplier.notes && (
                  <div className="pt-4 border-t border-gray-200">
                    <div>
                      <p className="text-xs text-gray-500 mb-2">Notes</p>
                      <p className="text-sm text-gray-700">{supplier.notes}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900">Recent Activity</CardTitle>
                <CardDescription className="text-gray-400">
                  Latest interactions and updates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { date: '2024-03-15', activity: 'Purchase order PO-2024-00123 created', user: 'John Doe' },
                    { date: '2024-03-10', activity: 'Supplier rating updated to 4.5', user: 'System' },
                    { date: '2024-03-05', activity: 'Contact information updated', user: 'Sarah Johnson' },
                    { date: '2024-02-28', activity: 'Credit limit increased to 1,000,000 ETB', user: 'Finance Dept' },
                    { date: '2024-02-20', activity: 'New contract CON-2024-00012 signed', user: 'Procurement' },
                  ].map((item, index) => (
                    <div key={index} className="flex items-start pb-4 border-b border-gray-200 last:border-0 last:pb-0">
                      <div className="w-2 h-2 rounded-full bg-[#c1121f] mt-1.5 mr-3"></div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{item.activity}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-gray-500">{item.user}</span>
                          <span className="text-xs text-gray-500">{item.date}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Contacts Tab */}
        <TabsContent value="contacts" className="space-y-6">
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900">Vendor Contacts</CardTitle>
              <CardDescription className="text-gray-400">
                Individuals to contact within this supplier organization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {supplier.contacts.length > 0 ? (
                  supplier.contacts.map((contact: SupplierContact, index: number) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center">
                            <User className="h-5 w-5 text-gray-500 mr-2" />
                            <h4 className="font-medium text-gray-900">{contact.name || 'Unnamed Contact'}</h4>
                          </div>
                          <p className="text-sm text-gray-400 mt-1">{contact.position}</p>
                        </div>
                        {contact.isPrimary && (
                          <Badge className="bg-green-500/20 text-green-400 text-xs">
                            Primary
                          </Badge>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        {contact.email && (
                          <div className="flex items-center text-sm">
                            <Mail className="h-4 w-4 text-gray-500 mr-2" />
                            <a href={`mailto:${contact.email}`} className="text-blue-400 hover:text-blue-300">
                              {contact.email}
                            </a>
                          </div>
                        )}
                        
                        {contact.phone && (
                          <div className="flex items-center text-sm">
                            <Phone className="h-4 w-4 text-gray-500 mr-2" />
                            <a href={`tel:${contact.phone}`} className="text-gray-300">
                              {contact.phone}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-3 text-center py-8">
                    <User className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-400 mb-2">No contacts added</h3>
                    <p className="text-gray-500 mb-4">Add contacts to this supplier for better communication</p>
                    <Button asChild>
                      <a href={`/prms/suppliers/${supplier.id}/edit`}>
                        <Edit className="h-4 w-4 mr-2" />
                        Add Contacts
                      </a>
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900">Performance Metrics</CardTitle>
                <CardDescription className="text-gray-400">
                  Supplier evaluation and rating
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Overall Rating */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Overall Rating</p>
                      <p className="text-2xl font-bold text-gray-900 mt-2">{supplier.rating?.toFixed(1) || 'N/A'}<span className="text-gray-500 text-lg">/5.0</span></p>
                    </div>
                    <div className="text-4xl">
                      {supplier.rating && supplier.rating >= 4 ? (
                        <span className="text-green-500">⭐</span>
                      ) : supplier.rating && supplier.rating >= 3 ? (
                        <span className="text-amber-500">⭐</span>
                      ) : (
                        <span className="text-red-500">⭐</span>
                      )}
                    </div>
                  </div>

                  {/* Rating Breakdown */}
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-300">Delivery Time</span>
                        <span className="text-white font-medium">4.2/5.0</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: '84%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-300">Product Quality</span>
                        <span className="text-white font-medium">4.5/5.0</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: '90%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-300">Communication</span>
                        <span className="text-white font-medium">4.0/5.0</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: '80%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-300">Pricing</span>
                        <span className="text-white font-medium">3.8/5.0</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: '76%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900">Key Performance Indicators</CardTitle>
                <CardDescription className="text-gray-400">
                  Supplier performance over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 border border-gray-200 rounded-lg">
                      <p className="text-2xl font-bold text-gray-900">98%</p>
                      <p className="text-xs text-gray-400 mt-1">On-time Delivery</p>
                    </div>
                    <div className="text-center p-4 border border-gray-200 rounded-lg">
                      <p className="text-2xl font-bold text-gray-900">2.5%</p>
                      <p className="text-xs text-gray-400 mt-1">Defect Rate</p>
                    </div>
                    <div className="text-center p-4 border border-gray-200 rounded-lg">
                      <p className="text-2xl font-bold text-gray-900">24 hrs</p>
                      <p className="text-xs text-gray-400 mt-1">Avg Response Time</p>
                    </div>
                    <div className="text-center p-4 border border-gray-200 rounded-lg">
                      <p className="text-2xl font-bold text-gray-900">0</p>
                      <p className="text-xs text-gray-400 mt-1">Contract Violations</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-sm font-medium text-gray-900">Monthly Order Volume</p>
                      <BarChart3 className="h-5 w-5 text-gray-500" />
                    </div>
                    <div className="h-40 flex items-end space-x-1">
                      {[65, 80, 75, 90, 85, 95, 100, 85, 90, 95, 85, 90].map((height, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center">
                          <div 
                            className="w-full bg-gradient-to-t from-prms-primary to-prms-primary/50 rounded-t-sm"
                            style={{ height: `${height}%` }}
                          ></div>
                          <span className="text-xs text-gray-500 mt-1">{['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][index]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
        </>
      )}
    </div>
  );
}



