"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, LogOut, User, ShieldUser } from "lucide-react";
import { Sidebar, type SidebarItem } from "./Sidebar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MiniFooter } from "./MiniFooter";
import { useAuth } from "@/lib/auth/AuthContext";

interface DashboardLayoutProps {
  children: React.ReactNode;
  sidebarItems: SidebarItem[];
  sidebarTitle: string;
  topbarLinks?: { label: string; href: string }[];
}

export function DashboardLayout({
  children,
  sidebarItems,
  sidebarTitle,
  topbarLinks = [],
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar items={sidebarItems} title={sidebarTitle} />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setSidebarOpen(false)}
        >
          <div
            className="w-64"
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar items={sidebarItems} title={sidebarTitle} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="h-14 sm:h-16 bg-gradient-to-r from-emerald-500 to-blue-500 flex items-center px-3 sm:px-4 md:px-6">
          {/* Left: mobile menu toggle */}
          <div className="flex items-center">
            <button
              className="lg:hidden p-2.5 text-white"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {/* Center: nav links */}
          <nav className="hidden md:flex flex-1 items-center justify-center gap-3 md:gap-8">
            {topbarLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-bold text-white/90 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right: user info + logout */}
          <div className="flex items-center gap-2 sm:gap-4 ml-auto">
            <span className="text-xs sm:text-sm text-white/80 hidden sm:inline">
              {user?.name ?? "User"}
            </span>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
              {user?.role === "admin" ? (
                <ShieldUser className="w-4 h-4 text-white" />
              ) : user?.profilePhoto ? (
                <img
                  src={user.profilePhoto}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-4 h-4 text-white" />
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:text-white hover:bg-white/10"
              onClick={handleLogout}
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-3 sm:p-4 md:p-6">{children}</main>
        <MiniFooter />
      </div>
    </div>
  );
}
