"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
import { Search, MapPin, Users, Calendar } from "lucide-react";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { mockJobs } from "@/lib/mock-data/jobs";

export default function AdminJobsPage() {
  const [search, setSearch] = useState("");
  const [filterDomain, setFilterDomain] = useState("all");

  const [filterLocation, setFilterLocation] = useState("all");

  const domains = [...new Set(mockJobs.map((j) => j.domain))];
  const locations = [...new Set(mockJobs.map((j) => j.wilaya))];

  const filtered = mockJobs.filter((j) => {
    if (filterDomain !== "all" && j.domain !== filterDomain) return false;
    if (filterLocation !== "all" && j.wilaya !== filterLocation) return false;
    if (search && !j.jobTitle.toLowerCase().includes(search.toLowerCase()) && !j.companyName?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalApps = mockJobs.reduce((acc, j) => acc + j.applicationsCount, 0);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-2xl font-bold mb-6">Job Offers Management</h1>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{mockJobs.length}</p>
            <p className="text-sm text-muted-foreground">Total Jobs</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-cvision-green">
              {mockJobs.filter((j) => j.status === "Active").length}
            </p>
            <p className="text-sm text-muted-foreground">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-cvision-blue">{totalApps}</p>
            <p className="text-sm text-muted-foreground">Total Applications</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2 sm:gap-4">
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search jobs or companies..." className="pl-10" />
            </div>
            <Select value={filterDomain} onValueChange={setFilterDomain}>
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue placeholder="Domain" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Domains</SelectItem>
                {domains.map((d) => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterLocation} onValueChange={setFilterLocation}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {locations.map((l) => (
                  <SelectItem key={l} value={l}>{l}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {(search !== "" || filterDomain !== "all" || filterLocation !== "all") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { setSearch(""); setFilterDomain("all"); setFilterLocation("all"); }}
                className="text-cvision-green bg-cvision-green/10 hover:bg-cvision-green hover:text-white rounded-lg px-4 shadow-sm hover:shadow-md transition-all duration-200"
              >
                Reset
              </Button>
            )}
          </div>
          <div className="flex justify-end mt-3">
            <span className="text-sm text-muted-foreground">{filtered.length} jobs</span>
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
                  <TableHead>Job Title</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Domain</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Applicants</TableHead>
                  <TableHead>Positions</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Posted</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((job) => {
                  const fillPercent = Math.round((job.currentAccepted / job.maxAcceptedCandidates) * 100);
                  return (
                    <TableRow key={job.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{job.jobTitle}</p>
                          <p className="text-xs text-muted-foreground">{job.contractType} &middot; {job.salaryRange}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{job.companyName}</TableCell>
                      <TableCell><Badge variant="secondary" className="text-xs">{job.domain}</Badge></TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1 text-sm"><MapPin className="w-3 h-3" />{job.wilaya}</span>
                      </TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1 text-sm font-semibold"><Users className="w-3 h-3" />{job.applicationsCount}</span>
                      </TableCell>
                      <TableCell>
                        <div className="w-20">
                          <div className="flex justify-between text-xs mb-1">
                            <span>{job.currentAccepted}/{job.maxAcceptedCandidates}</span>
                          </div>
                          <Progress value={fillPercent} className="h-1.5" />
                        </div>
                      </TableCell>
                      <TableCell><StatusBadge status={job.status} /></TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />{job.postedDate.toLocaleDateString()}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
