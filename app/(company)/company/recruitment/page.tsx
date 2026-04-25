"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Users, UserCheck, Clock, XCircle, Eye, MessageCircle } from "lucide-react";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { jobsApi, type ApiJob } from "@/lib/api/jobs";
import {
  applicationsApi,
  type ApiApplicationFull,
} from "@/lib/api/applications";
import { adaptJob } from "@/lib/api/adapters";
import type { JobOffer } from "@/types";
import {
  staggerContainerVariants,
  staggerItemVariants,
} from "@/lib/animations/variants";

export default function RecruitmentPage() {
  const [jobs, setJobs]               = useState<JobOffer[]>([]);
  const [rawJobs, setRawJobs]         = useState<ApiJob[]>([]);
  const [applications, setApplications] = useState<ApiApplicationFull[]>([]);
  const [loading, setLoading]         = useState(true);
  const [filterJob, setFilterJob]     = useState("all");

  useEffect(() => {
    async function load() {
      try {
        const jobRes = await jobsApi.companyList();
        const apiJobs = jobRes?.data?.data ?? [];
        setRawJobs(apiJobs);
        setJobs(apiJobs.map(adaptJob));

        // Fetch applications for all jobs in parallel
        const results = await Promise.all(
          apiJobs.map((j) =>
            applicationsApi
              .jobApplications(j.id)
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              .then((r: any) => (r?.data?.data ?? []) as ApiApplicationFull[])
              .catch(() => [] as ApiApplicationFull[])
          )
        );
        setApplications(results.flat());
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered =
    filterJob === "all"
      ? applications
      : applications.filter((a) => String(a.job_offer?.id) === filterJob);

  const pending  = filtered.filter((a) => a.status === "pending");
  const accepted = filtered.filter((a) => a.status === "accepted");
  const rejected = filtered.filter((a) => a.status === "rejected");

  const pipelineStages = [
    { label: "Total Applicants", count: filtered.length,  icon: Users,      color: "text-cvision-blue"   },
    { label: "Pending Review",   count: pending.length,   icon: Clock,      color: "text-cvision-yellow" },
    { label: "Accepted",         count: accepted.length,  icon: UserCheck,  color: "text-cvision-green"  },
    { label: "Rejected",         count: rejected.length,  icon: XCircle,    color: "text-cvision-red"    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cvision-green" />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">Recruitment Pipeline</h1>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select value={filterJob} onValueChange={setFilterJob}>
            <SelectTrigger className="w-full sm:w-56">
              <SelectValue placeholder="Filter by job" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Positions</SelectItem>
              {rawJobs.map((j) => (
                <SelectItem key={j.id} value={String(j.id)}>{j.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {filterJob !== "all" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFilterJob("all")}
              className="text-cvision-green bg-cvision-green/10 hover:bg-cvision-green hover:text-white rounded-lg px-4 shadow-sm hover:shadow-md transition-all duration-200"
            >
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Pipeline Overview */}
      <motion.div
        variants={staggerContainerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        {pipelineStages.map((stage) => {
          const Icon = stage.icon;
          return (
            <motion.div key={stage.label} variants={staggerItemVariants}>
              <Card>
                <CardContent className="p-6 flex items-center gap-4">
                  <div className={`p-3 rounded-lg bg-cvision-container ${stage.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stage.count}</p>
                    <p className="text-sm text-muted-foreground">{stage.label}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Job-level Progress */}
      {jobs.length > 0 && (
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="font-semibold text-lg mb-4">Hiring Progress by Position</h2>
            <div className="space-y-4">
              {jobs.map((job) => {
                const jobApps   = applications.filter((a) => String(a.job_offer?.id) === job.id);
                const jobAccepted = jobApps.filter((a) => a.status === "accepted").length;
                const max       = job.maxAcceptedCandidates || 1;
                const fillPct   = Math.min(100, Math.round((jobAccepted / max) * 100));
                return (
                  <div key={job.id} className="p-4 bg-cvision-container rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-medium text-sm">{job.jobTitle}</p>
                        <p className="text-xs text-muted-foreground">
                          {jobApps.length} applicants &middot; {jobAccepted}/{max} positions filled
                        </p>
                      </div>
                      <span className={`text-sm font-semibold ${fillPct >= 100 ? "text-cvision-green" : "text-foreground"}`}>
                        {fillPct}%
                      </span>
                    </div>
                    <Progress value={fillPct} className="h-2" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Candidates by Stage */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Pending */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-cvision-yellow" />
              Pending Review ({pending.length})
            </h3>
            <div className="space-y-3">
              {pending.map((app) => (
                <div key={app.id} className="p-3 bg-cvision-container rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium">
                      {app.candidate?.user?.name ?? "—"}
                    </p>
                    <span className={`text-xs font-semibold ${
                      app.compatibility_score >= 80 ? "text-cvision-green" : "text-cvision-yellow"
                    }`}>
                      {app.compatibility_score}%
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{app.job_offer?.title ?? "—"}</p>
                  <div className="flex items-center justify-between">
                    {app.test_status && app.test_status !== "not_started" && (
                      <StatusBadge status={app.test_status === "passed" ? "Passed" : "Failed"} />
                    )}
                    <div className="flex items-center gap-1 ml-auto">
                      <Link href={`/company/recruitment/${app.id}`}>
                        <Button variant="ghost" size="sm"><Eye className="w-3 h-3" /></Button>
                      </Link>
                      {app.candidate?.id && (
                        <Link href={`/company/messages?candidateId=${app.candidate.id}&jobId=${app.job_offer?.id ?? ""}`}>
                          <Button variant="ghost" size="sm"><MessageCircle className="w-3 h-3" /></Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {pending.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No pending candidates.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Accepted */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-cvision-green" />
              Accepted ({accepted.length})
            </h3>
            <div className="space-y-3">
              {accepted.map((app) => (
                <div key={app.id} className="p-3 bg-cvision-green-bg rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium">{app.candidate?.user?.name ?? "—"}</p>
                    <span className="text-xs font-semibold text-cvision-green">{app.compatibility_score}%</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">{app.job_offer?.title ?? "—"}</p>
                  {app.test_status && app.test_status !== "not_started" && (
                    <div className="mb-1">
                      <StatusBadge status={app.test_status === "passed" ? "Passed" : "Failed"} />
                    </div>
                  )}
                  {app.comment && (
                    <p className="text-xs text-muted-foreground italic mb-1 truncate">{app.comment}</p>
                  )}
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/company/recruitment/${app.id}`}>
                      <Button variant="ghost" size="sm"><Eye className="w-3 h-3" /></Button>
                    </Link>
                    {app.candidate?.id && (
                      <Link href={`/company/messages?candidateId=${app.candidate.id}&jobId=${app.job_offer?.id ?? ""}`}>
                        <Button variant="ghost" size="sm"><MessageCircle className="w-3 h-3" /></Button>
                      </Link>
                    )}
                  </div>
                </div>
              ))}
              {accepted.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No accepted candidates yet.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Rejected */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <XCircle className="w-4 h-4 text-cvision-red" />
              Rejected ({rejected.length})
            </h3>
            <div className="space-y-3">
              {rejected.map((app) => (
                <div key={app.id} className="p-3 bg-cvision-red-bg rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium">{app.candidate?.user?.name ?? "—"}</p>
                    <span className="text-xs font-semibold text-cvision-red">{app.compatibility_score}%</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">{app.job_offer?.title ?? "—"}</p>
                  {app.comment && (
                    <p className="text-xs text-muted-foreground italic truncate">{app.comment}</p>
                  )}
                </div>
              ))}
              {rejected.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No rejected candidates.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
