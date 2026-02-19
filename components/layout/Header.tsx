"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";


export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-emerald-500 to-blue-500 shadow-md">




      <div className="max-w-[1280px] mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image 
            src="/logo/logo_cvision_blanc.png" 
            alt="logo" 
            width={120} 
            height={40}
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-sm font-medium text-foreground hover:text-cvision-green transition-colors"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-muted-foreground hover:text-cvision-green transition-colors"
            >
              About Us
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login">
              <Button variant="outline" size="sm">
                Login
              </Button>
            </Link>
            <Link href="/register/candidate">
              <Button size="sm">Register as a condidate</Button>
            </Link>
            <Link href="/register/company">
              <Button size="sm">Register as a company</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2.5"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-border">
            <nav className="flex flex-col gap-3 pt-4">
              <Link
                href="/"
                className="text-sm font-medium text-foreground px-2 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/about"
                className="text-sm font-medium text-muted-foreground px-2 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                About Us
              </Link>
              <div className="flex flex-col gap-2 pt-3 border-t border-border">
                <Link href="/login">
                  <Button variant="outline" size="sm" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link href="/register/candidate">
              <Button size="sm"className="w-full">Register as a condidate</Button>
            </Link>
            <Link href="/register/company">
              <Button size="sm" className="w-full">Register as a company</Button>
            </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
