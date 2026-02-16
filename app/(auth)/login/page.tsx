"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Loader2 } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const MOCK_USERS = [
  { email: "candidate@cvision.dz", password: "123456", role: "candidate" as const, redirect: "/dashboard" },
  { email: "company@cvision.dz", password: "123456", role: "company" as const, redirect: "/company/dashboard" },
  { email: "admin@cvision.dz", password: "123456", role: "admin" as const, redirect: "/admin/dashboard" },
];

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setLoginError("");

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const user = MOCK_USERS.find(
      (u) => u.email === data.email && u.password === data.password
    );

    if (user) {
      router.push(user.redirect);
    } else {
      setLoginError("Invalid email or password. Try one of the demo accounts below.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card>
          <CardHeader className="text-center pb-2">
            <Link
              href="/"
              className="text-2xl font-bold text-cvision-green mb-2 inline-block"
            >
              CVision
            </Link>
            <CardTitle className="text-xl">Welcome Back</CardTitle>
            <p className="text-sm text-muted-foreground">
              Sign in to your account
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {loginError && (
                <div className="bg-cvision-red-bg text-cvision-red text-sm p-3 rounded-lg">
                  {loginError}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  {...register("email")}
                  className={errors.email ? "border-cvision-red" : ""}
                />
                {errors.email && (
                  <p className="text-xs text-cvision-red">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("password")}
                    className={errors.password ? "border-cvision-red pr-10" : "pr-10"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-cvision-red">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox id="remember" />
                  <Label htmlFor="remember" className="text-sm font-normal">
                    Remember me
                  </Label>
                </div>
                <Link
                  href="#"
                  className="text-sm text-cvision-green hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            {/* Demo Accounts */}
            <div className="mt-6 p-4 bg-cvision-container rounded-lg border border-border">
              <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                Demo Accounts (password: 123456)
              </p>
              <div className="space-y-1.5">
                {MOCK_USERS.map((u) => (
                  <p key={u.email} className="text-xs text-muted-foreground">
                    <span className="font-medium text-foreground capitalize">
                      {u.role}:
                    </span>{" "}
                    {u.email}
                  </p>
                ))}
              </div>
            </div>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                href="/register/candidate"
                className="text-cvision-green hover:underline font-medium"
              >
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
