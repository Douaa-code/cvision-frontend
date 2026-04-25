"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Settings, Bell, Shield, Globe, Check, Loader2 } from "lucide-react";
import { useSettingsStore } from "@/lib/stores/settingsStore";
import { adminApi, AdminSettings } from "@/lib/api/admin";

const tabs = [
  { id: "general", label: "General", icon: Settings },
  { id: "platform", label: "Platform", icon: Globe },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
] as const;

type TabId = (typeof tabs)[number]["id"];

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("general");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [loadingSettings, setLoadingSettings] = useState(true);

  const { applySettings } = useSettingsStore();

  // General
  const [footerText, setFooterText] = useState("");
  const [supportEmail, setSupportEmail] = useState("");

  // Platform
  const [maxJobsPerCompany, setMaxJobsPerCompany] = useState("10");
  const [maxApplicantsPerJob, setMaxApplicantsPerJob] = useState("100");

  // Notifications
  const [notifyNewCompany, setNotifyNewCompany] = useState(true);
  const [notifyNewCandidate, setNotifyNewCandidate] = useState(false);

  // Security
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    adminApi
      .getSettings()
      .then((s: AdminSettings) => {
        setFooterText(s.footerText ?? "");
        setSupportEmail(s.supportEmail ?? "");
        setMaxJobsPerCompany(String(s.maxJobsPerCompany ?? 10));
        setMaxApplicantsPerJob(String(s.maxApplicantsPerJob ?? 100));
        setNotifyNewCompany(s.notifyNewCompany ?? true);
        setNotifyNewCandidate(s.notifyNewCandidate ?? false);
        applySettings(s.footerText ?? "", s.supportEmail ?? "");
      })
      .catch(console.error)
      .finally(() => setLoadingSettings(false));
  }, [applySettings]);

  const showSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleSaveGeneral = async () => {
    setSaving(true);
    setSaveError("");
    try {
      await adminApi.updateSettings({ footerText, supportEmail });
      applySettings(footerText, supportEmail);
      showSaved();
    } catch {
      setSaveError("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  const handleSavePlatform = async () => {
    setSaving(true);
    setSaveError("");
    try {
      await adminApi.updateSettings({
        maxJobsPerCompany: Number(maxJobsPerCompany),
        maxApplicantsPerJob: Number(maxApplicantsPerJob),
      });
      showSaved();
    } catch {
      setSaveError("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotifications = async () => {
    setSaving(true);
    setSaveError("");
    try {
      await adminApi.updateSettings({ notifyNewCompany, notifyNewCandidate });
      showSaved();
    } catch {
      setSaveError("Failed to save preferences.");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    setPasswordError("");
    if (!currentPassword) { setPasswordError("Current password is required."); return; }
    if (newPassword.length < 6) { setPasswordError("New password must be at least 6 characters."); return; }
    if (newPassword !== confirmPassword) { setPasswordError("Passwords do not match."); return; }

    setSaving(true);
    try {
      await adminApi.changePassword(currentPassword, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      showSaved();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update password.";
      setPasswordError(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loadingSettings) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-2xl font-bold mb-6">Platform Settings</h1>

      {/* Tabs */}
      <div className="flex gap-1 sm:gap-2 mb-6 flex-wrap">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-cvision-green text-white"
                  : "bg-cvision-container text-muted-foreground hover:bg-cvision-bar"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {saved && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 flex items-center gap-2 bg-cvision-green-bg text-cvision-green px-4 py-3 rounded-lg text-sm font-medium"
        >
          <Check className="w-4 h-4" />
          Settings saved successfully.
        </motion.div>
      )}

      {saveError && (
        <div className="mb-4 px-4 py-3 rounded-lg text-sm font-medium bg-cvision-red-bg text-cvision-red">
          {saveError}
        </div>
      )}

      {/* General */}
      {activeTab === "general" && (
        <Card>
          <CardContent className="p-6 space-y-6">
            <div>
              <h2 className="font-semibold text-lg mb-1">General Settings</h2>
              <p className="text-sm text-muted-foreground">Basic platform configuration.</p>
            </div>
            <Separator />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Footer Text</Label>
                <Input value={footerText} onChange={(e) => setFooterText(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Support Email</Label>
                <Input type="email" value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)} />
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleSaveGeneral} disabled={saving}>
                {saving ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Saving…</> : "Save Changes"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Platform */}
      {activeTab === "platform" && (
        <Card>
          <CardContent className="p-6 space-y-6">
            <div>
              <h2 className="font-semibold text-lg mb-1">Platform Configuration</h2>
              <p className="text-sm text-muted-foreground">Control platform behavior and limits.</p>
            </div>
            <Separator />
            <div className="space-y-4">
              <div className="max-w-xs space-y-2">
                <Label>Max job offers per company</Label>
                <Input
                  type="number"
                  value={maxJobsPerCompany}
                  onChange={(e) => setMaxJobsPerCompany(e.target.value)}
                />
              </div>
              <div className="max-w-xs space-y-2">
                <Label>Max applicants per job offer</Label>
                <Input
                  type="number"
                  value={maxApplicantsPerJob}
                  onChange={(e) => setMaxApplicantsPerJob(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleSavePlatform} disabled={saving}>
                {saving ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Saving…</> : "Save Changes"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notifications */}
      {activeTab === "notifications" && (
        <Card>
          <CardContent className="p-6 space-y-6">
            <div>
              <h2 className="font-semibold text-lg mb-1">Admin Notifications</h2>
              <p className="text-sm text-muted-foreground">Configure email notifications for admin.</p>
            </div>
            <Separator />
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Checkbox
                  id="notifCompany"
                  checked={notifyNewCompany}
                  onCheckedChange={(c) => setNotifyNewCompany(c === true)}
                />
                <div>
                  <Label htmlFor="notifCompany" className="cursor-pointer">New company registration</Label>
                  <p className="text-xs text-muted-foreground">Get notified when a new company registers.</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox
                  id="notifCandidate"
                  checked={notifyNewCandidate}
                  onCheckedChange={(c) => setNotifyNewCandidate(c === true)}
                />
                <div>
                  <Label htmlFor="notifCandidate" className="cursor-pointer">New candidate registration</Label>
                  <p className="text-xs text-muted-foreground">Get notified when a new candidate signs up.</p>
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleSaveNotifications} disabled={saving}>
                {saving ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Saving…</> : "Save Preferences"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Security */}
      {activeTab === "security" && (
        <Card>
          <CardContent className="p-6 space-y-6">
            <div>
              <h2 className="font-semibold text-lg mb-1">Security</h2>
              <p className="text-sm text-muted-foreground">Update admin password.</p>
            </div>
            <Separator />
            <div className="max-w-md space-y-4">
              <div className="space-y-2">
                <Label>Current Password</Label>
                <Input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                />
              </div>
              <div className="space-y-2">
                <Label>New Password</Label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                />
              </div>
              <div className="space-y-2">
                <Label>Confirm New Password</Label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                />
              </div>
              {passwordError && <p className="text-sm text-cvision-red">{passwordError}</p>}
              <Button onClick={handleChangePassword} disabled={saving}>
                {saving ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Updating…</> : "Update Password"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}
