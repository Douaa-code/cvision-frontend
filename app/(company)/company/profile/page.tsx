"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Building2,
  Mail,
  MapPin,
  FileText,
  Check,
  ShieldAlert,
} from "lucide-react";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { companyApi, type ApiCompanyProfile } from "@/lib/api/company";
import { getWilayaOptions, getPostalCodeByWilaya } from "@/lib/constants/wilayas";
import { DOMAINS } from "@/lib/constants/domains";

export default function CompanyProfilePage() {
  const [profile, setProfile] = useState<ApiCompanyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Editable fields
  const [companyName, setCompanyName] = useState("");
  const [domain, setDomain] = useState("");
  const [phone, setPhone] = useState("");
  const [wilaya, setWilaya] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    companyApi.getProfile()
      .then((r) => {
        const p = r.data;
        setProfile(p);
        resetForm(p);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  function resetForm(p: ApiCompanyProfile) {
    setCompanyName(p.company_name ?? "");
    setDomain(p.domain ?? "");
    setPhone(p.phone ?? "");
    setWilaya(p.wilaya ?? "");
    setPostalCode(p.postal_code ?? "");
    setStreetAddress(p.street_address ?? "");
    setDescription(p.description ?? "");
  }

  const handleWilayaChange = (value: string) => {
    setWilaya(value);
    const pc = getPostalCodeByWilaya(value);
    if (pc) setPostalCode(pc);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const r = await companyApi.updateProfile({
        company_name:   companyName,
        domain,
        phone,
        wilaya,
        postal_code:    postalCode,
        street_address: streetAddress,
        description,
      });
      setProfile(r.data);
      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) resetForm(profile);
    setEditing(false);
    setError(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cvision-green" />
      </div>
    );
  }

  if (!profile) {
    return <p className="text-muted-foreground p-6">Failed to load profile.</p>;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Company Profile</h1>
        {!editing && (
          <Button onClick={() => setEditing(true)}>Edit Profile</Button>
        )}
      </div>

      {saved && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 flex items-center gap-2 bg-cvision-green-bg text-cvision-green px-4 py-3 rounded-lg text-sm font-medium"
        >
          <Check className="w-4 h-4" />
          Profile updated successfully.
        </motion.div>
      )}

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Company Header */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-xl bg-cvision-bar flex items-center justify-center text-xl font-bold text-muted-foreground">
              {companyName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-xl font-bold">{companyName}</h2>
                <StatusBadge status={profile.status === "approved" ? "Active" : profile.status === "pending" ? "Pending" : "Rejected"} />
              </div>
              <p className="text-sm text-muted-foreground mb-2">{domain}</p>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {wilaya}{postalCode ? ` - ${postalCode}` : ""}
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  {profile.user.email}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Company Information
              </h3>
              <Separator className="mb-4" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Company Name</Label>
                  {editing ? (
                    <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                  ) : (
                    <p className="text-sm text-muted-foreground p-2">{companyName || "—"}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Activity Domain</Label>
                  {editing ? (
                    <Select value={domain} onValueChange={setDomain}>
                      <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {DOMAINS.map((d) => (
                          <SelectItem key={d} value={d}>{d}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-sm text-muted-foreground p-2">{domain || "—"}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Email</Label>
                  <p className="text-sm text-muted-foreground p-2">{profile.user.email}</p>
                </div>

                <div className="space-y-2">
                  <Label>Phone</Label>
                  {editing ? (
                    <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
                  ) : (
                    <p className="text-sm text-muted-foreground p-2">{phone || "—"}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Wilaya</Label>
                  {editing ? (
                    <Select value={wilaya} onValueChange={handleWilayaChange}>
                      <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {getWilayaOptions().map((w) => (
                          <SelectItem key={w.value} value={w.value}>{w.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-sm text-muted-foreground p-2">{wilaya || "—"}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Postal Code</Label>
                  {editing ? (
                    <Input value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
                  ) : (
                    <p className="text-sm text-muted-foreground p-2">{postalCode || "—"}</p>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label>Street Address</Label>
                  {editing ? (
                    <Input value={streetAddress} onChange={(e) => setStreetAddress(e.target.value)} placeholder="e.g. 12 Rue Didouche Mourad" />
                  ) : (
                    <p className="text-sm text-muted-foreground p-2">{streetAddress || "—"}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2 mt-4">
                <Label>Description</Label>
                {editing ? (
                  <Textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
                ) : (
                  <p className="text-sm text-muted-foreground p-2 leading-relaxed">{description || "—"}</p>
                )}
              </div>

              {editing && (
                <div className="flex gap-3 mt-6">
                  <Button onClick={handleSave} disabled={saving}>
                    {saving ? "Saving…" : "Save Changes"}
                  </Button>
                  <Button variant="outline" onClick={handleCancel} disabled={saving}>Cancel</Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Documents */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Legal Documents
              </h3>
              <Separator className="mb-4" />

              <div className="space-y-3">
                {(profile.documents ?? []).length === 0 ? (
                  <p className="text-sm text-muted-foreground">No documents uploaded.</p>
                ) : (
                  (profile.documents ?? []).map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-4 bg-cvision-container rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-cvision-blue" />
                        <div>
                          <p className="text-sm font-medium">{doc.document_type}</p>
                          <p className="text-xs text-muted-foreground">
                            {doc.file_path.split("/").pop()}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-cvision-green font-medium bg-cvision-green-bg px-2 py-1 rounded">
                        Uploaded
                      </span>
                    </div>
                  ))
                )}

                <div className="flex items-start gap-3 mt-4 p-4 bg-[#FDEDEB] border border-cvision-red/20 rounded-lg">
                  <ShieldAlert className="w-5 h-5 text-cvision-red flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-cvision-red leading-relaxed">
                    For security reasons, legal documents cannot be modified. Please contact CVision administration for any changes.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-3">Account Administrator</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Name</p>
                  <p className="font-medium">{profile.user.name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <p className="font-medium">{profile.user.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-3">Statistics</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Job Offers</span>
                  <span className="font-semibold">{profile.jobs_count}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Applications</span>
                  <span className="font-semibold">{profile.total_applications}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Accepted</span>
                  <span className="font-semibold text-cvision-green">{profile.accepted_candidates}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Registered</span>
                  <span className="font-semibold">
                    {profile.created_at ? new Date(profile.created_at).toLocaleDateString() : "—"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
