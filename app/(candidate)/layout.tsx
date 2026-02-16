import type { Metadata } from "next";
import CandidateLayoutClient from "@/components/layout/CandidateLayoutClient";

export const metadata: Metadata = {
  title: {
    default: "Candidate Portal",
    template: "%s - Candidate | CVision",
  },
  description: "Manage your job applications, take tests, and access training on CVision.",
};

export default function CandidateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CandidateLayoutClient>{children}</CandidateLayoutClient>;
}
