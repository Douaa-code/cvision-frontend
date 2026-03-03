"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Trash2,
  CheckCircle2,
  GripVertical,
  PlayCircle,
  FileText,
  HelpCircle,
  Image,
  Paperclip,
  BookOpen,
  Upload,
} from "lucide-react";
import { DOMAINS } from "@/lib/constants/domains";
import { mockJobs } from "@/lib/mock-data/jobs";

const companyJobs = mockJobs.filter((j) => j.companyId === "c1");

type BlockType = "video" | "text" | "image" | "file" | "quiz";

type QuizOption = { id: "A" | "B" | "C" | "D"; text: string };

type ContentBlock = {
  id: string;
  type: BlockType;
  title: string;
  videoUrl?: string;
  duration?: string;
  content?: string;
  uploadedFile?: File | null;
  questionText?: string;
  options?: QuizOption[];
  correctAnswer?: "A" | "B" | "C" | "D";
};

type ModuleDraft = {
  id: string;
  title: string;
  blocks: ContentBlock[];
};

const emptyBlock = (type: BlockType = "video"): ContentBlock => ({
  id: `b-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  type,
  title: "",
  videoUrl: "",
  duration: "15",
  content: "",
  uploadedFile: null,
  questionText: "",
  options: [
    { id: "A", text: "" },
    { id: "B", text: "" },
    { id: "C", text: "" },
    { id: "D", text: "" },
  ],
  correctAnswer: "A",
});

const emptyModule = (): ModuleDraft => ({
  id: `m-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  title: "",
  blocks: [emptyBlock("video")],
});

const blockTypeOptions: { value: BlockType; label: string; icon: React.ElementType }[] = [
  { value: "video", label: "Video", icon: PlayCircle },
  { value: "text", label: "Text", icon: FileText },
  { value: "image", label: "Image", icon: Image },
  { value: "file", label: "File", icon: Paperclip },
  { value: "quiz", label: "MCQ Quiz", icon: HelpCircle },
];

export default function CreateTrainingPage() {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);

  const [jobOffer, setJobOffer] = useState("");
  const [title, setTitle] = useState("");
  const [domain, setDomain] = useState("");
  const [description, setDescription] = useState("");
  const [modules, setModules] = useState<ModuleDraft[]>([emptyModule()]);

  const addModule = () => setModules((prev) => [...prev, emptyModule()]);

  const removeModule = (id: string) => {
    if (modules.length <= 1) return;
    setModules((prev) => prev.filter((m) => m.id !== id));
  };

  const updateModuleTitle = (id: string, value: string) =>
    setModules((prev) => prev.map((m) => (m.id === id ? { ...m, title: value } : m)));

  const addBlock = (moduleId: string, type: BlockType) => {
    setModules((prev) =>
      prev.map((m) =>
        m.id === moduleId ? { ...m, blocks: [...m.blocks, emptyBlock(type)] } : m
      )
    );
  };

  const removeBlock = (moduleId: string, blockId: string) => {
    setModules((prev) =>
      prev.map((m) =>
        m.id === moduleId
          ? { ...m, blocks: m.blocks.filter((b) => b.id !== blockId) }
          : m
      )
    );
  };

  const updateBlock = (moduleId: string, blockId: string, updates: Partial<ContentBlock>) => {
    setModules((prev) =>
      prev.map((m) =>
        m.id === moduleId
          ? {
              ...m,
              blocks: m.blocks.map((b) =>
                b.id === blockId ? { ...b, ...updates } : b
              ),
            }
          : m
      )
    );
  };

  const updateBlockOption = (
    moduleId: string,
    blockId: string,
    optionId: string,
    text: string
  ) => {
    setModules((prev) =>
      prev.map((m) =>
        m.id === moduleId
          ? {
              ...m,
              blocks: m.blocks.map((b) =>
                b.id === blockId
                  ? {
                      ...b,
                      options: b.options?.map((o) =>
                        o.id === optionId ? { ...o, text } : o
                      ),
                    }
                  : b
              ),
            }
          : m
      )
    );
  };

  const totalBlocks = modules.reduce((acc, m) => acc + m.blocks.length, 0);
  const totalDuration = modules.reduce(
    (acc, m) =>
      acc + m.blocks.reduce((a, b) => a + (parseInt(b.duration ?? "0", 10) || 0), 0),
    0
  );

  const handleSubmit = () => setSubmitted(true);

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
            <h1 className="text-2xl font-bold mb-2">Training Created!</h1>
            <p className="text-muted-foreground mb-2">
              &ldquo;{title}&rdquo; with {modules.length} module
              {modules.length !== 1 ? "s" : ""} and {totalBlocks} content block
              {totalBlocks !== 1 ? "s" : ""}.
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              The training program is now available for assigned candidates.
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => router.push("/company/training")}>
                View Trainings
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setSubmitted(false);
                  setModules([emptyModule()]);
                  setTitle("");
                  setDescription("");
                  setJobOffer("");
                  setDomain("");
                }}
              >
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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Create Training Program</h1>
        <Link href="/company/training">
          <Button variant="outline">
            <BookOpen className="w-4 h-4 mr-2" />
            View Trainings
          </Button>
        </Link>
      </div>

      {/* Training Info */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <h2 className="font-semibold text-lg mb-4">Training Information</h2>
          <Separator className="mb-4" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Job Offer</Label>
              <Select value={jobOffer} onValueChange={setJobOffer}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose Job Offer" />
                </SelectTrigger>
                <SelectContent>
                  {companyJobs.map((j) => (
                    <SelectItem key={j.id} value={j.id}>{j.jobTitle}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Domain *</Label>
              <Select value={domain} onValueChange={setDomain}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select domain" />
                </SelectTrigger>
                <SelectContent>
                  {DOMAINS.map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Training Title *</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. PHP Development Onboarding"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Description</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the training program..."
                rows={3}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modules */}
      <div className="space-y-4 mb-6">
        {modules.map((mod, mi) => (
          <Card key={mod.id}>
            <CardContent className="p-6">
              {/* Module header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <GripVertical className="w-4 h-4 text-muted-foreground" />
                  <h3 className="font-semibold">Module {mi + 1}</h3>
                </div>
                {modules.length > 1 && (
                  <Button variant="ghost" size="sm" onClick={() => removeModule(mod.id)}>
                    <Trash2 className="w-4 h-4 text-cvision-red" />
                  </Button>
                )}
              </div>

              <div className="space-y-2 mb-4">
                <Label>Module Title *</Label>
                <Input
                  value={mod.title}
                  onChange={(e) => updateModuleTitle(mod.id, e.target.value)}
                  placeholder="e.g. Introduction to Company Standards"
                />
              </div>

              <Separator className="mb-4" />

              {/* Content Blocks */}
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
                Content Blocks
              </p>
              <div className="space-y-3">
                {mod.blocks.map((block, bi) => {
                  const blockMeta = blockTypeOptions.find((o) => o.value === block.type)!;
                  const BlockIcon = blockMeta.icon;

                  return (
                    <div key={block.id} className="border border-border rounded-lg overflow-hidden">
                      {/* Block header bar */}
                      <div className="flex items-center gap-3 px-4 py-2.5 bg-cvision-container border-b border-border">
                        <BlockIcon className="w-4 h-4 text-muted-foreground shrink-0" />
                        <span className="text-sm text-muted-foreground flex-1">
                          Block {bi + 1}
                        </span>
                        <Select
                          value={block.type}
                          onValueChange={(v) =>
                            updateBlock(mod.id, block.id, { type: v as BlockType })
                          }
                        >
                          <SelectTrigger className="w-36 h-7 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {blockTypeOptions.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {mod.blocks.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={() => removeBlock(mod.id, block.id)}
                          >
                            <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />
                          </Button>
                        )}
                      </div>

                      {/* Block body */}
                      <div className="p-4 space-y-3">
                        <div className="space-y-2">
                          <Label className="text-xs">Title *</Label>
                          <Input
                            value={block.title}
                            onChange={(e) =>
                              updateBlock(mod.id, block.id, { title: e.target.value })
                            }
                            placeholder={`${blockMeta.label} title`}
                          />
                        </div>

                        {/* Video */}
                        {block.type === "video" && (
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="space-y-2 sm:col-span-2">
                              <Label className="text-xs">Video URL</Label>
                              <Input
                                value={block.videoUrl ?? ""}
                                onChange={(e) =>
                                  updateBlock(mod.id, block.id, { videoUrl: e.target.value })
                                }
                                placeholder="https://youtube.com/watch?v=..."
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-xs">Duration (min)</Label>
                              <Input
                                value={block.duration ?? ""}
                                onChange={(e) =>
                                  updateBlock(mod.id, block.id, { duration: e.target.value })
                                }
                                placeholder="15"
                              />
                            </div>
                          </div>
                        )}

                        {/* Text */}
                        {block.type === "text" && (
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="space-y-2 sm:col-span-2">
                              <Label className="text-xs">Content</Label>
                              <Textarea
                                value={block.content ?? ""}
                                onChange={(e) =>
                                  updateBlock(mod.id, block.id, { content: e.target.value })
                                }
                                placeholder="Write your reading content here..."
                                rows={4}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-xs">Duration (min)</Label>
                              <Input
                                value={block.duration ?? ""}
                                onChange={(e) =>
                                  updateBlock(mod.id, block.id, { duration: e.target.value })
                                }
                                placeholder="10"
                              />
                            </div>
                          </div>
                        )}

                        {/* Image */}
                        {block.type === "image" && (
                          <div className="space-y-2">
                            <Label className="text-xs">Upload Image</Label>
                            {block.uploadedFile ? (
                              <div className="flex items-center justify-between bg-cvision-green-bg rounded-lg p-3">
                                <span className="text-sm text-cvision-green flex items-center gap-2">
                                  <Image className="w-4 h-4" />
                                  {block.uploadedFile.name}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateBlock(mod.id, block.id, { uploadedFile: null })
                                  }
                                  className="text-xs text-muted-foreground hover:text-cvision-red transition-colors"
                                >
                                  Remove
                                </button>
                              </div>
                            ) : (
                              <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-cvision-green transition-colors">
                                <Upload className="w-5 h-5 text-muted-foreground mb-1" />
                                <span className="text-xs text-muted-foreground">
                                  Click to upload (JPG, PNG, WebP)
                                </span>
                                <input
                                  type="file"
                                  className="hidden"
                                  accept=".jpg,.jpeg,.png,.webp,.gif"
                                  onChange={(e) =>
                                    updateBlock(mod.id, block.id, {
                                      uploadedFile: e.target.files?.[0] ?? null,
                                    })
                                  }
                                />
                              </label>
                            )}
                          </div>
                        )}

                        {/* File */}
                        {block.type === "file" && (
                          <div className="space-y-2">
                            <Label className="text-xs">Upload File</Label>
                            {block.uploadedFile ? (
                              <div className="flex items-center justify-between bg-cvision-green-bg rounded-lg p-3">
                                <span className="text-sm text-cvision-green flex items-center gap-2">
                                  <Paperclip className="w-4 h-4" />
                                  {block.uploadedFile.name}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateBlock(mod.id, block.id, { uploadedFile: null })
                                  }
                                  className="text-xs text-muted-foreground hover:text-cvision-red transition-colors"
                                >
                                  Remove
                                </button>
                              </div>
                            ) : (
                              <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-cvision-green transition-colors">
                                <Upload className="w-5 h-5 text-muted-foreground mb-1" />
                                <span className="text-xs text-muted-foreground">
                                  Click to upload (PDF, DOC, PPTX, ZIP...)
                                </span>
                                <input
                                  type="file"
                                  className="hidden"
                                  accept=".pdf,.doc,.docx,.pptx,.xlsx,.zip"
                                  onChange={(e) =>
                                    updateBlock(mod.id, block.id, {
                                      uploadedFile: e.target.files?.[0] ?? null,
                                    })
                                  }
                                />
                              </label>
                            )}
                          </div>
                        )}

                        {/* MCQ Quiz */}
                        {block.type === "quiz" && (
                          <div className="space-y-3">
                            <div className="space-y-2">
                              <Label className="text-xs">Question *</Label>
                              <Textarea
                                value={block.questionText ?? ""}
                                onChange={(e) =>
                                  updateBlock(mod.id, block.id, {
                                    questionText: e.target.value,
                                  })
                                }
                                placeholder="Enter your quiz question..."
                                rows={2}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-xs">Options *</Label>
                              {block.options?.map((opt) => (
                                <div key={opt.id} className="flex items-center gap-3">
                                  <span className="text-sm font-semibold w-6 text-center">
                                    {opt.id}.
                                  </span>
                                  <Input
                                    value={opt.text}
                                    onChange={(e) =>
                                      updateBlockOption(mod.id, block.id, opt.id, e.target.value)
                                    }
                                    placeholder={`Option ${opt.id}`}
                                    className="flex-1"
                                  />
                                </div>
                              ))}
                            </div>
                            <div className="space-y-2">
                              <Label className="text-xs">Correct Answer *</Label>
                              <RadioGroup
                                value={block.correctAnswer ?? "A"}
                                onValueChange={(v) =>
                                  updateBlock(mod.id, block.id, {
                                    correctAnswer: v as "A" | "B" | "C" | "D",
                                  })
                                }
                                className="flex gap-4"
                              >
                                {(["A", "B", "C", "D"] as const).map((letter) => (
                                  <div key={letter} className="flex items-center gap-1.5">
                                    <RadioGroupItem
                                      value={letter}
                                      id={`${block.id}-correct-${letter}`}
                                    />
                                    <Label
                                      htmlFor={`${block.id}-correct-${letter}`}
                                      className="cursor-pointer text-sm"
                                    >
                                      {letter}
                                    </Label>
                                  </div>
                                ))}
                              </RadioGroup>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Add block buttons */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {blockTypeOptions.map((opt) => {
                    const Icon = opt.icon;
                    return (
                      <Button
                        key={opt.value}
                        variant="outline"
                        size="sm"
                        onClick={() => addBlock(mod.id, opt.value)}
                        className="text-xs"
                      >
                        <Icon className="w-3.5 h-3.5 mr-1.5" />
                        {opt.label}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button variant="outline" onClick={addModule} className="w-full mb-6">
        <Plus className="w-4 h-4 mr-2" />
        Add Module
      </Button>

      {/* Summary & Submit */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {modules.length} module{modules.length !== 1 ? "s" : ""} &middot;{" "}
              {totalBlocks} block{totalBlocks !== 1 ? "s" : ""} &middot; ~
              {Math.round((totalDuration / 60) * 10) / 10}h total
            </span>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => router.push("/company/training")}>
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={
                  !title ||
                  !domain ||
                  modules.some((m) => !m.title || m.blocks.some((b) => !b.title))
                }
              >
                Create Training
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
