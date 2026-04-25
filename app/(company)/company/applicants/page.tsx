"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
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
import { jobsApi } from "@/lib/api/jobs";
import { applicationsApi } from "@/lib/api/applications";
import { adaptJob, adaptApplication } from "@/lib/api/adapters";
import type { ApiApplication } from "@/lib/api/adapters";
import type { JobOffer, Application } from "@/types";

function ApplicantsPageInner() {
  const searchParams = useSearchParams();
  const initialJobId = searchParams.get("job") ?? "all";

  const [companyJobs, setCompanyJobs] = useState<JobOffer[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterJob, setFilterJob] = useState(initialJobId);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCompatibility, setFilterCompatibility] = useState("all");
  const [actionDialog, setActionDialog] = useState<{
    app: Application;
    action: "Accept" | "Reject";
  } | null>(null);
  const [comment, setComment] = useState("");
  const [actioning, setActioning] = useState(false);

  // Load company jobs once
  useEffect(() => {
    async function loadJobs() {
      try {
        const res = await jobsApi.companyList();
        const jobs = (res?.data?.data ?? []).map(adaptJob);
        setCompanyJobs(jobs);
      } catch {
        // keep empty
      }
    }
    loadJobs();
  }, []);

  // Load applications when job filter changes
  const loadApplications = useCallback(async (jobId: string) => {
    setIsLoading(true);
    try {
      const jobs = jobId !== "all" ? [{ id: jobId }] : companyJobs;
      if (jobs.length === 0) { setIsLoading(false); return; }

      const results = await Promise.all(
        jobs.map((j) =>
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          applicationsApi.jobApplications(j.id).then((r: any) => r?.data?.data ?? [])
        )
      );
      const flat: ApiApplication[] = results.flat();
      setApplications(flat.map(adaptApplication));
    } catch {
      setApplications([]);
    } finally {
      setIsLoading(false);
    }
  }, [companyJobs]);

  useEffect(() => {
    if (filterJob === "all" && companyJobs.length > 0) {
      loadApplications("all");
    } else if (filterJob !== "all") {
      loadApplications(filterJob);
    } else if (filterJob === "all" && companyJobs.length === 0) {
      setIsLoading(false);
    }
  }, [filterJob, companyJobs, loadApplications]);

  const filtered = applications.filter((app) => {
    if (filterJob !== "all" && app.jobId !== filterJob) return false;
    if (filterStatus !== "all" && app.currentStatus !== filterStatus) return false;
    if (filterCompatibility !== "all") {
      const score = app.compatibilityScore;
      if (score === null) return false;
      if (filterCompatibility === "67-100" && score < 67) return false;
      if (filterCompatibility === "34-66" && (score < 34 || score > 66)) return false;
      if (filterCompatibility === "0-33" && score > 33) return false;
    }
    return true;
  });

  const handleDecision = async () => {
    if (!actionDialog) return;
    const { app, action } = actionDialog;
    setActioning(true);
    try {
      if (action === "Accept") {
        await applicationsApi.accept(Number(app.id), comment || undefined);
      } else {
        await applicationsApi.reject(Number(app.id), comment || undefined);
      }
      setApplications((prev) =>
        prev.map((a) =>
          a.id === app.id
            ? { ...a, currentStatus: action === "Accept" ? ("Accepted" as const) : ("Rejected" as const) }
            : a
        )
      );
    } catch {
      // silently fail
    } finally {
      setActioning(false);
      setActionDialog(null);
      setComment("");
    }
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
                  <SelectItem value="67-100">67% – 100%</SelectItem>
                  <SelectItem value="34-66">34% – 66%</SelectItem>
                  <SelectItem value="0-33">0% – 33%</SelectItem>
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
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cvision-green" />
            </div>
          ) : (
            <>
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
                            {app.candidatePhotoPath ? (
                              <img
                                src={`${process.env.NEXT_PUBLIC_STORAGE_URL ?? "http://127.0.0.1:8000/storage"}/${app.candidatePhotoPath}`}
                                alt={app.candidateName ?? ""}
                                className="w-8 h-8 rounded-full object-cover shrink-0"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-cvision-bar flex items-center justify-center text-xs font-bold text-muted-foreground shrink-0">
                                {app.candidateName?.charAt(0)}
                              </div>
                            )}
                            <span className="font-medium">{app.candidateName}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{app.jobTitle}</TableCell>
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
                            <div>
                              <StatusBadge status={app.testStatus} />
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
                            <Link href={`/company/recruitment/${app.id}`}>
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
                                  onClick={() => setActionDialog({ app, action: "Accept" })}
                                >
                                  <CheckCircle2 className="w-4 h-4 text-cvision-green" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  title="Reject"
                                  onClick={() => setActionDialog({ app, action: "Reject" })}
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
            </>
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
              disabled={actioning}
              onClick={handleDecision}
            >
              {actioning ? "Processing…" : actionDialog?.action === "Accept" ? "Accept Candidate" : "Reject Candidate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

export default function ApplicantsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-32"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cvision-green" /></div>}>
      <ApplicantsPageInner />
    </Suspense>
  );
}
