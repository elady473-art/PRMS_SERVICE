"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Search, Plus, Download, FileText, BarChart3, TrendingUp, Users, Clock, CheckCircle,
} from "lucide-react";

const REPORTS = [
  { id:"1", name:"Monthly Spend Analysis",     type:"FINANCIAL", generatedDate:"2024-03-22", size:"1.4 MB", status:"READY",   icon:BarChart3, color:"text-blue-600",   bg:"bg-blue-50"   },
  { id:"2", name:"Supplier Performance Q1",    type:"SUPPLIER",  generatedDate:"2024-03-20", size:"892 KB", status:"READY",   icon:Users,     color:"text-purple-600", bg:"bg-purple-50" },
  { id:"3", name:"Procurement Pipeline",       type:"OPERATIONS",generatedDate:"2024-03-18", size:"2.1 MB", status:"READY",   icon:TrendingUp,color:"text-green-600",  bg:"bg-green-50"  },
  { id:"4", name:"Open PO Status Report",      type:"OPERATIONS",generatedDate:"2024-03-15", size:"650 KB", status:"READY",   icon:FileText,  color:"text-amber-600",  bg:"bg-amber-50"  },
  { id:"5", name:"Invoice Aging Report",       type:"FINANCIAL", generatedDate:"2024-03-14", size:"780 KB", status:"READY",   icon:BarChart3, color:"text-red-600",    bg:"bg-red-50"    },
  { id:"6", name:"Budget Utilization YTD",     type:"FINANCIAL", generatedDate:"—",          size:"—",      status:"PENDING", icon:BarChart3, color:"text-gray-400",   bg:"bg-gray-50"   },
];

const TYPE_STYLE: Record<string, string> = {
  FINANCIAL:  "bg-blue-100 text-blue-700",
  SUPPLIER:   "bg-purple-100 text-purple-700",
  OPERATIONS: "bg-green-100 text-green-700",
};

export default function ReportsPage() {
  const [search, setSearch]             = useState("");
  const [typeFilter, setTypeFilter]     = useState("all");

  const filtered = REPORTS.filter((r) =>
    (!search || r.name.toLowerCase().includes(search.toLowerCase())) &&
    (typeFilter === "all" || r.type === typeFilter)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reports</h2>
          <p className="text-sm text-gray-500 mt-0.5">Generate and download procurement reports</p>
        </div>
        <Button className="bg-[#c1121f] hover:bg-[#a00f1a] text-white shadow-sm">
          <Plus className="h-4 w-4 mr-2" />Generate Report
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label:"Available Reports", value:REPORTS.filter((r) => r.status === "READY").length,   bg:"bg-green-500",  icon:CheckCircle },
          { label:"Pending",           value:REPORTS.filter((r) => r.status === "PENDING").length, bg:"bg-amber-500",  icon:Clock       },
          { label:"Total Reports",     value:REPORTS.length,                                        bg:"bg-blue-500",   icon:FileText    },
        ].map(({ label, value, bg, icon: Icon }) => (
          <Card key={label} className="border border-gray-200 bg-white">
            <CardContent className="p-5 flex items-center justify-between">
              <div><p className="text-xs text-gray-500">{label}</p><p className="text-2xl font-bold text-gray-900 mt-0.5">{value}</p></div>
              <div className={`h-10 w-10 rounded-xl ${bg} flex items-center justify-center`}><Icon className="h-5 w-5 text-white" /></div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border border-gray-200 bg-white">
        <CardContent className="p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <Input placeholder="Search reports…" className="pl-9 border-gray-300 text-gray-900 placeholder:text-gray-400" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-40 border-gray-300 text-gray-800"><SelectValue placeholder="Type" /></SelectTrigger>
            <SelectContent className="bg-white border-gray-200">
              {["all","FINANCIAL","SUPPLIER","OPERATIONS"].map((v) => (
                <SelectItem key={v} value={v}>{v === "all" ? "All Types" : v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {filtered.map((r) => {
          const Icon = r.icon;
          return (
            <Card key={r.id} className="border border-gray-200 bg-white hover:shadow-sm transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className={`h-10 w-10 rounded-xl ${r.bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`h-5 w-5 ${r.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm">{r.name}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <Badge className={`${TYPE_STYLE[r.type]} border-0 text-[11px] font-semibold`}>{r.type}</Badge>
                      <span className="text-xs text-gray-400">Generated: {r.generatedDate}</span>
                      {r.size !== "—" && <span className="text-xs text-gray-400">{r.size}</span>}
                    </div>
                  </div>
                  {r.status === "READY" ? (
                    <Button size="sm" variant="outline" className="h-8 border-gray-300 text-[#1e50c8] hover:bg-blue-50 flex-shrink-0">
                      <Download className="h-3.5 w-3.5 mr-1.5" />Download
                    </Button>
                  ) : (
                    <span className="flex items-center gap-1.5 text-xs text-amber-600 flex-shrink-0">
                      <Clock className="h-3.5 w-3.5" />Generating…
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
        {filtered.length === 0 && (
          <Card className="border border-gray-200 bg-white">
            <CardContent className="py-16 text-center text-gray-400">No reports found</CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
