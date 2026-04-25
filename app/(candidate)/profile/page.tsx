"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, X, Plus, FileText, Upload } from "lucide-react";
import { WILAYAS, getWilayaCode } from "@/lib/constants/wilayas";
import { DomainEnum, EducationEnum } from "@/types/enums";
import { candidateApi } from "@/lib/api/candidate";
import type { ApiCandidateSkill, ApiLanguage } from "@/lib/api/candidate";

const EXPERIENCE_OPTIONS = [
  { label: "0-1 years (Entry Level)", value: 0 },
  { label: "2-5 years", value: 2 },
  { label: "5-10 years", value: 5 },
  { label: "10+ years", value: 10 },
];

const LANGUAGE_OPTIONS = [
  "Arabic", "French", "English", "Tamazight", "Spanish", "German",
  "Italian", "Chinese", "Russian", "Turkish", "Japanese", "Portuguese",
  "Dutch", "Korean", "Swedish",
];
const PROFICIENCY_LEVELS = ["Native", "Fluent", "Intermediate"] as const;

const GRADUATION_YEARS = Array.from({ length: 2026 - 1970 + 1 }, (_, i) => 2026 - i);

interface ProfileState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  wilaya: string;
  postalCode: string;
  streetAddress: string;
  highestDegree: string;
  fieldOfStudy: string;
  university: string;
  graduationYear: number | null;
  yearsOfExperience: number;
  currentPosition: string;
  currentCompany: string;
  certificatePath: string | null;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileState>({
    firstName: "", lastName: "", email: "", phone: "", wilaya: "", postalCode: "",
    streetAddress: "", highestDegree: "", fieldOfStudy: "",
    university: "", graduationYear: null, yearsOfExperience: 0,
    currentPosition: "", currentCompany: "", certificatePath: null,
  });
  const [skills, setSkills] = useState<ApiCandidateSkill[]>([]);
  const [languages, setLanguages] = useState<ApiLanguage[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [langName, setLangName] = useState("");
  const [langLevel, setLangLevel] = useState<"Native" | "Fluent" | "Intermediate">("Intermediate");
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [postalSuffix, setPostalSuffix] = useState("000");
  const certInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const loadProfile = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await candidateApi.getProfile();
      const data = res.data;
      const fullName: string = data.user.name ?? "";
      const spaceIdx = fullName.indexOf(" ");
      const firstName = spaceIdx === -1 ? fullName : fullName.slice(0, spaceIdx);
      const lastName = spaceIdx === -1 ? "" : fullName.slice(spaceIdx + 1);
      setProfile({
        firstName,
        lastName,
        email: data.user.email ?? "",
        phone: data.phone ?? "",
        wilaya: data.wilaya ?? "",
        postalCode: data.postal_code ?? "",
        streetAddress: data.street_address ?? "",
        highestDegree: data.highest_degree ?? "",
        fieldOfStudy: data.field_of_study ?? "",
        university: data.university ?? "",
        graduationYear: data.graduation_year ?? null,
        yearsOfExperience: data.years_of_experience ?? 0,
        currentPosition: data.current_position ?? "",
        currentCompany: data.current_company ?? "",
        certificatePath: data.certificate_path ?? null,
      });
      setSkills(data.skills ?? []);
      setLanguages(data.languages ?? []);
      // Init postal suffix from stored value
      const stored = data.postal_code ?? "";
      setPostalSuffix(stored.length >= 2 ? stored.slice(2) : "000");
      // Restore profile photo preview
      if (data.profile_photo) {
        const storageUrl = process.env.NEXT_PUBLIC_STORAGE_URL ?? "http://127.0.0.1:8000/storage";
        setPhotoPreview(`${storageUrl}/${data.profile_photo}`);
      } else {
        setPhotoPreview(null);
      }
    } catch {
      // keep defaults
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { loadProfile(); }, [loadProfile]);

  const updateField = <K extends keyof ProfileState>(field: K, value: ProfileState[K]) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleWilayaChange = (wilayaName: string) => {
    const code = getWilayaCode(wilayaName) ?? "";
    setPostalSuffix("000");
    setProfile((prev) => ({ ...prev, wilaya: wilayaName, postalCode: code + "000" }));
  };

  const handlePostalSuffixChange = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 3);
    const code = getWilayaCode(profile.wilaya) ?? "";
    setPostalSuffix(digits);
    updateField("postalCode", code + digits);
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);
    try {
      await candidateApi.updateProfile({
        name: `${profile.firstName} ${profile.lastName}`.trim(),
        phone: profile.phone,
        wilaya: profile.wilaya,
        postal_code: profile.postalCode,
        street_address: profile.streetAddress,
        highest_degree: profile.highestDegree,
        field_of_study: profile.fieldOfStudy,
        university: profile.university,
        graduation_year: profile.graduationYear,
        years_of_experience: profile.yearsOfExperience,
        current_position: profile.currentPosition,
        current_company: profile.currentCompany,
        languages,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch {
      setSaveError("Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Show local preview immediately
    setPhotoPreview(URL.createObjectURL(file));
    const formData = new FormData();
    formData.append("profile_photo", file);
    // Laravel method spoofing: PUT via POST
    formData.append("_method", "PUT");
    try {
      const token = localStorage.getItem("token") ?? sessionStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/candidate/profile`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );
      if (res.ok) {
        const json = await res.json();
        const photoPath: string | null = json.data?.profile_photo ?? null;
        if (photoPath) {
          const storageUrl = process.env.NEXT_PUBLIC_STORAGE_URL ?? "http://127.0.0.1:8000/storage";
          setPhotoPreview(`${storageUrl}/${photoPath}`);
        }
      }
    } catch { /* silently fail */ }
    e.target.value = "";
  };

  const addSkill = async () => {
    const trimmed = skillInput.trim();
    if (!trimmed || skills.length >= 30 || skills.some((s) => s.name === trimmed)) return;
    try {
      const res = await candidateApi.addSkill(trimmed);
      setSkills((prev) => [...prev, res.data]);
      setSkillInput("");
    } catch { /* silently fail */ }
  };

  const removeSkill = async (skill: ApiCandidateSkill) => {
    try {
      await candidateApi.removeSkill(skill.id);
      setSkills((prev) => prev.filter((s) => s.id !== skill.id));
    } catch { /* silently fail */ }
  };

  const addLanguage = () => {
    if (!langName || languages.some((l) => l.name === langName)) return;
    setLanguages((prev) => [...prev, { name: langName, level: langLevel }]);
    setLangName("");
  };

  const removeLanguage = (name: string) => {
    setLanguages((prev) => prev.filter((l) => l.name !== name));
  };

  const handleCertificateUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/candidate/certificate/upload`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          body: formData,
        }
      );
      if (res.ok) {
        const json = await res.json();
        setProfile((prev) => ({ ...prev, certificatePath: json.data?.certificate_path ?? null }));
      }
    } catch { /* silently fail */ }
    e.target.value = "";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cvision-green" />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>

      <div className="space-y-6">
        {/* Personal Information */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              Personal Information
            </h2>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center gap-2">
                <div className="w-24 h-24 rounded-full bg-cvision-container border-2 border-border flex items-center justify-center overflow-hidden">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-10 h-10 text-muted-foreground" />
                  )}
                </div>
                <Button variant="outline" size="sm" onClick={() => photoInputRef.current?.click()}>
                  Change Picture
                </Button>
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
              </div>
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>First Name</Label>
                  <Input value={profile.firstName} onChange={(e) => updateField("firstName", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Last Name</Label>
                  <Input value={profile.lastName} onChange={(e) => updateField("lastName", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" value={profile.email} disabled className="opacity-60" />
                </div>
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input value={profile.phone} onChange={(e) => updateField("phone", e.target.value)} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Location</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Wilaya</Label>
                <Select value={profile.wilaya} onValueChange={handleWilayaChange}>
                  <SelectTrigger className="w-full"><SelectValue placeholder="Select wilaya" /></SelectTrigger>
                  <SelectContent>
                    {WILAYAS.map((w) => (
                      <SelectItem key={w.code} value={w.name}>{w.code} - {w.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Postal Code</Label>
                <div className="flex rounded-md border border-input overflow-hidden">
                  <span className="flex items-center px-3 bg-muted text-sm font-mono border-r border-input text-muted-foreground select-none min-w-[2.75rem] justify-center">
                    {getWilayaCode(profile.wilaya) ?? "—"}
                  </span>
                  <input
                    value={postalSuffix}
                    onChange={(e) => handlePostalSuffixChange(e.target.value)}
                    maxLength={3}
                    placeholder="000"
                    disabled={!profile.wilaya}
                    className="flex-1 px-3 py-2 text-sm bg-transparent outline-none font-mono placeholder:text-muted-foreground disabled:opacity-50"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Street Address</Label>
                <Input value={profile.streetAddress} onChange={(e) => updateField("streetAddress", e.target.value)} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Education */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Education</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Highest Degree</Label>
                <Select value={profile.highestDegree} onValueChange={(v) => updateField("highestDegree", v)}>
                  <SelectTrigger className="w-full"><SelectValue placeholder="Select degree" /></SelectTrigger>
                  <SelectContent>
                    {Object.values(EducationEnum).map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Field of Study</Label>
                <Select value={profile.fieldOfStudy} onValueChange={(v) => updateField("fieldOfStudy", v)}>
                  <SelectTrigger className="w-full"><SelectValue placeholder="Select field" /></SelectTrigger>
                  <SelectContent>
                    {Object.values(DomainEnum).map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>University / School</Label>
                <Input value={profile.university} onChange={(e) => updateField("university", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Graduation Year</Label>
                <Select
                  value={profile.graduationYear ? String(profile.graduationYear) : ""}
                  onValueChange={(v) => updateField("graduationYear", Number(v))}
                >
                  <SelectTrigger className="w-full"><SelectValue placeholder="Select year" /></SelectTrigger>
                  <SelectContent>
                    {GRADUATION_YEARS.map((y) => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Professional Experience */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Professional Experience</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Years of Experience</Label>
                <Select
                  value={String(profile.yearsOfExperience)}
                  onValueChange={(v) => updateField("yearsOfExperience", Number(v))}
                >
                  <SelectTrigger className="w-full"><SelectValue placeholder="Select experience" /></SelectTrigger>
                  <SelectContent>
                    {EXPERIENCE_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={String(o.value)}>{o.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Current Position</Label>
                <Input value={profile.currentPosition} onChange={(e) => updateField("currentPosition", e.target.value)} placeholder="e.g. Software Engineer" />
              </div>
              <div className="space-y-2">
                <Label>Current Company</Label>
                <Input value={profile.currentCompany} onChange={(e) => updateField("currentCompany", e.target.value)} placeholder="e.g. Acme Corp" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skills */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Skills</h2>
            <div className="flex gap-2 mb-3">
              <Input
                placeholder="Add a skill..."
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }}
              />
              <Button variant="outline" onClick={addSkill} disabled={skills.length >= 30}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span key={skill.id} className="flex items-center gap-1 bg-cvision-green-bg text-cvision-green text-sm px-3 py-1 rounded-full">
                  {skill.name}
                  <button onClick={() => removeSkill(skill)}><X className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Languages */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Languages</h2>
            <div className="flex flex-wrap gap-2 mb-3">
              <Select value={langName} onValueChange={setLangName}>
                <SelectTrigger className="w-full sm:w-[180px]"><SelectValue placeholder="Language" /></SelectTrigger>
                <SelectContent>
                  {LANGUAGE_OPTIONS.filter((l) => !languages.some((la) => la.name === l)).map((lang) => (
                    <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={langLevel} onValueChange={(v) => setLangLevel(v as typeof langLevel)}>
                <SelectTrigger className="w-full sm:w-[160px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PROFICIENCY_LEVELS.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={addLanguage}><Plus className="w-4 h-4" /></Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {languages.map((lang) => (
                <span key={lang.name} className="flex items-center gap-1 bg-cvision-container text-foreground text-sm px-3 py-1 rounded-full border border-border">
                  {lang.name} ({lang.level})
                  <button onClick={() => removeLanguage(lang.name)}><X className="w-3 h-3 text-muted-foreground" /></button>
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Graduation Certificate */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Graduation Certificate</h2>
              <Button variant="outline" size="sm" onClick={() => certInputRef.current?.click()}>
                <Upload className="w-4 h-4 mr-2" />
                {profile.certificatePath ? "Replace" : "Add Certificate"}
              </Button>
              <input
                ref={certInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.zip,.rar"
                className="hidden"
                onChange={handleCertificateUpload}
              />
            </div>
            {profile.certificatePath ? (
              <div className="flex items-center justify-between gap-3 p-3 bg-cvision-container rounded-lg border border-border">
                <div className="flex items-center gap-3 min-w-0">
                  <FileText className="w-5 h-5 text-cvision-green flex-shrink-0" />
                  <p className="text-sm font-medium truncate">{profile.certificatePath.split("/").pop()}</p>
                </div>
                <a
                  href={`${process.env.NEXT_PUBLIC_STORAGE_URL ?? "http://127.0.0.1:8000/storage"}/${profile.certificatePath}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0"
                >
                  <Button variant="outline" size="sm">View</Button>
                </a>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">No certificate uploaded.</p>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        {saveError && <p className="text-sm text-cvision-red">{saveError}</p>}
        {saveSuccess && <p className="text-sm text-cvision-green">Profile saved successfully!</p>}
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={loadProfile} disabled={saving}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : "Save Changes"}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
