import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowUp, ArrowDown } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: LucideIcon;
  color: string;
}

export function KPICard({ title, value, change, trend, icon: Icon, color }: KPICardProps) {
  return (
    <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">{title}</p>
            <div className="flex items-baseline">
              <span className="text-2xl font-bold text-gray-900">{value}</span>
              <div
                className={cn(
                  "flex items-center ml-2 text-xs font-medium",
                  trend === "up" ? "text-green-600" : "text-red-500"
                )}
              >
                {trend === "up" ? (
                  <ArrowUp className="h-3 w-3 mr-0.5" />
                ) : (
                  <ArrowDown className="h-3 w-3 mr-0.5" />
                )}
                {change}
              </div>
            </div>
          </div>
          <div
            className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center",
              color
            )}
          >
            <Icon className="h-5 w-5 text-white" />
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>vs. last month</span>
            <span
              className={cn(
                "px-2 py-0.5 rounded-full text-xs font-medium",
                trend === "up"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-600"
              )}
            >
              {trend === "up" ? "Improving" : "Declining"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
