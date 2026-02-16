"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { Search, MapPin } from "lucide-react";
import { mockAdminCandidates } from "@/lib/mock-data/admin";

export default function CandidatesListPage() {
  const [search, setSearch] = useState("");
  const [filterWilaya, setFilterWilaya] = useState("all");

  const wilayas = [...new Set(mockAdminCandidates.map((c) => c.wilaya))];

  const filtered = mockAdminCandidates.filter((c) => {
    const fullName = `${c.firstName} ${c.lastName}`.toLowerCase();
    if (search && !fullName.includes(search.toLowerCase()) && !c.email.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterWilaya !== "all" && c.wilaya !== filterWilaya) return false;
    return true;
  });

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-2xl font-bold mb-6">Candidates</h1>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2 sm:gap-4">
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or email..." className="pl-10" />
            </div>
            <Select value={filterWilaya} onValueChange={setFilterWilaya}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Wilaya" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Wilayas</SelectItem>
                {wilayas.map((w) => (
                  <SelectItem key={w} value={w}>{w}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">
              {filtered.length} candidate{filtered.length !== 1 ? "s" : ""}
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
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Education</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Skills</TableHead>
                  <TableHead>Registered</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-cvision-bar flex items-center justify-center text-xs font-bold text-muted-foreground">
                          {c.firstName.charAt(0)}
                        </div>
                        <span className="font-medium">{c.firstName} {c.lastName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{c.email}</TableCell>
                    <TableCell>
                      <span className="flex items-center gap-1 text-sm">
                        <MapPin className="w-3 h-3" />{c.wilaya}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{c.educationLevel}</p>
                        <p className="text-xs text-muted-foreground">{c.fieldOfStudy}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{c.yearsOfExperience}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {c.skills.slice(0, 3).map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>
                        ))}
                        {c.skills.length > 3 && (
                          <Badge variant="outline" className="text-xs">+{c.skills.length - 3}</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {c.createdAt.toLocaleDateString()}
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
