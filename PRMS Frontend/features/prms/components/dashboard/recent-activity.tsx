import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, AlertCircle, FileText, Users } from "lucide-react";
import { ChevronRight } from "lucide-react";

const activities = [
  {
    icon: CheckCircle,
    color: "text-green-500",
    title: "PR-2024-00456 Approved",
    description: "Purchase request for IT equipment approved by Finance",
    time: "10 min ago",
    user: "Sarah Johnson",
  },
  {
    icon: XCircle,
    color: "text-red-500",
    title: "PO-2024-00123 Rejected",
    description: "Purchase order rejected due to budget constraints",
    time: "45 min ago",
    user: "Michael Chen",
  },
  {
    icon: FileText,
    color: "text-blue-500",
    title: "New RFQ Created",
    description: "RFQ-2024-00090 created for office supplies",
    time: "2 hours ago",
    user: "Alex Rodriguez",
  },
  {
    icon: Users,
    color: "text-purple-500",
    title: "Supplier Status Updated",
    description: "ABC Supplies Inc. status changed to Active",
    time: "3 hours ago",
    user: "Emma Wilson",
  },
  {
    icon: AlertCircle,
    color: "text-amber-500",
    title: "Invoice Overdue",
    description: "INV-2024-00789 is 5 days overdue",
    time: "5 hours ago",
    user: "System Alert",
  },
];

export function RecentActivity() {
  return (
    <Card className="bg-white border border-gray-200 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-gray-900 text-base font-semibold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activities.map((activity, index) => {
            const Icon = activity.icon;
            return (
              <div
                key={index}
                className="flex gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0"
              >
                <div className={`${activity.color} flex-shrink-0 mt-0.5`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {activity.title}
                    </h4>
                    <span className="text-xs text-gray-400 flex-shrink-0">{activity.time}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">{activity.description}</p>
                  <div className="flex items-center mt-1.5">
                    <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center mr-1.5">
                      <span className="text-xs text-gray-600 font-medium">
                        {activity.user.split(" ").map((n) => n[0]).join("")}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">{activity.user}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-3 pt-3 border-t border-gray-100">
          <a
            href="/prms/audit"
            className="text-sm text-red-600 hover:text-red-700 font-medium inline-flex items-center"
          >
            View All Activity
            <ChevronRight className="ml-0.5 h-4 w-4" />
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
