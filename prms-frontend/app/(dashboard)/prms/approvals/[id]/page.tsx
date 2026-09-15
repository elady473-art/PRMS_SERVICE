"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  MessageSquare,
  ExternalLink,
  User,
  Calendar,
  DollarSign,
  FileText,
  Clock,
  AlertCircle,
  TrendingUp,
  History,
  Paperclip,
  Send,
  ChevronRight,
  ChevronLeft,
  Check,
  X,
  RefreshCw
} from "lucide-react";
import { ApprovalRequest, ApprovalDecision, ApprovalHistory } from "@/features/prms/types/approval";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ApprovalDetailsPage() {
  const params = useParams();
  const { toast } = useToast();
  const [decision, setDecision] = useState<ApprovalDecision>("APPROVE");
  const [comments, setComments] = useState("");
  const [requiresRework, setRequiresRework] = useState(false);
  const [nextReviewDate, setNextReviewDate] = useState("");
  const [loading, setLoading] = useState(false);
  
  const [approvalRequest] = useState<ApprovalRequest>({
    id: "1",
    entityId: "1",
    entityType: "PURCHASE_REQUEST",
    entityNumber: "PR-2024-00124",
    entityTitle: "Office Furniture Renewal",
    requesterId: "sarah.johnson@company.com",
    requesterName: "Sarah Johnson",
    amount: 850000,
    currency: "ETB",
    currentStep: 2,
    totalSteps: 4,
    currentApproverId: "current-user@company.com",
    currentApproverName: "Current User",
    status: "PENDING",
    submittedAt: "2024-03-12T09:15:00Z",
    deadline: "2024-03-19T09:15:00Z",
    workflowId: "1",
    workflowName: "Standard Procurement Approval",
    createdAt: "2024-03-12T09:15:00Z",
    updatedAt: "2024-03-12T09:15:00Z",
  });

  const [approvalHistory] = useState<ApprovalHistory[]>([
    {
      id: "1",
      approvalRequestId: "1",
      stepOrder: 1,
      approverId: "sarah.johnson@company.com",
      approverName: "Sarah Johnson",
      decision: "APPROVE",
      comments: "Approved at department level.",
      decisionDate: "2024-03-12T10:30:00Z",
    },
  ]);

  const workflowSteps = [
    { step: 1, name: "Department Head Review", approver: "Sarah Johnson", status: "completed" },
    { step: 2, name: "Procurement Review", approver: "Current User", status: "current" },
    { step: 3, name: "Finance Approval", approver: "Alex Rodriguez", status: "pending" },
    { step: 4, name: "Final Approval", approver: "Emma Wilson", status: "pending" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-400';
      case 'current': return 'bg-blue-500/20 text-blue-400';
      case 'pending': return 'bg-gray-500/20 text-gray-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getDecisionColor = (decision: ApprovalDecision) => {
    switch (decision) {
      case 'APPROVE': return 'bg-green-500/20 text-green-400';
      case 'REJECT': return 'bg-red-500/20 text-red-400';
      case 'REQUEST_CHANGES': return 'bg-amber-500/20 text-amber-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getDecisionIcon = (decision: ApprovalDecision) => {
    switch (decision) {
      case 'APPROVE': return <CheckCircle className="h-3 w-3 mr-1" />;
      case 'REJECT': return <XCircle className="h-3 w-3 mr-1" />;
      case 'REQUEST_CHANGES': return <MessageSquare className="h-3 w-3 mr-1" />;
      default: return <AlertCircle className="h-3 w-3 mr-1" />;
    }
  };

  const handleSubmitDecision = async () => {
    if (!comments.trim() && (decision === 'REJECT' || decision === 'REQUEST_CHANGES')) {
      toast({
        title: "Comments required",
        description: "Please provide comments for rejection or change requests.",
        variant: "destructive",
      });
      return;
    }

    if (requiresRework && !nextReviewDate) {
      toast({
        title: "Review date required",
        description: "Please select a date for re-review.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // In a real app, you would call the API here
      // await approvalApi.submitDecision(approvalRequest.id, { decision, comments, requiresRework, nextReviewDate });
      
      toast({
        title: "Decision submitted",
        description: `Document has been ${decision.toLowerCase()}d successfully.`,
      });
      
      setTimeout(() => {
        window.location.href = "/prms/approvals";
      }, 1500);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit decision. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelegate = () => {
    toast({
      title: "Delegation",
      description: "Delegate this approval to another approver.",
    });
  };

  const handleRequestMoreInfo = () => {
    toast({
      title: "Information Request",
      description: "Request for more information has been sent.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
              <a href="/prms/approvals">
                <ArrowLeft className="h-4 w-4" />
              </a>
            </Button>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Review & Approval</h2>
              <div className="flex items-center space-x-2 mt-2">
                <span className="font-mono text-blue-400">{approvalRequest.entityNumber}</span>
                <Badge className="bg-blue-500/20 text-blue-400">
                  {approvalRequest.entityType.replace('_', ' ')}
                </Badge>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50" asChild>
            <a href={`/prms/${approvalRequest.entityType.toLowerCase().replace('_', '-')}s/${approvalRequest.entityId}`}>
              <ExternalLink className="h-4 w-4 mr-2" />
              View Document
            </a>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Document Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Document Information */}
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900">Document Information</CardTitle>
              <CardDescription className="text-gray-400">
                Details of the document requiring approval
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-400">Title</p>
                  <p className="text-white mt-1">{approvalRequest.entityTitle}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-400">Amount</p>
                    <div className="flex items-baseline mt-1">
                      <DollarSign className="h-4 w-4 text-gray-500 mr-1" />
                      <span className="text-2xl font-bold text-gray-900">{formatCurrency(approvalRequest.amount)}</span>
                      <span className="text-gray-500 text-sm ml-1">{approvalRequest.currency}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-400">Requester</p>
                    <div className="flex items-center mt-1">
                      <User className="h-4 w-4 text-gray-500 mr-2" />
                      <div>
                        <p className="text-gray-900">{approvalRequest.requesterName}</p>
                        <p className="text-xs text-gray-500">{approvalRequest.requesterId}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                  <div>
                    <p className="text-sm font-medium text-gray-400">Submitted</p>
                    <div className="flex items-center mt-1">
                      <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-gray-300">{formatDate(approvalRequest.submittedAt)}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-400">Deadline</p>
                    <div className="flex items-center mt-1">
                      <Clock className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-gray-900">{formatDate(approvalRequest.deadline)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Approval Workflow */}
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900">Approval Workflow</CardTitle>
              <CardDescription className="text-gray-400">
                {approvalRequest.workflowName} - Step {approvalRequest.currentStep} of {approvalRequest.totalSteps}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Workflow Steps */}
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-100"></div>
                  
                  {/* Steps */}
                  <div className="space-y-8 relative z-10">
                    {workflowSteps.map((step) => (
                      <div key={step.step} className="flex items-start">
                        <div className="flex-shrink-0">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            step.status === 'completed' ? 'bg-green-500' : 
                            step.status === 'current' ? 'bg-blue-500' : 'bg-gray-700'
                          }`}>
                            {step.status === 'completed' ? (
                              <Check className="h-5 w-5 text-gray-900" />
                            ) : step.status === 'current' ? (
                              <span className="text-white text-sm font-bold">{step.step}</span>
                            ) : (
                              <span className="text-gray-400 text-sm font-bold">{step.step}</span>
                            )}
                          </div>
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium text-gray-900">{step.name}</h3>
                            <Badge className={getStatusColor(step.status)}>
                              {step.status === 'completed' ? 'Completed' : 
                               step.status === 'current' ? 'Current Step' : 'Pending'}
                            </Badge>
                          </div>
                          <p className="text-gray-400 mt-1">Approver: {step.approver}</p>
                          {step.status === 'completed' && step.step === 1 && (
                            <div className="mt-2 p-2 bg-gray-50 rounded border border-gray-200">
                              <p className="text-sm text-gray-700">"Approved at department level."</p>
                              <p className="text-xs text-gray-500 mt-1">- Sarah Johnson, {formatDate('2024-03-12T10:30:00Z')}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Workflow Statistics */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{approvalRequest.currentStep}</p>
                    <p className="text-sm text-gray-400">Current Step</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{approvalRequest.totalSteps}</p>
                    <p className="text-sm text-gray-400">Total Steps</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">2.5 days</p>
                    <p className="text-sm text-gray-400">Avg Time/Step</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Previous Decisions */}
          {approvalHistory.length > 0 && (
            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900">Previous Decisions</CardTitle>
                <CardDescription className="text-gray-400">
                  Decisions made at previous approval steps
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {approvalHistory.map((history) => (
                    <div key={history.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mr-3">
                            <User className="h-4 w-4 text-gray-700" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{history.approverName}</p>
                            <p className="text-xs text-gray-500">Step {history.stepOrder}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getDecisionColor(history.decision)}>
                            {getDecisionIcon(history.decision)}
                            {history.decision.replace('_', ' ')}
                          </Badge>
                          <span className="text-sm text-gray-500">{formatDate(history.decisionDate)}</span>
                        </div>
                      </div>
                      <div className="mt-3 pl-11">
                        <p className="text-gray-300">{history.comments}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Decision Making */}
        <div className="space-y-6">
          {/* Decision Form */}
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900">Make Decision</CardTitle>
              <CardDescription className="text-gray-400">
                Review and decide on this document
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    type="button"
                    variant={decision === "APPROVE" ? "default" : "outline"}
                    className={`${decision === "APPROVE" ? "bg-green-600 hover:bg-green-700" : "border-gray-300 text-gray-700 hover:bg-gray-50"}`}
                    onClick={() => setDecision("APPROVE")}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    type="button"
                    variant={decision === "REJECT" ? "default" : "outline"}
                    className={`${decision === "REJECT" ? "bg-red-600 hover:bg-red-700" : "border-gray-300 text-gray-700 hover:bg-gray-50"}`}
                    onClick={() => setDecision("REJECT")}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                  <Button
                    type="button"
                    variant={decision === "REQUEST_CHANGES" ? "default" : "outline"}
                    className={`${decision === "REQUEST_CHANGES" ? "bg-amber-600 hover:bg-amber-700" : "border-gray-300 text-gray-700 hover:bg-gray-50"}`}
                    onClick={() => setDecision("REQUEST_CHANGES")}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Request Changes
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="comments" className="text-gray-300">
                    Comments {['REJECT', 'REQUEST_CHANGES'].includes(decision) && '*'}
                  </Label>
                  <Textarea
                    id="comments"
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    className="border-gray-300 text-gray-900 min-h-[120px]"
                    placeholder="Provide comments for your decision..."
                    required={['REJECT', 'REQUEST_CHANGES'].includes(decision)}
                  />
                  <p className="text-xs text-gray-500">
                    Comments are required for rejection or change requests
                  </p>
                </div>

                {decision === "REQUEST_CHANGES" && (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="requiresRework"
                        checked={requiresRework}
                        onChange={(e) => setRequiresRework(e.target.checked)}
                        className="rounded border-gray-200 bg-white text-[#c1121f] focus:ring-prms-primary"
                      />
                      <Label htmlFor="requiresRework" className="text-gray-300">
                        Requires re-review after changes
                      </Label>
                    </div>
                    
                    {requiresRework && (
                      <div className="space-y-2">
                        <Label htmlFor="nextReviewDate" className="text-gray-300">
                          Next Review Date *
                        </Label>
                        <Input
                          id="nextReviewDate"
                          type="date"
                          value={nextReviewDate}
                          onChange={(e) => setNextReviewDate(e.target.value)}
                          className="border-gray-300 text-gray-900"
                          required
                        />
                      </div>
                    )}
                  </div>
                )}

                <Button
                  type="button"
                  className="w-full bg-[#c1121f] hover:bg-[#a00f1a]"
                  onClick={handleSubmitDecision}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Submit Decision
                    </>
                  )}
                </Button>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 text-center">
                    Your decision will be recorded and forwarded to the next approver
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Actions */}
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900">Additional Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                type="button"
                variant="outline"
                className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                onClick={handleDelegate}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Delegate Approval
              </Button>
              
              <Button
                type="button"
                variant="outline"
                className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                onClick={handleRequestMoreInfo}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Request More Information
              </Button>
              
              <Button
                type="button"
                variant="outline"
                className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                asChild
              >
                <a href={`/prms/${approvalRequest.entityType.toLowerCase().replace('_', '-')}s/${approvalRequest.entityId}`}>
                  <FileText className="h-4 w-4 mr-2" />
                  View Full Document
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* Approval Guidelines */}
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900">Approval Guidelines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                  <span className="text-gray-300">Verify budget availability before approving</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                  <span className="text-gray-300">Ensure compliance with procurement policies</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                  <span className="text-gray-300">Check if proper quotations are attached</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                  <span className="text-gray-300">Validate business justification</span>
                </div>
                <div className="flex items-start">
                  <XCircle className="h-4 w-4 text-red-500 mr-2 mt-0.5" />
                  <span className="text-gray-300">Reject if documentation is incomplete</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


