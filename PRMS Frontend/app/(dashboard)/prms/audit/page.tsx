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
  Search, Download, Activity, RefreshCw, Loader2, AlertCircle,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { formatDate } from "@/lib/utils";

interface AuditEntry {
  entity: string;
  entityName: string;
  actor: string;
  action: string;
  timestamp: string;
}

function useAuditLogs() {
  return useQuery({
    queryKey: ["audit-logs"],
    queryFn: () => apiClient.get<AuditEntry[]>("/audit-logs").then((r) => r.data ?? []),
    staleTime: 60 * 1000,
  });
}

const ACTION_STYLE: Record<string, string> = {
  CREATE: "bg-green-100 text-green-700",
  UPDATE: "bg-blue-100 text-blue-700",
  DELETE: "bg-red-100 text-red-700",
  APPROVE: "bg-green-100 text-green-700",
  REJECT: "bg-red-100 text-red-700",
};

export default function AuditLogsPage() {
  const [search, setSearch] = useState("");
  const [entityFilter, setEntityFilter] = useState("all");
  const { data: logs, isLoading, isError, refetch } = useAuditLogs();

  const filtered = (logs ?? []).filter((l) => {
    const q = search.toLowerCase();
    return (
      (!search || l.actor.toLowerCase().includes(q) || l.entityName.toLowerCase().includes(q)) &&
      (entityFilter === "all" || l.entity === entityFilter)
    );
  });

  const entities = Array.from(new Set((logs ?? []).map((l) => l.entity))).filter(Boolean);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Audit Trail</h2>
          <p className="text-sm text-gray-500 mt-0.5">System activity from PostgreSQL — last 30 days</p>
        </div>
        <Button variant="outline" className="border-gray-300 text-gray-700 h-9" onClick={() => refetch()}>
          <RefreshCw className="h-4 w-4 mr-1.5" />Refresh
        </Button>
      </div>

      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-blue-600">
          <Loader2 className="h-4 w-4 animate-spin" />Loading audit logs…
        </div>
      )}
      {isError && (
        <div className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
          <div className="flex items-center gap-2"><AlertCircle className="h-4 w-4" />Failed to load audit logs.</div>
          <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => refetch()}>
            <RefreshCw className="h-3.5 w-3.5 mr-1" />Retry
          </Button>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Events", value: logs?.length ?? 0, bg: "bg-blue-500" },
          { label: "Shown", value: filtered.length, bg: "bg-green-500" },
          { label: "Entity Types", value: entities.length, bg: "bg-purple-500" },
        ].map(({ label, value, bg }) => (
          <Card key={label} className="border border-gray-200 bg-white">
            <CardContent className="p-5 flex items-center justify-between">
              <div><p className="text-xs text-gray-500">{label}</p><p className="text-2xl font-bold text-gray-900 mt-0.5">{value}</p></div>
              <div className={`h-10 w-10 rounded-xl ${bg} flex items-center justify-center`}>
                <Activity className="h-5 w-5 text-white" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <Input
            placeholder="Search by actor or entity…"
            className="pl-9 border-gray-300 text-gray-900 placeholder:text-gray-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={entityFilter} onValueChange={setEntityFilter}>
          <SelectTrigger className="w-48 border-gray-300 text-gray-800"><SelectValue placeholder="Entity" /></SelectTrigger>
          <SelectContent className="bg-white border-gray-200">
            <SelectItem value="all">All Entities</SelectItem>
            {entities.map((e) => (
              <SelectItem key={e} value={e}>{e.replace(/_/g, " ")}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card className="border border-gray-200 bg-white">
        <CardHeader className="pb-3 border-b border-gray-100">
          <CardTitle className="text-sm font-semibold text-gray-900">Activity Log ({filtered.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-gray-400" /></div>
          ) : (
            <div className="divide-y divide-gray-50">
              {filtered.map((log, i) => {
                const initials = log.actor.split(/[\s_@]/).map((n) => n[0] ?? "").join("").toUpperCase().slice(0, 2);
                return (
                  <div key={i} className="flex items-start gap-4 px-4 py-3 hover:bg-gray-50 transition-colors">
                    <div className="h-8 w-8 rounded-full bg-[#0a1f44] flex items-center justify-center flex-shrink-0 text-xs font-bold text-white mt-0.5">
                      {initials || "?"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-gray-900">{log.actor}</p>
                        <Badge className={`${ACTION_STYLE[log.action] ?? "bg-gray-100 text-gray-600"} border-0 text-[11px] font-semibold`}>
                          {log.action}
                        </Badge>
                        <span className="text-xs font-mono text-gray-500">{log.entityName}</span>
                        <span className="text-xs text-gray-400">({log.entity?.replace(/_/g, " ")})</span>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400 flex-shrink-0 mt-0.5">
                      {log.timestamp ? formatDate(log.timestamp) : "—"}
                    </span>
                  </div>
                );
              })}
              {filtered.length === 0 && !isLoading && (
                <div className="py-16 text-center text-gray-400">
                  {(logs ?? []).length === 0 ? "No audit events found in the database." : "No events match your filter."}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
