"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Eye,
  EyeOff,
  Loader2,
  Building2,
  FileText,
  UserCog,
  Check,
  Upload,
  X,
  Info,
} from "lucide-react";
import { WILAYAS, getWilayaCode } from "@/lib/constants/wilayas";
import { DomainEnum } from "@/types/enums";
import { ArrowLeft } from "lucide-react";
import { authApi } from "@/lib/api/auth";

// Step 1 schema
const step1Schema = z.object({
  companyName: z.string().min(2, "Company name is required"),
  activityDomain: z.string().min(1, "Please select a domain"),
  professionalEmail: z.string().email("Please enter a valid email"),
  phoneNumber: z.string().min(9, "Please enter a valid phone number"),
  website: z.string().optional(),
  wilaya: z.string().min(1, "Please select a wilaya"),
  postalCode: z.string().min(5, "Postal code must be 5 digits"),
  streetAddress: z.string().optional(),
  description: z.string().min(20, "Description must be at least 20 characters"),
}).refine((data) => {
  const wilayaEntry = WILAYAS.find((w) => w.name === data.wilaya);
  if (!wilayaEntry) return true;
  return data.postalCode.startsWith(wilayaEntry.code);
}, {
  message: "Postal code must start with your wilaya code",
  path: ["postalCode"],
});

// Step 3 schema
const step3Schema = z
  .object({
    adminFullName: z.string().min(2, "Full name is required"),
    adminEmail: z.string().email("Please enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    termsAccepted: z.boolean().refine((v) => v, "You must accept the terms"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type Step1Data = z.infer<typeof step1Schema>;
type Step3Data = z.infer<typeof step3Schema>;

const STEPS = [
  { icon: Building2, label: "Company Info" },
  { icon: FileText, label: "Documents" },
  { icon: UserCog, label: "Admin Account" },
];


export default function CompanyRegisterPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [documents, setDocuments] = useState<{
    rc: File | null;
    nif: File | null;
    additional: File[];
  }>({ rc: null, nif: null, additional: [] });
  const [docError, setDocError] = useState("");
  const [serverError, setServerError] = useState("");
  const [postalPrefix, setPostalPrefix] = useState("");
  const [postalSuffix, setPostalSuffix] = useState("");

  // Step 1 form
  const step1Form = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
  });

  // Step 3 form
  const step3Form = useForm<Step3Data>({
    resolver: zodResolver(step3Schema),
    defaultValues: { termsAccepted: false },
  });

  const handleWilayaChange = (value: string) => {
    step1Form.setValue("wilaya", value);
    const code = getWilayaCode(value) ?? "";
    setPostalPrefix(code);
    setPostalSuffix("000");
    step1Form.setValue("postalCode", code + "000");
  };

  const handlePostalSuffixChange = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 3);
    setPostalSuffix(digits);
    step1Form.setValue("postalCode", postalPrefix + digits);
  };

  const handleFileChange = (
    type: "rc" | "nif" | "additional",
    file: File | null
  ) => {
    if (file && file.size > 5 * 1024 * 1024) {
      setDocError("File size must be less than 5MB");
      return;
    }
    setDocError("");
    if (type === "additional" && file) {
      setDocuments((prev) => ({
        ...prev,
        additional: [...prev.additional, file],
      }));
    } else {
      setDocuments((prev) => ({ ...prev, [type]: file }));
    }
  };

  const removeAdditionalDoc = (index: number) => {
    setDocuments((prev) => ({
      ...prev,
      additional: prev.additional.filter((_, i) => i !== index),
    }));
  };

  const goToStep = async (step: number) => {
    if (step > currentStep) {
      // Validate current step before advancing
      if (currentStep === 0) {
        const valid = await step1Form.trigger();
        if (!valid) return;
      }
      if (currentStep === 1) {
        if (!documents.rc || !documents.nif) {
          setDocError("Commercial Register (RC) and NIF document are required");
          return;
        }
        setDocError("");
      }
    }
    setCurrentStep(step);
  };

  const onSubmit = async (data: Step3Data) => {
    setIsLoading(true);
    setServerError("");
    const s1 = step1Form.getValues();
    try {
      const formData = new FormData();
      formData.append("name", data.adminFullName);
      formData.append("email", data.adminEmail);
      formData.append("password", data.password);
      formData.append("password_confirmation", data.confirmPassword);
      formData.append("company_name", s1.companyName);
      formData.append("domain", s1.activityDomain);
      formData.append("professional_email", s1.professionalEmail);
      formData.append("phone", s1.phoneNumber);
      if (s1.website) formData.append("website", s1.website);
      formData.append("wilaya", s1.wilaya);
      formData.append("postal_code", s1.postalCode);
      formData.append("street_address", s1.streetAddress ?? "");
      formData.append("description", s1.description);
      formData.append("terms_accepted", "1");
      if (documents.rc) formData.append("rc_document", documents.rc);
      if (documents.nif) formData.append("nif_document", documents.nif);
      documents.additional.forEach((file) => {
        formData.append("additional_documents[]", file);
      });

      await authApi.registerCompany(formData);
      setCurrentStep(3); // success screen
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const stepVariants = {
    enter: { opacity: 0, x: 20 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Link
        href="/"
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
        <Card>
          <CardHeader className="text-center pb-2">
            
            <CardTitle className="text-xl">Register Your Company</CardTitle>
            <p className="text-sm text-muted-foreground">
              3-step verification process
            </p>

            {/* Progress Steps */}
            <div className="flex items-center justify-center gap-2 mt-6">
              {STEPS.map((step, i) => {
                const Icon = step.icon;
                const isCompleted = i < currentStep;
                const isCurrent = i === currentStep;
                return (
                  <div key={step.label} className="flex items-center gap-2">
                    {i > 0 && (
                      <div
                        className={`w-12 h-0.5 ${
                          isCompleted ? "bg-cvision-green" : "bg-border"
                        }`}
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => i < currentStep && setCurrentStep(i)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                        isCurrent
                          ? "bg-cvision-green text-white"
                          : isCompleted
                          ? "bg-cvision-green-bg text-cvision-green"
                          : "bg-cvision-container text-muted-foreground"
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Icon className="w-4 h-4" />
                      )}
                      <span className="hidden sm:inline">{step.label}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            <AnimatePresence mode="wait">
              {/* Step 1: Company Information */}
              {currentStep === 0 && (
                <motion.div
                  key="step1"
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <form
                    onSubmit={step1Form.handleSubmit(() => goToStep(1))}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="companyName">Company Name</Label>
                        <Input
                          id="companyName"
                          placeholder="Tech Solutions Inc."
                          {...step1Form.register("companyName")}
                          className={step1Form.formState.errors.companyName ? "border-cvision-red" : ""}
                        />
                        {step1Form.formState.errors.companyName && (
                          <p className="text-xs text-cvision-red">{step1Form.formState.errors.companyName.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label>Activity Domain</Label>
                        <Select onValueChange={(v) => step1Form.setValue("activityDomain", v)}>
                          <SelectTrigger className={`w-full h-9 ${step1Form.formState.errors.activityDomain ? "border-cvision-red" : ""}`}>
                            <SelectValue placeholder="Select domain" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.values(DomainEnum).map((domain) => (
                              <SelectItem key={domain} value={domain}>{domain}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {step1Form.formState.errors.activityDomain && (
                          <p className="text-xs text-cvision-red">{step1Form.formState.errors.activityDomain.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="professionalEmail">Professional Email</Label>
                        <Input
                          id="professionalEmail"
                          type="email"
                          placeholder="contact@company.com"
                          {...step1Form.register("professionalEmail")}
                          className={step1Form.formState.errors.professionalEmail ? "border-cvision-red" : ""}
                        />
                        {step1Form.formState.errors.professionalEmail && (
                          <p className="text-xs text-cvision-red">{step1Form.formState.errors.professionalEmail.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phoneNumber">Phone Number</Label>
                        <Input
                          id="phoneNumber"
                          placeholder="+213 555 123 456"
                          {...step1Form.register("phoneNumber")}
                          className={step1Form.formState.errors.phoneNumber ? "border-cvision-red" : ""}
                        />
                        {step1Form.formState.errors.phoneNumber && (
                          <p className="text-xs text-cvision-red">{step1Form.formState.errors.phoneNumber.message}</p>
                        )}
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="website">Website (optional)</Label>
                        <Input
                          id="website"
                          placeholder="https://www.company.com"
                          {...step1Form.register("website")}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Wilaya</Label>
                        <Select onValueChange={handleWilayaChange} value={step1Form.watch("wilaya")}>
                          <SelectTrigger className={`w-full h-9 ${step1Form.formState.errors.wilaya ? "border-cvision-red" : ""}`}>
                            <SelectValue placeholder="Select wilaya" />
                          </SelectTrigger>
                          <SelectContent>
                            {WILAYAS.map((w) => (
                              <SelectItem key={w.code} value={w.name}>{w.code} - {w.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {step1Form.formState.errors.wilaya && (
                          <p className="text-xs text-cvision-red">{step1Form.formState.errors.wilaya.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="postalSuffix">Postal Code</Label>
                        <div className={`flex rounded-md border overflow-hidden ${step1Form.formState.errors.postalCode ? "border-cvision-red" : "border-input"}`}>
                          <span className="flex items-center px-3 bg-muted text-sm font-mono border-r border-input text-muted-foreground select-none min-w-[2.75rem] justify-center">
                            {postalPrefix || "—"}
                          </span>
                          <input
                            id="postalSuffix"
                            value={postalSuffix}
                            onChange={(e) => handlePostalSuffixChange(e.target.value)}
                            maxLength={3}
                            placeholder="000"
                            disabled={!postalPrefix}
                            className="flex-1 px-3 py-2 text-sm bg-transparent outline-none font-mono placeholder:text-muted-foreground disabled:opacity-50"
                          />
                        </div>
                        {step1Form.formState.errors.postalCode && (
                          <p className="text-xs text-cvision-red">{step1Form.formState.errors.postalCode.message}</p>
                        )}
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="streetAddress">Street Address</Label>
                        <Input
                          id="streetAddress"
                          placeholder="e.g. 12 Rue Didouche Mourad"
                          {...step1Form.register("streetAddress")}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Company Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe your company's activity, mission, and values..."
                        rows={4}
                        {...step1Form.register("description")}
                        className={step1Form.formState.errors.description ? "border-cvision-red" : ""}
                      />
                      {step1Form.formState.errors.description && (
                        <p className="text-xs text-cvision-red">{step1Form.formState.errors.description.message}</p>
                      )}
                    </div>
                    <Button type="submit" className="w-full">
                      Continue to Documents
                    </Button>
                  </form>
                </motion.div>
              )}

              {/* Step 2: Document Upload */}
              {currentStep === 1 && (
                <motion.div
                  key="step2"
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {docError && (
                    <div className="bg-cvision-red-bg text-cvision-red text-sm p-3 rounded-lg">
                      {docError}
                    </div>
                  )}

                  {/* RC */}
                  <div className="space-y-2">
                    <Label>
                      Commercial Register (RC){" "}
                      <span className="text-cvision-red">*</span>
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      PDF, JPG or PNG - Max 5MB
                    </p>
                    {documents.rc ? (
                      <div className="flex items-center justify-between bg-cvision-green-bg rounded-lg p-3">
                        <span className="text-sm text-cvision-green flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          {documents.rc.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => setDocuments((p) => ({ ...p, rc: null }))}
                        >
                          <X className="w-4 h-4 text-cvision-red" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-cvision-green transition-colors">
                        <Upload className="w-6 h-6 text-muted-foreground mb-2" />
                        <span className="text-sm text-muted-foreground">
                          Click to upload
                        </span>
                        <input
                          type="file"
                          className="hidden"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) =>
                            handleFileChange("rc", e.target.files?.[0] ?? null)
                          }
                        />
                      </label>
                    )}
                  </div>

                  {/* NIF */}
                  <div className="space-y-2">
                    <Label>
                      NIF Document{" "}
                      <span className="text-cvision-red">*</span>
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      PDF, JPG or PNG - Max 5MB
                    </p>
                    {documents.nif ? (
                      <div className="flex items-center justify-between bg-cvision-green-bg rounded-lg p-3">
                        <span className="text-sm text-cvision-green flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          {documents.nif.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => setDocuments((p) => ({ ...p, nif: null }))}
                        >
                          <X className="w-4 h-4 text-cvision-red" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-cvision-green transition-colors">
                        <Upload className="w-6 h-6 text-muted-foreground mb-2" />
                        <span className="text-sm text-muted-foreground">
                          Click to upload
                        </span>
                        <input
                          type="file"
                          className="hidden"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) =>
                            handleFileChange("nif", e.target.files?.[0] ?? null)
                          }
                        />
                      </label>
                    )}
                  </div>

                  {/* Additional Docs */}
                  <div className="space-y-2">
                    <Label>Additional Documents (optional)</Label>
                    <p className="text-xs text-muted-foreground">
                      Any other supporting documents
                    </p>
                    {documents.additional.length > 0 && (
                      <div className="space-y-2 mb-2">
                        {documents.additional.map((file, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between bg-cvision-container rounded-lg p-3"
                          >
                            <span className="text-sm flex items-center gap-2">
                              <FileText className="w-4 h-4 text-muted-foreground" />
                              {file.name}
                            </span>
                            <button type="button" onClick={() => removeAdditionalDoc(i)}>
                              <X className="w-4 h-4 text-cvision-red" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-cvision-green transition-colors">
                      <span className="text-sm text-muted-foreground">
                        + Add document
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) =>
                          handleFileChange(
                            "additional",
                            e.target.files?.[0] ?? null
                          )
                        }
                      />
                    </label>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => setCurrentStep(0)}
                    >
                      Back
                    </Button>
                    <Button
                      type="button"
                      className="flex-1"
                      onClick={() => goToStep(2)}
                    >
                      Continue to Admin Account
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Admin Account */}
              {currentStep === 2 && (
                <motion.div
                  key="step3"
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <form
                    onSubmit={step3Form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="adminFullName">Full Name</Label>
                      <Input
                        id="adminFullName"
                        placeholder="Admin User"
                        {...step3Form.register("adminFullName")}
                        className={step3Form.formState.errors.adminFullName ? "border-cvision-red" : ""}
                      />
                      {step3Form.formState.errors.adminFullName && (
                        <p className="text-xs text-cvision-red">{step3Form.formState.errors.adminFullName.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="adminEmail">Admin Email</Label>
                      <Input
                        id="adminEmail"
                        type="email"
                        placeholder="admin@company.com"
                        {...step3Form.register("adminEmail")}
                        className={step3Form.formState.errors.adminEmail ? "border-cvision-red" : ""}
                      />
                      {step3Form.formState.errors.adminEmail && (
                        <p className="text-xs text-cvision-red">{step3Form.formState.errors.adminEmail.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          {...step3Form.register("password")}
                          className={step3Form.formState.errors.password ? "border-cvision-red pr-10" : "pr-10"}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {step3Form.formState.errors.password && (
                        <p className="text-xs text-cvision-red">{step3Form.formState.errors.password.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        {...step3Form.register("confirmPassword")}
                        className={step3Form.formState.errors.confirmPassword ? "border-cvision-red" : ""}
                      />
                      {step3Form.formState.errors.confirmPassword && (
                        <p className="text-xs text-cvision-red">{step3Form.formState.errors.confirmPassword.message}</p>
                      )}
                    </div>
                    <div className="flex items-start gap-2 pt-2">
                      <Checkbox
                        id="terms"
                        onCheckedChange={(checked) =>
                          step3Form.setValue("termsAccepted", !!checked)
                        }
                      />
                      <Label htmlFor="terms" className="text-sm font-normal leading-relaxed">
                        I accept the terms and conditions and confirm that all
                        provided information is accurate.
                      </Label>
                    </div>
                    {step3Form.formState.errors.termsAccepted && (
                      <p className="text-xs text-cvision-red">{step3Form.formState.errors.termsAccepted.message}</p>
                    )}

                    {serverError && (
                      <div className="bg-cvision-red-bg text-cvision-red text-sm p-3 rounded-lg">
                        {serverError}
                      </div>
                    )}
                    <div className="flex gap-3 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={() => setCurrentStep(1)}
                      >
                        Back
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            Submitting...
                          </>
                        ) : (
                          "Submit Registration"
                        )}
                      </Button>
                    </div>
                  </form>

                  <div className="mt-6 p-5 bg-orange-50 border border-orange-200 rounded-xl flex items-start gap-3">
                    <Info className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                    <p className="text-sm font-semibold text-orange-700 leading-relaxed">
                      After submission, your company will be reviewed by our
                      admin team. Approval takes 1–3 business days.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-cvision-green hover:underline font-medium"
              >
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
