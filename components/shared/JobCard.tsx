"use client";

import Link from "next/link";
import { MapPin, Banknote, Bookmark, BookmarkCheck, Briefcase, Tag } from "lucide-react";
import { Card } from "@/components/ui/card";
import { MatchScore } from "./MatchScore";
import type { JobOffer } from "@/types";

interface JobCardProps {
  job: JobOffer;
  onToggleSave?: (jobId: string) => void;
}

export function JobCard({ job, onToggleSave }: JobCardProps) {
  return (
    <Card className="p-4 sm:p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-cvision-bar flex items-center justify-center text-base sm:text-lg font-bold text-muted-foreground flex-shrink-0">
            {job.companyName?.charAt(0) ?? "C"}
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-foreground truncate">{job.jobTitle}</h3>
            <p className="text-xs sm:text-sm text-muted-foreground truncate">{job.companyName}</p>
          </div>
        </div>
        {onToggleSave && (
          <button
            onClick={() => onToggleSave(job.id)}
            className="text-muted-foreground hover:text-cvision-green transition-colors"
          >
            {job.saved ? (
              <BookmarkCheck className="w-5 h-5 text-cvision-green" />
            ) : (
              <Bookmark className="w-5 h-5" />
            )}
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4 text-xs sm:text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          <MapPin className="w-4 h-4" />
          {job.wilaya}
        </span>
        <span className="flex items-center gap-1">
          <Banknote className="w-4 h-4" />
          {job.salaryRange}
        </span>
      </div>

      <div className="flex flex-wrap gap-3 mb-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Briefcase className="w-3.5 h-3.5" />
          {job.contractType}
        </span>
        <span className="flex items-center gap-1">
          <Tag className="w-3.5 h-3.5" />
          {job.domain}
        </span>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-border">
        {job.matchPercentage !== undefined && (
          <MatchScore score={job.matchPercentage} size="sm" />
        )}
        <Link
          href={`/jobs/${job.id}`}
          className="text-sm font-medium text-cvision-green hover:text-cvision-green-hover transition-colors"
        >
          View Details
        </Link>
      </div>
    </Card>
  );
}
