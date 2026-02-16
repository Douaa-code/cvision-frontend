import type { Metadata } from "next";
import AdminLayoutClient from "@/components/layout/AdminLayoutClient";

export const metadata: Metadata = {
  title: {
    default: "Admin Panel",
    template: "%s - Admin | CVision",
  },
  description: "Manage the CVision platform: companies, candidates, and analytics.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
