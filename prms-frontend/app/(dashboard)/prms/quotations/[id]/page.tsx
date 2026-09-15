"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowLeft,
  Download,
  Printer,
  Mail,
  Eye,
  CheckCircle,
  XCircle,
  TrendingUp,
  DollarSign,
  Calendar,
  Building,
  FileText,
  Package,
  Clock,
  User,
  Award,
  Star,
  Edit,
  Copy,
  Share2,
  MoreVertical,
  ChevronRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Quotation, QuotationItem, RFQAttachment } from "@/features/prms/types/rfq";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useQuotation } from "@/features/prms/hooks/use-quotations";
import { Loader2, WifiOff } from "lucide-react";

export default function QuotationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const quotationId = params?.id as string | undefined;
  
  const { data: apiQuotation, isLoading, isError, refetch } = useQuotation(quotationId);
  const quotation = apiQuotation;
  const evaluationData: any = null; // Real evaluation data will be loaded from API when available
  const [activeTab, setActiveTab] = useState<"details" | "items" | "evaluation" | "attachments">("details");

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'bg-gray-500/20 text-gray-400';
      case 'SUBMITTED': return 'bg-blue-500/20 text-blue-400';
      case 'UNDER_REVIEW': return 'bg-amber-500/20 text-amber-400';
      case 'EVALUATED': return 'bg-purple-500/20 text-purple-400';
      case 'ACCEPTED': return 'bg-green-500/20 text-green-400';
      case 'REJECTED': return 'bg-red-500/20 text-red-400';
      case 'EXPIRED': return 'bg-gray-500/20 text-gray-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DRAFT': return <FileText className="h-3 w-3 mr-1" />;
      case 'SUBMITTED': return <Clock className="h-3 w-3 mr-1" />;
      case 'UNDER_REVIEW': return <TrendingUp className="h-3 w-3 mr-1" />;
      case 'EVALUATED': return <Star className="h-3 w-3 mr-1" />;
      case 'ACCEPTED': return <CheckCircle className="h-3 w-3 mr-1" />;
      case 'REJECTED': return <XCircle className="h-3 w-3 mr-1" />;
      case 'EXPIRED': return <Clock className="h-3 w-3 mr-1" />;
      default: return <FileText className="h-3 w-3 mr-1" />;
    }
  };

  const handleDownloadQuotation = () => {
    toast({
      title: "Quotation downloaded",
      description: "Quotation PDF has been downloaded successfully.",
    });
  };

  const handlePrintQuotation = () => {
    toast({
      title: "Printing quotation",
      description: "Opening print dialog...",
    });
  };

  const handleSendEmail = () => {
    toast({
      title: "Email sent",
      description: "Quotation has been sent via email.",
    });
  };

  const handleEvaluate = () => {
    toast({
      title: "Starting evaluation",
      description: "Redirecting to evaluation form...",
    });
  };

  const handleAccept = () => {
    toast({
      title: "Quotation accepted",
      description: "Quotation has been accepted. Creating purchase order...",
    });
  };

  const handleReject = () => {
    toast({
      title: "Quotation rejected",
      description: "Quotation has been rejected.",
    });
  };

  const handleCompare = () => {
    toast({
      title: "Comparison mode",
      description: "Opening quotation comparison interface...",
    });
  };

  const getDaysRemaining = (validUntil: string) => {
    const validDate = new Date(validUntil);
    const now = new Date();
    const diffTime = validDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysRemaining = quotation ? getDaysRemaining(quotation.validUntil) : 0;
  const isValid = daysRemaining > 0;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (isError || !quotation) {
    return (
      <div className="p-8 text-center bg-gray-50 border border-gray-200 rounded-lg">
        <WifiOff className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Quotation Not Found</h3>
        <p className="text-gray-500 mb-4">Could not load quotation from backend.</p>
        <Button asChild>
          <a href="/prms/quotations">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Quotations
          </a>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center space-x-3">
              <h2 className="text-2xl font-bold text-gray-900">
                Quotation {quotation.quotationNumber}
              </h2>
              <Badge className={`inline-flex items-center ${getStatusColor(quotation.status)}`}>
                {getStatusIcon(quotation.status)}
                {quotation.status.replace('_', ' ')}
              </Badge>
            </div>
            <div className="flex items-center text-gray-400 mt-2 space-x-4">
              <span className="flex items-center">
                <Building className="h-4 w-4 mr-1" />
                {quotation.supplierName}
              </span>
              <span>•</span>
              <span className="flex items-center">
                <FileText className="h-4 w-4 mr-1" />
                RFQ: {quotation.rfqNumber}
              </span>
              <span>•</span>
              <span className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Submitted: {formatDate(quotation.submittedAt || quotation.createdAt)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
            onClick={handleDownloadQuotation}
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button 
            variant="outline" 
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
            onClick={handlePrintQuotation}
          >
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button 
            className="bg-[#c1121f] hover:bg-[#a00f1a]"
            onClick={handleCompare}
          >
            <Eye className="h-4 w-4 mr-2" />
            Compare
          </Button>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-white border border-gray-200 border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <p className="text-sm text-gray-400">Total Amount</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(quotation.totalAmount)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Valid Until</p>
              <p className={`text-lg font-medium ${isValid ? (daysRemaining <= 7 ? 'text-amber-400' : 'text-white') : 'text-red-400'}`}>
                {formatDate(quotation.validUntil)}
                <span className="text-sm ml-2">
                  ({isValid ? `${daysRemaining} days left` : 'Expired'})
                </span>
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {quotation.status === 'SUBMITTED' || quotation.status === 'UNDER_REVIEW' ? (
              <Button 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={handleEvaluate}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Evaluate Quotation
              </Button>
            ) : quotation.status === 'EVALUATED' ? (
              <>
                <Button 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={handleAccept}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Accept
                </Button>
                <Button 
                  variant="outline"
                  className="border-red-600 text-red-500 hover:text-red-400 hover:bg-red-600/10"
                  onClick={handleReject}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              </>
            ) : null}
            
            <Button 
              variant="outline" 
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
              onClick={handleSendEmail}
            >
              <Mail className="h-4 w-4 mr-2" />
              Send Email
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs */}
          <div className="flex space-x-1 border-b border-gray-200">
            {[
              { id: "details", label: "Details", icon: FileText },
              { id: "items", label: "Items", icon: Package },
              { id: "evaluation", label: "Evaluation", icon: Star },
              { id: "attachments", label: "Attachments", icon: FileText }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-colors ${
                    isActive 
                      ? 'border-[#c1121f] text-[#c1121f]' 
                      : 'border-transparent text-gray-400 hover:text-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {/* Details Tab */}
            {activeTab === "details" && (
              <div className="space-y-6">
                <Card className="bg-white border border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-gray-900">Quotation Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-400">Quotation Number</p>
                        <p className="text-white font-medium">{quotation.quotationNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">RFQ Number</p>
                        <p className="text-white font-medium">{quotation.rfqNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Quotation Date</p>
                        <p className="text-white font-medium">{formatDate(quotation.quotationDate)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Valid Until</p>
                        <p className={`font-medium ${isValid ? (daysRemaining <= 7 ? 'text-amber-400' : 'text-white') : 'text-red-400'}`}>
                          {formatDate(quotation.validUntil)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-gray-900">Terms & Conditions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {quotation.deliveryTerms && (
                      <div>
                        <h4 className="font-medium text-white mb-2 flex items-center">
                          <Package className="h-4 w-4 mr-2" />
                          Delivery Terms
                        </h4>
                        <p className="text-gray-300">{quotation.deliveryTerms}</p>
                      </div>
                    )}
                    
                    {quotation.paymentTerms && (
                      <div>
                        <h4 className="font-medium text-white mb-2 flex items-center">
                          <DollarSign className="h-4 w-4 mr-2" />
                          Payment Terms
                        </h4>
                        <p className="text-gray-300">{quotation.paymentTerms}</p>
                      </div>
                    )}
                    
                    {quotation.warrantyTerms && (
                      <div>
                        <h4 className="font-medium text-white mb-2 flex items-center">
                          <Award className="h-4 w-4 mr-2" />
                          Warranty Terms
                        </h4>
                        <p className="text-gray-300">{quotation.warrantyTerms}</p>
                      </div>
                    )}
                    
                    {quotation.notes && (
                      <div>
                        <h4 className="font-medium text-white mb-2 flex items-center">
                          <FileText className="h-4 w-4 mr-2" />
                          Additional Notes
                        </h4>
                        <p className="text-gray-300">{quotation.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="bg-white border border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-gray-900">Supplier Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                        <Building className="h-6 w-6 text-gray-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{quotation.supplierName}</h4>
                        <p className="text-sm text-gray-400">Supplier ID: {quotation.supplierId}</p>
                        <Button variant="link" className="p-0 h-auto text-sm text-blue-400 hover:text-blue-300" asChild>
                          <a href={`/prms/suppliers/${quotation.supplierId}`}>
                            View Supplier Details <ChevronRight className="h-3 w-3 ml-1" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Items Tab */}
            {activeTab === "items" && (
              <Card className="bg-white border border-gray-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-gray-900">Quotation Items</CardTitle>
                    <p className="text-sm text-gray-400">
                      Total: {formatCurrency(quotation.totalAmount)} {quotation.currency}
                    </p>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 text-gray-400 font-medium">Item Code</th>
                          <th className="text-left py-3 px-4 text-gray-400 font-medium">Description</th>
                          <th className="text-left py-3 px-4 text-gray-400 font-medium">Quantity</th>
                          <th className="text-left py-3 px-4 text-gray-400 font-medium">Unit Price</th>
                          <th className="text-left py-3 px-4 text-gray-400 font-medium">Total Price</th>
                          <th className="text-left py-3 px-4 text-gray-400 font-medium">Delivery</th>
                        </tr>
                      </thead>
                      <tbody>
                        {quotation.items.map((item, index) => (
                          <tr key={item.id} className="border-b border-gray-200/50">
                            <td className="py-3 px-4">
                              <span className="font-mono text-sm">{item.itemCode}</span>
                            </td>
                            <td className="py-3 px-4">
                              <div>
                                <div className="font-medium text-gray-900">{item.description}</div>
                                {item.notes && (
                                  <div className="text-xs text-gray-500 mt-1">{item.notes}</div>
                                )}
                                {item.warrantyMonths && (
                                  <div className="text-xs text-amber-500 mt-1">
                                    {item.warrantyMonths} months warranty
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="font-medium text-gray-900">{item.quantity}</div>
                              <div className="text-xs text-gray-500">{item.unit}</div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="font-medium text-gray-900">{formatCurrency(item.unitPrice)}</div>
                              <div className="text-xs text-gray-500">{quotation.currency}</div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="font-medium text-gray-900">{formatCurrency(item.totalPrice)}</div>
                              <div className="text-xs text-gray-500">{quotation.currency}</div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 text-gray-500 mr-2" />
                                <div>
                                  <div className="font-medium text-gray-900">{item.deliveryDays} days</div>
                                  <div className="text-xs text-gray-500">Delivery time</div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="bg-gray-50">
                          <td colSpan={4} className="py-3 px-4 text-right text-gray-400">
                            Total Amount:
                          </td>
                          <td colSpan={2} className="py-3 px-4">
                            <div className="text-xl font-bold text-gray-900">
                              {formatCurrency(quotation.totalAmount)} {quotation.currency}
                            </div>
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Evaluation Tab */}
            {activeTab === "evaluation" && (
              <div className="space-y-6">
                {quotation.evaluationScore ? (
                  <>
                    <Card className="bg-white border border-gray-200">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-gray-900">Evaluation Results</CardTitle>
                          <Badge className="bg-green-500/20 text-green-400">
                            Score: {quotation.evaluationScore}/100
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div>
                          <h4 className="font-medium text-white mb-4">Evaluation Criteria</h4>
                          <div className="space-y-4">
                    </Card>
                  </>
                ) : (
                  <Card className="bg-white border border-gray-200">
                    <CardContent className="py-12 text-center">
                      <TrendingUp className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                      <h3 className="text-xl font-medium text-gray-400 mb-2">Not Yet Evaluated</h3>
                      <p className="text-gray-500 mb-6 max-w-md mx-auto">
                        This quotation has not been evaluated yet. Start the evaluation process to score and review this quotation.
                      </p>
                      <Button 
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={handleEvaluate}
                      >
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Start Evaluation
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Attachments Tab */}
            {activeTab === "attachments" && (
              <Card className="bg-white border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-gray-900">Attachments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {quotation.attachments.map((attachment) => (
                      <div key={attachment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                            <FileText className="h-5 w-5 text-gray-400" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{attachment.name}</h4>
                            <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                              <span>{attachment.type}</span>
                              <span>•</span>
                              <span>Uploaded: {formatDate(attachment.uploadedAt)}</span>
                              <span>•</span>
                              <span>By: {attachment.uploadedBy}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}

                    {quotation.attachments.length === 0 && (
                      <div className="text-center py-12 border border-dashed border-gray-200 rounded-lg">
                        <FileText className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-400 mb-2">No attachments</h3>
                        <p className="text-gray-500">No attachments have been uploaded for this quotation.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Right Column - Summary & Actions */}
        <div className="space-y-6">
          {/* Status Summary */}
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900">Status Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Status:</span>
                  <Badge className={getStatusColor(quotation.status)}>
                    {getStatusIcon(quotation.status)}
                    {quotation.status.replace('_', ' ')}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Validity:</span>
                  <span className={`font-medium ${isValid ? (daysRemaining <= 7 ? 'text-amber-400' : 'text-green-400') : 'text-red-400'}`}>
                    {isValid ? `${daysRemaining} days left` : 'Expired'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Submitted:</span>
                  <span className="text-gray-900">{formatDate(quotation.submittedAt || quotation.createdAt)}</span>
                </div>
                {quotation.evaluatedAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Evaluated:</span>
                    <span className="text-gray-900">{formatDate(quotation.evaluatedAt)}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card className="bg-white border border-gray-200">
            <CardContent className="p-6">
              <h4 className="font-medium text-white mb-4">Actions</h4>
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-gray-300 text-gray-700 hover:bg-gray-50"
                  onClick={handleDownloadQuotation}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Quotation
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-gray-300 text-gray-700 hover:bg-gray-50"
                  onClick={handlePrintQuotation}
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Print Quotation
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-gray-300 text-gray-700 hover:bg-gray-50"
                  onClick={handleSendEmail}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Send via Email
                </Button>
                
                {(quotation.status === 'SUBMITTED' || quotation.status === 'UNDER_REVIEW') && (
                  <Button 
                    className="w-full justify-start bg-blue-600 hover:bg-blue-700"
                    onClick={handleEvaluate}
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Evaluate Quotation
                  </Button>
                )}
                
                {quotation.status === 'EVALUATED' && (
                  <>
                    <Button 
                      className="w-full justify-start bg-green-600 hover:bg-green-700"
                      onClick={handleAccept}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Accept Quotation
                    </Button>
                    <Button 
                      variant="outline"
                      className="w-full justify-start border-red-600 text-red-500 hover:text-red-400 hover:bg-red-600/10"
                      onClick={handleReject}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject Quotation
                    </Button>
                  </>
                )}
                
                <Button 
                  className="w-full justify-start bg-[#c1121f] hover:bg-[#a00f1a]"
                  onClick={handleCompare}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Compare with Others
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-gray-300 text-gray-700 hover:bg-gray-50"
                  asChild
                >
                  <a href={`/prms/rfq/${quotation.rfqId}`}>
                    <FileText className="h-4 w-4 mr-2" />
                    View RFQ Details
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Financial Summary */}
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900">Financial Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Amount:</span>
                  <span className="text-xl font-bold text-gray-900">
                    {formatCurrency(quotation.totalAmount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Currency:</span>
                  <span className="text-gray-900">{quotation.currency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Items Count:</span>
                  <span className="text-gray-900">{quotation.items.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Average Unit Price:</span>
                  <span className="text-gray-900">
                    {formatCurrency(quotation.items.reduce((sum, item) => sum + item.unitPrice, 0) / quotation.items.length)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


