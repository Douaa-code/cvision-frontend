import type { Metadata } from "next";
import CompanyLayoutClient from "@/components/layout/CompanyLayoutClient";

export const metadata: Metadata = {
  title: {
    default: "Company Portal",
    template: "%s - Company | CVision",
  },
  description: "Manage job offers, review applicants, and track recruitment on CVision.",
};

export default function CompanyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CompanyLayoutClient>{children}</CompanyLayoutClient>;
}
