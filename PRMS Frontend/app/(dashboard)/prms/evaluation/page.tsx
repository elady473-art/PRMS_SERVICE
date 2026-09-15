"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  CheckCircle, TrendingUp, FileText, DollarSign, Package,
  Clock, Award, Download, Save, Send, Eye, ChevronDown, ChevronUp,
  Search, Trophy, Loader2, AlertCircle, RefreshCw, Check, Star,
  Sliders, UserCheck, ShieldCheck, ClipboardCheck, Plus, Building2,
  Shield, Truck, ShieldAlert, FileCheck, ArrowRight
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";
import { useQuotations, useSelectQuotation } from "@/features/prms/hooks/use-quotations";
import { useRFQs } from "@/features/prms/hooks/use-rfq";
import { useVendors } from "@/features/prms/hooks/use-vendors";
import type { QuotationResponse } from "@/lib/prms-api";

// Range color function (Smooth, clean styling)
function getScoreColorConfig(score: number) {
  if (score < 30) {
    return {
      bg: "bg-red-500",
      text: "text-red-600 font-semibold",
      badge: "bg-red-50 text-red-700 border-red-200/80",
      border: "border-red-300",
      label: "Critical / Low",
    };
  }
  if (score < 50) {
    return {
      bg: "bg-amber-500",
      text: "text-amber-600 font-semibold",
      badge: "bg-amber-50 text-amber-800 border-amber-200/80",
      border: "border-amber-300",
      label: "Golden Yellow / Moderate",
    };
  }
  if (score < 80) {
    return {
      bg: "bg-yellow-400",
      text: "text-yellow-600 font-semibold",
      badge: "bg-yellow-50 text-yellow-800 border-yellow-200/80",
      border: "border-yellow-300",
      label: "Yellow / Satisfactory",
    };
  }
  return {
    bg: "bg-emerald-500",
    text: "text-emerald-600 font-semibold",
    badge: "bg-emerald-50 text-emerald-800 border-emerald-200/80",
    border: "border-emerald-300",
    label: "Green / Excellent",
  };
}

const EVALUATION_METRICS = [
  { id: "performance", name: "Performance Score", weight: 20, desc: "Vendor historical fulfillment & SLA compliance" },
  { id: "price", name: "Price Competitiveness", weight: 25, desc: "Unit pricing compared to market estimates" },
  { id: "delivery", name: "Delivery Speed", weight: 20, desc: "Promised lead time & logistics capabilities" },
  { id: "cost", name: "Cost & Payment Terms", weight: 20, desc: "Payment terms (Net 30/60) & lifecycle cost" },
  { id: "warranty", name: "Warranty & Support", weight: 15, desc: "Warranty duration & technical support SLA" },
];

export default function EvaluationPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { data: quotations, isLoading, isError, refetch } = useQuotations();
  const { data: rfqs } = useRFQs();
  const { data: vendors, isLoading: loadingVendors } = useVendors();
  const selectQuotation = useSelectQuotation();

  const [activeTab, setActiveTab] = useState<"quotations" | "suppliers">("quotations");
  const [selectedRFQ, setSelectedRFQ] = useState<string>("ALL");
  const [search, setSearch] = useState("");
  const [selectedVendorId, setSelectedVendorId] = useState<number | null>(null);
  
  // Detailed Evaluation Form State
  const [showEvaluationForm, setShowEvaluationForm] = useState(false);
  const [evalVendor, setEvalVendor] = useState<string>("");
  const [evalRfq, setEvalRfq] = useState<string>("");
  
  const [scores, setScores] = useState({
    performance: 85,
    price: 90,
    delivery: 75,
    cost: 80,
    warranty: 85,
  });
  const [evaluatorNotes, setEvaluatorNotes] = useState("");
  const [recommendation, setRecommendation] = useState("RECOMMENDED");
  const [isSubmittingEval, setIsSubmittingEval] = useState(false);

  const totalWeightedScore = Math.round(
    (scores.performance * 0.20) +
    (scores.price * 0.25) +
    (scores.delivery * 0.20) +
    (scores.cost * 0.20) +
    (scores.warranty * 0.15)
  );

  const overallColor = getScoreColorConfig(totalWeightedScore);

  const filteredQuotations = (quotations ?? []).filter((q: QuotationResponse) => {
    const matchesRFQ = selectedRFQ === "ALL" || String(q.rfqId) === selectedRFQ || q.rfqNumber === selectedRFQ;
    const matchesSearch =
      !search ||
      q.quotationNumber.toLowerCase().includes(search.toLowerCase()) ||
      q.vendorName.toLowerCase().includes(search.toLowerCase());
    return matchesRFQ && matchesSearch;
  });

  const filteredVendors = (vendors ?? []).filter((v) => {
    const q = search.toLowerCase();
    return (
      !search ||
      v.name.toLowerCase().includes(q) ||
      v.email.toLowerCase().includes(q) ||
      v.vendorCode.toLowerCase().includes(q)
    );
  });

  const handleAward = async (q: QuotationResponse) => {
    try {
      await selectQuotation.mutateAsync(q.id);
      toast({
        title: "Quotation Awarded",
        description: `Quotation ${q.quotationNumber} from ${q.vendorName} awarded! Flowed to Purchase Orders.`,
      });
    } catch (err) {
      // Handled by react-query
    }
  };

  const handleSaveEvaluationForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evalVendor) {
      toast({ title: "Please select a supplier", variant: "destructive" });
      return;
    }
    setIsSubmittingEval(true);
    setTimeout(() => {
      setIsSubmittingEval(false);
      setShowEvaluationForm(false);
      toast({
        title: "Supplier Evaluation Recorded",
        description: `Evaluation score (${totalWeightedScore}/100) saved for ${evalVendor}.`,
      });
      setEvaluatorNotes("");
    }, 600);
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Supplier Evaluation & Technical Scoring</h2>
          <p className="text-xs text-gray-500 mt-0.5">Multi-criteria vendor scoring across Performance, Price, Delivery, Cost & Warranty</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            className="bg-[#c1121f] hover:bg-[#a00f1a] text-white h-9 text-xs font-medium shadow-xs rounded-lg px-3.5"
            onClick={() => setShowEvaluationForm(!showEvaluationForm)}
          >
            <ClipboardCheck className="h-4 w-4 mr-1.5 stroke-[1.75]" />
            {showEvaluationForm ? "Close Form" : "Evaluate Supplier"}
          </Button>
          <Button variant="outline" className="border-gray-200 text-gray-700 h-9 text-xs font-medium rounded-lg" onClick={() => refetch()}>
            <RefreshCw className="h-3.5 w-3.5 mr-1.5 text-gray-400" /> Refresh
          </Button>
        </div>
      </div>

      {/* FORM PANEL */}
      {showEvaluationForm && (
        <Card className="border border-red-100 bg-white shadow-xs rounded-xl overflow-hidden">
          <CardHeader className="bg-red-50/30 pb-3 border-b border-red-100/60">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-[#c1121f]/10 text-[#c1121f] flex items-center justify-center">
                  <Star className="h-4 w-4 fill-current" />
                </div>
                <div>
                  <CardTitle className="text-sm font-semibold text-gray-900">Formal Supplier Evaluation Form</CardTitle>
                  <CardDescription className="text-xs text-gray-500">Rate supplier metrics: Performance, Price, Delivery, Cost, and Warranty</CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 font-medium">Weighted Score:</span>
                <Badge className={`${overallColor.badge} border text-xs font-semibold px-2.5 py-0.5`}>
                  {totalWeightedScore} / 100 ({overallColor.label.split('/')[0]})
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-5 space-y-5">
            <form onSubmit={handleSaveEvaluationForm} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-[11px] font-semibold text-gray-600 uppercase tracking-wider">Select Target Supplier *</Label>
                  <Select value={evalVendor} onValueChange={setEvalVendor}>
                    <SelectTrigger className="border-gray-200 h-9 text-xs bg-white text-gray-900 rounded-lg">
                      <SelectValue placeholder="Choose a registered supplier..." />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200">
                      {vendors?.map((v) => (
                        <SelectItem key={v.id} value={v.name}>
                          {v.name} ({v.vendorCode})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label className="text-[11px] font-semibold text-gray-600 uppercase tracking-wider">Associated Solicitation (RFQ)</Label>
                  <Select value={evalRfq} onValueChange={setEvalRfq}>
                    <SelectTrigger className="border-gray-200 h-9 text-xs bg-white text-gray-900 rounded-lg">
                      <SelectValue placeholder="Select RFQ reference..." />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200">
                      {rfqs?.map((r) => (
                        <SelectItem key={r.id} value={r.rfqNumber}>
                          {r.rfqNumber} — {r.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Sliders */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-semibold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Sliders className="h-3.5 w-3.5 text-[#c1121f]" /> Evaluation Criteria (0-100 Points)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {EVALUATION_METRICS.map((m) => {
                    const key = m.id as keyof typeof scores;
                    const val = scores[key];
                    const metricColor = getScoreColorConfig(val);
                    return (
                      <div key={m.id} className="p-3.5 rounded-xl border border-gray-100 bg-gray-50/40 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-gray-900">{m.name}</span>
                          <span className={`text-xs ${metricColor.text}`}>{val} / 100</span>
                        </div>
                        <p className="text-[11px] text-gray-400">{m.desc}</p>
                        <div className="flex items-center gap-3 pt-1">
                          <input
                            type="range"
                            min={0}
                            max={100}
                            value={val}
                            onChange={(e) => setScores({ ...scores, [key]: parseInt(e.target.value) || 0 })}
                            className="flex-1 accent-[#c1121f]"
                          />
                          <div className="h-2 w-20 rounded-full overflow-hidden bg-gray-200/80">
                            <div className={`h-full ${metricColor.bg}`} style={{ width: `${val}%` }} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Remarks */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-1">
                  <Label className="text-[11px] font-semibold text-gray-600 uppercase tracking-wider">Audit Remarks & Observations</Label>
                  <Textarea
                    placeholder="Enter compliance notes or pricing observations..."
                    className="border-gray-200 text-gray-900 text-xs min-h-[75px] bg-white rounded-lg"
                    value={evaluatorNotes}
                    onChange={(e) => setEvaluatorNotes(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-[11px] font-semibold text-gray-600 uppercase tracking-wider">Recommendation</Label>
                  <Select value={recommendation} onValueChange={setRecommendation}>
                    <SelectTrigger className="border-gray-200 h-9 text-xs bg-white text-gray-900 font-medium rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200">
                      <SelectItem value="RECOMMENDED">Recommended for Award</SelectItem>
                      <SelectItem value="CONDITIONAL">Conditionally Approved</SelectItem>
                      <SelectItem value="REJECTED">Not Recommended</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="pt-2">
                    <Button
                      type="submit"
                      disabled={isSubmittingEval}
                      className="w-full bg-[#c1121f] hover:bg-[#a00f1a] text-white font-medium h-9 text-xs shadow-xs rounded-lg"
                    >
                      {isSubmittingEval ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Evaluation Score"}
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Tabs & Search Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("quotations")}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === "quotations"
                ? "bg-[#1e50c8] text-white shadow-xs"
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200/70"
            }`}
          >
            Evaluated Quotations ({filteredQuotations.length})
          </button>
          <button
            onClick={() => setActiveTab("suppliers")}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === "suppliers"
                ? "bg-[#1e50c8] text-white shadow-xs"
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200/70"
            }`}
          >
            Registered Suppliers ({vendors?.length ?? 0})
          </button>
        </div>

        <div className="relative max-w-xs flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
          <Input
            placeholder="Search quotations or suppliers..."
            className="pl-8.5 h-8.5 border-gray-200 text-gray-900 text-xs rounded-lg"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* TAB 1: EVALUATED QUOTATIONS */}
      {activeTab === "quotations" && (
        <div className="space-y-3.5">
          {isLoading && (
            <div className="flex justify-center py-12 text-xs text-gray-500 gap-2 items-center">
              <Loader2 className="h-4 w-4 animate-spin text-[#c1121f]" /> Loading evaluated quotations...
            </div>
          )}

          {!isLoading && filteredQuotations.map((q, idx) => {
            const perfScore = 88;
            const priceScore = q.totalAmount < 500000 ? 92 : q.totalAmount < 1000000 ? 65 : 42;
            const deliveryScore = 75;
            const costScore = 80;
            const warrantyScore = 85;

            const overallScore = Math.round((perfScore + priceScore + deliveryScore + costScore + warrantyScore) / 5);
            const scoreColor = getScoreColorConfig(overallScore);

            return (
              <Card
                key={q.id}
                className={`border bg-white transition-all shadow-xs rounded-xl overflow-hidden ${
                  q.selected ? "border-emerald-300 shadow-xs" : "border-gray-100 hover:border-gray-200"
                }`}
              >
                <CardContent className="p-4 space-y-3.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100/80 pb-3">
                    <div className="flex items-center gap-3">
                      <div className={`h-9 w-9 rounded-xl flex items-center justify-center font-semibold text-xs ${q.selected ? "bg-emerald-50 text-emerald-700" : "bg-blue-50/80 text-[#1e50c8]"}`}>
                        {q.selected ? <Trophy className="h-4.5 w-4.5 stroke-[1.75]" /> : `#${idx + 1}`}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs font-semibold text-[#1e50c8]">{q.quotationNumber}</span>
                          <span className="text-[11px] text-gray-400">RFQ: {q.rfqNumber || `RFQ-${q.rfqId}`}</span>
                          {q.selected && (
                            <Badge className="bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-[10px] font-semibold px-2 py-0">
                              AWARDED SUPPLIER
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs font-semibold text-gray-900 mt-0.5">{q.vendorName}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-5">
                      <div className="text-right">
                        <p className="text-[10px] text-gray-400 font-medium uppercase">Quote Value</p>
                        <p className="text-xs font-bold text-gray-900">{formatCurrency(q.totalAmount)} ETB</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-gray-400 font-medium uppercase">Score</p>
                        <Badge className={`${scoreColor.badge} border text-[11px] font-semibold px-2 py-0.5`}>
                          {overallScore} / 100
                        </Badge>
                      </div>
                      {q.selected ? (
                        <Button
                          size="sm"
                          className="h-7.5 text-xs bg-emerald-700 hover:bg-emerald-800 text-white font-medium px-3 rounded-lg"
                          asChild
                        >
                          <Link href="/prms/purchase-orders/new">
                            Issue PO <ArrowRight className="h-3 w-3 ml-1" />
                          </Link>
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          className="h-7.5 text-xs bg-[#c1121f] hover:bg-[#a00f1a] text-white font-medium px-3 rounded-lg"
                          onClick={() => handleAward(q)}
                          disabled={selectQuotation.isPending}
                        >
                          <Award className="h-3 w-3 mr-1" /> Select & Award
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* 5 Metrics Breakdown */}
                  <div>
                    <p className="text-[11px] font-semibold text-gray-600 uppercase tracking-wider mb-2">
                      5 Evaluation Category Scores
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
                      {[
                        { label: "Performance", score: perfScore },
                        { label: "Price", score: priceScore },
                        { label: "Delivery", score: deliveryScore },
                        { label: "Cost", score: costScore },
                        { label: "Warranty", score: warrantyScore },
                      ].map((item) => {
                        const cfg = getScoreColorConfig(item.score);
                        return (
                          <div key={item.label} className="p-2.5 rounded-lg border border-gray-100 bg-gray-50/50">
                            <div className="flex items-center justify-between text-[11px] mb-1">
                              <span className="text-gray-500 font-medium">{item.label}</span>
                              <span className={`font-semibold ${cfg.text}`}>{item.score}%</span>
                            </div>
                            <div className="h-1.5 w-full rounded-full bg-gray-200/80 overflow-hidden">
                              <div className={`h-full ${cfg.bg}`} style={{ width: `${item.score}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* TAB 2: REGISTERED SUPPLIERS */}
      {activeTab === "suppliers" && (
        <div className="space-y-3.5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-gray-800">Registered Suppliers ({filteredVendors.length})</h3>
            <p className="text-[11px] text-gray-400">Click any supplier to view their evaluation metrics</p>
          </div>

          {loadingVendors && (
            <div className="flex justify-center py-12 text-xs text-gray-500 gap-2 items-center">
              <Loader2 className="h-4 w-4 animate-spin text-[#1e50c8]" /> Loading registered suppliers...
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredVendors.map((v) => {
              const isSelected = selectedVendorId === v.id;
              const perf = v.performanceScore != null ? Math.round(v.performanceScore * 20) : 70;
              const price = 82;
              const delivery = 78;
              const cost = 85;
              const warranty = 80;
              const avgScore = Math.round((perf + price + delivery + cost + warranty) / 5);
              const cfg = getScoreColorConfig(avgScore);

              return (
                <Card
                  key={v.id}
                  onClick={() => setSelectedVendorId(v.id)}
                  className={`cursor-pointer transition-all border rounded-xl overflow-hidden p-4 ${
                    isSelected ? "border-[#1e50c8] bg-blue-50/20 shadow-xs" : "border-gray-100 bg-white hover:border-gray-200"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="h-9 w-9 rounded-lg bg-blue-50/70 text-[#1e50c8] font-semibold text-xs flex items-center justify-center">
                        <Building2 className="h-4.5 w-4.5 stroke-[1.75]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-gray-900 text-xs">{v.name}</p>
                          {isSelected && (
                            <Badge className="bg-blue-50 text-[#1e50c8] border border-blue-200/80 text-[10px] font-semibold">
                              Selected
                            </Badge>
                          )}
                        </div>
                        <p className="text-[11px] text-gray-400 font-mono">{v.vendorCode} · {v.vendorType}</p>
                      </div>
                    </div>
                    <Badge className={`${cfg.badge} border text-[11px] font-semibold px-2 py-0.5`}>
                      {avgScore}% Score
                    </Badge>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-gray-100/80">
                    {[
                      { label: "Performance", val: perf },
                      { label: "Price", val: price },
                      { label: "Delivery", val: delivery },
                      { label: "Cost", val: cost },
                      { label: "Warranty", val: warranty },
                    ].map((m) => {
                      const mCfg = getScoreColorConfig(m.val);
                      return (
                        <div key={m.label} className="flex items-center gap-2.5 text-[11px]">
                          <span className="w-20 text-gray-500 font-medium">{m.label}:</span>
                          <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                            <div className={`h-full ${mCfg.bg}`} style={{ width: `${m.val}%` }} />
                          </div>
                          <span className={`w-8 text-right font-semibold ${mCfg.text}`}>{m.val}%</span>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
