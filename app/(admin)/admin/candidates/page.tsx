"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { adminApi, AdminCandidate } from "@/lib/api/admin";

export default function CandidatesListPage() {
  const [candidates, setCandidates] = useState<AdminCandidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterWilaya, setFilterWilaya] = useState("all");
  const [filterDomain, setFilterDomain] = useState("all");
  const [filterEducation, setFilterEducation] = useState("all");

  useEffect(() => {
    adminApi
      .getCandidates()
      .then(setCandidates)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const wilayas = useMemo(() => [...new Set(candidates.map((c) => c.wilaya).filter(Boolean))], [candidates]);
  const domains = useMemo(() => [...new Set(candidates.map((c) => c.fieldOfStudy).filter(Boolean))], [candidates]);
  const educationLevels = useMemo(() => [...new Set(candidates.map((c) => c.educationLevel).filter(Boolean))], [candidates]);

  const filtered = useMemo(() =>
    candidates.filter((c) => {
      const fullName = `${c.firstName} ${c.lastName}`.toLowerCase();
      if (search && !fullName.includes(search.toLowerCase()) && !c.email.toLowerCase().includes(search.toLowerCase())) return false;
      if (filterWilaya !== "all" && c.wilaya !== filterWilaya) return false;
      if (filterDomain !== "all" && c.fieldOfStudy !== filterDomain) return false;
      if (filterEducation !== "all" && c.educationLevel !== filterEducation) return false;
      return true;
    }),
  [candidates, search, filterWilaya, filterDomain, filterEducation]);

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
            <Select value={filterDomain} onValueChange={setFilterDomain}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Domain" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Domains</SelectItem>
                {domains.map((d) => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterEducation} onValueChange={setFilterEducation}>
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue placeholder="Education" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Education</SelectItem>
                {educationLevels.map((e) => (
                  <SelectItem key={e} value={e}>{e}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {(search !== "" || filterWilaya !== "all" || filterDomain !== "all" || filterEducation !== "all") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { setSearch(""); setFilterWilaya("all"); setFilterDomain("all"); setFilterEducation("all"); }}
                className="text-cvision-green bg-cvision-green/10 hover:bg-cvision-green hover:text-white rounded-lg px-4 shadow-sm hover:shadow-md transition-all duration-200"
              >
                Reset
              </Button>
            )}
          </div>
          <div className="flex justify-end mt-3">
            <span className="text-sm text-muted-foreground">
              {filtered.length} candidate{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-6">
          {loading ? (
            <p className="text-sm text-muted-foreground text-center py-8">Loading…</p>
          ) : (
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
                          {c.profilePhotoUrl ? (
                            <img src={c.profilePhotoUrl} alt={c.firstName} className="w-8 h-8 rounded-full object-cover shrink-0" />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-cvision-bar flex items-center justify-center text-xs font-bold text-muted-foreground shrink-0">
                              {c.firstName.charAt(0)}
                            </div>
                          )}
                          <span className="font-medium">{c.firstName} {c.lastName}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{c.email}</TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm flex items-center gap-1"><MapPin className="w-3 h-3" />{c.wilaya}</p>
                          {c.postalCode && <p className="text-xs text-muted-foreground">{c.postalCode}</p>}
                        </div>
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
                        {new Date(c.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                        No candidates found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
