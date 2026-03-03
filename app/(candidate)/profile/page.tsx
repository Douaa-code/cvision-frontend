"use client";

import { useState, useRef, useEffect } from "react";
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
import { User, X, Plus, FileText, ExternalLink, Upload } from "lucide-react";
import { mockCandidate } from "@/lib/mock-data/candidate";
import { WILAYAS } from "@/lib/constants/wilayas";
import { DomainEnum, EducationEnum, ExperienceEnum } from "@/types/enums";

type Certificate = {
  id: string;
  name: string;
  url: string;
};

const LANGUAGE_OPTIONS = ["Arabic", "French", "English", "Tamazight", "Spanish", "German"];
const PROFICIENCY_LEVELS = ["Native", "Fluent", "Intermediate"] as const;

export default function ProfilePage() {
  const [candidate, setCandidate] = useState(mockCandidate);
  const [skillInput, setSkillInput] = useState("");
  const [langName, setLangName] = useState("");
  const [langLevel, setLangLevel] = useState<string>("Intermediate");
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const certInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      certificates.forEach((c) => URL.revokeObjectURL(c.url));
    };
  }, []);

  const handleAddCertificates = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const newCerts = files.map((file) => ({
      id: crypto.randomUUID(),
      name: file.name,
      url: URL.createObjectURL(file),
    }));
    setCertificates((prev) => [...prev, ...newCerts]);
    e.target.value = "";
  };

  const removeCertificate = (id: string) => {
    setCertificates((prev) => {
      const cert = prev.find((c) => c.id === id);
      if (cert) URL.revokeObjectURL(cert.url);
      return prev.filter((c) => c.id !== id);
    });
  };

  const updateField = (field: string, value: string | number) => {
    setCandidate((prev) => ({ ...prev, [field]: value }));
  };

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && candidate.skills.length < 10 && !candidate.skills.includes(trimmed)) {
      setCandidate((prev) => ({ ...prev, skills: [...prev.skills, trimmed] }));
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => {
    setCandidate((prev) => ({ ...prev, skills: prev.skills.filter((s) => s !== skill) }));
  };

  const addLanguage = () => {
    if (langName && !candidate.languages.some((l) => l.name === langName)) {
      setCandidate((prev) => ({
        ...prev,
        languages: [...prev.languages, { name: langName, level: langLevel as "Native" | "Fluent" | "Intermediate" }],
      }));
      setLangName("");
    }
  };

  const removeLanguage = (name: string) => {
    setCandidate((prev) => ({ ...prev, languages: prev.languages.filter((l) => l.name !== name) }));
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>

      <div className="space-y-6">
        {/* Profile Photo + Personal Info */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              Personal Information
            </h2>
            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-24 h-24 rounded-full bg-cvision-container border-2 border-border flex items-center justify-center">
                  <User className="w-10 h-10 text-muted-foreground" />
                </div>
                <Button variant="outline" size="sm">Change Picture</Button>
              </div>
              {/* Fields */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>First Name</Label>
                  <Input value={candidate.firstName} onChange={(e) => updateField("firstName", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Last Name</Label>
                  <Input value={candidate.lastName} onChange={(e) => updateField("lastName", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" value={candidate.email} onChange={(e) => updateField("email", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input value={candidate.phoneNumber} onChange={(e) => updateField("phoneNumber", e.target.value)} />
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
                <Select value={candidate.wilaya} onValueChange={(v) => updateField("wilaya", v)}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {WILAYAS.map((w) => (
                      <SelectItem key={w.code} value={w.name}>{w.code} - {w.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Postal Code</Label>
                <Input value={candidate.postalCode} onChange={(e) => updateField("postalCode", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Street Address</Label>
                <Input value={candidate.streetAddress ?? ""} onChange={(e) => updateField("streetAddress", e.target.value)} />
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
                <Select value={candidate.educationLevel} onValueChange={(v) => updateField("educationLevel", v)}>
                  <SelectTrigger className="w-full" ><SelectValue/></SelectTrigger>
                  <SelectContent>
                    {Object.values(EducationEnum).map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Field of Study</Label>
                <Select value={candidate.fieldOfStudy} onValueChange={(v) => updateField("fieldOfStudy", v)}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.values(DomainEnum).map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>University / School</Label>
                <Input value={candidate.university} onChange={(e) => updateField("university", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Graduation Year</Label>
                <Input value={candidate.graduationYear} onChange={(e) => updateField("graduationYear", parseInt(e.target.value) || 0)} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Experience */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Professional Experience</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Years of Experience</Label>
                <Select value={candidate.yearsOfExperience} onValueChange={(v) => updateField("yearsOfExperience", v)}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.values(ExperienceEnum).map((e) => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Current Position</Label>
                <Input value={candidate.currentPosition ?? ""} onChange={(e) => updateField("currentPosition", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Current Company</Label>
                <Input value={candidate.currentCompany ?? ""} onChange={(e) => updateField("currentCompany", e.target.value)} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skills */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Skills</h2>
            <div className="flex gap-2 mb-3">
              <Input placeholder="Add a skill..." value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }} />
              <Button variant="outline" onClick={addSkill} disabled={candidate.skills.length >= 10}><Plus className="w-4 h-4" /></Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {candidate.skills.map((skill) => (
                <span key={skill} className="flex items-center gap-1 bg-cvision-green-bg text-cvision-green text-sm px-3 py-1 rounded-full">
                  {skill}
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
                  {LANGUAGE_OPTIONS.filter((l) => !candidate.languages.some((la) => la.name === l)).map((lang) => (
                    <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={langLevel} onValueChange={setLangLevel}>
                <SelectTrigger className="w-full sm:w-[160px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PROFICIENCY_LEVELS.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={addLanguage}><Plus className="w-4 h-4" /></Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {candidate.languages.map((lang) => (
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
                Add Certificate
              </Button>
              <input
                ref={certInputRef}
                type="file"
                accept=".pdf,image/*"
                multiple
                className="hidden"
                onChange={handleAddCertificates}
              />
            </div>

            <div className="space-y-2">
              {/* Static original certificate */}
              <div className="flex items-center gap-3 p-3 bg-cvision-container rounded-lg border border-border">
                <FileText className="w-5 h-5 text-cvision-green flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">graduation_certificate.pdf</p>
                  <p className="text-xs text-muted-foreground">Uploaded during registration</p>
                </div>
              </div>

              {/* Uploaded certificates */}
              {certificates.map((cert) => (
                <div key={cert.id} className="flex items-center gap-3 p-3 bg-cvision-container rounded-lg border border-border">
                  <FileText className="w-5 h-5 text-cvision-green flex-shrink-0" />
                  <p className="text-sm font-medium flex-1 min-w-0 truncate">{cert.name}</p>
                  <a
                    href={cert.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-cvision-green transition-colors flex-shrink-0"
                    title="View"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => removeCertificate(cert.id)}
                    className="text-muted-foreground hover:text-cvision-red transition-colors flex-shrink-0"
                    title="Delete"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {certificates.length === 0 && (
                <p className="text-xs text-muted-foreground mt-2">No additional certificates uploaded.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button variant="outline">Cancel</Button>
          <Button>Save Changes</Button>
        </div>
      </div>
    </motion.div>
  );
}
