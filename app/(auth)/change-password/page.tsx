"use client";

import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import { apiClient } from "@/lib/api/client";

function ChangePasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get("email") ?? "";

  const [email, setEmail] = useState(emailFromQuery);
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (emailFromQuery) setEmail(emailFromQuery);
  }, [emailFromQuery]);

  const handleChangePassword = async () => {
    setError("");
    if (!code.trim()) { setError("Verification code is required."); return; }
    if (code.length !== 6) { setError("Code must be 6 digits."); return; }
    if (newPassword.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (newPassword !== confirmPassword) { setError("Passwords do not match."); return; }

    setIsLoading(true);
    try {
      await apiClient.post("/reset-password", {
        email,
        code,
        password: newPassword,
        password_confirmation: confirmPassword,
      });
      setSuccess(true);
      setTimeout(() => router.push("/login"), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to reset password. Please try again.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-6">
        <CheckCircle2 className="w-14 h-14 text-cvision-green mx-auto mb-4" />
        <p className="font-semibold text-lg">Password changed!</p>
        <p className="text-sm text-muted-foreground mt-1">
          Redirecting you to login...
        </p>
      </div>
    );
  }

  return (
    <CardContent className="space-y-4">
      {error && (
        <div className="bg-cvision-red-bg text-cvision-red text-sm p-3 rounded-lg">
          {error}
        </div>
      )}

      {!emailFromQuery && (
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="code">Verification Code</Label>
        <Input
          id="code"
          type="text"
          placeholder="6-digit code"
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
        />
        <p className="text-xs text-muted-foreground">
          {emailFromQuery
            ? `Code sent to ${emailFromQuery}`
            : "Enter the code sent to your email"}
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="newPassword">New Password</Label>
        <Input
          id="newPassword"
          type="password"
          placeholder="Min. 6 characters"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm New Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") handleChangePassword(); }}
        />
      </div>

      <Button className="w-full" onClick={handleChangePassword} disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            Resetting...
          </>
        ) : (
          "Reset Password"
        )}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        Didn&apos;t receive a code?{" "}
        <Link href="/forgot-password" className="text-cvision-green hover:underline">
          Request again
        </Link>
      </p>
    </CardContent>
  );
}

export default function ChangePasswordPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Link
          href="/forgot-password"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>

        <Card>
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-xl">Reset Password</CardTitle>
            <p className="text-sm text-muted-foreground">
              Enter the code sent to your email and set a new password
            </p>
          </CardHeader>
          <Suspense fallback={<div className="p-6 text-center text-sm text-muted-foreground">Loading...</div>}>
            <ChangePasswordForm />
          </Suspense>
        </Card>
      </motion.div>
    </div>
  );
}
