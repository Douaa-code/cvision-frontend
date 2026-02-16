import type { Metadata } from "next";

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
  return <>{children}</>;
}
