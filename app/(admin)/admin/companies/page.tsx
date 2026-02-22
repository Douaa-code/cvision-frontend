"use client";

import { useState } from "react";
import Link from "next/link";
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
import { Search, Eye, MapPin } from "lucide-react";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { mockAdminCompanies } from "@/lib/mock-data/admin";

export default function CompaniesListPage() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filtered = mockAdminCompanies.filter((c) => {
    if (filterStatus !== "all" && c.status !== filterStatus) return false;
    if (search && !c.companyName.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-2xl font-bold mb-6">Companies</h1>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2 sm:gap-4">
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search companies..."
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            {(search !== "" || filterStatus !== "all") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { setSearch(""); setFilterStatus("all"); }}
                className="text-cvision-green bg-cvision-green/10 hover:bg-cvision-green hover:text-white rounded-lg px-4 shadow-sm hover:shadow-md transition-all duration-200"
              >
                Reset
              </Button>
            )}
            <span className="text-sm text-muted-foreground">
              {filtered.length} compan{filtered.length !== 1 ? "ies" : "y"}
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
                  <TableHead>Company</TableHead>
                  <TableHead>Domain</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Jobs</TableHead>
                  <TableHead>Applications</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Registered</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((company) => (
                  <TableRow key={company.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-cvision-bar flex items-center justify-center text-xs font-bold text-muted-foreground">
                          {company.companyName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium">{company.companyName}</p>
                          <p className="text-xs text-muted-foreground">{company.adminEmail}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{company.activityDomain}</TableCell>
                    <TableCell>
                      <span className="flex items-center gap-1 text-sm">
                        <MapPin className="w-3 h-3" />{company.wilaya}
                      </span>
                    </TableCell>
                    <TableCell className="font-semibold">{company.jobOffersCount}</TableCell>
                    <TableCell className="font-semibold">{company.totalApplications}</TableCell>
                    <TableCell><StatusBadge status={company.status} /></TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {company.registrationDate.toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Link href={`/admin/companies/${company.id}`}>
                          <Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button>
                        </Link>
                        {company.status === "Pending" && (
                          <Link href={`/admin/companies/approval/${company.id}`}>
                            <Button size="sm" variant="outline">Review</Button>
                          </Link>
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
  );
}
