"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Building2, Bell, Shield, AlertTriangle, Check } from "lucide-react";
import { mockCompany } from "@/lib/mock-data/company";

const tabs = [
  { id: "general", label: "General", icon: Building2 },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "account", label: "Account", icon: AlertTriangle },
] as const;

type TabId = (typeof tabs)[number]["id"];

export default function CompanySettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("general");
  const [saved, setSaved] = useState(false);

  // General
  const [adminName, setAdminName] = useState(mockCompany.adminFullName);
  const [adminEmail, setAdminEmail] = useState(mockCompany.adminEmail);

  // Notifications
  const [emailNewApp, setEmailNewApp] = useState(true);
  const [emailTestComplete, setEmailTestComplete] = useState(true);
  const [emailWeeklyReport, setEmailWeeklyReport] = useState(false);

  // Security
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Account
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleChangePassword = () => {
    setPasswordError("");
    if (!currentPassword) { setPasswordError("Current password is required."); return; }
    if (newPassword.length < 6) { setPasswordError("New password must be at least 6 characters."); return; }
    if (newPassword !== confirmPassword) { setPasswordError("Passwords do not match."); return; }
    setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    handleSave();
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

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
          Changes saved successfully.
        </motion.div>
      )}

      {/* General */}
      {activeTab === "general" && (
        <Card>
          <CardContent className="p-6 space-y-6">
            <div>
              <h2 className="font-semibold text-lg mb-1">General Settings</h2>
              <p className="text-sm text-muted-foreground">Manage your account administrator details.</p>
            </div>
            <Separator />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Administrator Name</Label>
                <Input value={adminName} onChange={(e) => setAdminName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Administrator Email</Label>
                <Input type="email" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} />
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleSave}>Save Changes</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notifications */}
      {activeTab === "notifications" && (
        <Card>
          <CardContent className="p-6 space-y-6">
            <div>
              <h2 className="font-semibold text-lg mb-1">Notification Preferences</h2>
              <p className="text-sm text-muted-foreground">Configure email notifications.</p>
            </div>
            <Separator />
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Checkbox id="notifNewApp" checked={emailNewApp} onCheckedChange={(c) => setEmailNewApp(c === true)} />
                <div>
                  <Label htmlFor="notifNewApp" className="cursor-pointer">New Application</Label>
                  <p className="text-xs text-muted-foreground">Get notified when a candidate applies to your job offers.</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox id="notifTest" checked={emailTestComplete} onCheckedChange={(c) => setEmailTestComplete(c === true)} />
                <div>
                  <Label htmlFor="notifTest" className="cursor-pointer">Test Completed</Label>
                  <p className="text-xs text-muted-foreground">Get notified when a candidate completes a test.</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox id="notifWeekly" checked={emailWeeklyReport} onCheckedChange={(c) => setEmailWeeklyReport(c === true)} />
                <div>
                  <Label htmlFor="notifWeekly" className="cursor-pointer">Weekly Report</Label>
                  <p className="text-xs text-muted-foreground">Receive a weekly summary of recruitment activity.</p>
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleSave}>Save Preferences</Button>
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
              <p className="text-sm text-muted-foreground">Update your password.</p>
            </div>
            <Separator />
            <div className="max-w-md space-y-4">
              <div className="space-y-2">
                <Label>Current Password</Label>
                <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Enter current password" />
              </div>
              <div className="space-y-2">
                <Label>New Password</Label>
                <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Enter new password" />
              </div>
              <div className="space-y-2">
                <Label>Confirm New Password</Label>
                <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm new password" />
              </div>
              {passwordError && <p className="text-sm text-cvision-red">{passwordError}</p>}
              <Button onClick={handleChangePassword}>Update Password</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Account */}
      {activeTab === "account" && (
        <Card>
          <CardContent className="p-6 space-y-6">
            <div>
              <h2 className="font-semibold text-lg mb-1">Account</h2>
              <p className="text-sm text-muted-foreground">Manage your company account.</p>
            </div>
            <Separator />
            <div className="border border-cvision-red/30 rounded-lg p-6">
              <div className="flex items-start gap-3 mb-4">
                <AlertTriangle className="w-5 h-5 text-cvision-red mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-cvision-red">Danger Zone</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Deleting your company account will remove all job offers, applications, tests, and training programs permanently.
                  </p>
                </div>
              </div>
              <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
                Delete Company Account
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Company Account</DialogTitle>
            <DialogDescription>
              This action is irreversible. Type <strong>DELETE</strong> to confirm.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={deleteConfirmText}
            onChange={(e) => setDeleteConfirmText(e.target.value)}
            placeholder='Type "DELETE" to confirm'
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowDeleteDialog(false); setDeleteConfirmText(""); }}>
              Cancel
            </Button>
            <Button variant="destructive" disabled={deleteConfirmText !== "DELETE"} onClick={() => { setShowDeleteDialog(false); setDeleteConfirmText(""); }}>
              Delete Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
