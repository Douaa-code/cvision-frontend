"use client";

import {
  LayoutDashboard,
  Building2,
  PlusCircle,
  Briefcase,
  Users,
  UserCheck,
  ClipboardCheck,
  GraduationCap,
  MessageCircle,
  Settings,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import type { SidebarItem } from "@/components/layout/Sidebar";

const companySidebarItems: SidebarItem[] = [
  { label: "Dashboard", href: "/company/dashboard", icon: LayoutDashboard },
  { label: "Company Profile", href: "/company/profile", icon: Building2 },
  { label: "Create Job Offer", href: "/company/jobs/create", icon: PlusCircle },
  { label: "Job Offers", href: "/company/jobs", icon: Briefcase },
  { label: "Applicants", href: "/company/applicants", icon: Users },
  { label: "Recruitment", href: "/company/recruitment", icon: UserCheck },
  { label: "Tests", href: "/company/tests", icon: ClipboardCheck },
  { label: "Create Test", href: "/company/tests/create", icon: ClipboardCheck },
  { label: "Training", href: "/company/training", icon: GraduationCap },
  { label: "Create Training", href: "/company/training/create", icon: GraduationCap },
  { label: "Messages", href: "/company/messages", icon: MessageCircle },
  { label: "Settings", href: "/company/settings", icon: Settings },
];

const topbarLinks = [
  { label: "Dashboard", href: "/company/dashboard" },
  { label: "Create Job", href: "/company/jobs/create" },
  { label: "Company Profile", href: "/company/profile" },
];

export default function CompanyLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayout
      sidebarItems={companySidebarItems}
      sidebarTitle="Company Portal"
      topbarLinks={topbarLinks}
      userName="Tech Solutions Inc."
    >
      {children}
    </DashboardLayout>
  );
}
