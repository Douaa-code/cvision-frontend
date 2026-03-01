"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, XCircle, Eye, Filter } from "lucide-react";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { mockCompanyApplications } from "@/lib/mock-data/company";
import { mockJobs } from "@/lib/mock-data/jobs";
import type { Application } from "@/types";

const companyJobs = mockJobs.filter((j) => j.companyId === "c1");

export default function ApplicantsPage() {
  const [applications, setApplications] = useState(mockCompanyApplications);
  const [filterJob, setFilterJob] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCompatibility, setFilterCompatibility] = useState("all");
  const [actionDialog, setActionDialog] = useState<{
    app: Application;
    action: "Accept" | "Reject";
  } | null>(null);
  const [comment, setComment] = useState("");

  const filtered = applications.filter((app) => {
    if (filterJob !== "all" && app.jobId !== filterJob) return false;
    if (filterStatus !== "all" && app.currentStatus !== filterStatus) return false;
    if (filterCompatibility !== "all") {
      if (filterCompatibility === "u49" && app.compatibilityScore > 49) return false;
      if (filterCompatibility === "u20" && app.compatibilityScore > 20) return false;
      if (filterCompatibility !== "u49" && filterCompatibility !== "u20" && app.compatibilityScore < Number(filterCompatibility)) return false;
    }
    return true;
  });

  const handleDecision = () => {
    if (!actionDialog) return;
    const { app, action } = actionDialog;
    setApplications((prev) =>
      prev.map((a) =>
        a.id === app.id
          ? {
              ...a,
              currentStatus: action === "Accept" ? ("Accepted" as const) : ("Rejected" as const),
              decision: action,
              decisionDate: new Date(),
              comments: comment || undefined,
              updatedAt: new Date(),
            }
          : a
      )
    );
    setActionDialog(null);
    setComment("");
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-2xl font-bold mb-6">Applicants</h1>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filter Applicants</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select value={filterJob} onValueChange={setFilterJob}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Jobs" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Jobs</SelectItem>
                {companyJobs.map((job) => (
                  <SelectItem key={job.id} value={job.id}>
                    {job.jobTitle}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Accepted">Accepted</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <Select value={filterCompatibility} onValueChange={setFilterCompatibility}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Compatibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Compatibility</SelectItem>
                  <SelectItem value="90"><span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-cvision-green inline-block" />90%+</span></SelectItem>
                  <SelectItem value="80"><span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-cvision-green inline-block" />80%+</span></SelectItem>
                  <SelectItem value="70"><span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-cvision-yellow inline-block" />70%+</span></SelectItem>
                  <SelectItem value="50"><span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-cvision-yellow inline-block" />50%+</span></SelectItem>
                  <SelectItem value="u49"><span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-cvision-red inline-block" />≤49%</span></SelectItem>
                  <SelectItem value="u20"><span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-cvision-red inline-block" />≤20%</span></SelectItem>
                </SelectContent>
              </Select>
              {(filterJob !== "all" || filterStatus !== "all" || filterCompatibility !== "all") && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => { setFilterJob("all"); setFilterStatus("all"); setFilterCompatibility("all"); }}
                  className="text-cvision-green bg-cvision-green/10 hover:bg-cvision-green hover:text-white rounded-lg px-4 shadow-sm hover:shadow-md transition-all duration-200 shrink-0"
                >
                  Reset
                </Button>
              )}
            </div>
          </div>
          <div className="flex justify-end mt-3">
            <span className="text-sm text-muted-foreground">
              {filtered.length} applicant{filtered.length !== 1 ? "s" : ""}
            </span>
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
                  <TableHead>Compatibility</TableHead>
                  <TableHead>Test</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Applied</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-cvision-bar flex items-center justify-center text-xs font-bold text-muted-foreground">
                          {app.candidateName?.charAt(0)}
                        </div>
                        <span className="font-medium">{app.candidateName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{app.jobTitle}</TableCell>
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
                        <div>
                          <StatusBadge status={app.testStatus === "Completed" ? "Passed" : app.testStatus} />
                          {app.testScore !== undefined && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Score: {app.testScore}%
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">Not started</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={app.currentStatus} />
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {app.appliedDate.toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Link href={`/company/recruitment/${app.candidateId}`}>
                          <Button variant="ghost" size="sm" title="View Profile">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        {app.currentStatus === "Pending" && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              title="Accept"
                              onClick={() =>
                                setActionDialog({ app, action: "Accept" })
                              }
                            >
                              <CheckCircle2 className="w-4 h-4 text-cvision-green" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              title="Reject"
                              onClick={() =>
                                setActionDialog({ app, action: "Reject" })
                              }
                            >
                              <XCircle className="w-4 h-4 text-cvision-red" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No applicants match the current filters.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Accept/Reject Dialog */}
      <Dialog open={!!actionDialog} onOpenChange={() => setActionDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionDialog?.action === "Accept" ? "Accept" : "Reject"} Candidate
            </DialogTitle>
            <DialogDescription>
              {actionDialog?.action === "Accept"
                ? `Accept ${actionDialog.app.candidateName} for the position of ${actionDialog.app.jobTitle}?`
                : `Reject ${actionDialog?.app.candidateName}'s application for ${actionDialog?.app.jobTitle}?`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <label className="text-sm font-medium">Comment (optional)</label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a note about your decision..."
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialog(null)}>
              Cancel
            </Button>
            <Button
              variant={actionDialog?.action === "Accept" ? "default" : "destructive"}
              onClick={handleDecision}
            >
              {actionDialog?.action === "Accept" ? "Accept Candidate" : "Reject Candidate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
