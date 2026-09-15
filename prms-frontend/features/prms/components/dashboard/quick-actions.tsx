import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, FileText, Users, ShoppingCart, FileSearch, Quote, FileCheck } from "lucide-react";

const actions = [
  { label: "Register Supplier",     icon: Users,       href: "/prms/suppliers/new",          color: "bg-blue-500"   },
  { label: "New Purchase Request",  icon: FileText,    href: "/prms/purchase-requests/new",  color: "bg-green-500"  },
  { label: "Issue Purchase Order",  icon: ShoppingCart,href: "/prms/purchase-orders/new",    color: "bg-purple-500" },
  { label: "Send RFQ",              icon: FileSearch,  href: "/prms/rfq/new",                color: "bg-indigo-500" },
  { label: "New Quotation",         icon: Quote,       href: "/prms/quotations/new",         color: "bg-amber-500"  },
  { label: "New Contract",          icon: FileCheck,   href: "/prms/contracts/new",          color: "bg-red-500"    },
];

export function QuickActions() {
  return (
    <Card className="bg-white border border-gray-200 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-gray-900 text-base font-semibold">Quick Create</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.label}
                variant="outline"
                className="h-auto py-3 px-3 bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50 flex flex-col items-center justify-center text-center"
                asChild
              >
                <a href={action.href}>
                  <div className={`${action.color} w-9 h-9 rounded-lg flex items-center justify-center mb-1.5`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-xs font-medium text-gray-700">{action.label}</span>
                </a>
              </Button>
            );
          })}
        </div>

        <div className="mt-3 pt-3 border-t border-gray-100">
          <Button
            variant="ghost"
            className="w-full text-gray-500 hover:text-gray-900 hover:bg-gray-50"
            asChild
          >
            <a href="/prms/all-actions">
              <PlusCircle className="h-4 w-4 mr-2" />
              View All Actions
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
