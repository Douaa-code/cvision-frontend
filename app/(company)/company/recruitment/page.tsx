"use client";

import { useState } from "react";
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
import { Users, UserCheck, Clock, XCircle, Eye } from "lucide-react";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { mockCompanyApplications } from "@/lib/mock-data/company";
import { mockJobs } from "@/lib/mock-data/jobs";
import {
  staggerContainerVariants,
  staggerItemVariants,
} from "@/lib/animations/variants";

const companyJobs = mockJobs.filter((j) => j.companyId === "c1");

export default function RecruitmentPage() {
  const [filterJob, setFilterJob] = useState("all");

  const apps = filterJob === "all"
    ? mockCompanyApplications
    : mockCompanyApplications.filter((a) => a.jobId === filterJob);

  const pending = apps.filter((a) => a.currentStatus === "Pending");
  const accepted = apps.filter((a) => a.currentStatus === "Accepted");
  const rejected = apps.filter((a) => a.currentStatus === "Rejected");

  const pipelineStages = [
    { label: "Total Applicants", count: apps.length, icon: Users, color: "text-cvision-blue" },
    { label: "Pending Review", count: pending.length, icon: Clock, color: "text-cvision-yellow" },
    { label: "Accepted", count: accepted.length, icon: UserCheck, color: "text-cvision-green" },
    { label: "Rejected", count: rejected.length, icon: XCircle, color: "text-cvision-red" },
  ];

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
              {companyJobs.map((job) => (
                <SelectItem key={job.id} value={job.id}>{job.jobTitle}</SelectItem>
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
      <Card className="mb-8">
        <CardContent className="p-6">
          <h2 className="font-semibold text-lg mb-4">Hiring Progress by Position</h2>
          <div className="space-y-4">
            {companyJobs.map((job) => {
              const jobApps = mockCompanyApplications.filter((a) => a.jobId === job.id);
              const jobAccepted = jobApps.filter((a) => a.currentStatus === "Accepted").length;
              const fillPercent = Math.round((jobAccepted / job.maxAcceptedCandidates) * 100);
              return (
                <div key={job.id} className="p-4 bg-cvision-container rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium text-sm">{job.jobTitle}</p>
                      <p className="text-xs text-muted-foreground">
                        {jobApps.length} applicants &middot; {jobAccepted}/{job.maxAcceptedCandidates} positions filled
                      </p>
                    </div>
                    <span className={`text-sm font-semibold ${fillPercent >= 100 ? "text-cvision-green" : "text-foreground"}`}>
                      {fillPercent}%
                    </span>
                  </div>
                  <Progress value={fillPercent} className="h-2" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

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
                    <p className="text-sm font-medium">{app.candidateName}</p>
                    <span className={`text-xs font-semibold ${
                      app.compatibilityScore >= 80 ? "text-cvision-green" : "text-cvision-yellow"
                    }`}>
                      {app.compatibilityScore}%
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{app.jobTitle}</p>
                  <div className="flex items-center justify-between">
                    {app.testStatus && <StatusBadge status={app.testStatus} />}
                    <Link href={`/company/recruitment/${app.candidateId}`}>
                      <Button variant="ghost" size="sm"><Eye className="w-3 h-3" /></Button>
                    </Link>
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
                    <p className="text-sm font-medium">{app.candidateName}</p>
                    <span className="text-xs font-semibold text-cvision-green">{app.compatibilityScore}%</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">{app.jobTitle}</p>
                  {app.comments && (
                    <p className="text-xs text-muted-foreground italic">&ldquo;{app.comments}&rdquo;</p>
                  )}
                </div>
              ))}
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
                    <p className="text-sm font-medium">{app.candidateName}</p>
                    <span className="text-xs font-semibold text-cvision-red">{app.compatibilityScore}%</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">{app.jobTitle}</p>
                  {app.comments && (
                    <p className="text-xs text-muted-foreground italic">&ldquo;{app.comments}&rdquo;</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
