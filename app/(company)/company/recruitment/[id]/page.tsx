"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Mail,
  MapPin,
  GraduationCap,
  Briefcase,
  CheckCircle2,
  XCircle,
  ClipboardCheck,
  FileText,
  Calendar,
  Building2,
  Hash,
} from "lucide-react";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { MatchScore } from "@/components/shared/MatchScore";
import { applicationsApi, type ApiApplicationFull } from "@/lib/api/applications";

export default function RecruitmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [app, setApp]         = useState<ApiApplicationFull | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionDialog, setActionDialog] = useState<{
    action: "Accept" | "Reject";
  } | null>(null);
  const [comment, setComment]   = useState("");
  const [actioning, setActioning] = useState(false);

  useEffect(() => {
    applicationsApi.show(id)
      .then((r) => setApp(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleDecision = async () => {
    if (!actionDialog || !app) return;
    setActioning(true);
    try {
      if (actionDialog.action === "Accept") {
        await applicationsApi.accept(app.id, comment || undefined);
        setApp((prev) => prev ? { ...prev, status: "accepted", comment: comment || null } : prev);
      } else {
        await applicationsApi.reject(app.id, comment || undefined);
        setApp((prev) => prev ? { ...prev, status: "rejected", comment: comment || null } : prev);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActioning(false);
      setActionDialog(null);
      setComment("");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cvision-green" />
      </div>
    );
  }

  if (!app) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Application not found.</p>
        <Link href="/company/recruitment">
          <Button variant="outline" className="mt-4">Back to Recruitment</Button>
        </Link>
      </div>
    );
  }

  const candidate = app.candidate;
  const candidateName = candidate?.user?.name ?? "—";

  const statusLabel =
    app.status === "accepted" ? "Accepted"
    : app.status === "rejected" ? "Rejected"
    : "Pending";

  const testStatusLabel =
    app.test_status === "passed" ? "Passed"
    : app.test_status === "failed" ? "Failed"
    : null;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Link
        href="/company/recruitment"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Recruitment
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Profile */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4 mb-4">
                {candidate?.profile_photo ? (
                  <img
                    src={`${process.env.NEXT_PUBLIC_STORAGE_URL ?? "http://127.0.0.1:8000/storage"}/${candidate.profile_photo}`}
                    alt={candidateName}
                    className="w-14 h-14 rounded-full object-cover shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-cvision-bar flex items-center justify-center text-lg font-bold text-muted-foreground shrink-0">
                    {candidateName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h1 className="text-xl font-bold">{candidateName}</h1>
                  <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mt-1">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {candidate?.user?.email ?? "—"}
                    </span>
                    {candidate?.wilaya && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {candidate.wilaya}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground flex items-center gap-1 mb-1">
                    <GraduationCap className="w-4 h-4" /> Education
                  </p>
                  <p className="font-medium">{candidate?.highest_degree ?? "—"}</p>
                  {candidate?.university && (
                    <p className="text-xs text-muted-foreground">{candidate.university}</p>
                  )}
                </div>
                <div>
                  <p className="text-muted-foreground flex items-center gap-1 mb-1">
                    <Briefcase className="w-4 h-4" /> Experience
                  </p>
                  <p className="font-medium">{candidate?.years_of_experience ?? "—"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground flex items-center gap-1 mb-1">
                    <Calendar className="w-4 h-4" /> Graduation Year
                  </p>
                  <p className="font-medium">{candidate?.graduation_year ?? "—"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground flex items-center gap-1 mb-1">
                    <Briefcase className="w-4 h-4" /> Current Position
                  </p>
                  <p className="font-medium">{candidate?.current_position ?? "—"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground flex items-center gap-1 mb-1">
                    <Building2 className="w-4 h-4" /> Current Company
                  </p>
                  <p className="font-medium">{candidate?.current_company ?? "—"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground flex items-center gap-1 mb-1">
                    <Hash className="w-4 h-4" /> Postal Code
                  </p>
                  <p className="font-medium">{candidate?.postal_code ?? "—"}</p>
                </div>
              </div>

              {candidate?.skills && candidate.skills.length > 0 && (
                <>
                  <Separator className="my-4" />
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2">Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {candidate.skills.map((skill) => (
                        <Badge key={skill} variant="secondary">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {candidate?.languages && candidate.languages.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Languages</p>
                  <div className="flex flex-wrap gap-2">
                    {candidate.languages.map((lang) => (
                      <Badge key={lang.name} variant="outline">
                        {lang.name} ({lang.level})
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {candidate?.certificate_path !== undefined && (
                <>
                  <Separator className="my-4" />
                  <div>
                    <p className="text-sm font-medium mb-2">Graduation Certificate</p>
                    {candidate.certificate_path ? (
                      <div className="flex items-center justify-between gap-3 p-3 bg-cvision-container rounded-lg border border-border">
                        <div className="flex items-center gap-3 min-w-0">
                          <FileText className="w-4 h-4 text-cvision-green shrink-0" />
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">
                              {candidate.certificate_path.split("/").pop()}
                            </p>
                            <p className="text-xs text-muted-foreground">Uploaded by candidate</p>
                          </div>
                        </div>
                        <a
                          href={`${process.env.NEXT_PUBLIC_STORAGE_URL ?? "http://127.0.0.1:8000/storage"}/${candidate.certificate_path}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button variant="outline" size="sm" className="shrink-0">
                            View Certificate
                          </Button>
                        </a>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 p-3 bg-cvision-container rounded-lg border border-border">
                        <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                        <p className="text-sm text-muted-foreground">No certificate uploaded.</p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Application Detail */}
          <Card>
            <CardContent className="p-6">
              <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5" />
                Application
              </h2>
              <div className="p-4 border border-border rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-medium">{app.job_offer?.title ?? "—"}</p>
                    <p className="text-xs text-muted-foreground">
                      Applied {app.applied_at
                        ? new Date(app.applied_at).toLocaleDateString()
                        : new Date(app.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <StatusBadge status={statusLabel} />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm mb-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Compatibility</p>
                    <MatchScore score={app.compatibility_score} size="sm" />
                  </div>
                  {testStatusLabel && (
                    <div>
                      <p className="text-xs text-muted-foreground">Test</p>
                      <StatusBadge status={testStatusLabel} />
                      {app.test_score !== null && app.test_score !== undefined && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Score: {app.test_score}%
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {app.status === "pending" && (
                  <div className="flex gap-2 pt-2 border-t border-border">
                    <Button size="sm" onClick={() => setActionDialog({ action: "Accept" })}>
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setActionDialog({ action: "Reject" })}
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Info Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-3">Contact Information</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <p className="font-medium">{candidate?.user?.email ?? "—"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Phone</p>
                  <p className="font-medium">{candidate?.phone ?? "—"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Location</p>
                  <p className="font-medium">{candidate?.wilaya ?? "—"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-3">Job Details</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Position</p>
                  <p className="font-medium">{app.job_offer?.title ?? "—"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Domain</p>
                  <p className="font-medium">{app.job_offer?.domain ?? "—"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Contract</p>
                  <p className="font-medium">{app.job_offer?.contract_type ?? "—"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Decision Dialog */}
      <Dialog open={!!actionDialog} onOpenChange={() => setActionDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionDialog?.action === "Accept" ? "Accept" : "Reject"} Candidate
            </DialogTitle>
            <DialogDescription>
              {actionDialog?.action === "Accept"
                ? `Accept ${candidateName} for this position?`
                : `Reject ${candidateName}'s application?`}
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment (optional)..."
            rows={3}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialog(null)}>Cancel</Button>
            <Button
              variant={actionDialog?.action === "Accept" ? "default" : "destructive"}
              disabled={actioning}
              onClick={handleDecision}
            >
              {actioning ? "Processing…" : `Confirm ${actionDialog?.action}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
