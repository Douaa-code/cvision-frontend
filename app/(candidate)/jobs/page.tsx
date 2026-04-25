"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { JobCard } from "@/components/shared/JobCard";
import { WILAYAS } from "@/lib/constants/wilayas";
import { DomainEnum, ContractEnum, SalaryEnum } from "@/types/enums";
import {
  staggerContainerVariants,
  staggerItemVariants,
} from "@/lib/animations/variants";
import { jobsApi, savedJobsApi } from "@/lib/api/jobs";
import { adaptJob } from "@/lib/api/adapters";
import type { JobOffer } from "@/types";

const SORT_BY_API_MAP: Record<string, string> = {
  match: "best_match",
  date: "most_recent",
  applications: "most_popular",
};

export default function JobSearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [wilayaFilter, setWilayaFilter] = useState("all");
  const [domainFilter, setDomainFilter] = useState("all");
  const [contractFilter, setContractFilter] = useState("all");
  const [salaryFilter, setSalaryFilter] = useState("all");
  const [compatibilityFilter, setCompatibilityFilter] = useState("all");
  const [sortBy, setSortBy] = useState("match");
  const [jobs, setJobs] = useState<JobOffer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const res = await jobsApi.list({ sort_by: SORT_BY_API_MAP[sortBy] ?? "most_recent" });
        const rawJobs = res?.data?.data ?? [];
        setJobs(rawJobs.map(adaptJob));
      } catch {
        // keep empty on error
      } finally {
        setIsLoading(false);
      }
    }
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy]);

  const filteredJobs = useMemo(() => {
    let result = [...jobs];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (j) =>
          j.jobTitle.toLowerCase().includes(q) ||
          j.companyName?.toLowerCase().includes(q) ||
          j.domain.toLowerCase().includes(q)
      );
    }
    if (wilayaFilter !== "all") {
      result = result.filter((j) => j.wilaya === wilayaFilter);
    }
    if (domainFilter !== "all") {
      result = result.filter((j) => j.domain === domainFilter);
    }
    if (contractFilter !== "all") {
      result = result.filter((j) => j.contractType === contractFilter);
    }
    if (salaryFilter !== "all") {
      result = result.filter((j) => j.salaryRange === salaryFilter);
    }
    if (compatibilityFilter !== "all") {
      result = result.filter((j) => {
        const s = j.matchPercentage ?? null;
        if (s === null) return false;
        if (compatibilityFilter === "0-33") return s <= 33;
        if (compatibilityFilter === "34-66") return s >= 34 && s <= 66;
        if (compatibilityFilter === "67-100") return s >= 67;
        return true;
      });
    }

    if (sortBy === "match") {
      result.sort((a, b) => (b.matchPercentage ?? -1) - (a.matchPercentage ?? -1));
    }

    return result;
  }, [jobs, searchQuery, wilayaFilter, domainFilter, contractFilter, salaryFilter, compatibilityFilter, sortBy]);

  const toggleSave = async (jobId: string) => {
    const job = jobs.find((j) => j.id === jobId);
    if (!job) return;
    try {
      if (job.saved) {
        await savedJobsApi.unsave(Number(jobId));
      } else {
        await savedJobsApi.save(Number(jobId));
      }
      setJobs((prev) =>
        prev.map((j) => (j.id === jobId ? { ...j, saved: !j.saved } : j))
      );
    } catch {
      // silently fail
    }
  };

  const resetFilters = () => {
    setSearchQuery("");
    setWilayaFilter("all");
    setDomainFilter("all");
    setContractFilter("all");
    setSalaryFilter("all");
    setCompatibilityFilter("all");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Job Search</h1>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Search by job title, company, or keyword..."
          className="pl-10 h-12"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Filters */}
      <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-3 mb-6">
        <Select value={wilayaFilter} onValueChange={setWilayaFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="All Wilayas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Wilayas</SelectItem>
            {WILAYAS.map((w) => (
              <SelectItem key={w.code} value={w.name}>{w.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={domainFilter} onValueChange={setDomainFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="All Domains" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Domains</SelectItem>
            {Object.values(DomainEnum).map((d) => (
              <SelectItem key={d} value={d}>{d}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={contractFilter} onValueChange={setContractFilter}>
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="Contract Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Contracts</SelectItem>
            {Object.values(ContractEnum).map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={salaryFilter} onValueChange={setSalaryFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Salary Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Salaries</SelectItem>
            {Object.values(SalaryEnum).map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={compatibilityFilter} onValueChange={setCompatibilityFilter}>
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="Compatibility" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Scores</SelectItem>
            <SelectItem value="67-100">67% – 100%</SelectItem>
            <SelectItem value="34-66">34% – 66%</SelectItem>
            <SelectItem value="0-33">0% – 33%</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="match">Best Match</SelectItem>
            <SelectItem value="date">Most Recent</SelectItem>
            <SelectItem value="applications">Most Popular</SelectItem>
          </SelectContent>
        </Select>

       <Button
       variant="ghost"
       size="sm"
       onClick={resetFilters}
       className="text-cvision-green bg-cvision-green/10 hover:bg-cvision-green hover:text-white rounded-lg px-4 shadow-sm hover:shadow-md transition-all duration-200"
       >
        Reset
        </Button>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cvision-green" />
        </div>
      ) : (
        <>
          <div className="flex justify-end mb-4">
            <span className="text-sm text-muted-foreground">
              {filteredJobs.length} job{filteredJobs.length !== 1 ? "s" : ""} found
            </span>
          </div>

          {filteredJobs.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No jobs match your search criteria.</p>
              <Button variant="outline" className="mt-4" onClick={resetFilters}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <motion.div
              variants={staggerContainerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {filteredJobs.map((job) => (
                <motion.div key={job.id} variants={staggerItemVariants}>
                  <JobCard job={job} onToggleSave={toggleSave} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}
