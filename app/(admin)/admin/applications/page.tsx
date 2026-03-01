"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
} from "lucide-react";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { mockCompanyApplications } from "@/lib/mock-data/company";
import { mockApplications } from "@/lib/mock-data/applications";
import { mockJobs } from "@/lib/mock-data/jobs";
import {
  staggerContainerVariants,
  staggerItemVariants,
} from "@/lib/animations/variants";

// Combine all platform applications
const allApplications = [
  ...mockCompanyApplications,
  ...mockApplications.filter(
    (a) => !mockCompanyApplications.some((ca) => ca.id === a.id || (ca.candidateId === a.candidateId && ca.jobId === a.jobId))
  ),
];

const jobDomainMap = Object.fromEntries(mockJobs.map((j) => [j.id, j.domain]));

const getMonthLabel = (date: Date) =>
  date.toLocaleDateString("en-US", { month: "short", year: "numeric" });

const uniqueDomains = [...new Set(allApplications.map((a) => jobDomainMap[a.jobId]).filter(Boolean))];
const uniqueMonths = [...new Set(allApplications.map((a) => getMonthLabel(a.appliedDate)))];

export default function AdminApplicationsPage() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDomain, setFilterDomain] = useState("all");
  const [filterDate, setFilterDate] = useState("all");

  const pending = allApplications.filter((a) => a.currentStatus === "Pending");
  const accepted = allApplications.filter((a) => a.currentStatus === "Accepted");
  const rejected = allApplications.filter((a) => a.currentStatus === "Rejected");

  const filtered = allApplications.filter((a) => {
    if (filterStatus !== "all" && a.currentStatus !== filterStatus) return false;
    if (filterDomain !== "all" && jobDomainMap[a.jobId] !== filterDomain) return false;
    if (filterDate !== "all" && getMonthLabel(a.appliedDate) !== filterDate) return false;
    if (search) {
      const term = search.toLowerCase();
      if (!a.candidateName?.toLowerCase().includes(term) && !a.jobTitle?.toLowerCase().includes(term) && !a.companyName?.toLowerCase().includes(term)) return false;
    }
    return true;
  });

  const statCards = [
    { label: "Total", value: allApplications.length, icon: ClipboardList, color: "text-cvision-blue", bg: "bg-cvision-container" },
    { label: "Pending", value: pending.length, icon: Clock, color: "text-cvision-yellow", bg: "bg-cvision-yellow-bg" },
    { label: "Accepted", value: accepted.length, icon: CheckCircle2, color: "text-cvision-green", bg: "bg-cvision-green-bg" },
    { label: "Rejected", value: rejected.length, icon: XCircle, color: "text-cvision-red", bg: "bg-cvision-red-bg" },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-2xl font-bold mb-6">Applications Overview</h1>

      {/* Stats */}
      <motion.div
        variants={staggerContainerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.label} variants={staggerItemVariants}>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                    <div>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2 sm:gap-4">
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by candidate, job, or company..." className="pl-10" />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Accepted">Accepted</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterDomain} onValueChange={setFilterDomain}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Domain" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Domains</SelectItem>
                {uniqueDomains.map((d) => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterDate} onValueChange={setFilterDate}>
              <SelectTrigger className="w-full sm:w-36">
                <SelectValue placeholder="Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Dates</SelectItem>
                {uniqueMonths.map((m) => (
                  <SelectItem key={m} value={m}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {(search !== "" || filterStatus !== "all" || filterDomain !== "all" || filterDate !== "all") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { setSearch(""); setFilterStatus("all"); setFilterDomain("all"); setFilterDate("all"); }}
                className="text-cvision-green bg-cvision-green/10 hover:bg-cvision-green hover:text-white rounded-lg px-4 shadow-sm hover:shadow-md transition-all duration-200"
              >
                Reset
              </Button>
            )}
          </div>
          <div className="flex justify-end mt-3">
            <span className="text-sm text-muted-foreground">{filtered.length} applications</span>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidate</TableHead>
                  <TableHead>Job Position</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Compatibility</TableHead>
                  <TableHead>Test</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Applied</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-cvision-bar flex items-center justify-center text-xs font-bold text-muted-foreground">
                          {app.candidateName?.charAt(0)}
                        </div>
                        <span className="font-medium text-sm">{app.candidateName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{app.jobTitle}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{app.companyName}</TableCell>
                    <TableCell>
                      <span className={`font-semibold text-sm ${
                        app.compatibilityScore >= 80 ? "text-cvision-green" : app.compatibilityScore >= 60 ? "text-cvision-yellow" : "text-cvision-red"
                      }`}>
                        {app.compatibilityScore}%
                      </span>
                    </TableCell>
                    <TableCell>
                      {app.testStatus ? (
                        <div>
                          <StatusBadge status={app.testStatus === "Completed" ? "Passed" : app.testStatus} />
                          {app.testScore !== undefined && (
                            <p className="text-xs text-muted-foreground mt-0.5">{app.testScore}%</p>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">Not started</span>
                      )}
                    </TableCell>
                    <TableCell><StatusBadge status={app.currentStatus} /></TableCell>
                    <TableCell className="text-xs text-muted-foreground">
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
  );
}
