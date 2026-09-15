"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Search,
  Filter,
  Plus,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Copy,
  Pause,
  GitBranch,
  Users,
  Clock,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { type ApprovalWorkflow, type UserRole } from "@/features/prms/types/settings";
import { formatDate } from "@/lib/utils";

export default function WorkflowsPage() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [entityFilter, setEntityFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const [workflows] = useState<ApprovalWorkflow[]>([
    {
      id: "1",
      name: "Standard Purchase Request Approval",
      description: "Standard approval workflow for purchase requests under 100,000 ETB",
      entity: "PURCHASE_REQUEST",
      isActive: true,
      steps: [
        {
          id: "1",
          name: "Department Head Approval",
          description: "Review by department head",
          order: 1,
          roleRequired: ["DEPARTMENT_HEAD"],
          isActive: true,
        },
        {
          id: "2",
          name: "Finance Review",
          description: "Budget verification by finance team",
          order: 2,
          roleRequired: ["FINANCE_MANAGER"],
          isActive: true,
        },
        {
          id: "3",
          name: "Procurement Admin Approval",
          description: "Final approval by Procurement Admin",
          order: 3,
          roleRequired: ["PROCUREMENT_ADMIN"],
          isActive: true,
        },
      ],
      createdBy: "System Admin",
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-03-15T14:30:00Z",
    },
    {
      id: "2",
      name: "High Value Purchase Request",
      description: "Enhanced approval workflow for purchase requests over 100,000 ETB",
      entity: "PURCHASE_REQUEST",
      isActive: true,
      steps: [
        {
          id: "1",
          name: "Department Head Approval",
          description: "Initial review by department head",
          order: 1,
          roleRequired: ["DEPARTMENT_HEAD"],
          isActive: true,
        },
        {
          id: "2",
          name: "Finance Manager Review",
          description: "Detailed budget analysis",
          order: 2,
          roleRequired: ["FINANCE_MANAGER"],
          isActive: true,
        },
        {
          id: "3",
          name: "Procurement Admin Review",
          description: "Procurement strategy review",
          order: 3,
          roleRequired: ["PROCUREMENT_ADMIN"],
          isActive: true,
        },
        {
          id: "4",
          name: "Director Approval",
          description: "Executive approval for high-value purchases",
          order: 4,
          roleRequired: ["APPROVER"],
          isActive: true,
        },
      ],
      createdBy: "Alex Rodriguez",
      createdAt: "2024-02-01T09:30:00Z",
      updatedAt: "2024-03-10T11:45:00Z",
    },
    {
      id: "3",
      name: "RFQ Approval Workflow",
      description: "Approval process for Request for Quotations",
      entity: "RFQ",
      isActive: true,
      steps: [
        {
          id: "1",
          name: "Procurement Admin Review",
          description: "Review and publish RFQ specifications",
          order: 1,
          roleRequired: ["PROCUREMENT_ADMIN"],
          isActive: true,
        },
        {
          id: "2",
          name: "Finance Verification",
          description: "Budget verification before RFQ publish",
          order: 2,
          roleRequired: ["FINANCE_MANAGER"],
          isActive: true,
        },
      ],
      createdBy: "Sarah Johnson",
      createdAt: "2024-02-15T14:20:00Z",
      updatedAt: "2024-03-05T16:15:00Z",
    },
    {
      id: "4",
      name: "Purchase Order Approval",
      description: "Standard approval for purchase orders",
      entity: "PURCHASE_ORDER",
      isActive: false,
      steps: [
        {
          id: "1",
          name: "Finance Verification",
          description: "Verify budget availability",
          order: 1,
          roleRequired: ["FINANCE_MANAGER"],
          isActive: true,
        },
        {
          id: "2",
          name: "Procurement Admin Approval",
          description: "Final PO approval",
          order: 2,
          roleRequired: ["PROCUREMENT_ADMIN"],
          isActive: true,
        },
      ],
      createdBy: "Michael Chen",
      createdAt: "2024-01-20T12:15:00Z",
      updatedAt: "2024-02-28T09:30:00Z",
    },
  ]);

  const getEntityColor = (entity: string) => {
    switch (entity) {
      case "PURCHASE_REQUEST": return "bg-green-100 text-green-700";
      case "RFQ":              return "bg-blue-100 text-blue-700";
      case "QUOTATION":        return "bg-purple-100 text-purple-700";
      case "PURCHASE_ORDER":   return "bg-orange-100 text-orange-700";
      default:                 return "bg-gray-100 text-gray-600";
    }
  };

  const getStepRoleLabel = (role: UserRole): string => {
    switch (role) {
      case "PROCUREMENT_ADMIN": return "Procurement Admin";
      case "REQUESTER":         return "Requester";
      case "SUPPLIER":          return "Supplier";
      case "DEPARTMENT_HEAD":   return "Department Head";
      case "FINANCE_MANAGER":   return "Finance Manager";
      case "APPROVER":          return "Approver";
      case "VIEWER":            return "Viewer";
      default:                  return role;
    }
  };

  const filteredWorkflows = workflows.filter((workflow) => {
    const matchesSearch =
      search === "" ||
      workflow.name.toLowerCase().includes(search.toLowerCase()) ||
      workflow.description?.toLowerCase().includes(search.toLowerCase());
    const matchesEntity = entityFilter === "all" || workflow.entity === entityFilter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && workflow.isActive) ||
      (statusFilter === "inactive" && !workflow.isActive);
    return matchesSearch && matchesEntity && matchesStatus;
  });

  const handleToggleWorkflow = (_id: string, isActive: boolean) => {
    toast({
      title: isActive ? "Workflow activated" : "Workflow deactivated",
      description: `Workflow has been ${isActive ? "activated" : "deactivated"} successfully.`,
    });
  };

  const handleCloneWorkflow = (_id: string) => {
    toast({ title: "Workflow cloned", description: "Workflow has been cloned successfully." });
  };

  const handleDeleteWorkflow = (_id: string) => {
    toast({ title: "Workflow deleted", description: "Workflow has been deleted successfully." });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Approval Workflows</h2>
          <p className="text-gray-500 mt-1">
            Configure approval workflows for different procurement processes
          </p>
        </div>
        <Button className="bg-red-600 hover:bg-red-700 text-white shadow-sm" asChild>
          <a href="/prms/settings/workflows/new">
            <Plus className="h-4 w-4 mr-2" />
            New Workflow
          </a>
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardContent className="p-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <Input
                type="search"
                placeholder="Search workflows…"
                className="pl-9 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-red-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <Select value={entityFilter} onValueChange={setEntityFilter}>
                  <SelectTrigger className="w-48 bg-white border-gray-300 text-gray-800">
                    <SelectValue placeholder="Entity" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200">
                    <SelectItem value="all">All Entities</SelectItem>
                    <SelectItem value="PURCHASE_REQUEST">Purchase Request</SelectItem>
                    <SelectItem value="RFQ">RFQ</SelectItem>
                    <SelectItem value="QUOTATION">Quotation</SelectItem>
                    <SelectItem value="PURCHASE_ORDER">Purchase Order</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32 bg-white border-gray-300 text-gray-800">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200">
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Workflows List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredWorkflows.map((workflow) => (
          <Card key={workflow.id} className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <CardTitle className="text-gray-900 text-base">{workflow.name}</CardTitle>
                    <Badge className={getEntityColor(workflow.entity)}>
                      {workflow.entity.replace(/_/g, " ")}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500">{workflow.description}</p>
                </div>
                <div className="flex items-center space-x-2 flex-shrink-0 ml-3">
                  <Switch
                    checked={workflow.isActive}
                    onCheckedChange={(checked) => handleToggleWorkflow(workflow.id, checked)}
                  />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-gray-900">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white border-gray-200 shadow-lg">
                      <DropdownMenuLabel className="text-gray-700">Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-gray-100" />
                      <DropdownMenuItem className="text-gray-700 hover:text-gray-900 hover:bg-gray-50 cursor-pointer" asChild>
                        <a href={`/prms/settings/workflows/${workflow.id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </a>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-gray-700 hover:text-gray-900 hover:bg-gray-50 cursor-pointer" asChild>
                        <a href={`/prms/settings/workflows/${workflow.id}/edit`}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </a>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 cursor-pointer"
                        onClick={() => handleCloneWorkflow(workflow.id)}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Clone
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-gray-100" />
                      <DropdownMenuItem
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                        onClick={() => handleDeleteWorkflow(workflow.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="space-y-4">
                {/* Steps */}
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                    <GitBranch className="h-3.5 w-3.5" />
                    Approval Steps ({workflow.steps.length})
                  </h4>
                  <div className="space-y-2">
                    {workflow.steps.slice(0, 3).map((step, index) => (
                      <div key={step.id} className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                          <span className="text-xs font-semibold text-red-600">{step.order}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-800">{step.name}</div>
                          <div className="text-xs text-gray-500">
                            {step.roleRequired.map((r) => getStepRoleLabel(r)).join(", ")}
                          </div>
                        </div>
                        {index < workflow.steps.length - 1 && index < 2 && (
                          <ArrowRight className="h-4 w-4 text-gray-300 flex-shrink-0" />
                        )}
                      </div>
                    ))}
                    {workflow.steps.length > 3 && (
                      <div className="text-xs text-gray-400 pl-9">
                        +{workflow.steps.length - 3} more steps
                      </div>
                    )}
                  </div>
                </div>

                {/* Meta */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {workflow.createdBy}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDate(workflow.updatedAt)}
                    </span>
                  </div>
                  {workflow.isActive ? (
                    <div className="flex items-center text-green-600 text-xs font-medium">
                      <CheckCircle className="h-3.5 w-3.5 mr-1" />
                      Active
                    </div>
                  ) : (
                    <div className="flex items-center text-gray-400 text-xs">
                      <Pause className="h-3.5 w-3.5 mr-1" />
                      Inactive
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredWorkflows.length === 0 && (
        <Card className="bg-white border border-gray-200">
          <CardContent className="py-16 text-center">
            <GitBranch className="h-14 w-14 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No workflows found</h3>
            <p className="text-gray-500 mb-6">
              {search || entityFilter !== "all" || statusFilter !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Create your first approval workflow to get started"}
            </p>
            <Button className="bg-red-600 hover:bg-red-700 text-white" asChild>
              <a href="/prms/settings/workflows/new">
                <Plus className="h-4 w-4 mr-2" />
                Create Workflow
              </a>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
