"use client";

import { use, useState } from "react";
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
} from "lucide-react";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { MatchScore } from "@/components/shared/MatchScore";
import { mockCompanyApplications } from "@/lib/mock-data/company";

// Simulated candidate profiles for the review page
const candidateProfiles: Record<string, {
  name: string;
  email: string;
  phone: string;
  wilaya: string;
  education: string;
  university: string;
  experience: string;
  skills: string[];
  languages: { name: string; level: string }[];
}> = {
  u1: { name: "John Doe", email: "john@example.dz", phone: "+213 555 111 222", wilaya: "Algiers", education: "Master's Degree - IT & Software", university: "USTHB", experience: "5-10 years", skills: ["PHP", "Laravel", "MySQL", "Docker", "React", "Git"], languages: [{ name: "Arabic", level: "Native" }, { name: "French", level: "Fluent" }, { name: "English", level: "Fluent" }] },
  u2: { name: "Amina Khelif", email: "amina@example.dz", phone: "+213 555 222 333", wilaya: "Oran", education: "Master's Degree - IT & Software", university: "USTO", experience: "5-10 years", skills: ["PHP", "Symfony", "PostgreSQL", "Redis", "Vue.js", "AWS"], languages: [{ name: "Arabic", level: "Native" }, { name: "French", level: "Fluent" }, { name: "English", level: "Intermediate" }] },
  u3: { name: "Youcef Mebarki", email: "youcef@example.dz", phone: "+213 555 333 444", wilaya: "Constantine", education: "Bachelor's Degree - IT & Software", university: "Université Constantine 1", experience: "2-5 years", skills: ["PHP", "Laravel", "MySQL", "JavaScript"], languages: [{ name: "Arabic", level: "Native" }, { name: "French", level: "Fluent" }] },
  u6: { name: "Sara Benattia", email: "sara@example.dz", phone: "+213 555 666 777", wilaya: "Algiers", education: "Master's Degree - IT & Software", university: "ESI", experience: "2-5 years", skills: ["React", "Node.js", "TypeScript", "MongoDB", "Next.js", "Tailwind CSS"], languages: [{ name: "Arabic", level: "Native" }, { name: "French", level: "Fluent" }, { name: "English", level: "Fluent" }] },
  u7: { name: "Mohamed Cherif", email: "mohamed@example.dz", phone: "+213 555 777 888", wilaya: "Blida", education: "Bachelor's Degree - IT & Software", university: "Université Blida 1", experience: "2-5 years", skills: ["React", "Node.js", "PostgreSQL", "Docker", "AWS"], languages: [{ name: "Arabic", level: "Native" }, { name: "French", level: "Fluent" }] },
};

export default function RecruitmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const candidateApps = mockCompanyApplications.filter((a) => a.candidateId === id);
  const profile = candidateProfiles[id];
  const [actionDialog, setActionDialog] = useState<{
    appId: string;
    action: "Accept" | "Reject";
  } | null>(null);
  const [comment, setComment] = useState("");
  const [apps, setApps] = useState(candidateApps);

  if (!profile || candidateApps.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Candidate not found.</p>
        <Link href="/company/recruitment">
          <Button variant="outline" className="mt-4">Back to Recruitment</Button>
        </Link>
      </div>
    );
  }

  const handleDecision = () => {
    if (!actionDialog) return;
    setApps((prev) =>
      prev.map((a) =>
        a.id === actionDialog.appId
          ? {
              ...a,
              currentStatus: actionDialog.action === "Accept" ? ("Accepted" as const) : ("Rejected" as const),
              decision: actionDialog.action,
              decisionDate: new Date(),
              comments: comment || undefined,
              updatedAt: new Date(),
            }
          : a
      )
    );
    setActionDialog(null);
    setComment("");
  };

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
                <div className="w-14 h-14 rounded-full bg-cvision-bar flex items-center justify-center text-lg font-bold text-muted-foreground">
                  {profile.name.charAt(0)}
                </div>
                <div>
                  <h1 className="text-xl font-bold">{profile.name}</h1>
                  <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mt-1">
                    <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{profile.email}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{profile.wilaya}</span>
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground flex items-center gap-1 mb-1">
                    <GraduationCap className="w-4 h-4" /> Education
                  </p>
                  <p className="font-medium">{profile.education}</p>
                  <p className="text-xs text-muted-foreground">{profile.university}</p>
                </div>
                <div>
                  <p className="text-muted-foreground flex items-center gap-1 mb-1">
                    <Briefcase className="w-4 h-4" /> Experience
                  </p>
                  <p className="font-medium">{profile.experience}</p>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="mb-4">
                <p className="text-sm font-medium mb-2">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Languages</p>
                <div className="flex flex-wrap gap-2">
                  {profile.languages.map((lang) => (
                    <Badge key={lang.name} variant="outline">
                      {lang.name} ({lang.level})
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Applications */}
          <Card>
            <CardContent className="p-6">
              <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5" />
                Applications ({apps.length})
              </h2>
              <div className="space-y-4">
                {apps.map((app) => (
                  <div key={app.id} className="p-4 border border-border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-medium">{app.jobTitle}</p>
                        <p className="text-xs text-muted-foreground">
                          Applied {app.appliedDate.toLocaleDateString()}
                        </p>
                      </div>
                      <StatusBadge status={app.currentStatus} />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm mb-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Compatibility</p>
                        <MatchScore score={app.compatibilityScore} size="sm" />
                      </div>
                      {app.testStatus && (
                        <div>
                          <p className="text-xs text-muted-foreground">Test</p>
                          <StatusBadge status={app.testStatus === "Completed" ? "Passed" : app.testStatus} />
                          {app.testScore !== undefined && (
                            <p className="text-xs text-muted-foreground mt-0.5">Score: {app.testScore}%</p>
                          )}
                        </div>
                      )}
                      {app.comments && (
                        <div className="col-span-2 sm:col-span-1">
                          <p className="text-xs text-muted-foreground">Comment</p>
                          <p className="text-xs italic">&ldquo;{app.comments}&rdquo;</p>
                        </div>
                      )}
                    </div>

                    {app.currentStatus === "Pending" && (
                      <div className="flex gap-2 pt-2 border-t border-border">
                        <Button
                          size="sm"
                          onClick={() => setActionDialog({ appId: app.id, action: "Accept" })}
                        >
                          <CheckCircle2 className="w-4 h-4 mr-1" />
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => setActionDialog({ appId: app.id, action: "Reject" })}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
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
                  <p className="font-medium">{profile.email}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Phone</p>
                  <p className="font-medium">{profile.phone}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Location</p>
                  <p className="font-medium">{profile.wilaya}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-3">Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Applications</span>
                  <span className="font-semibold">{apps.length}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Avg. Score</span>
                  <span className="font-semibold">
                    {Math.round(apps.reduce((acc, a) => acc + a.compatibilityScore, 0) / apps.length)}%
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tests Passed</span>
                  <span className="font-semibold text-cvision-green">
                    {apps.filter((a) => a.testStatus === "Passed").length}
                  </span>
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
                ? `Accept ${profile.name} for this position?`
                : `Reject ${profile.name}'s application?`}
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
              onClick={handleDecision}
            >
              Confirm {actionDialog?.action}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
