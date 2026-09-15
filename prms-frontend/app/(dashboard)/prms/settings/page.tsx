"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Settings, Save, RefreshCw, Shield, Bell, Building,
  Check, FileText, AlertTriangle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SystemConfiguration, SettingCategory } from "@/features/prms/types/settings";

const TABS = [
  { id:"GENERAL",      label:"General",       icon:Settings  },
  { id:"PROCUREMENT",  label:"Procurement",   icon:Building  },
  { id:"APPROVAL",     label:"Approvals",     icon:Check     },
  { id:"NOTIFICATION", label:"Notifications", icon:Bell      },
  { id:"SECURITY",     label:"Security",      icon:Shield    },
  { id:"REPORTS",      label:"Reports",       icon:FileText  },
] as const;

export default function SettingsPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab]   = useState<SettingCategory>("GENERAL");
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving]     = useState(false);

  const [config, setConfig] = useState<SystemConfiguration>({
    general:       { companyName:"Ethiopian Institute of Science and Technology (INSA)", companyLogo:"", timezone:"Africa/Addis_Ababa", dateFormat:"DD/MM/YYYY", currency:"ETB", language:"en" },
    procurement:   { defaultApprovalWorkflow:"standard-approval", autoCreatePO:true, requireGRNForInvoice:true, allowPartialDelivery:true, defaultPaymentTerms:"NET_30", poNumberFormat:"PO-{YYYY}-{#####}", rfqNumberFormat:"RFQ-{YYYY}-{#####}" },
    approval:      { parallelApproval:false, approvalTimeout:72, escalationEnabled:true, escalationTimeout:24, autoRejectTimeout:168 },
    notifications: { emailEnabled:true, smsEnabled:false, pushEnabled:true, emailFrom:"noreply@insa.edu.et", emailHost:"smtp.insa.edu.et", emailPort:587, smsProvider:"" },
    security:      { sessionTimeout:480, passwordExpiry:90, maxLoginAttempts:5, twoFactorEnabled:false, auditLogRetention:365 },
    reports:       { defaultFormat:"PDF", autoScheduleEnabled:true, reportRetention:180, maxFileSize:10 },
  });

  const upd = (section: string, field: string, value: any) => {
    setConfig((prev) => ({ ...prev, [section]: { ...(prev as any)[section], [field]: value } }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 1200));
    toast({ title:"Settings saved", description:"Configuration saved successfully." });
    setIsSaving(false);
    setHasChanges(false);
  };

  const inputCls = "border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#c1121f]";
  const selectTriggerCls = "border-gray-300 text-gray-800";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">PRMS Settings</h2>
          <p className="text-sm text-gray-500 mt-0.5">Configure system settings and preferences</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-gray-300 text-gray-700" onClick={() => setHasChanges(false)} disabled={!hasChanges}>
            <RefreshCw className="h-4 w-4 mr-2" />Reset
          </Button>
          <Button className="bg-[#c1121f] hover:bg-[#a00f1a] text-white" onClick={handleSave} disabled={!hasChanges || isSaving}>
            <Save className="h-4 w-4 mr-2" />{isSaving ? "Saving…" : "Save Changes"}
          </Button>
        </div>
      </div>

      {hasChanges && (
        <div className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-amber-700">Unsaved Changes</p>
            <p className="text-xs text-amber-600 mt-0.5">Click "Save Changes" to apply your configuration.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Tab nav */}
        <Card className="border border-gray-200 bg-white lg:col-span-1 h-fit">
          <CardContent className="p-2">
            <div className="space-y-0.5">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id as SettingCategory)}
                    className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-left transition-colors ${active ? "bg-[#c1121f]/10 text-[#c1121f] font-semibold border border-[#c1121f]/20" : "text-gray-600 hover:bg-gray-100"}`}>
                    <Icon className="h-4 w-4 flex-shrink-0" />{tab.label}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Content */}
        <div className="lg:col-span-3 space-y-5">
          {activeTab === "GENERAL" && (
            <Card className="border border-gray-200 bg-white">
              <CardHeader className="pb-3 border-b border-gray-100"><CardTitle className="text-sm font-semibold text-gray-900 flex items-center gap-2"><Settings className="h-4 w-4" />General Settings</CardTitle></CardHeader>
              <CardContent className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
                <div><Label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Company Name</Label><Input className={`mt-1.5 ${inputCls}`} value={config.general.companyName} onChange={(e) => upd("general","companyName",e.target.value)} /></div>
                <div><Label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Timezone</Label>
                  <Select value={config.general.timezone} onValueChange={(v) => upd("general","timezone",v)}>
                    <SelectTrigger className={`mt-1.5 ${selectTriggerCls}`}><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-white border-gray-200"><SelectItem value="Africa/Addis_Ababa">Africa/Addis_Ababa</SelectItem><SelectItem value="UTC">UTC</SelectItem></SelectContent>
                  </Select>
                </div>
                <div><Label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Date Format</Label>
                  <Select value={config.general.dateFormat} onValueChange={(v) => upd("general","dateFormat",v)}>
                    <SelectTrigger className={`mt-1.5 ${selectTriggerCls}`}><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-white border-gray-200"><SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem><SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem><SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem></SelectContent>
                  </Select>
                </div>
                <div><Label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Currency</Label>
                  <Select value={config.general.currency} onValueChange={(v) => upd("general","currency",v)}>
                    <SelectTrigger className={`mt-1.5 ${selectTriggerCls}`}><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-white border-gray-200"><SelectItem value="ETB">ETB — Ethiopian Birr</SelectItem><SelectItem value="USD">USD — US Dollar</SelectItem></SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "PROCUREMENT" && (
            <Card className="border border-gray-200 bg-white">
              <CardHeader className="pb-3 border-b border-gray-100"><CardTitle className="text-sm font-semibold text-gray-900 flex items-center gap-2"><Building className="h-4 w-4" />Procurement Settings</CardTitle></CardHeader>
              <CardContent className="p-5 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div><Label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">PO Number Format</Label><Input className={`mt-1.5 ${inputCls}`} value={config.procurement.poNumberFormat} onChange={(e) => upd("procurement","poNumberFormat",e.target.value)} /></div>
                  <div><Label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">RFQ Number Format</Label><Input className={`mt-1.5 ${inputCls}`} value={config.procurement.rfqNumberFormat} onChange={(e) => upd("procurement","rfqNumberFormat",e.target.value)} /></div>
                </div>
                {[
                  { field:"autoCreatePO",        label:"Auto Create Purchase Orders",  sub:"Automatically create PO when quotation is accepted" },
                  { field:"requireGRNForInvoice", label:"Require GRN for Invoice",      sub:"Require goods receipt before invoice processing" },
                  { field:"allowPartialDelivery", label:"Allow Partial Delivery",       sub:"Allow suppliers to deliver orders in multiple shipments" },
                ].map(({ field, label, sub }) => (
                  <div key={field} className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                    <div><p className="text-sm font-medium text-gray-900">{label}</p><p className="text-xs text-gray-500 mt-0.5">{sub}</p></div>
                    <Switch checked={(config.procurement as any)[field]} onCheckedChange={(v) => upd("procurement",field,v)} />
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {activeTab === "NOTIFICATION" && (
            <Card className="border border-gray-200 bg-white">
              <CardHeader className="pb-3 border-b border-gray-100"><CardTitle className="text-sm font-semibold text-gray-900 flex items-center gap-2"><Bell className="h-4 w-4" />Notification Settings</CardTitle></CardHeader>
              <CardContent className="p-5 space-y-4">
                {[
                  { field:"emailEnabled", label:"Email Notifications", sub:"Send notifications via email" },
                  { field:"smsEnabled",   label:"SMS Notifications",   sub:"Send notifications via SMS" },
                  { field:"pushEnabled",  label:"Push Notifications",  sub:"Browser push notifications" },
                ].map(({ field, label, sub }) => (
                  <div key={field} className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                    <div><p className="text-sm font-medium text-gray-900">{label}</p><p className="text-xs text-gray-500 mt-0.5">{sub}</p></div>
                    <Switch checked={(config.notifications as any)[field]} onCheckedChange={(v) => upd("notifications",field,v)} />
                  </div>
                ))}
                <div><Label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">From Email</Label><Input className={`mt-1.5 ${inputCls}`} value={config.notifications.emailFrom} onChange={(e) => upd("notifications","emailFrom",e.target.value)} /></div>
              </CardContent>
            </Card>
          )}

          {activeTab === "SECURITY" && (
            <Card className="border border-gray-200 bg-white">
              <CardHeader className="pb-3 border-b border-gray-100"><CardTitle className="text-sm font-semibold text-gray-900 flex items-center gap-2"><Shield className="h-4 w-4" />Security Settings</CardTitle></CardHeader>
              <CardContent className="p-5 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div><Label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Session Timeout (min)</Label><Input type="number" className={`mt-1.5 ${inputCls}`} value={config.security.sessionTimeout} onChange={(e) => upd("security","sessionTimeout",+e.target.value)} /></div>
                  <div><Label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Max Login Attempts</Label><Input type="number" className={`mt-1.5 ${inputCls}`} value={config.security.maxLoginAttempts} onChange={(e) => upd("security","maxLoginAttempts",+e.target.value)} /></div>
                  <div><Label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Password Expiry (days)</Label><Input type="number" className={`mt-1.5 ${inputCls}`} value={config.security.passwordExpiry} onChange={(e) => upd("security","passwordExpiry",+e.target.value)} /></div>
                  <div><Label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Audit Log Retention (days)</Label><Input type="number" className={`mt-1.5 ${inputCls}`} value={config.security.auditLogRetention} onChange={(e) => upd("security","auditLogRetention",+e.target.value)} /></div>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                  <div><p className="text-sm font-medium text-gray-900">Two-Factor Authentication</p><p className="text-xs text-gray-500 mt-0.5">Require 2FA for all users</p></div>
                  <Switch checked={config.security.twoFactorEnabled} onCheckedChange={(v) => upd("security","twoFactorEnabled",v)} />
                </div>
              </CardContent>
            </Card>
          )}

          {(activeTab === "APPROVAL" || activeTab === "REPORTS") && (
            <Card className="border border-gray-200 bg-white">
              <CardContent className="p-8 text-center">
                <p className="text-gray-400 text-sm">Configuration for this section coming soon.</p>
                <Button variant="outline" className="mt-4 border-gray-300 text-gray-600" onClick={() => toast({ title:"Saved" })}>
                  <Save className="h-4 w-4 mr-2" />Save Defaults
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
