/**
 * Integration test page — fetches real job offers from Laravel API.
 * Route: /jobs/live
 *
 * Uses the public GET /api/jobs endpoint (no auth required).
 */

import type { ApiJob, JobsResponse } from "@/lib/api/jobs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, MapPin, Briefcase, TrendingUp } from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api";

async function fetchJobs(): Promise<ApiJob[]> {
  try {
    const res = await fetch(`${API_URL}/jobs`, {
      headers: { Accept: "application/json" },
      // Revalidate every 60 seconds
      next: { revalidate: 60 },
    });

    if (!res.ok) return [];

    const json: JobsResponse = await res.json();
    return json.data?.data ?? [];
  } catch {
    return [];
  }
}

function CompatibilityBadge({ score }: { score: number | null }) {
  if (score === null) return null;

  const color =
    score >= 80
      ? "bg-emerald-100 text-emerald-800"
      : score >= 60
        ? "bg-sky-100 text-sky-800"
        : "bg-amber-100 text-amber-800";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${color}`}
    >
      <TrendingUp className="h-3 w-3" />
      {score}% match
    </span>
  );
}

export default async function LiveJobsPage() {
  const jobs = await fetchJobs();

  return (
    <div className="container mx-auto max-w-5xl px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Live Job Offers
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Data fetched in real-time from{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">
            GET {API_URL}/jobs
          </code>
        </p>
      </div>

      {/* Connection status */}
      <div
        className={`mb-6 flex items-center gap-2 rounded-lg border px-4 py-3 text-sm ${
          jobs.length > 0
            ? "border-emerald-200 bg-emerald-50 text-emerald-800"
            : "border-amber-200 bg-amber-50 text-amber-800"
        }`}
      >
        <span
          className={`h-2 w-2 rounded-full ${
            jobs.length > 0 ? "bg-emerald-500" : "bg-amber-500"
          }`}
        />
        {jobs.length > 0
          ? `Backend connected — ${jobs.length} job offer${jobs.length !== 1 ? "s" : ""} returned`
          : "No jobs returned. Make sure the Laravel server is running on port 8000."}
      </div>

      {/* Job cards */}
      {jobs.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
          <Briefcase className="mx-auto mb-3 h-10 w-10 opacity-30" />
          <p className="font-medium">No job offers found</p>
          <p className="mt-1 text-sm">
            Run{" "}
            <code className="rounded bg-muted px-1">php artisan serve</code>{" "}
            and seed the database to see results here.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <Card key={job.id} className="flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base leading-snug">
                    {job.title}
                  </CardTitle>
                  <CompatibilityBadge score={job.compatibility_score} />
                </div>

                {job.company && (
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Building2 className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{job.company.company_name}</span>
                  </div>
                )}
              </CardHeader>

              <CardContent className="flex flex-1 flex-col justify-between gap-3 pt-0">
                <div className="flex flex-wrap gap-1.5">
                  {job.wilaya && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {job.wilaya}
                    </span>
                  )}
                  {job.contract_type && (
                    <Badge variant="secondary" className="text-xs">
                      {job.contract_type}
                    </Badge>
                  )}
                  {job.domain && (
                    <Badge variant="outline" className="text-xs">
                      {job.domain}
                    </Badge>
                  )}
                </div>

                {job.salary_range && (
                  <p className="text-xs font-medium text-muted-foreground">
                    {job.salary_range}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
