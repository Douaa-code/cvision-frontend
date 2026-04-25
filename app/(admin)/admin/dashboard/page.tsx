"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Clock,
  Users,
  Briefcase,
  ClipboardList,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  staggerContainerVariants,
  staggerItemVariants,
} from "@/lib/animations/variants";
import { adminApi, AdminDashboardResponse } from "@/lib/api/admin";

export default function AdminDashboard() {
  const [dashboard, setDashboard] = useState<AdminDashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .getDashboard()
      .then(setDashboard)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const ps = dashboard?.platformStats;

  const stats = [
    { label: "Total Companies",    value: ps?.totalCompanies ?? 0,      icon: Building2,     color: "text-cvision-green" },
    { label: "Pending Approvals",  value: ps?.pendingCompanies ?? 0,     icon: Clock,         color: "text-cvision-green" },
    { label: "Total Candidates",   value: ps?.totalCandidates ?? 0,      icon: Users,         color: "text-cvision-green" },
    { label: "Active Job Offers",  value: ps?.activeJobOffers ?? 0,      icon: Briefcase,     color: "text-cvision-green" },
    { label: "Total Applications", value: ps?.totalApplications ?? 0,    icon: ClipboardList, color: "text-cvision-green" },
    { label: "Accepted",           value: ps?.acceptedApplications ?? 0, icon: CheckCircle2,  color: "text-cvision-green" },
  ];

  const pendingCompanies = dashboard?.pendingCompanies ?? [];
  const recentCandidates = dashboard?.recentCandidates ?? [];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* Stats */}
      <motion.div
        variants={staggerContainerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
      >
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.label} variants={staggerItemVariants}>
              <Card>
                <CardContent className="p-6 flex items-center gap-4">
                  <div className={`p-3 rounded-lg bg-cvision-container ${stat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {loading ? "—" : stat.value.toString()}
                    </p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Pending Approvals */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="h-full">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Pending Company Approvals</h2>
                <Link href="/admin/companies">
                  <Button variant="ghost" size="sm">
                    View All <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
              {loading ? (
                <p className="text-sm text-muted-foreground py-4 text-center">Loading…</p>
              ) : pendingCompanies.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  No pending approvals.
                </p>
              ) : (
                <div className="space-y-3">
                  {pendingCompanies.map((company) => (
                    <div key={company.id} className="p-4 bg-cvision-yellow-bg rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-medium text-sm">{company.companyName}</p>
                          <p className="text-xs text-muted-foreground">
                            {company.activityDomain} &middot; {company.wilaya}
                          </p>
                        </div>
                        <StatusBadge status="Pending" />
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">
                          Registered {new Date(company.registrationDate).toLocaleDateString()}
                        </p>
                        <Link href={`/admin/companies/approval/${company.id}`}>
                          <Button size="sm" variant="outline">Review</Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Candidates */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="h-full">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Recent Candidates</h2>
                <Link href="/admin/candidates">
                  <Button variant="ghost" size="sm">
                    View All <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
              {loading ? (
                <p className="text-sm text-muted-foreground py-4 text-center">Loading…</p>
              ) : recentCandidates.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  No candidates yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {recentCandidates.map((c) => (
                    <div key={c.id} className="flex items-center justify-between p-3 bg-cvision-container rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-cvision-bar flex items-center justify-center text-xs font-bold text-muted-foreground overflow-hidden">
                          {c.profilePhotoUrl ? (
                            <img src={c.profilePhotoUrl} alt={c.firstName} className="w-full h-full object-cover" />
                          ) : (
                            c.firstName.charAt(0)
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{c.firstName} {c.lastName}</p>
                          <p className="text-xs text-muted-foreground">{c.wilaya} &middot; {c.fieldOfStudy}</p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
