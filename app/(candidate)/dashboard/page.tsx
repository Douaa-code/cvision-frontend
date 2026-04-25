"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Send, Clock, Bookmark, TrendingUp, AlertTriangle, Eye, CheckCircle2, Upload, X } from "lucide-react";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { JobCard } from "@/components/shared/JobCard";
import {
  staggerContainerVariants,
  staggerItemVariants,
} from "@/lib/animations/variants";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { applicationsApi } from "@/lib/api/applications";
import { jobsApi } from "@/lib/api/jobs";
import { adaptJob, adaptApplication } from "@/lib/api/adapters";
import type { ApiApplication } from "@/lib/api/adapters";
import type { JobOffer, Application } from "@/types";
import { candidateApi } from "@/lib/api/candidate";

const STATUS_COLORS = ["#00C897", "#FFC107", "#E74C3C"];

export default function CandidateDashboard() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<JobOffer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [confirmedAppId, setConfirmedAppId] = useState<string | null>(null);
  const [showSeparationModal, setShowSeparationModal] = useState(false);
  const [separationFormData, setSeparationFormData] = useState({ documentFile: null as File | null, comment: "" });
  const [separationSubmitting, setSeparationSubmitting] = useState(false);
  const [separationMessage, setSeparationMessage] = useState({ type: "", text: "" });
  const [confirmedApplication, setConfirmedApplication] = useState<Application | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [appsRes, jobsRes] = await Promise.all([
          applicationsApi.myApplications(),
          jobsApi.list(),
        ]);
        // candidateIndex returns paginated: { success, data: { data: [...], meta: {...} } }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const appsPayload = (appsRes as any)?.data;
        const rawApps: ApiApplication[] = Array.isArray(appsPayload)
          ? appsPayload
          : (appsPayload?.data ?? []);
        const adapted = rawApps.map(adaptApplication);
        setApplications(adapted);

        // Pre-set banner if an offer was already confirmed in a previous session
        const alreadyConfirmed = adapted.find((a) => a.confirmedAt);
        if (alreadyConfirmed) {
          setConfirmedAppId(alreadyConfirmed.id);
          setConfirmedApplication(alreadyConfirmed);
        }

        const rawJobsPayload = jobsRes?.data;
        const rawJobs = Array.isArray(rawJobsPayload)
          ? rawJobsPayload
          : (rawJobsPayload?.data ?? []);
        setJobs(rawJobs.map(adaptJob));
      } catch {
        // silently keep empty arrays on error
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const handleSubmitSeparation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!separationFormData.documentFile || !confirmedApplication) {
      setSeparationMessage({ type: "error", text: "Please upload a document" });
      return;
    }

    setSeparationSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('application_id', confirmedApplication.id);
      formData.append('document_path', separationFormData.documentFile);
      if (separationFormData.comment) {
        formData.append('comment', separationFormData.comment);
      }

      await candidateApi.submitSeparationRequest(formData);

      setSeparationMessage({ type: "success", text: "Separation request submitted successfully!" });
      setSeparationFormData({ documentFile: null, comment: "" });
      setTimeout(() => setShowSeparationModal(false), 2000);
    } catch (error) {
      setSeparationMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to submit request"
      });
    } finally {
      setSeparationSubmitting(false);
    }
  };

  const acceptedCount = applications.filter((a) => a.currentStatus === "Accepted").length;
  const hasAcceptedOffers = acceptedCount >= 2;

  const statusCounts = {
    Accepted: applications.filter((a) => a.currentStatus === "Accepted").length,
    Pending: applications.filter((a) => a.currentStatus === "Pending").length,
    Rejected: applications.filter((a) => a.currentStatus === "Rejected").length,
  };
  const statusData = [
    { name: "Accepted", value: statusCounts.Accepted },
    { name: "Pending", value: statusCounts.Pending },
    { name: "Rejected", value: statusCounts.Rejected },
  ];

  const compatibilityData = applications
    .filter((a) => a.compatibilityScore !== null)
    .map((a) => ({
      name: (a.jobTitle ?? "").length > 22 ? (a.jobTitle ?? "").slice(0, 22) + "…" : (a.jobTitle ?? ""),
      Score: a.compatibilityScore as number,
    }));

  const recentApplications = applications.slice(0, 5);
  const savedJobs = jobs.filter((j) => j.saved);
  const recommendedJobs = [...jobs]
    .sort((a, b) => (b.matchPercentage ?? 0) - (a.matchPercentage ?? 0))
    .slice(0, 3);

  const stats = [
    { label: "Applications Sent", value: String(applications.length), icon: Send, color: "text-cvision-green" },
    { label: "Pending Reviews", value: String(statusCounts.Pending), icon: Clock, color: "text-cvision-green" },
    { label: "Jobs Saved", value: String(savedJobs.length), icon: Bookmark, color: "text-cvision-green" },
    {
      label: "Highest Compatibility",
      value: (() => {
        const scores = applications.map((a) => a.compatibilityScore).filter((s): s is number => s !== null);
        return scores.length > 0 ? `${Math.max(...scores)}%` : "—";
      })(),
      icon: TrendingUp,
      color: "text-cvision-green",
    },
  ];

  const handleConfirmOffer = async (applicationId: string) => {
    setConfirmingId(applicationId);
    try {
      await applicationsApi.confirmOffer(applicationId);
      setConfirmedAppId(applicationId);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      // "already confirmed" means we succeeded in a prior session — show banner anyway
      if (msg.toLowerCase().includes("already been confirmed") || msg.toLowerCase().includes("already confirmed")) {
        setConfirmedAppId(applicationId);
      }
      // other errors are silently ignored (network issues, etc.)
    } finally {
      setConfirmingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cvision-green" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>

      {/* Confirmation success banner */}
      {confirmedAppId !== null && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="bg-cvision-green-bg border border-cvision-green/30 rounded-xl p-5 flex items-start gap-4">
            <CheckCircle2 className="w-6 h-6 text-cvision-green flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-sm text-foreground mb-1">
                Offer confirmed successfully!
              </p>
              <p className="text-sm text-muted-foreground mb-3">
                You are now officially recruited. Your training program is ready — head to the Training page to begin your onboarding.
              </p>
              <Link href="/training">
                <Button size="sm">Go to Training</Button>
              </Link>
            </div>
          </div>
        </motion.div>
      )}

      {/* Separation Request Notice */}
      {confirmedApplication && !showSeparationModal && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-sm text-foreground mb-1">
                You are currently employed
              </p>
              <p className="text-sm text-muted-foreground mb-3">
                If you have left your job or your contract has ended, you can request separation to reactivate your job seeker status.
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowSeparationModal(true)}
                className="gap-2"
              >
                <Upload className="w-4 h-4" />
                Request Separation
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* KPI Cards */}
      <motion.div
        variants={staggerContainerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.label} variants={staggerItemVariants}>
              <Card>
                <CardContent className="p-6 flex items-center gap-4">
                  <div className={`p-3 rounded-lg bg-cvision-container ${stat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Application Status */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="h-full">
            <CardContent className="p-6">
              <h2 className="font-semibold text-lg mb-1">Application Status</h2>
              <p className="text-sm text-muted-foreground mb-2">Breakdown of your applications</p>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {statusData.map((_, i) => (
                      <Cell key={i} fill={STATUS_COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [value, "Applications"]}
                    contentStyle={{ borderRadius: 8, border: "1px solid #E5E7EB", fontSize: 12 }}
                  />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Compatibility per Application */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <Card className="h-full">
            <CardContent className="p-6">
              <h2 className="font-semibold text-lg mb-1">Compatibility Scores</h2>
              <p className="text-sm text-muted-foreground mb-2">Your score per job application</p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={compatibilityData} layout="vertical" barCategoryGap="30%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12, fill: "#6B7280" }} axisLine={false} tickLine={false} unit="%" />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} width={115} />
                  <Tooltip
                    formatter={(value) => [`${value}%`, "Score"]}
                    contentStyle={{ borderRadius: 8, border: "1px solid #E5E7EB", fontSize: 12 }}
                    cursor={{ fill: "#F3F4F6" }}
                  />
                  <Bar dataKey="Score" fill="#00C897" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Acceptance Notice */}
      {hasAcceptedOffers && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="bg-cvision-yellow-bg border border-cvision-yellow/30 rounded-xl p-5 flex gap-4">
            <AlertTriangle className="w-6 h-6 text-cvision-yellow flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm text-foreground mb-1">
                You have been accepted by one or more companies
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Please note that you can choose only one company. Once you confirm
                your choice, you will be officially recruited, and your profile
                will be locked for other offers. You will then gain access to the
                training and onboarding process of the selected company. This
                action is final and cannot be changed. Choose carefully before
                confirming your decision.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Saved Jobs */}
      {savedJobs.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Saved Jobs</h2>
            <Link href="/jobs" className="text-sm text-cvision-green hover:underline">
              Browse all jobs
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </motion.div>
      )}

      {/* Recent Applications */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-8"
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Recent Applications</h2>
              <Link href="/jobs" className="text-sm text-cvision-green hover:underline">
                View all
              </Link>
            </div>
            {recentApplications.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No applications yet. Start applying to jobs!
              </p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Job Title</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Applied Date</TableHead>
                      <TableHead>Compatibility</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentApplications.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell className="font-medium">
                          {app.jobTitle}
                        </TableCell>
                        <TableCell>{app.companyName}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {app.appliedDate.toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <span
                            className="font-semibold"
                            style={{
                              color:
                                app.compatibilityScore === null
                                  ? "#9CA3AF"
                                  : app.compatibilityScore >= 67
                                  ? "#00C897"
                                  : app.compatibilityScore >= 34
                                  ? "#FFC107"
                                  : "#E74C3C",
                            }}
                          >
                            {app.compatibilityScore !== null ? `${app.compatibilityScore}%` : "N/A"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={app.currentStatus} />
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Link href={`/jobs/${app.jobId}`}>
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4 mr-1" />
                                View
                              </Button>
                            </Link>
                            {app.currentStatus === "Accepted" && (
                              confirmedAppId === app.id ? (
                                <Link href="/training">
                                  <Button size="sm" variant="outline" className="border-cvision-green text-cvision-green gap-1.5">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    Go to Training
                                  </Button>
                                </Link>
                              ) : (
                                <Button
                                  size="sm"
                                  disabled={confirmingId === app.id}
                                  onClick={() => handleConfirmOffer(app.id)}
                                >
                                  {confirmingId === app.id ? "Confirming…" : "Confirm Offer"}
                                </Button>
                              )
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Recommended Jobs */}
      {recommendedJobs.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recommended Jobs</h2>
            <Link href="/jobs" className="text-sm text-cvision-green hover:underline">
              Browse all jobs
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendedJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </motion.div>
      )}

      {/* Separation Request Modal */}
      {showSeparationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Request Job Separation</h2>
                <button
                  onClick={() => setShowSeparationModal(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-sm text-muted-foreground mb-4">
                Submit proof of separation (resignation letter, termination letter, or contract end notice) to reactivate your job seeker status.
              </p>

              <form onSubmit={handleSubmitSeparation} className="space-y-4">
                {/* Document Upload */}
                <div>
                  <label className="text-sm font-medium block mb-2">Proof Document *</label>
                  <div className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-cvision-green transition"
                    onClick={() => document.getElementById('separationDocInput')?.click()}
                  >
                    {separationFormData.documentFile ? (
                      <div>
                        <p className="text-sm font-medium text-cvision-green">{separationFormData.documentFile.name}</p>
                      </div>
                    ) : (
                      <div className="py-6">
                        <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">Click to upload document</p>
                        <p className="text-xs text-muted-foreground">PDF, JPG, PNG up to 5MB</p>
                      </div>
                    )}
                    <input
                      id="separationDocInput"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      onChange={(e) => setSeparationFormData({ ...separationFormData, documentFile: e.target.files?.[0] || null })}
                    />
                  </div>
                </div>

                {/* Comment */}
                <div>
                  <label className="text-sm font-medium block mb-2">Additional Comment (Optional)</label>
                  <textarea
                    placeholder="Explain your separation reason (e.g., contract ended, resignation, etc.)"
                    value={separationFormData.comment}
                    onChange={(e) => setSeparationFormData({ ...separationFormData, comment: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cvision-green text-sm"
                    rows={3}
                  />
                </div>

                {/* Message */}
                {separationMessage.text && (
                  <div className={`p-3 rounded text-sm ${
                    separationMessage.type === 'success'
                      ? 'bg-green-50 text-green-800'
                      : 'bg-red-50 text-red-800'
                  }`}>
                    {separationMessage.text}
                  </div>
                )}

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowSeparationModal(false)}
                    disabled={separationSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={separationSubmitting}
                    className="flex-1"
                  >
                    {separationSubmitting ? "Submitting..." : "Request Separation"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
