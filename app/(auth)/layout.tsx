import type { Metadata } from "next";
import { MiniFooter } from "@/components/layout/MiniFooter";

export const metadata: Metadata = {
  title: {
    default: "Authentication",
    template: "%s | CVision",
  },
  description: "Sign in or create your CVision account.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <MiniFooter />
    </>
  );
}
