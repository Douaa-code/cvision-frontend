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
import { Progress } from "@/components/ui/progress";
import {
  Briefcase,
  ClipboardList,
  Clock,
  UserCheck,
  ArrowRight,
  Upload,
  X,
} from "lucide-react";
import { StatusBadge } from "@/components/shared/StatusBadge";
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
import { jobsApi } from "@/lib/api/jobs";
import { applicationsApi } from "@/lib/api/applications";
import { companyApi } from "@/lib/api/company";
import { adaptJob, adaptApplication } from "@/lib/api/adapters";
import type { ApiApplication } from "@/lib/api/adapters";
import type { JobOffer, Application } from "@/types";

const STATUS_COLORS = ["#00C897", "#FFC107", "#E74C3C"];

export default function CompanyDashboard() {
  const [companyJobs, setCompanyJobs] = useState<JobOffer[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAdModal, setShowAdModal] = useState(false);
  const [adFormData, setAdFormData] = useState({ imageUrl: null as File | null, linkUrl: "" });
  const [adSubmitting, setAdSubmitting] = useState(false);
  const [adMessage, setAdMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    async function load() {
      try {
        // Fetch company jobs
        const jobsRes = await jobsApi.companyList();
        const jobs = (jobsRes?.data?.data ?? []).map(adaptJob);
        setCompanyJobs(jobs);

        // Try to get all applications via dashboard stats or per-job
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const dashRes = await companyApi.dashboard() as any;
          // If the dashboard endpoint returns applications, use them
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const rawApps: ApiApplication[] = dashRes?.data?.recent_applications ?? [];
          if (rawApps.length > 0) {
            setApplications(rawApps.map(adaptApplication));
          }
        } catch {
          // dashboard endpoint might not return applications - that's OK
        }
      } catch {
        // keep empty on error
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const handleSubmitAd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adFormData.imageUrl || !adFormData.linkUrl) {
      setAdMessage({ type: "error", text: "Please fill in all fields" });
      return;
    }

    setAdSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('image_url', adFormData.imageUrl);
      formData.append('link_url', adFormData.linkUrl);

      await companyApi.submitAd(formData);

      setAdMessage({ type: "success", text: "Ad request submitted successfully!" });
      setAdFormData({ imageUrl: null, linkUrl: "" });
      setTimeout(() => setShowAdModal(false), 2000);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      setAdMessage({ type: "error", text: message });
    } finally {
      setAdSubmitting(false);
    }
  };

  const pendingApps = applications.filter((a) => a.currentStatus === "Pending");
  const acceptedApps = applications.filter((a) => a.currentStatus === "Accepted");
  const rejectedApps = applications.filter((a) => a.currentStatus === "Rejected");

  const statusData = [
    { name: "Accepted", value: acceptedApps.length },
    { name: "Pending", value: pendingApps.length },
    { name: "Rejected", value: rejectedApps.length },
  ];

  const appsPerJob = companyJobs.map((job) => ({
    name: job.jobTitle.length > 20 ? job.jobTitle.slice(0, 20) + "…" : job.jobTitle,
    Applications: job.applicationsCount,
  }));

  const stats = [
    {
      label: "Active Job Offers",
      value: companyJobs.filter((j) => j.status === "Active").length.toString(),
      icon: Briefcase,
      color: "text-cvision-green",
    },
    {
      label: "Total Applications",
      value: companyJobs.reduce((sum, j) => sum + j.applicationsCount, 0).toString(),
      icon: ClipboardList,
      color: "text-cvision-green",
    },
    {
      label: "Pending Reviews",
      value: pendingApps.length.toString(),
      icon: Clock,
      color: "text-cvision-green",
    },
    {
      label: "Accepted Candidates",
      value: acceptedApps.length.toString(),
      icon: UserCheck,
      color: "text-cvision-green",
    },
  ];

  const recentApps = [...applications]
    .sort((a, b) => b.appliedDate.getTime() - a.appliedDate.getTime())
    .slice(0, 5);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cvision-green" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Company Dashboard</h1>
        <Button onClick={() => setShowAdModal(true)} className="gap-2">
          <Upload className="w-4 h-4" />
          Request Ad
        </Button>
      </div>

      {/* Stats */}
      <motion.div
        variants={staggerContainerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.label} variants={staggerItemVariants} className="h-full">
              <Card className="h-full">
                <CardContent className="p-6 flex items-center gap-4">
                  <div
                    className={`p-3 rounded-lg bg-cvision-container ${stat.color}`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">
                      {stat.label}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Application Status */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="h-full">
            <CardContent className="p-6">
              <h2 className="font-semibold text-lg mb-1">Application Status</h2>
              <p className="text-sm text-muted-foreground mb-2">Breakdown by decision</p>
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

        {/* Applications per Job */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="h-full">
            <CardContent className="p-6">
              <h2 className="font-semibold text-lg mb-1">Applications per Job</h2>
              <p className="text-sm text-muted-foreground mb-2">Total applicants by position</p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={appsPerJob} layout="vertical" barCategoryGap="35%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" horizontal={false} />
                  <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} width={100} />
                  <Tooltip
                    contentStyle={{ borderRadius: 8, border: "1px solid #E5E7EB", fontSize: 12 }}
                    cursor={{ fill: "#F3F4F6" }}
                  />
                  <Bar dataKey="Applications" fill="#3B82F6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Active Job Offers */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-6"
      >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Active Job Offers</h2>
                <Link href="/company/jobs">
                  <Button variant="ghost" size="sm">
                    View All <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
              {companyJobs.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No job offers yet.{" "}
                  <Link href="/company/jobs/create" className="text-cvision-green hover:underline">
                    Create your first offer
                  </Link>
                </p>
              ) : (
                <div className="space-y-4">
                  {companyJobs.map((job) => {
                    const fillPercent = job.maxAcceptedCandidates > 0
                      ? Math.round((job.currentAccepted / job.maxAcceptedCandidates) * 100)
                      : 0;
                    return (
                      <div
                        key={job.id}
                        className="p-4 bg-cvision-container rounded-lg"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-medium text-sm">{job.jobTitle}</p>
                            <p className="text-xs text-muted-foreground">
                              {job.applicationsCount} applicants
                            </p>
                          </div>
                          <span className="text-xs font-medium text-cvision-green bg-cvision-green-bg px-2 py-1 rounded">
                            {job.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                          <span>
                            Positions filled: {job.currentAccepted}/
                            {job.maxAcceptedCandidates}
                          </span>
                          <span className="font-semibold">{fillPercent}%</span>
                        </div>
                        <Progress value={fillPercent} className="h-1.5" />
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
      </motion.div>

      {/* Recent Applications */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Recent Applications</h2>
              <Link href="/company/applicants">
                <Button variant="ghost" size="sm">
                  View All <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
            {recentApps.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No applications received yet.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Candidate</TableHead>
                      <TableHead>Job Position</TableHead>
                      <TableHead>Compatibility</TableHead>
                      <TableHead>Test Status</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Applied</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentApps.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell className="font-medium">
                          {app.candidateName}
                        </TableCell>
                        <TableCell>{app.jobTitle}</TableCell>
                        <TableCell>
                          <span
                            className={`font-semibold ${
                              app.compatibilityScore === null
                                ? "text-muted-foreground"
                                : app.compatibilityScore >= 67
                                ? "text-cvision-green"
                                : app.compatibilityScore >= 34
                                ? "text-cvision-yellow"
                                : "text-cvision-red"
                            }`}
                          >
                            {app.compatibilityScore !== null ? `${app.compatibilityScore}%` : "N/A"}
                          </span>
                        </TableCell>
                        <TableCell>
                          {app.testStatus ? (
                            <StatusBadge status={app.testStatus} />
                          ) : (
                            <span className="text-xs text-muted-foreground">
                              Not started
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={app.currentStatus} />
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {app.appliedDate.toLocaleDateString()}
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

      {/* Ad Request Modal */}
      {showAdModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Request Promotion Ad</h2>
                <button
                  onClick={() => setShowAdModal(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmitAd} className="space-y-4">
                {/* Image Upload */}
                <div>
                  <label className="text-sm font-medium block mb-2">Ad Image *</label>
                  <p className="text-xs text-muted-foreground mb-2">
                    Wide banner format required — recommended <strong>1280×320px</strong> (4:1 ratio). Min width: 800px, max height: 400px. JPG or PNG, max 5MB.
                  </p>
                  <div className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-cvision-green transition"
                    onClick={() => document.getElementById('adImageInput')?.click()}
                  >
                    {adFormData.imageUrl ? (
                      <div>
                        <p className="text-sm font-medium text-cvision-green">{adFormData.imageUrl.name}</p>
                        <img
                          src={URL.createObjectURL(adFormData.imageUrl)}
                          alt="Preview"
                          className="w-full aspect-[4/1] object-cover rounded mt-2"
                        />
                      </div>
                    ) : (
                      <div className="py-6">
                        <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">Click to upload banner image</p>
                        <p className="text-xs text-muted-foreground">Recommended: 1280×320px (4:1 wide banner)</p>
                      </div>
                    )}
                    <input
                      id="adImageInput"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => setAdFormData({ ...adFormData, imageUrl: e.target.files?.[0] || null })}
                    />
                  </div>
                </div>

                {/* Link URL */}
                <div>
                  <label className="text-sm font-medium block mb-2">Ad Link URL *</label>
                  <input
                    type="url"
                    placeholder="https://example.com"
                    value={adFormData.linkUrl}
                    onChange={(e) => setAdFormData({ ...adFormData, linkUrl: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cvision-green"
                  />
                </div>

                {/* Message */}
                {adMessage.text && (
                  <div className={`p-3 rounded text-sm ${
                    adMessage.type === 'success'
                      ? 'bg-green-50 text-green-800'
                      : 'bg-red-50 text-red-800'
                  }`}>
                    {adMessage.text}
                  </div>
                )}

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAdModal(false)}
                    disabled={adSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={adSubmitting}
                    className="flex-1"
                  >
                    {adSubmitting ? "Submitting..." : "Request Ad"}
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
