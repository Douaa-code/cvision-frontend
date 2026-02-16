"use client";

import { useState } from "react";
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
  Globe,
  MapPin,
  FileText,
  Check,
  Upload,
} from "lucide-react";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { mockCompany } from "@/lib/mock-data/company";
import { getWilayaOptions, getPostalCodeByWilaya } from "@/lib/constants/wilayas";
import { DOMAINS } from "@/lib/constants/domains";

export default function CompanyProfilePage() {
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  const [companyName, setCompanyName] = useState(mockCompany.companyName);
  const [domain, setDomain] = useState<string>(mockCompany.activityDomain);
  const [email, setEmail] = useState(mockCompany.professionalEmail);
  const [phone, setPhone] = useState(mockCompany.phoneNumber);
  const [website, setWebsite] = useState(mockCompany.website ?? "");
  const [wilaya, setWilaya] = useState<string>(mockCompany.wilaya);
  const [postalCode, setPostalCode] = useState(mockCompany.postalCode);
  const [description, setDescription] = useState(mockCompany.description);

  const handleWilayaChange = (value: string) => {
    setWilaya(value);
    const pc = getPostalCodeByWilaya(value);
    if (pc) setPostalCode(pc);
  };

  const handleSave = () => {
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleCancel = () => {
    setEditing(false);
    setCompanyName(mockCompany.companyName);
    setDomain(mockCompany.activityDomain);
    setEmail(mockCompany.professionalEmail);
    setPhone(mockCompany.phoneNumber);
    setWebsite(mockCompany.website ?? "");
    setWilaya(mockCompany.wilaya);
    setPostalCode(mockCompany.postalCode);
    setDescription(mockCompany.description);
  };

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

      {/* Company Header */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-xl bg-cvision-bar flex items-center justify-center text-xl font-bold text-muted-foreground">
              {companyName.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-xl font-bold">{companyName}</h2>
                <StatusBadge status={mockCompany.status} />
              </div>
              <p className="text-sm text-muted-foreground mb-2">{domain}</p>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {wilaya}
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  {email}
                </span>
                {website && (
                  <span className="flex items-center gap-1">
                    <Globe className="w-4 h-4" />
                    {website}
                  </span>
                )}
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
                    <p className="text-sm text-muted-foreground p-2">{companyName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Activity Domain</Label>
                  {editing ? (
                    <Select value={domain} onValueChange={setDomain}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {DOMAINS.map((d) => (
                          <SelectItem key={d} value={d}>{d}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-sm text-muted-foreground p-2">{domain}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Email</Label>
                  {editing ? (
                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  ) : (
                    <p className="text-sm text-muted-foreground p-2">{email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Phone</Label>
                  {editing ? (
                    <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
                  ) : (
                    <p className="text-sm text-muted-foreground p-2">{phone}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Website</Label>
                  {editing ? (
                    <Input value={website} onChange={(e) => setWebsite(e.target.value)} />
                  ) : (
                    <p className="text-sm text-muted-foreground p-2">{website || "—"}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Wilaya</Label>
                  {editing ? (
                    <Select value={wilaya} onValueChange={handleWilayaChange}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {getWilayaOptions().map((w) => (
                          <SelectItem key={w.value} value={w.value}>{w.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-sm text-muted-foreground p-2">{wilaya}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Postal Code</Label>
                  <p className="text-sm text-muted-foreground p-2">{postalCode}</p>
                </div>
              </div>

              <div className="space-y-2 mt-4">
                <Label>Description</Label>
                {editing ? (
                  <Textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
                ) : (
                  <p className="text-sm text-muted-foreground p-2 leading-relaxed">{description}</p>
                )}
              </div>

              {editing && (
                <div className="flex gap-3 mt-6">
                  <Button onClick={handleSave}>Save Changes</Button>
                  <Button variant="outline" onClick={handleCancel}>Cancel</Button>
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
                <div className="flex items-center justify-between p-4 bg-cvision-container rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-cvision-blue" />
                    <div>
                      <p className="text-sm font-medium">Commercial Register (RC)</p>
                      <p className="text-xs text-muted-foreground">{mockCompany.documents.commercialRegister.filename}</p>
                    </div>
                  </div>
                  <span className="text-xs text-cvision-green font-medium bg-cvision-green-bg px-2 py-1 rounded">Verified</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-cvision-container rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-cvision-blue" />
                    <div>
                      <p className="text-sm font-medium">NIF Document</p>
                      <p className="text-xs text-muted-foreground">{mockCompany.documents.nifDocument.filename}</p>
                    </div>
                  </div>
                  <span className="text-xs text-cvision-green font-medium bg-cvision-green-bg px-2 py-1 rounded">Verified</span>
                </div>

                {editing && (
                  <Button variant="outline" className="w-full mt-2">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Additional Document
                  </Button>
                )}
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
                  <p className="font-medium">{mockCompany.adminFullName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <p className="font-medium">{mockCompany.adminEmail}</p>
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
                  <span className="font-semibold">{mockCompany.jobOffersCount}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Applications</span>
                  <span className="font-semibold">{mockCompany.totalApplications}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Accepted</span>
                  <span className="font-semibold text-cvision-green">{mockCompany.acceptedCandidates}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Registered</span>
                  <span className="font-semibold">{mockCompany.registrationDate.toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
