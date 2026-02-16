"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export interface SidebarItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

interface SidebarProps {
  items: SidebarItem[];
  title: string;
}

export function Sidebar({ items, title }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-border flex flex-col">
      {/* Brand */}
      <div className="h-14 sm:h-16 flex items-center px-4 sm:px-6 border-b border-border">
        <Link href="/" className="text-xl font-bold text-cvision-green">
          CVision
        </Link>
      </div>

      {/* Title */}
      <div className="px-4 sm:px-6 py-3 sm:py-4">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {title}
        </p>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3">
        {items.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors mb-1",
                isActive
                  ? "bg-cvision-green text-white"
                  : "text-muted-foreground hover:bg-cvision-bg hover:text-foreground"
              )}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
