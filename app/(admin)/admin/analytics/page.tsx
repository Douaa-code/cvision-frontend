"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Building2,
  Users,
  Briefcase,
  ClipboardList,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import {
  staggerContainerVariants,
  staggerItemVariants,
} from "@/lib/animations/variants";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { adminApi, AdminAnalyticsResponse } from "@/lib/api/admin";

const GEO_COLORS = ["#FFC107", "#F97316", "#00C897", "#3B82F6", "#8B5CF6", "#EC4899", "#14B8A6", "#F59E0B"];

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AdminAnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .getAnalytics()
      .then(setAnalytics)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const ps = analytics?.platformStats;

  const kpis = [
    { label: "Companies",    value: ps?.totalCompanies ?? 0,   icon: Building2,     color: "text-cvision-green",  sub: `${ps?.approvedCompanies ?? 0} approved` },
    { label: "Candidates",   value: ps?.totalCandidates ?? 0,  icon: Users,         color: "text-cvision-green", sub: "registered" },
    { label: "Job Offers",   value: ps?.totalJobOffers ?? 0,   icon: Briefcase,     color: "text-cvision-green", sub: `${ps?.activeJobOffers ?? 0} active` },
    { label: "Applications", value: ps?.totalApplications ?? 0, icon: ClipboardList, color: "text-cvision-green",  sub: `${ps?.acceptedApplications ?? 0} accepted` },
  ];

  // Monthly registrations chart data
  const registrationsData = (analytics?.monthlyRegistrations ?? []).map((m) => ({
    month: m.month,
    Companies: m.companies,
    Candidates: m.candidates,
  }));

  // Applications by domain chart data
  const domainData = [...(analytics?.topDomains ?? [])]
    .sort((a, b) => a.count - b.count)
    .map((d) => ({ name: d.domain, Applications: d.count }));

  // Applications over time chart data
  const monthlyApplicationsData = (analytics?.applicationsOverTime ?? []).map((m) => ({
    month: m.month,
    applications: m.count,
  }));

  // Geographic distribution (pie chart)
  const geoData = (analytics?.geoDistribution ?? []).map((g) => ({
    name: g.wilaya,
    value: g.count,
  }));

  const funnel = analytics?.applicationFunnel ?? { total: 0, pending: 0, accepted: 0, rejected: 0 };
  const companyBreakdown = analytics?.companyBreakdown ?? { approved: 0, pending: 0, rejected: 0 };
  const recentActivity = analytics?.recentActivity ?? [];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-2xl font-bold mb-6">Platform Analytics</h1>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Monthly Registrations */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="h-full">
            <CardContent className="p-6">
              <h2 className="font-semibold text-lg mb-1">Monthly Registrations</h2>
              <p className="text-sm text-muted-foreground mb-4">Companies and candidates over the last 6 months</p>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={registrationsData} barCategoryGap="30%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: "#6B7280" }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: 8, border: "1px solid #E5E7EB", fontSize: 12 }}
                    cursor={{ fill: "#F3F4F6" }}
                  />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="Companies" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Candidates" fill="#00C897" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
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
              <h2 className="font-semibold text-lg mb-0.5">Top 5 Domains</h2>
              <p className="text-sm text-muted-foreground mb-4">Job Offers by Industry Domain</p>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={domainData} barCategoryGap="30%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: "#6B7280" }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: 8, border: "1px solid #E5E7EB", fontSize: 12 }}
                    cursor={{ fill: "#F3F4F6" }}
                  />
                  <Bar dataKey="Applications" fill="#00C897" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Applications Over Time */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <Card className="h-full">
            <CardContent className="p-6">
              <h2 className="font-semibold text-lg mb-1">Applications Over Time</h2>
              <p className="text-sm text-muted-foreground mb-4">Monthly application submissions</p>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={monthlyApplicationsData}>
                  <defs>
                    <linearGradient id="appGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00C897" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#00C897" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: 8, border: "1px solid #E5E7EB", fontSize: 12 }}
                    cursor={{ stroke: "#E5E7EB" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="applications"
                    stroke="#00C897"
                    strokeWidth={2.5}
                    fill="url(#appGradient)"
                    dot={{ fill: "#00C897", strokeWidth: 2, r: 4, stroke: "white" }}
                    activeDot={{ r: 6, stroke: "white", strokeWidth: 2 }}
                    name="Applications"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Geographic Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="h-full">
            <CardContent className="p-6">
              <h2 className="font-semibold text-lg mb-1">Geographic Distribution</h2>
              <p className="text-sm text-muted-foreground mb-4">User distribution by region</p>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={geoData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {geoData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={GEO_COLORS[index % GEO_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: 8, border: "1px solid #E5E7EB", fontSize: 12 }}
                  />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Activity Summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mb-6"
      >
        <Card>
          <CardContent className="p-6">
            <h2 className="font-semibold text-lg mb-1">Recent Activity Summary</h2>
            <p className="text-sm text-muted-foreground mb-4">Latest platform activity</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Activity</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Count</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recentActivity.map((row, i) => (
                    <tr key={i} className="hover:bg-cvision-container transition-colors">
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cvision-green-bg text-cvision-green">
                          Today
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium text-foreground">{row.activity}</td>
                      <td className="py-3 px-4 text-right font-bold text-foreground">{row.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

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
                  <p className="text-3xl font-bold">{loading ? "—" : kpi.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{kpi.sub}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

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
                <p className="text-2xl font-bold">{funnel.total}</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
              <div className="text-center p-4 bg-cvision-yellow-bg rounded-lg">
                <Clock className="w-6 h-6 text-cvision-yellow mx-auto mb-2" />
                <p className="text-2xl font-bold">{funnel.pending}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
              <div className="text-center p-4 bg-cvision-green-bg rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-cvision-green mx-auto mb-2" />
                <p className="text-2xl font-bold">{funnel.accepted}</p>
                <p className="text-xs text-muted-foreground">Accepted</p>
              </div>
              <div className="text-center p-4 bg-cvision-red-bg rounded-lg">
                <XCircle className="w-6 h-6 text-cvision-red mx-auto mb-2" />
                <p className="text-2xl font-bold">{funnel.rejected}</p>
                <p className="text-xs text-muted-foreground">Rejected</p>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Company status breakdown */}
            <h3 className="font-semibold mb-3">Company Status Breakdown</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 bg-cvision-green-bg rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-cvision-green" />
                <div>
                  <p className="font-bold">{companyBreakdown.approved}</p>
                  <p className="text-xs text-muted-foreground">Approved</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-cvision-yellow-bg rounded-lg">
                <Clock className="w-5 h-5 text-cvision-yellow" />
                <div>
                  <p className="font-bold">{companyBreakdown.pending}</p>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-cvision-red-bg rounded-lg">
                <XCircle className="w-5 h-5 text-cvision-red" />
                <div>
                  <p className="font-bold">{companyBreakdown.rejected}</p>
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
