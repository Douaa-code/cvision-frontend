"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
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
  FileText,
  CheckCircle2,
  XCircle,
  MapPin,
  Mail,
  Phone,
  Globe,
  Building2,
  Loader2,
} from "lucide-react";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { adminApi, AdminCompanyDetail } from "@/lib/api/admin";

export default function CompanyApprovalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [company, setCompany] = useState<AdminCompanyDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [decision, setDecision] = useState<"approve" | "reject" | null>(null);
  const [comment, setComment] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [resultAction, setResultAction] = useState("");

  useEffect(() => {
    adminApi
      .getCompany(Number(id))
      .then(setCompany)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  const handleConfirm = async () => {
    if (!company) return;
    setActionLoading(true);
    try {
      if (decision === "approve") {
        await adminApi.approveCompany(company.id, comment || undefined);
      } else {
        await adminApi.rejectCompany(company.id, comment || undefined);
      }
      setResultAction(decision === "approve" ? "approved" : "rejected");
      setCompleted(true);
      setDecision(null);
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (notFound || !company) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Company not found.</p>
        <Link href="/admin/companies">
          <Button variant="outline" className="mt-4">Back</Button>
        </Link>
      </div>
    );
  }

  if (completed) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-lg mx-auto">
        <Card>
          <CardContent className="p-8 text-center">
            {resultAction === "approved" ? (
              <CheckCircle2 className="w-16 h-16 text-cvision-green mx-auto mb-4" />
            ) : (
              <XCircle className="w-16 h-16 text-cvision-red mx-auto mb-4" />
            )}
            <h1 className="text-2xl font-bold mb-2">
              Company {resultAction === "approved" ? "Approved" : "Rejected"}
            </h1>
            <p className="text-muted-foreground mb-6">
              {company.companyName} has been {resultAction}.{" "}
              {resultAction === "approved"
                ? "They will receive an email with their verification code and can now post job offers."
                : "They have been notified via email."}
            </p>
            <Button onClick={() => router.push("/admin/companies")}>
              Back to Companies
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  const rc = company.documents.commercialRegister;
  const nif = company.documents.nifDocument;
  const waitingDays = Math.ceil(
    (Date.now() - new Date(company.registrationDate).getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Link
        href="/admin/companies"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Companies
      </Link>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Company Approval Review</h1>
        <StatusBadge status={company.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Company Info */}
          <Card>
            <CardContent className="p-6">
              <h2 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Building2 className="w-5 h-5" /> Company Information
              </h2>
              <Separator className="mb-4" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Company Name</p>
                  <p className="font-medium">{company.companyName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Domain</p>
                  <p className="font-medium">{company.activityDomain}</p>
                </div>
                <div>
                  <p className="text-muted-foreground flex items-center gap-1"><Mail className="w-3 h-3" /> Email</p>
                  <p className="font-medium">{company.professionalEmail}</p>
                </div>
                <div>
                  <p className="text-muted-foreground flex items-center gap-1"><Phone className="w-3 h-3" /> Phone</p>
                  <p className="font-medium">{company.phoneNumber}</p>
                </div>
                <div>
                  <p className="text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" /> Location</p>
                  <p className="font-medium">{company.wilaya} ({company.postalCode})</p>
                </div>
                <div>
                  <p className="text-muted-foreground flex items-center gap-1"><Globe className="w-3 h-3" /> Website</p>
                  <p className="font-medium">{company.website || <span className="text-muted-foreground italic">Not provided</span>}</p>
                </div>
              </div>
              {company.description && (
                <div className="mt-4">
                  <p className="text-muted-foreground text-sm mb-1">Description</p>
                  <p className="text-sm leading-relaxed">{company.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Documents Review */}
          <Card>
            <CardContent className="p-6">
              <h2 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5" /> Documents to Review
              </h2>
              <Separator className="mb-4" />
              <div className="space-y-3">
                {rc ? (
                  <div className="p-4 border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-cvision-blue" />
                        <div>
                          <p className="text-sm font-medium">Commercial Register (RC)</p>
                          <p className="text-xs text-muted-foreground">{rc.filename}</p>
                        </div>
                      </div>
                      <a href={rc.url} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm">View Document</Button>
                      </a>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Uploaded on {new Date(rc.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No RC document uploaded.</p>
                )}

                {nif ? (
                  <div className="p-4 border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-cvision-blue" />
                        <div>
                          <p className="text-sm font-medium">NIF Document</p>
                          <p className="text-xs text-muted-foreground">{nif.filename}</p>
                        </div>
                      </div>
                      <a href={nif.url} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm">View Document</Button>
                      </a>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Uploaded on {new Date(nif.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No NIF document uploaded.</p>
                )}

                {company.documents.additionalDocuments.length > 0 && (
                  <>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pt-2">
                      Additional Documents
                    </p>
                    {company.documents.additionalDocuments.map((doc, i) => (
                      <div key={i} className="p-4 border border-border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">{doc.filename}</p>
                            </div>
                          </div>
                          <a href={doc.url} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="sm">View Document</Button>
                          </a>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Uploaded on {new Date(doc.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Decision */}
          <Card>
            <CardContent className="p-6">
              <h2 className="font-semibold text-lg mb-4">Make Decision</h2>
              <div className="flex gap-4">
                <Button size="lg" onClick={() => setDecision("approve")} className="flex-1">
                  <CheckCircle2 className="w-5 h-5 mr-2" /> Approve Company
                </Button>
                <Button size="lg" variant="destructive" onClick={() => setDecision("reject")} className="flex-1">
                  <XCircle className="w-5 h-5 mr-2" /> Reject Company
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-3">Administrator</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Name</p>
                  <p className="font-medium">{company.adminFullName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <p className="font-medium">{company.adminEmail}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-3">Timeline</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Registered</span>
                  <span className="font-semibold">
                    {new Date(company.registrationDate).toLocaleDateString()}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Waiting</span>
                  <span className="font-semibold">{waitingDays} days</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Confirm Dialog */}
      <Dialog open={!!decision} onOpenChange={() => setDecision(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {decision === "approve" ? "Approve" : "Reject"} {company.companyName}?
            </DialogTitle>
            <DialogDescription>
              {decision === "approve"
                ? "The company will receive an email with a verification code and will be able to create job offers."
                : "The company will be notified via email and will not be able to use the platform."}
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment (optional)..."
            rows={3}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setDecision(null)} disabled={actionLoading}>
              Cancel
            </Button>
            <Button
              variant={decision === "approve" ? "default" : "destructive"}
              onClick={handleConfirm}
              disabled={actionLoading}
            >
              {actionLoading
                ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Processing…</>
                : `Confirm ${decision === "approve" ? "Approval" : "Rejection"}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
