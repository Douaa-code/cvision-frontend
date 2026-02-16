import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-foreground text-white">
      <div className="max-w-[1280px] mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-xl font-bold text-cvision-green mb-3">
              CVision
            </h3>
            <p className="text-sm text-gray-400">
              AI-powered recruitment platform connecting job seekers with
              verified companies across Algeria.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="hover:text-white transition-colors"
                >
                  Login
                </Link>
              </li>
            </ul>
          </div>

          {/* For Job Seekers */}
          <div>
            <h4 className="font-semibold mb-3">For Job Seekers</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link
                  href="/register/candidate"
                  className="hover:text-white transition-colors"
                >
                  Register as Candidate
                </Link>
              </li>
              <li>
                <Link
                  href="/jobs"
                  className="hover:text-white transition-colors"
                >
                  Browse Jobs
                </Link>
              </li>
            </ul>
          </div>

          {/* For Employers */}
          <div>
            <h4 className="font-semibold mb-3">For Employers</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link
                  href="/register/company"
                  className="hover:text-white transition-colors"
                >
                  Register as Company
                </Link>
              </li>
              <li>
                <Link
                  href="/company/dashboard"
                  className="hover:text-white transition-colors"
                >
                  Company Dashboard
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          &copy; 2026 CVision. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
