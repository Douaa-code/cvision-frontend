"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { jobsApi } from "@/lib/api/jobs";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, X, CheckCircle2 } from "lucide-react";
import { DOMAINS } from "@/lib/constants/domains";
import { getWilayaOptions, getWilayaCode } from "@/lib/constants/wilayas";
import { ExperienceEnum, SalaryEnum, ContractEnum } from "@/types/enums";

const jobSchema = z.object({
  jobTitle: z.string().min(3, "Job title must be at least 3 characters"),
  jobDescription: z.string().min(20, "Description must be at least 20 characters"),
  domain: z.string().min(1, "Domain is required"),
  wilaya: z.string().min(1, "Wilaya is required"),
  postalCode: z.string(),
  salaryRange: z.string().min(1, "Salary range is required"),
  experienceRequired: z.string().min(1, "Experience level is required"),
  contractType: z.string().min(1, "Contract type is required"),
  maxAcceptedCandidates: z.string().min(1, "Required").refine(
    (v) => { const n = parseInt(v, 10); return !isNaN(n) && n >= 1 && n <= 100; },
    "Must be between 1 and 100"
  ),
  requireQCMTest: z.boolean(),
});

type JobFormData = z.infer<typeof jobSchema>;

export default function CreateJobPage() {
  const router = useRouter();
  const [requirements, setRequirements] = useState<string[]>([]);
  const [responsibilities, setResponsibilities] = useState<string[]>([]);
  const [reqInput, setReqInput] = useState("");
  const [respInput, setRespInput] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [postalSuffix, setPostalSuffix] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      requireQCMTest: false,
      postalCode: "",
    },
  });

  const watchWilaya = watch("wilaya");

  const handleWilayaChange = (value: string) => {
    setValue("wilaya", value);
    const code = getWilayaCode(value) ?? "";
    setPostalSuffix("000");
    setValue("postalCode", code + "000");
  };

  const handlePostalSuffixChange = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 3);
    setPostalSuffix(digits);
    setValue("postalCode", (getWilayaCode(watchWilaya) ?? "") + digits);
  };

  const addRequirement = () => {
    if (reqInput.trim()) {
      setRequirements((prev) => [...prev, reqInput.trim()]);
      setReqInput("");
    }
  };

  const addResponsibility = () => {
    if (respInput.trim()) {
      setResponsibilities((prev) => [...prev, respInput.trim()]);
      setRespInput("");
    }
  };

  const parseSalary = (range: string): { salary_min: number | null; salary_max: number | null } => {
    if (range === SalaryEnum.RANGE_1) return { salary_min: 0,      salary_max: 50000  };
    if (range === SalaryEnum.RANGE_2) return { salary_min: 50000,  salary_max: 100000 };
    if (range === SalaryEnum.RANGE_3) return { salary_min: 100000, salary_max: 200000 };
    if (range === SalaryEnum.RANGE_4) return { salary_min: 200000, salary_max: null   };
    return { salary_min: null, salary_max: null };
  };

  const onSubmit = async (data: JobFormData) => {
    setSubmitting(true);
    setSubmitError(null);
    const { salary_min, salary_max } = parseSalary(data.salaryRange);
    try {
      await jobsApi.create({
        title: data.jobTitle,
        description: data.jobDescription,
        domain: data.domain,
        wilaya: data.wilaya,
        postal_code: data.postalCode,
        salary_min,
        salary_max,
        experience_required: data.experienceRequired,
        contract_type: data.contractType,
        positions: parseInt(data.maxAcceptedCandidates, 10),
        has_test: data.requireQCMTest,
        requirements,
        responsibilities,
      });
      setSubmitted(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Failed to create job offer. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg mx-auto"
      >
        <Card>
          <CardContent className="p-8 text-center">
            <CheckCircle2 className="w-16 h-16 text-cvision-green mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Job Offer Created!</h1>
            <p className="text-muted-foreground mb-6">
              Your job offer has been published and is now visible to candidates.
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => router.push("/company/jobs")}>
                View Job Offers
              </Button>
              <Button variant="outline" onClick={() => setSubmitted(false)}>
                Create Another
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-2xl font-bold mb-6">Create Job Offer</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardContent className="p-6">
            <h2 className="font-semibold text-lg mb-4">Basic Information</h2>
            <Separator className="mb-4" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="jobTitle">Job Title *</Label>
                <Input id="jobTitle" {...register("jobTitle")} placeholder="e.g. Senior PHP Developer" />
                {errors.jobTitle && <p className="text-xs text-cvision-red">{errors.jobTitle.message}</p>}
              </div>

              <div className="space-y-2">
                <Label>Domain *</Label>
                <Select onValueChange={(v) => setValue("domain", v)}>
                  <SelectTrigger className="w-full"><SelectValue placeholder="Select domain" /></SelectTrigger>
                  <SelectContent>
                    {DOMAINS.map((d) => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.domain && <p className="text-xs text-cvision-red">{errors.domain.message}</p>}
              </div>

              <div className="space-y-2">
                <Label>Contract Type *</Label>
                <Select onValueChange={(v) => setValue("contractType", v)}>
                  <SelectTrigger className="w-full"><SelectValue placeholder="Select contract" /></SelectTrigger>
                  <SelectContent>
                    {Object.values(ContractEnum).map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.contractType && <p className="text-xs text-cvision-red">{errors.contractType.message}</p>}
              </div>

              <div className="space-y-2">
                <Label>Experience Required *</Label>
                <Select onValueChange={(v) => setValue("experienceRequired", v)}>
                  <SelectTrigger className="w-full"><SelectValue placeholder="Select experience" /></SelectTrigger>
                  <SelectContent>
                    {Object.values(ExperienceEnum).map((e) => (
                      <SelectItem key={e} value={e}>{e}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.experienceRequired && <p className="text-xs text-cvision-red">{errors.experienceRequired.message}</p>}
              </div>

              <div className="space-y-2">
                <Label>Salary Range *</Label>
                <Select onValueChange={(v) => setValue("salaryRange", v)}>
                  <SelectTrigger className="w-full"><SelectValue placeholder="Select salary" /></SelectTrigger>
                  <SelectContent>
                    {Object.values(SalaryEnum).map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.salaryRange && <p className="text-xs text-cvision-red">{errors.salaryRange.message}</p>}
              </div>

              <div className="space-y-2">
                <Label>Wilaya *</Label>
                <Select onValueChange={handleWilayaChange}>
                  <SelectTrigger className="w-full"><SelectValue placeholder="Select wilaya" /></SelectTrigger>
                  <SelectContent>
                    {getWilayaOptions().map((w) => (
                      <SelectItem key={w.value} value={w.value}>{w.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.wilaya && <p className="text-xs text-cvision-red">{errors.wilaya.message}</p>}
              </div>

              <div className="space-y-2">
                <Label>Postal Code</Label>
                <div className="flex rounded-md border border-input overflow-hidden">
                  <span className="flex items-center px-3 bg-muted text-sm font-mono border-r border-input text-muted-foreground select-none min-w-[2.75rem] justify-center">
                    {watchWilaya ? (getWilayaCode(watchWilaya) ?? "—") : "—"}
                  </span>
                  <input
                    value={postalSuffix}
                    onChange={(e) => handlePostalSuffixChange(e.target.value)}
                    maxLength={3}
                    placeholder="000"
                    disabled={!watchWilaya}
                    className="flex-1 px-3 py-2 text-sm bg-transparent outline-none font-mono placeholder:text-muted-foreground disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxCandidates">Max Candidates *</Label>
                <Input id="maxCandidates" {...register("maxAcceptedCandidates")} placeholder="e.g. 5" />
                {errors.maxAcceptedCandidates && <p className="text-xs text-cvision-red">{errors.maxAcceptedCandidates.message}</p>}
              </div>
            </div>

            <div className="space-y-2 mt-4">
              <Label htmlFor="desc">Job Description *</Label>
              <Textarea id="desc" rows={5} {...register("jobDescription")} placeholder="Describe the job position in detail..." />
              {errors.jobDescription && <p className="text-xs text-cvision-red">{errors.jobDescription.message}</p>}
            </div>
          </CardContent>
        </Card>

        {/* Requirements */}
        <Card>
          <CardContent className="p-6">
            <h2 className="font-semibold text-lg mb-4">Requirements</h2>
            <Separator className="mb-4" />

            <div className="flex gap-2 mb-3">
              <Input
                value={reqInput}
                onChange={(e) => setReqInput(e.target.value)}
                placeholder="Add a requirement..."
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addRequirement(); } }}
              />
              <Button type="button" variant="outline" onClick={addRequirement}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {requirements.map((req, i) => (
                <div key={i} className="flex items-center gap-2 bg-cvision-container px-3 py-2 rounded-lg text-sm">
                  <span className="flex-1">{req}</span>
                  <button type="button" onClick={() => setRequirements((prev) => prev.filter((_, j) => j !== i))}>
                    <X className="w-4 h-4 text-muted-foreground hover:text-cvision-red" />
                  </button>
                </div>
              ))}
              {requirements.length === 0 && (
                <p className="text-sm text-muted-foreground">No requirements added yet.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Responsibilities */}
        <Card>
          <CardContent className="p-6">
            <h2 className="font-semibold text-lg mb-4">Responsibilities</h2>
            <Separator className="mb-4" />

            <div className="flex gap-2 mb-3">
              <Input
                value={respInput}
                onChange={(e) => setRespInput(e.target.value)}
                placeholder="Add a responsibility..."
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addResponsibility(); } }}
              />
              <Button type="button" variant="outline" onClick={addResponsibility}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {responsibilities.map((resp, i) => (
                <div key={i} className="flex items-center gap-2 bg-cvision-container px-3 py-2 rounded-lg text-sm">
                  <span className="flex-1">{resp}</span>
                  <button type="button" onClick={() => setResponsibilities((prev) => prev.filter((_, j) => j !== i))}>
                    <X className="w-4 h-4 text-muted-foreground hover:text-cvision-red" />
                  </button>
                </div>
              ))}
              {responsibilities.length === 0 && (
                <p className="text-sm text-muted-foreground">No responsibilities added yet.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Test Option */}
        <Card>
          <CardContent className="p-6">
            <h2 className="font-semibold text-lg mb-4">Test Configuration</h2>
            <Separator className="mb-4" />

            <div className="flex items-center gap-3">
              <Checkbox
                id="requireTest"
                checked={watch("requireQCMTest")}
                onCheckedChange={(checked) => setValue("requireQCMTest", checked === true)}
              />
              <Label htmlFor="requireTest" className="cursor-pointer">
                Require candidates to pass a QCM test before applying
              </Label>
            </div>
            {watch("requireQCMTest") && (
              <p className="text-sm text-muted-foreground mt-3 ml-7">
                You can create and link a test from the{" "}
                <span className="font-medium text-cvision-green">Create Test</span> page after publishing this job offer.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Submit */}
        {submitError && (
          <p className="text-sm text-cvision-red bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            {submitError}
          </p>
        )}
        <div className="flex gap-3">
          <Button type="submit" size="lg" disabled={submitting}>
            {submitting ? "Publishing…" : "Publish Job Offer"}
          </Button>
          <Button type="button" variant="outline" size="lg" onClick={() => router.push("/company/jobs")}>
            Cancel
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
