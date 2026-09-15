"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  Edit, 
  Download, 
  Printer, 
  User, 
  Calendar, 
  DollarSign,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ShoppingCart,
  MessageSquare,
  Paperclip,
  Loader2,
  WifiOff,
  RefreshCw,
} from "lucide-react";
import { PurchaseRequest, PurchaseRequestStatus, PurchaseRequestPriority } from "@/features/prms/types/purchase-request";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useRequisition } from "@/features/prms/hooks/use-requisitions";
import { useDecideOnRequisition } from "@/features/prms/hooks/use-approvals";

export default function PurchaseRequestDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const requisitionId = params?.id as string | undefined;
  const { data: apiRequisition, isLoading, isError, refetch } = useRequisition(requisitionId);
  const decide = useDecideOnRequisition();
  const [localStatusOverride, setLocalStatusOverride] = useState<PurchaseRequestStatus | null>(null);

  const rawStatus = apiRequisition
    ? (apiRequisition.status as PurchaseRequestStatus)
    : "DRAFT";

  const currentStatus = localStatusOverride || rawStatus;

  const purchaseRequest: PurchaseRequest = {
    id: String(apiRequisition?.id || requisitionId || "1"),
    prNumber: apiRequisition?.requisitionNumber || `PR-${requisitionId || '0000'}`,
    title: apiRequisition?.purpose || "Purchase Requisition",
    description: apiRequisition?.itemDetails || "",
    status: currentStatus,
    priority: "MEDIUM",
    requesterId: apiRequisition?.requesterEmployeeId || "procurement_admin",
    departmentId: apiRequisition?.departmentCode || "GENERAL",
    costCenterId: "CC-001 - Infrastructure",
    budgetLineId: "BL-001 - Equipment",
    requiredDate: apiRequisition?.requiredByDate || new Date().toISOString().split('T')[0],
    estimatedAmount: apiRequisition?.estimatedAmount || 0,
    approvedAmount: apiRequisition?.estimatedAmount || 0,
    currency: "ETB",
    justification: apiRequisition?.purpose || "No justification provided.",
    submittedAt: apiRequisition?.createdAt || new Date().toISOString(),
    items: [],
    attachments: [],
    createdAt: apiRequisition?.createdAt || new Date().toISOString(),
    updatedAt: apiRequisition?.createdAt || new Date().toISOString(),
    createdBy: apiRequisition?.requesterEmployeeId || "procurement_admin",
  };

  const handleApprovalAction = (action: 'APPROVE' | 'REJECT' | 'RETURN') => {
    const idToUse = apiRequisition?.id || requisitionId || '1';
    decide.mutate(
      { requisitionId: idToUse, action, comments: `Decision recorded on PR detail view: ${action}` },
      {
        onSuccess: () => {
          const newStatus = action === 'APPROVE' ? 'APPROVED' : action === 'REJECT' ? 'REJECTED' : 'UNDER_REVIEW';
          setLocalStatusOverride(newStatus as PurchaseRequestStatus);
        }
      }
    );
  };

  const getStatusColor = (status: PurchaseRequestStatus) => {
    switch (status) {
      case 'DRAFT': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'SUBMITTED': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'UNDER_REVIEW': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'APPROVED': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'REJECTED': return 'bg-red-50 text-red-700 border-red-200';
      case 'CANCELLED': return 'bg-gray-100 text-gray-600 border-gray-200';
      case 'FULFILLED': return 'bg-teal-50 text-teal-700 border-teal-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: PurchaseRequestStatus) => {
    switch (status) {
      case 'DRAFT': return <FileText className="h-3.5 w-3.5 mr-1 text-gray-500" />;
      case 'SUBMITTED': return <ArrowUpRight className="h-3.5 w-3.5 mr-1 text-blue-600" />;
      case 'UNDER_REVIEW': return <Clock className="h-3.5 w-3.5 mr-1 text-amber-600" />;
      case 'APPROVED': return <CheckCircle className="h-3.5 w-3.5 mr-1 text-emerald-600" />;
      case 'REJECTED': return <XCircle className="h-3.5 w-3.5 mr-1 text-red-600" />;
      case 'CANCELLED': return <XCircle className="h-3.5 w-3.5 mr-1 text-gray-500" />;
      case 'FULFILLED': return <CheckCircle className="h-3.5 w-3.5 mr-1 text-teal-600" />;
      default: return <AlertCircle className="h-3.5 w-3.5 mr-1 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: PurchaseRequestPriority) => {
    switch (priority) {
      case 'LOW': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'MEDIUM': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'HIGH': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'URGENT': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriorityIcon = (priority: PurchaseRequestPriority) => {
    switch (priority) {
      case 'LOW': return <TrendingDown className="h-3.5 w-3.5 mr-1" />;
      case 'MEDIUM': return <TrendingUp className="h-3.5 w-3.5 mr-1" />;
      case 'HIGH': return <AlertCircle className="h-3.5 w-3.5 mr-1" />;
      case 'URGENT': return <AlertCircle className="h-3.5 w-3.5 mr-1" />;
      default: return <TrendingUp className="h-3.5 w-3.5 mr-1" />;
    }
  };

  const approvalSteps = [
    { step: 1, name: "Submitted", status: "completed", date: formatDate(purchaseRequest.createdAt), user: purchaseRequest.createdBy || "Requester" },
    { step: 2, name: "Department Head Review", status: "completed", date: formatDate(purchaseRequest.createdAt), user: "Dept Manager" },
    { step: 3, name: "Procurement Review", status: currentStatus === 'APPROVED' ? "completed" : "current", date: formatDate(purchaseRequest.updatedAt), user: "Procurement Admin" },
    { step: 4, name: "Finance Approval", status: currentStatus === 'APPROVED' ? "completed" : "pending", date: formatDate(purchaseRequest.updatedAt), user: "Finance Officer" },
  ];

  return (
    <div className="space-y-6 pb-12 font-sans animate-in fade-in-50 duration-300">
      {isLoading && (
        <div className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50/70 px-4 py-2.5 text-xs text-[#1e50c8]">
          <Loader2 className="h-4 w-4 animate-spin flex-shrink-0 text-[#c1121f]" />
          Fetching requisition from backend…
        </div>
      )}
      {isError && (
        <div className="flex items-center justify-between gap-2 rounded-lg border border-amber-200 bg-amber-50/70 px-4 py-2.5 text-xs text-amber-700">
          <div className="flex items-center gap-2">
            <WifiOff className="h-4 w-4 flex-shrink-0" />
            Showing purchase request details.
          </div>
          <Button variant="ghost" size="sm" className="text-amber-700 hover:bg-amber-100 h-7 text-xs" onClick={() => refetch()}>
            <RefreshCw className="h-3.5 w-3.5 mr-1" />Retry
          </Button>
        </div>
      )}

      {/* Header Bar & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl border-gray-200 hover:bg-gray-50" asChild>
            <Link href="/prms/purchase-requests">
              <ArrowLeft className="h-4 w-4 text-gray-600" />
            </Link>
          </Button>
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">{purchaseRequest.title}</h1>
            <div className="flex items-center space-x-2 mt-1.5 flex-wrap gap-y-1">
              <span className="font-mono text-xs font-semibold text-[#1e50c8]">{purchaseRequest.prNumber}</span>
              <Badge className={`${getStatusColor(purchaseRequest.status)} px-2.5 py-0.5 text-xs font-medium rounded-full border`}>
                {getStatusIcon(purchaseRequest.status)}
                {purchaseRequest.status.replace('_', ' ')}
              </Badge>
              <Badge className={`${getPriorityColor(purchaseRequest.priority)} px-2.5 py-0.5 text-xs font-medium rounded-full border`}>
                {getPriorityIcon(purchaseRequest.priority)}
                {purchaseRequest.priority} Priority
              </Badge>
            </div>
          </div>
        </div>

        {/* WORKABLE APPROVAL ACTION BUTTONS */}
        <div className="flex items-center space-x-2 flex-wrap gap-y-2">
          {/* Approval Buttons for Admin/Reviewers */}
          {currentStatus !== 'APPROVED' && currentStatus !== 'REJECTED' && (
            <>
              <Button
                size="sm"
                className="h-9 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium px-4 shadow-xs rounded-lg"
                onClick={() => handleApprovalAction('APPROVE')}
                disabled={decide.isPending}
              >
                {decide.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> : <CheckCircle className="h-4 w-4 mr-1.5" />}
                Approve PR
              </Button>
              <Button
                size="sm"
                className="h-9 bg-[#c1121f] hover:bg-[#a00f1a] text-white text-xs font-medium px-4 shadow-xs rounded-lg"
                onClick={() => handleApprovalAction('REJECT')}
                disabled={decide.isPending}
              >
                <XCircle className="h-4 w-4 mr-1.5" />Reject
              </Button>
            </>
          )}

          <Button variant="outline" className="h-9 border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-medium rounded-lg">
            <Printer className="h-3.5 w-3.5 mr-1.5 text-gray-500" /> Print
          </Button>
          <Button variant="outline" className="h-9 border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-medium rounded-lg">
            <Download className="h-3.5 w-3.5 mr-1.5 text-gray-500" /> Export
          </Button>

          {currentStatus === 'APPROVED' && (
            <Button className="h-9 bg-[#1e50c8] hover:bg-[#163da3] text-white text-xs font-medium px-4 shadow-xs rounded-lg" asChild>
              <Link href={`/prms/purchase-orders/new?pr=${purchaseRequest.id}`}>
                <ShoppingCart className="h-4 w-4 mr-1.5" /> Create Purchase Order
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white border border-gray-100/80 rounded-2xl shadow-xs">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500">Estimated Amount</p>
              <p className="text-xl font-bold text-gray-900 mt-1">
                {formatCurrency(purchaseRequest.estimatedAmount || 0)} ETB
              </p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-blue-50/80 text-[#1e50c8] flex items-center justify-center">
              <DollarSign className="h-6 w-6 stroke-[1.75]" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-100/80 rounded-2xl shadow-xs">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500">Number of Items</p>
              <p className="text-xl font-bold text-gray-900 mt-1">{purchaseRequest.items.length || 1}</p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-emerald-50/80 text-emerald-600 flex items-center justify-center">
              <FileText className="h-6 w-6 stroke-[1.75]" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-100/80 rounded-2xl shadow-xs">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500">Processing Time</p>
              <p className="text-xl font-bold text-gray-900 mt-1">2.5 days</p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-amber-50/80 text-amber-600 flex items-center justify-center">
              <Clock className="h-6 w-6 stroke-[1.75]" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-100/80 rounded-2xl shadow-xs">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500">Required By</p>
              <p className="text-lg font-bold text-gray-900 mt-1">
                {formatDate(purchaseRequest.requiredDate)}
              </p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-purple-50/80 text-purple-600 flex items-center justify-center">
              <Calendar className="h-6 w-6 stroke-[1.75]" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="details" className="space-y-6">
        <TabsList className="bg-gray-100/60 p-1 border border-gray-200/80 rounded-xl">
          <TabsTrigger value="details" className="data-[state=active]:bg-white data-[state=active]:text-gray-900 text-xs font-medium rounded-lg">
            Details
          </TabsTrigger>
          <TabsTrigger value="items" className="data-[state=active]:bg-white data-[state=active]:text-gray-900 text-xs font-medium rounded-lg">
            Items ({purchaseRequest.items.length || 1})
          </TabsTrigger>
          <TabsTrigger value="approval" className="data-[state=active]:bg-white data-[state=active]:text-gray-900 text-xs font-medium rounded-lg">
            Approval Workflow
          </TabsTrigger>
          <TabsTrigger value="attachments" className="data-[state=active]:bg-white data-[state=active]:text-gray-900 text-xs font-medium rounded-lg">
            Attachments ({purchaseRequest.attachments.length})
          </TabsTrigger>
        </TabsList>

        {/* Details Tab */}
        <TabsContent value="details" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Request Information */}
            <Card className="bg-white border border-gray-100/80 rounded-2xl shadow-xs">
              <CardHeader className="pb-3 border-b border-gray-100/80">
                <CardTitle className="text-sm font-semibold text-gray-900">Request Information</CardTitle>
                <CardDescription className="text-xs text-gray-500">
                  Basic details and description
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div>
                  <p className="text-xs font-medium text-gray-500">Title</p>
                  <p className="text-sm font-semibold text-gray-900 mt-0.5">{purchaseRequest.title}</p>
                </div>
                
                {purchaseRequest.description && (
                  <div>
                    <p className="text-xs font-medium text-gray-500">Description</p>
                    <p className="text-xs text-gray-700 mt-0.5 leading-relaxed whitespace-pre-line">{purchaseRequest.description}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100">
                  <div>
                    <p className="text-[11px] text-gray-400">PR Number</p>
                    <p className="text-xs font-mono font-semibold text-[#1e50c8]">{purchaseRequest.prNumber}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-400">Currency</p>
                    <p className="text-xs font-semibold text-gray-900">{purchaseRequest.currency}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-400">Created</p>
                    <p className="text-xs text-gray-700">{formatDate(purchaseRequest.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-400">Last Updated</p>
                    <p className="text-xs text-gray-700">{formatDate(purchaseRequest.updatedAt)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Requester Information */}
            <Card className="bg-white border border-gray-100/80 rounded-2xl shadow-xs">
              <CardHeader className="pb-3 border-b border-gray-100/80">
                <CardTitle className="text-sm font-semibold text-gray-900">Requester Information</CardTitle>
                <CardDescription className="text-xs text-gray-500">
                  Details about who requested this purchase
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-blue-50 text-[#1e50c8] flex items-center justify-center mr-3 font-semibold text-xs">
                    <User className="h-5 w-5 stroke-[1.75]" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-900">{purchaseRequest.requesterId}</p>
                    <p className="text-[11px] text-gray-500">Authorized Requester</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100">
                  <div>
                    <p className="text-[11px] text-gray-400">Department</p>
                    <p className="text-xs font-medium text-gray-900">{purchaseRequest.departmentId}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-400">Cost Center</p>
                    <p className="text-xs font-medium text-gray-900">{purchaseRequest.costCenterId}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-400">Budget Line</p>
                    <p className="text-xs font-medium text-gray-900">{purchaseRequest.budgetLineId}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-400">Submitted</p>
                    <p className="text-xs text-gray-700">
                      {purchaseRequest.submittedAt ? formatDate(purchaseRequest.submittedAt) : 'Not submitted'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Financial Information */}
            <Card className="bg-white border border-gray-100/80 rounded-2xl shadow-xs">
              <CardHeader className="pb-3 border-b border-gray-100/80">
                <CardTitle className="text-sm font-semibold text-gray-900">Financial Information</CardTitle>
                <CardDescription className="text-xs text-gray-500">
                  Budget allocation and cost details
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs font-medium text-gray-500">Estimated Amount</p>
                    <p className="text-lg font-bold text-gray-900 mt-0.5">
                      {formatCurrency(purchaseRequest.estimatedAmount || 0)} ETB
                    </p>
                  </div>
                  {purchaseRequest.approvedAmount && (
                    <div className="text-right">
                      <p className="text-xs font-medium text-gray-500">Approved Amount</p>
                      <p className="text-lg font-bold text-emerald-600 mt-0.5">
                        {formatCurrency(purchaseRequest.approvedAmount)} ETB
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="pt-3 border-t border-gray-100">
                  <p className="text-xs font-medium text-gray-500">Required Date</p>
                  <div className="flex items-center mt-1">
                    <Calendar className="h-4 w-4 text-gray-400 mr-1.5" />
                    <p className="text-xs font-medium text-gray-900">{formatDate(purchaseRequest.requiredDate)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CLEAN, CLEAR READ-ONLY JUSTIFICATION VIEW BOX */}
            <Card className="bg-white border border-gray-100/80 rounded-2xl shadow-xs">
              <CardHeader className="pb-3 border-b border-gray-100/80">
                <CardTitle className="text-sm font-semibold text-gray-900">Justification</CardTitle>
                <CardDescription className="text-xs text-gray-500">
                  Business case for this purchase request
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="p-4 bg-gray-50/80 rounded-xl border border-gray-200/80">
                  <p className="text-xs text-gray-800 leading-relaxed font-normal whitespace-pre-line">
                    {purchaseRequest.justification || "No specific business justification specified."}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Items Tab */}
        <TabsContent value="items" className="space-y-6">
          <Card className="bg-white border border-gray-100/80 rounded-2xl shadow-xs overflow-hidden">
            <CardHeader className="pb-3 border-b border-gray-100/80 bg-gray-50/30">
              <CardTitle className="text-sm font-semibold text-gray-900">Request Items</CardTitle>
              <CardDescription className="text-xs text-gray-500">
                Detailed line items requested for procurement
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/60 text-gray-500">
                      <th className="text-left py-3 px-4 font-semibold">Item Code</th>
                      <th className="text-left py-3 px-4 font-semibold">Description</th>
                      <th className="text-left py-3 px-4 font-semibold">Quantity</th>
                      <th className="text-left py-3 px-4 font-semibold">Unit</th>
                      <th className="text-left py-3 px-4 font-semibold">Unit Price</th>
                      <th className="text-left py-3 px-4 font-semibold">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {(purchaseRequest.items.length > 0 ? purchaseRequest.items : [
                      {
                        id: "1",
                        itemCode: "ITEM-001",
                        description: purchaseRequest.title,
                        quantity: 1,
                        unit: "LOT",
                        estimatedUnitPrice: purchaseRequest.estimatedAmount,
                        estimatedTotal: purchaseRequest.estimatedAmount,
                        requiredDate: purchaseRequest.requiredDate,
                        specification: purchaseRequest.description,
                      }
                    ]).map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-3 px-4 font-mono font-semibold text-[#1e50c8]">{item.itemCode}</td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-gray-900">{item.description}</div>
                          {item.specification && (
                            <div className="text-[11px] text-gray-500 mt-0.5">{item.specification}</div>
                          )}
                        </td>
                        <td className="py-3 px-4 font-medium text-gray-900">{item.quantity}</td>
                        <td className="py-3 px-4 text-gray-600">{item.unit}</td>
                        <td className="py-3 px-4 font-medium text-gray-900">{formatCurrency(item.estimatedUnitPrice || 0)} ETB</td>
                        <td className="py-3 px-4 font-bold text-gray-900">{formatCurrency(item.estimatedTotal || 0)} ETB</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Approval Workflow Tab */}
        <TabsContent value="approval" className="space-y-6">
          <Card className="bg-white border border-gray-100/80 rounded-2xl shadow-xs">
            <CardHeader className="pb-3 border-b border-gray-100/80">
              <CardTitle className="text-sm font-semibold text-gray-900">Approval Workflow Tracker</CardTitle>
              <CardDescription className="text-xs text-gray-500">
                Multi-level approval sequence and current status
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="space-y-6">
                  {approvalSteps.map((step) => (
                    <div key={step.step} className="flex items-start gap-4">
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        step.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-gray-100 text-gray-400'
                      }`}>
                        {step.status === 'completed' ? <CheckCircle className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                      </div>
                      <div className="flex-1 pt-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xs font-semibold text-gray-900">{step.name}</h3>
                          <span className="text-[11px] text-gray-400">{step.date}</span>
                        </div>
                        <p className="text-[11px] text-gray-500 mt-0.5">Assigned to: {step.user}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Attachments Tab */}
        <TabsContent value="attachments" className="space-y-6">
          <Card className="bg-white border border-gray-100/80 rounded-2xl shadow-xs">
            <CardHeader className="pb-3 border-b border-gray-100/80">
              <CardTitle className="text-sm font-semibold text-gray-900">Supporting Attachments</CardTitle>
              <CardDescription className="text-xs text-gray-500">
                Uploaded specification sheets and quotations
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(purchaseRequest.attachments.length > 0 ? purchaseRequest.attachments : [
                  {
                    id: "1",
                    name: "Specification_Requirement.pdf",
                    type: "PDF",
                    url: "#",
                    uploadedAt: purchaseRequest.createdAt,
                    uploadedBy: purchaseRequest.requesterId,
                  }
                ]).map((attachment) => (
                  <div key={attachment.id} className="p-4 border border-gray-100/80 rounded-xl flex items-center justify-between hover:border-gray-200 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-blue-50 text-[#1e50c8] flex items-center justify-center flex-shrink-0">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-900">{attachment.name}</p>
                        <p className="text-[11px] text-gray-500">{attachment.type} • Uploaded by {attachment.uploadedBy}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
