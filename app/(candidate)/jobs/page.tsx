"use client";

import { useState, useMemo } from "react";
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
import { mockJobs } from "@/lib/mock-data/jobs";
import { WILAYAS } from "@/lib/constants/wilayas";
import { DomainEnum, ContractEnum, SalaryEnum } from "@/types/enums";
import {
  staggerContainerVariants,
  staggerItemVariants,
} from "@/lib/animations/variants";

export default function JobSearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [wilayaFilter, setWilayaFilter] = useState("all");
  const [domainFilter, setDomainFilter] = useState("all");
  const [contractFilter, setContractFilter] = useState("all");
  const [salaryFilter, setSalaryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("match");
  const [jobs, setJobs] = useState(mockJobs);

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

    if (sortBy === "match") {
      result.sort((a, b) => (b.matchPercentage ?? 0) - (a.matchPercentage ?? 0));
    } else if (sortBy === "date") {
      result.sort((a, b) => b.postedDate.getTime() - a.postedDate.getTime());
    } else if (sortBy === "applications") {
      result.sort((a, b) => b.applicationsCount - a.applicationsCount);
    }

    return result;
  }, [jobs, searchQuery, wilayaFilter, domainFilter, contractFilter, salaryFilter, sortBy]);

  const toggleSave = (jobId: string) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, saved: !j.saved } : j))
    );
  };

  const resetFilters = () => {
    setSearchQuery("");
    setWilayaFilter("all");
    setDomainFilter("all");
    setContractFilter("all");
    setSalaryFilter("all");
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
    </div>
  );
}
