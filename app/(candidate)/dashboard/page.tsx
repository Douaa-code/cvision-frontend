"use client";

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
import { Send, Clock, Bookmark, TrendingUp, AlertTriangle, Eye } from "lucide-react";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { JobCard } from "@/components/shared/JobCard";
import { mockApplications } from "@/lib/mock-data/applications";
import { mockJobs } from "@/lib/mock-data/jobs";
import {
  staggerContainerVariants,
  staggerItemVariants,
} from "@/lib/animations/variants";

const stats = [
  { label: "Applications Sent", value: "25", icon: Send, color: "text-cvision-blue" },
  { label: "Pending Reviews", value: "4", icon: Clock, color: "text-cvision-yellow" },
  { label: "Jobs Saved", value: "1", icon: Bookmark, color: "text-cvision-green" },
  { label: "Highest Compatibility", value: "92%", icon: TrendingUp, color: "text-cvision-green" },
];

const hasAcceptedOffers = mockApplications.some(
  (a) => a.currentStatus === "Accepted"
);

export default function CandidateDashboard() {
  const recentApplications = mockApplications.slice(0, 5);
  const recommendedJobs = mockJobs.slice(0, 3);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>

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
                              app.compatibilityScore >= 85
                                ? "#00C897"
                                : app.compatibilityScore >= 70
                                ? "#FFC107"
                                : "#9CA3AF",
                          }}
                        >
                          {app.compatibilityScore}%
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
                            <Button size="sm">Confirm Offer</Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recommended Jobs */}
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
    </div>
  );
}
