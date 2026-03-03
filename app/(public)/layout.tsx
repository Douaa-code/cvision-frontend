
import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: {
    default: "CVision - AI-Powered Recruitment Platform",
    template: "%s | CVision",
  },
  description:
    "CVision connects job seekers with verified companies across Algeria's 58 wilayas using AI-powered matching.",
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
