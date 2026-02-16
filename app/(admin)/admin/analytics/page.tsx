"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Building2,
  Users,
  Briefcase,
  ClipboardList,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import {
  platformStats,
  monthlyRegistrations,
  applicationsByDomain,
} from "@/lib/mock-data/admin";
import {
  staggerContainerVariants,
  staggerItemVariants,
} from "@/lib/animations/variants";

const kpis = [
  { label: "Companies", value: platformStats.totalCompanies, icon: Building2, color: "text-cvision-blue", sub: `${platformStats.approvedCompanies} approved` },
  { label: "Candidates", value: platformStats.totalCandidates, icon: Users, color: "text-cvision-green", sub: "registered" },
  { label: "Job Offers", value: platformStats.totalJobOffers, icon: Briefcase, color: "text-cvision-green", sub: `${platformStats.activeJobOffers} active` },
  { label: "Applications", value: platformStats.totalApplications, icon: ClipboardList, color: "text-cvision-blue", sub: `${platformStats.acceptedApplications} accepted` },
];

const maxDomainCount = Math.max(...applicationsByDomain.map((d) => d.count));

export default function AnalyticsPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-2xl font-bold mb-6">Platform Analytics</h1>

      {/* KPIs */}
      <motion.div
        variants={staggerContainerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <motion.div key={kpi.label} variants={staggerItemVariants}>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg bg-cvision-container ${kpi.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <p className="text-sm text-muted-foreground">{kpi.label}</p>
                  </div>
                  <p className="text-3xl font-bold">{kpi.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{kpi.sub}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Registration Trends */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="h-full">
            <CardContent className="p-6">
              <h2 className="font-semibold text-lg mb-1">Monthly Registrations</h2>
              <p className="text-sm text-muted-foreground mb-4">Companies and candidates over the last 6 months</p>
              <div className="space-y-3">
                {monthlyRegistrations.map((m) => (
                  <div key={m.month} className="flex items-center gap-3">
                    <span className="text-sm font-medium w-10">{m.month}</span>
                    <div className="flex-1 flex items-center gap-2">
                      <div className="flex-1 h-6 bg-cvision-container rounded overflow-hidden flex">
                        <div
                          className="h-full bg-cvision-blue rounded-l"
                          style={{ width: `${(m.companies / 4) * 100}%` }}
                        />
                        <div
                          className="h-full bg-cvision-green"
                          style={{ width: `${(m.candidates / 4) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground w-16 text-right">
                        {m.companies}C / {m.candidates}U
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-4 mt-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-cvision-blue inline-block" />
                  Companies
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-cvision-green inline-block" />
                  Candidates
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Applications by Domain */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="h-full">
            <CardContent className="p-6">
              <h2 className="font-semibold text-lg mb-1">Applications by Domain</h2>
              <p className="text-sm text-muted-foreground mb-4">Distribution across activity domains</p>
              <div className="space-y-4">
                {applicationsByDomain.map((d) => (
                  <div key={d.domain}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="font-medium">{d.domain}</span>
                      <span className="text-muted-foreground">{d.count}</span>
                    </div>
                    <div className="h-3 bg-cvision-container rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(d.count / maxDomainCount) * 100}%` }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="h-full bg-cvision-green rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Application Funnel */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardContent className="p-6">
            <h2 className="font-semibold text-lg mb-4">Application Funnel</h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
              <div className="text-center p-4 bg-cvision-container rounded-lg">
                <ClipboardList className="w-6 h-6 text-cvision-blue mx-auto mb-2" />
                <p className="text-2xl font-bold">{platformStats.totalApplications}</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
              <div className="text-center p-4 bg-cvision-yellow-bg rounded-lg">
                <Clock className="w-6 h-6 text-cvision-yellow mx-auto mb-2" />
                <p className="text-2xl font-bold">{platformStats.pendingApplications}</p>
                <p className="text-xs text-muted-foreground">Pending ({Math.round((platformStats.pendingApplications / platformStats.totalApplications) * 100)}%)</p>
              </div>
              <div className="text-center p-4 bg-cvision-green-bg rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-cvision-green mx-auto mb-2" />
                <p className="text-2xl font-bold">{platformStats.acceptedApplications}</p>
                <p className="text-xs text-muted-foreground">Accepted ({Math.round((platformStats.acceptedApplications / platformStats.totalApplications) * 100)}%)</p>
              </div>
              <div className="text-center p-4 bg-cvision-red-bg rounded-lg">
                <XCircle className="w-6 h-6 text-cvision-red mx-auto mb-2" />
                <p className="text-2xl font-bold">{platformStats.rejectedApplications}</p>
                <p className="text-xs text-muted-foreground">Rejected ({Math.round((platformStats.rejectedApplications / platformStats.totalApplications) * 100)}%)</p>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Company status breakdown */}
            <h3 className="font-semibold mb-3">Company Status Breakdown</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 bg-cvision-green-bg rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-cvision-green" />
                <div>
                  <p className="font-bold">{platformStats.approvedCompanies}</p>
                  <p className="text-xs text-muted-foreground">Approved</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-cvision-yellow-bg rounded-lg">
                <Clock className="w-5 h-5 text-cvision-yellow" />
                <div>
                  <p className="font-bold">{platformStats.pendingCompanies}</p>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-cvision-red-bg rounded-lg">
                <XCircle className="w-5 h-5 text-cvision-red" />
                <div>
                  <p className="font-bold">{platformStats.rejectedCompanies}</p>
                  <p className="text-xs text-muted-foreground">Rejected</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
