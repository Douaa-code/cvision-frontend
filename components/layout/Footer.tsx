import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-white border-t border-border text-foreground">
      <div className="max-w-[1280px] mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-xl font-bold text-cvision-green mb-3">
              CVision
            </h3>
            <p className="text-sm text-muted-foreground">
              AI-powered recruitment platform connecting job seekers with
              verified companies across Algeria.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-3 text-foreground">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-foreground transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="hover:text-foreground transition-colors"
                >
                  Login
                </Link>
              </li>
            </ul>
          </div>

          {/* For Job Seekers */}
          <div>
            <h4 className="font-semibold mb-3 text-foreground">For Job Seekers</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/register/candidate"
                  className="hover:text-foreground transition-colors"
                >
                  Register as Candidate
                </Link>
              </li>
            </ul>
          </div>

          {/* For Employers */}
          <div>
            <h4 className="font-semibold mb-3 text-foreground">For Employers</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/register/company"
                  className="hover:text-foreground transition-colors"
                >
                  Register as Company
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          &copy; 2026 CVision. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
