"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
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
import { Plus, Users, MapPin, Calendar, Eye, XCircle, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DOMAINS } from "@/lib/constants/domains";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { jobsApi } from "@/lib/api/jobs";
import { adaptJob } from "@/lib/api/adapters";
import type { JobOffer } from "@/types";

export default function CompanyJobsPage() {
  const [jobs, setJobs] = useState<JobOffer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [closeDialogId, setCloseDialogId] = useState<string | null>(null);
  const [closing, setClosing] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [domainFilter, setDomainFilter] = useState("all");

  useEffect(() => {
    async function load() {
      try {
        const res = await jobsApi.companyList();
        const rawJobs = res?.data?.data ?? [];
        setJobs(rawJobs.map(adaptJob));
      } catch {
        // keep empty on error
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const filteredJobs = jobs.filter((j) => {
    const matchStatus = statusFilter === "all" || j.status === statusFilter;
    const matchDomain = domainFilter === "all" || j.domain === domainFilter;
    return matchStatus && matchDomain;
  });

  const handleCloseJob = async (id: string) => {
    setClosing(true);
    try {
      await jobsApi.close(Number(id));
      setJobs((prev) =>
        prev.map((j) => (j.id === id ? { ...j, status: "Closed" as const } : j))
      );
    } catch {
      // silently fail
    } finally {
      setClosing(false);
      setCloseDialogId(null);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Job Offers</h1>
        <Link href="/company/jobs/create">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Job Offer
          </Button>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-cvision-green">{jobs.length}</p>
            <p className="text-sm text-muted-foreground">Total Offers</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-cvision-green">
              {jobs.filter((j) => j.status === "Active").length}
            </p>
            <p className="text-sm text-muted-foreground">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-cvision-green">
              {jobs.filter((j) => j.status === "Closed").length}
            </p>
            <p className="text-sm text-muted-foreground">Closed</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filter Job Offers</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Status</p>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Domain</p>
              <div className="flex items-center gap-2">
              <Select value={domainFilter} onValueChange={setDomainFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Domains" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Domains</SelectItem>
                  {DOMAINS.map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {(statusFilter !== "all" || domainFilter !== "all") && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => { setStatusFilter("all"); setDomainFilter("all"); }}
                  className="text-cvision-green bg-cvision-green/10 hover:bg-cvision-green hover:text-white rounded-lg px-4 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  Reset
                </Button>
              )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Jobs Table */}
      <Card>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cvision-green" />
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No job offers found.</p>
              <Link href="/company/jobs/create">
                <Button className="mt-4">Create your first offer</Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Job Title</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Applications</TableHead>
                    <TableHead>Positions</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Posted</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredJobs.map((job) => {
                    const fillPercent = job.maxAcceptedCandidates > 0
                      ? Math.round((job.currentAccepted / job.maxAcceptedCandidates) * 100)
                      : 0;
                    return (
                      <TableRow key={job.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{job.jobTitle}</p>
                            <p className="text-xs text-muted-foreground">
                              {job.domain} &middot; {job.contractType}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="flex items-center gap-1 text-sm">
                            <MapPin className="w-3 h-3" />
                            {job.wilaya}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="flex items-center gap-1 text-sm">
                            <Users className="w-3 h-3" />
                            {job.applicationsCount}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="w-24">
                            <div className="flex justify-between text-xs mb-1">
                              <span>
                                {job.currentAccepted}/{job.maxAcceptedCandidates}
                              </span>
                              <span>{fillPercent}%</span>
                            </div>
                            <Progress value={fillPercent} className="h-1.5" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={job.status} />
                        </TableCell>
                        <TableCell>
                          <span className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            {job.postedDate.toLocaleDateString()}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Link href={`/company/applicants?job=${job.id}`}>
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </Link>
                            {job.status === "Active" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setCloseDialogId(job.id)}
                              >
                                <XCircle className="w-4 h-4 text-cvision-red" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Close Job Dialog */}
      <Dialog open={!!closeDialogId} onOpenChange={() => setCloseDialogId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Close Job Offer?</DialogTitle>
            <DialogDescription>
              This will stop accepting new applications. Existing applications
              will still be visible. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCloseDialogId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={closing}
              onClick={() => closeDialogId && handleCloseJob(closeDialogId)}
            >
              {closing ? "Closing…" : "Close Offer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
