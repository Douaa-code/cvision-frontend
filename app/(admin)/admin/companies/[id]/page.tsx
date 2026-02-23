"use client";

import { use } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  FileText,
  Briefcase,
  Users,
  Calendar,
} from "lucide-react";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { mockAdminCompanies } from "@/lib/mock-data/admin";

export default function CompanyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const company = mockAdminCompanies.find((c) => c.id === id);

  if (!company) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Company not found.</p>
        <Link href="/admin/companies">
          <Button variant="outline" className="mt-4">Back to Companies</Button>
        </Link>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Link
        href="/admin/companies"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Companies
      </Link>

      {/* Header */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-cvision-bar flex items-center justify-center text-lg font-bold text-muted-foreground">
                {company.companyName.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-xl font-bold">{company.companyName}</h1>
                  <StatusBadge status={company.status} />
                </div>
                <p className="text-sm text-muted-foreground mb-2">{company.activityDomain}</p>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{company.wilaya}{company.postalCode ? ` - ${company.postalCode}` : ""}</span>
                  <span className="flex items-center gap-1"><Mail className="w-4 h-4" />{company.professionalEmail}</span>
                  <span className="flex items-center gap-1"><Phone className="w-4 h-4" />{company.phoneNumber}</span>
                  {company.website && <span className="flex items-center gap-1"><Globe className="w-4 h-4" />{company.website}</span>}
                </div>
              </div>
            </div>
            {company.status === "Pending" && (
              <Link href={`/admin/companies/approval/${company.id}`}>
                <Button>Review & Approve</Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card>
            <CardContent className="p-6">
              <h2 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Building2 className="w-5 h-5" /> About
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{company.description}</p>
            </CardContent>
          </Card>

          {/* Documents */}
          <Card>
            <CardContent className="p-6">
              <h2 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5" /> Legal Documents
              </h2>
              <Separator className="mb-4" />
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-cvision-container rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-cvision-blue" />
                    <div>
                      <p className="text-sm font-medium">Commercial Register (RC)</p>
                      <p className="text-xs text-muted-foreground">{company.documents.commercialRegister.filename}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Uploaded {company.documents.commercialRegister.uploadedAt.toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center justify-between p-4 bg-cvision-container rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-cvision-blue" />
                    <div>
                      <p className="text-sm font-medium">NIF Document</p>
                      <p className="text-xs text-muted-foreground">{company.documents.nifDocument.filename}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Uploaded {company.documents.nifDocument.uploadedAt.toLocaleDateString()}
                  </p>
                </div>
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
              <h3 className="font-semibold mb-3">Statistics</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground flex items-center gap-1"><Briefcase className="w-3 h-3" /> Job Offers</span>
                  <span className="font-semibold">{company.jobOffersCount}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground flex items-center gap-1"><Users className="w-3 h-3" /> Applications</span>
                  <span className="font-semibold">{company.totalApplications}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Accepted</span>
                  <span className="font-semibold text-cvision-green">{company.acceptedCandidates}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground flex items-center gap-1"><Calendar className="w-3 h-3" /> Registered</span>
                  <span className="font-semibold">{company.registrationDate.toLocaleDateString()}</span>
                </div>
                {company.approvedDate && (
                  <>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Approved</span>
                      <span className="font-semibold">{company.approvedDate.toLocaleDateString()}</span>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
