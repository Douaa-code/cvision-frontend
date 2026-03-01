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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, EyeOff, Loader2, X } from "lucide-react";
import { WILAYAS, getPostalCodeByWilaya } from "@/lib/constants/wilayas";
import { DomainEnum, EducationEnum, ExperienceEnum } from "@/types/enums";
import { ArrowLeft } from "lucide-react";

const candidateSchema = z
  .object({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    email: z.string().email("Please enter a valid email"),
    phoneNumber: z.string().min(9, "Please enter a valid phone number"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    wilaya: z.string().min(1, "Please select a wilaya"),
    postalCode: z.string().min(1, "Postal code is required"),
    educationLevel: z.string().min(1, "Please select education level"),
    fieldOfStudy: z.string().min(1, "Please select field of study"),
    university: z.string().min(2, "University is required"),
    graduationYear: z
      .string()
      .min(1, "Graduation year is required")
      .refine((v) => {
        const n = parseInt(v, 10);
        return !isNaN(n) && n >= 1980 && n <= 2030;
      }, "Year must be between 1980 and 2030"),
    yearsOfExperience: z.string().min(1, "Please select experience level"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type CandidateFormData = z.infer<typeof candidateSchema>;

const LANGUAGE_OPTIONS = [
  "Arabic",
  "French",
  "English",
  "Tamazight",
  "Spanish",
  "German",
  "Italian",
  "Turkish",
  "Chinese",
];
const PROFICIENCY_LEVELS = ["Native", "Fluent", "Intermediate"] as const;

export default function CandidateRegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [languages, setLanguages] = useState<
    { name: string; level: (typeof PROFICIENCY_LEVELS)[number] }[]
  >([]);
  const [langName, setLangName] = useState("");
  const [langLevel, setLangLevel] = useState<(typeof PROFICIENCY_LEVELS)[number]>("Intermediate");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CandidateFormData>({
    resolver: zodResolver(candidateSchema),
  });

  const selectedWilaya = watch("wilaya");

  const handleWilayaChange = (value: string) => {
    setValue("wilaya", value);
    const postal = getPostalCodeByWilaya(value);
    if (postal) setValue("postalCode", postal);
  };

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && skills.length < 10 && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const addLanguage = () => {
    if (langName && !languages.some((l) => l.name === langName)) {
      setLanguages([...languages, { name: langName, level: langLevel }]);
      setLangName("");
      setLangLevel("Intermediate");
    }
  };

  const removeLanguage = (name: string) => {
    setLanguages(languages.filter((l) => l.name !== name));
  };

  const onSubmit = async (_data: CandidateFormData) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    router.push("/login");
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
            
            <CardTitle className="text-xl">Create Candidate Account</CardTitle>
            <p className="text-sm text-muted-foreground">
              Fill in your details to get started
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Personal Details */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
                  Personal Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      {...register("firstName")}
                      className={errors.firstName ? "border-cvision-red" : ""}
                    />
                    {errors.firstName && (
                      <p className="text-xs text-cvision-red">{errors.firstName.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      {...register("lastName")}
                      className={errors.lastName ? "border-cvision-red" : ""}
                    />
                    {errors.lastName && (
                      <p className="text-xs text-cvision-red">{errors.lastName.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      {...register("email")}
                      className={errors.email ? "border-cvision-red" : ""}
                    />
                    {errors.email && (
                      <p className="text-xs text-cvision-red">{errors.email.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      placeholder="+213 555 123 456"
                      {...register("phoneNumber")}
                      className={errors.phoneNumber ? "border-cvision-red" : ""}
                    />
                    {errors.phoneNumber && (
                      <p className="text-xs text-cvision-red">{errors.phoneNumber.message}</p>
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
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-xs text-cvision-red">{errors.password.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      {...register("confirmPassword")}
                      className={errors.confirmPassword ? "border-cvision-red" : ""}
                    />
                    {errors.confirmPassword && (
                      <p className="text-xs text-cvision-red">{errors.confirmPassword.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Location */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
                  Location
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Wilaya</Label>
                    <Select onValueChange={handleWilayaChange} value={selectedWilaya}>
                      <SelectTrigger className={`w-full h-9 ${errors.wilaya ? "border-cvision-red" : ""}`}>
                        <SelectValue placeholder="Select wilaya" />
                      </SelectTrigger>
                      <SelectContent>
                        {WILAYAS.map((w) => (
                          <SelectItem key={w.code} value={w.name}>
                            {w.code} - {w.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.wilaya && (
                      <p className="text-xs text-cvision-red">{errors.wilaya.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input
                      id="postalCode"
                      placeholder="16000"
                      {...register("postalCode")}
                      className={errors.postalCode ? "border-cvision-red" : ""}
                    />
                    {errors.postalCode && (
                      <p className="text-xs text-cvision-red">{errors.postalCode.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Education */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
                  Education
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Education Level</Label>
                    <Select onValueChange={(v) => setValue("educationLevel", v)}>
                      <SelectTrigger className={`w-full h-9 ${errors.educationLevel ? "border-cvision-red" : ""}`}>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(EducationEnum).map((level) => (
                          <SelectItem key={level} value={level}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.educationLevel && (
                      <p className="text-xs text-cvision-red">{errors.educationLevel.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Field of Study</Label>
                    <Select onValueChange={(v) => setValue("fieldOfStudy", v)}>
                      <SelectTrigger className={`w-full h-9 ${errors.fieldOfStudy ? "border-cvision-red" : ""}`}>
                        <SelectValue placeholder="Select domain" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(DomainEnum).map((domain) => (
                          <SelectItem key={domain} value={domain}>
                            {domain}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.fieldOfStudy && (
                      <p className="text-xs text-cvision-red">{errors.fieldOfStudy.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="university">University / School</Label>
                    <Input
                      id="university"
                      placeholder="University of Algiers"
                      {...register("university")}
                      className={errors.university ? "border-cvision-red" : ""}
                    />
                    {errors.university && (
                      <p className="text-xs text-cvision-red">{errors.university.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="graduationYear">Graduation Year</Label>
                    <Input
                      id="graduationYear"
                      placeholder="2024"
                      {...register("graduationYear")}
                      className={errors.graduationYear ? "border-cvision-red" : ""}
                    />
                    {errors.graduationYear && (
                      <p className="text-xs text-cvision-red">{errors.graduationYear.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Experience */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
                  Experience
                </h3>
                <div className="space-y-2">
                  <Label>Years of Experience</Label>
                  <Select onValueChange={(v) => setValue("yearsOfExperience", v)}>
                    <SelectTrigger className={`w-full h-9 ${errors.yearsOfExperience ? "border-cvision-red" : ""}`}>
                      <SelectValue placeholder="Select experience" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(ExperienceEnum).map((exp) => (
                        <SelectItem key={exp} value={exp}>
                          {exp}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.yearsOfExperience && (
                    <p className="text-xs text-cvision-red">{errors.yearsOfExperience.message}</p>
                  )}
                </div>
              </div>

              {/* Skills */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
                  Skills <span className="text-muted-foreground font-normal normal-case">(max 10)</span>
                </h3>
                <div className="flex gap-2 mb-3">
                  <Input
                    placeholder="e.g. PHP, JavaScript, Laravel..."
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addSkill();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addSkill}
                    disabled={skills.length >= 10}
                  >
                    Add
                  </Button>
                </div>
                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <span
                        key={skill}
                        className="flex items-center gap-1 bg-cvision-green-bg text-cvision-green text-sm px-3 py-1 rounded-full"
                      >
                        {skill}
                        <button type="button" onClick={() => removeSkill(skill)}>
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Languages */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
                  Languages
                </h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  <Select value={langName} onValueChange={setLangName}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Language" />
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGE_OPTIONS.filter(
                        (l) => !languages.some((la) => la.name === l)
                      ).map((lang) => (
                        <SelectItem key={lang} value={lang}>
                          {lang}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={langLevel}
                    onValueChange={(v) => setLangLevel(v as typeof langLevel)}
                  >
                    <SelectTrigger className="w-full sm:w-[160px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PROFICIENCY_LEVELS.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button type="button" variant="outline" onClick={addLanguage}>
                    Add
                  </Button>
                </div>
                {languages.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {languages.map((lang) => (
                      <span
                        key={lang.name}
                        className="flex items-center gap-1 bg-cvision-container text-foreground text-sm px-3 py-1 rounded-full border border-border"
                      >
                        {lang.name} ({lang.level})
                        <button type="button" onClick={() => removeLanguage(lang.name)}>
                          <X className="w-3 h-3 text-muted-foreground" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit */}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

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
