"use client";

import {
  LayoutDashboard,
  User,
  Search,
  ClipboardCheck,
  GraduationCap,
  Settings,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import type { SidebarItem } from "@/components/layout/Sidebar";

const candidateSidebarItems: SidebarItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "My Profile", href: "/profile", icon: User },
  { label: "Job Search", href: "/jobs", icon: Search },
  { label: "Tests", href: "/tests", icon: ClipboardCheck },
  { label: "Training", href: "/training", icon: GraduationCap },
  { label: "Settings", href: "/settings", icon: Settings },
];

const topbarLinks = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Job Search", href: "/jobs" },
  { label: "My Profile", href: "/profile" },
];

export default function CandidateLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayout
      sidebarItems={candidateSidebarItems}
      sidebarTitle="Candidate Portal"
      topbarLinks={topbarLinks}
      userName="John Doe"
    >
      {children}
    </DashboardLayout>
  );
}
