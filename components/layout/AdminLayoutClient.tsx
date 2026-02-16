"use client";

import {
  LayoutDashboard,
  BarChart3,
  Building2,
  Users,
  UserCog,
  Briefcase,
  ClipboardList,
  Settings,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import type { SidebarItem } from "@/components/layout/Sidebar";

const adminSidebarItems: SidebarItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Companies", href: "/admin/companies", icon: Building2 },
  { label: "Candidates", href: "/admin/candidates", icon: Users },
  { label: "Users Management", href: "/admin/users", icon: UserCog },
  { label: "Job Offers", href: "/admin/jobs", icon: Briefcase },
  { label: "Applications", href: "/admin/applications", icon: ClipboardList },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

const topbarLinks = [
  { label: "Dashboard", href: "/admin/dashboard" },
  { label: "Analytics", href: "/admin/analytics" },
  { label: "Companies", href: "/admin/companies" },
];

export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayout
      sidebarItems={adminSidebarItems}
      sidebarTitle="Admin Panel"
      topbarLinks={topbarLinks}
      userName="Super Admin"
    >
      {children}
    </DashboardLayout>
  );
}
