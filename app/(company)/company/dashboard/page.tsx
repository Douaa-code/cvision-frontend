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
import { Progress } from "@/components/ui/progress";
import {
  Briefcase,
  ClipboardList,
  Clock,
  UserCheck,
  ArrowRight,
} from "lucide-react";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { mockCompanyApplications } from "@/lib/mock-data/company";
import { mockJobs } from "@/lib/mock-data/jobs";
import {
  staggerContainerVariants,
  staggerItemVariants,
} from "@/lib/animations/variants";

const companyJobs = mockJobs.filter((j) => j.companyId === "c1");
const pendingApps = mockCompanyApplications.filter(
  (a) => a.currentStatus === "Pending"
);
const acceptedApps = mockCompanyApplications.filter(
  (a) => a.currentStatus === "Accepted"
);

const stats = [
  {
    label: "Active Job Offers",
    value: companyJobs.length.toString(),
    icon: Briefcase,
    color: "text-cvision-blue",
  },
  {
    label: "Total Applications",
    value: mockCompanyApplications.length.toString(),
    icon: ClipboardList,
    color: "text-cvision-green",
  },
  {
    label: "Pending Reviews",
    value: pendingApps.length.toString(),
    icon: Clock,
    color: "text-cvision-yellow",
  },
  {
    label: "Accepted Candidates",
    value: acceptedApps.length.toString(),
    icon: UserCheck,
    color: "text-cvision-green",
  },
];

export default function CompanyDashboard() {
  const recentApps = [...mockCompanyApplications]
    .sort((a, b) => b.appliedDate.getTime() - a.appliedDate.getTime())
    .slice(0, 5);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Company Dashboard</h1>

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
              <div className="space-y-4">
                {companyJobs.map((job) => {
                  const fillPercent = Math.round(
                    (job.currentAccepted / job.maxAcceptedCandidates) * 100
                  );
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
                            app.compatibilityScore >= 80
                              ? "text-cvision-green"
                              : app.compatibilityScore >= 60
                              ? "text-cvision-yellow"
                              : "text-cvision-red"
                          }`}
                        >
                          {app.compatibilityScore}%
                        </span>
                      </TableCell>
                      <TableCell>
                        {app.testStatus ? (
                          <StatusBadge status={app.testStatus === "Completed" ? "Passed" : app.testStatus} />
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            N/A
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
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
