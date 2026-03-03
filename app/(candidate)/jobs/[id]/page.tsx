"use client";

import { use, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Banknote,
  Briefcase,
  Calendar,
  Users,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  ArrowLeft,
  Tag,
  GraduationCap,
  ClipboardCheck,
} from "lucide-react";
import { MatchScore } from "@/components/shared/MatchScore";
import { JobCard } from "@/components/shared/JobCard";
import { mockJobs } from "@/lib/mock-data/jobs";

export default function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const job = mockJobs.find((j) => j.id === id) ?? mockJobs[0];
  const [saved, setSaved] = useState(job.saved ?? false);
  const [applied, setApplied] = useState(false);

  const similarJobs = mockJobs
    .filter((j) => j.id !== job.id && j.domain === job.domain)
    .slice(0, 3);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Link
        href="/jobs"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Jobs
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold mb-1">{job.jobTitle}</h1>
                  <p className="text-muted-foreground">{job.companyName}</p>
                </div>
                <button onClick={() => setSaved(!saved)}>
                  {saved ? (
                    <BookmarkCheck className="w-6 h-6 text-cvision-green" />
                  ) : (
                    <Bookmark className="w-6 h-6 text-muted-foreground hover:text-cvision-green" />
                  )}
                </button>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{job.wilaya}</span>
                <span className="flex items-center gap-1"><Banknote className="w-4 h-4" />{job.salaryRange}</span>
                <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" />{job.contractType}</span>
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{job.postedDate.toLocaleDateString()}</span>
                <span className="flex items-center gap-1"><Users className="w-4 h-4" />{job.applicationsCount} applicants</span>
              </div>

              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Tag className="w-4 h-4" />{job.domain}</span>
                <span className="flex items-center gap-1"><GraduationCap className="w-4 h-4" />{job.experienceRequired}</span>
                {job.requireQCMTest && (
                  <span className="flex items-center gap-1 text-cvision-green font-medium">
                    <ClipboardCheck className="w-4 h-4" />Test Required
                  </span>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Match Score */}
          {job.matchPercentage !== undefined && (
            <Card>
              <CardContent className="p-6">
                <h2 className="font-semibold mb-3">Match Score</h2>
                <MatchScore score={job.matchPercentage} size="lg" />
                <p className="text-sm text-muted-foreground mt-2">
                  Based on your skills, experience, and education, you are a{" "}
                  <strong>{job.matchPercentage}%</strong> match for this position.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Description */}
          <Card>
            <CardContent className="p-6">
              <h2 className="font-semibold mb-3">Job Description</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {job.jobDescription}
              </p>

              <Separator className="my-6" />

              <h2 className="font-semibold mb-3">Requirements</h2>
              <ul className="space-y-2">
                {job.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-cvision-green mt-0.5 flex-shrink-0" />
                    {req}
                  </li>
                ))}
              </ul>

              <Separator className="my-6" />

              <h2 className="font-semibold mb-3">Responsibilities</h2>
              <ul className="space-y-2">
                {job.responsibilities.map((resp, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-cvision-blue mt-0.5 flex-shrink-0" />
                    {resp}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Apply Card */}
          <Card>
            <CardContent className="p-6 space-y-4">
              {applied ? (
                <div className="text-center py-4">
                  <CheckCircle2 className="w-12 h-12 text-cvision-green mx-auto mb-3" />
                  <p className="font-semibold">Application Submitted!</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {job.requireQCMTest
                      ? "You'll need to complete a test for this position."
                      : "The company will review your application."}
                  </p>
                  {job.requireQCMTest && (
                    <Link href={`/tests/${job.linkedTestId}`}>
                      <Button className="mt-4 w-full">Take Test</Button>
                    </Link>
                  )}
                </div>
              ) : (
                <>
                  <Button className="w-full" size="lg" onClick={() => setApplied(true)}>
                    Apply Now
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setSaved(!saved)}
                  >
                    {saved ? "Saved" : "Save Job"}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          {/* Company Info */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-3">About the Company</h3>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-cvision-bar flex items-center justify-center text-sm font-bold text-muted-foreground">
                  {job.companyName?.charAt(0)}
                </div>
                <div>
                  <p className="font-medium">{job.companyName}</p>
                  <p className="text-xs text-muted-foreground">{job.domain}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                A verified company on CVision platform, located in {job.wilaya}.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Similar Jobs */}
      {similarJobs.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Similar Jobs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {similarJobs.map((j) => (
              <JobCard key={j.id} job={j} />
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
