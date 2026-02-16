"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, CheckCircle2, GripVertical, PlayCircle, FileText, HelpCircle } from "lucide-react";
import { DOMAINS } from "@/lib/constants/domains";

type LessonDraft = {
  id: string;
  title: string;
  type: "video" | "text" | "quiz";
  duration: string;
};

type ModuleDraft = {
  id: string;
  title: string;
  lessons: LessonDraft[];
};

const emptyLesson = (): LessonDraft => ({
  id: `l-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  title: "",
  type: "video",
  duration: "15",
});

const emptyModule = (): ModuleDraft => ({
  id: `m-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  title: "",
  lessons: [emptyLesson()],
});

const lessonTypeIcons = {
  video: PlayCircle,
  text: FileText,
  quiz: HelpCircle,
};

export default function CreateTrainingPage() {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);

  const [title, setTitle] = useState("");
  const [domain, setDomain] = useState("");
  const [description, setDescription] = useState("");
  const [position, setPosition] = useState("");
  const [modules, setModules] = useState<ModuleDraft[]>([emptyModule()]);

  const addModule = () => {
    setModules((prev) => [...prev, emptyModule()]);
  };

  const removeModule = (id: string) => {
    if (modules.length <= 1) return;
    setModules((prev) => prev.filter((m) => m.id !== id));
  };

  const updateModule = (id: string, title: string) => {
    setModules((prev) => prev.map((m) => (m.id === id ? { ...m, title } : m)));
  };

  const addLesson = (moduleId: string) => {
    setModules((prev) =>
      prev.map((m) =>
        m.id === moduleId ? { ...m, lessons: [...m.lessons, emptyLesson()] } : m
      )
    );
  };

  const removeLesson = (moduleId: string, lessonId: string) => {
    setModules((prev) =>
      prev.map((m) =>
        m.id === moduleId
          ? { ...m, lessons: m.lessons.filter((l) => l.id !== lessonId) }
          : m
      )
    );
  };

  const updateLesson = (moduleId: string, lessonId: string, field: keyof LessonDraft, value: string) => {
    setModules((prev) =>
      prev.map((m) =>
        m.id === moduleId
          ? {
              ...m,
              lessons: m.lessons.map((l) =>
                l.id === lessonId ? { ...l, [field]: value } : l
              ),
            }
          : m
      )
    );
  };

  const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const totalDuration = modules.reduce(
    (acc, m) => acc + m.lessons.reduce((a, l) => a + (parseInt(l.duration, 10) || 0), 0),
    0
  );

  const handleSubmit = () => {
    setSubmitted(true);
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
            <h1 className="text-2xl font-bold mb-2">Training Created!</h1>
            <p className="text-muted-foreground mb-2">
              &ldquo;{title}&rdquo; with {modules.length} module{modules.length !== 1 ? "s" : ""} and {totalLessons} lesson{totalLessons !== 1 ? "s" : ""}.
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              The training program is now available for assigned candidates.
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => router.push("/company/dashboard")}>
                Back to Dashboard
              </Button>
              <Button variant="outline" onClick={() => { setSubmitted(false); setModules([emptyModule()]); setTitle(""); setDescription(""); }}>
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
      <h1 className="text-2xl font-bold mb-6">Create Training Program</h1>

      {/* Training Info */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <h2 className="font-semibold text-lg mb-4">Training Information</h2>
          <Separator className="mb-4" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label>Training Title *</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. PHP Development Onboarding" />
            </div>
            <div className="space-y-2">
              <Label>Domain *</Label>
              <Select value={domain} onValueChange={setDomain}>
                <SelectTrigger><SelectValue placeholder="Select domain" /></SelectTrigger>
                <SelectContent>
                  {DOMAINS.map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>For Position (optional)</Label>
              <Input value={position} onChange={(e) => setPosition(e.target.value)} placeholder="e.g. Senior PHP Developer" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Description</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the training program..." rows={3} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modules */}
      <div className="space-y-4 mb-6">
        {modules.map((mod, mi) => (
          <Card key={mod.id}>
            <CardContent className="p-6">
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
                  onChange={(e) => updateModule(mod.id, e.target.value)}
                  placeholder="e.g. Introduction to Company Standards"
                />
              </div>

              <Separator className="mb-4" />

              {/* Lessons */}
              <div className="space-y-3">
                <Label className="text-sm text-muted-foreground">Lessons</Label>
                {mod.lessons.map((lesson, li) => {
                  const LessonIcon = lessonTypeIcons[lesson.type];
                  return (
                    <div key={lesson.id} className="flex items-start gap-3 p-3 bg-cvision-container rounded-lg">
                      <LessonIcon className="w-4 h-4 text-muted-foreground mt-2.5" />
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <Input
                          value={lesson.title}
                          onChange={(e) => updateLesson(mod.id, lesson.id, "title", e.target.value)}
                          placeholder={`Lesson ${li + 1} title`}
                          className="sm:col-span-1"
                        />
                        <Select
                          value={lesson.type}
                          onValueChange={(v) => updateLesson(mod.id, lesson.id, "type", v)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="video">Video</SelectItem>
                            <SelectItem value="text">Reading</SelectItem>
                            <SelectItem value="quiz">Quiz</SelectItem>
                          </SelectContent>
                        </Select>
                        <div className="flex items-center gap-2">
                          <Input
                            value={lesson.duration}
                            onChange={(e) => updateLesson(mod.id, lesson.id, "duration", e.target.value)}
                            placeholder="min"
                            className="w-20"
                          />
                          <span className="text-xs text-muted-foreground">min</span>
                          {mod.lessons.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeLesson(mod.id, lesson.id)}
                            >
                              <Trash2 className="w-3 h-3 text-muted-foreground" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => addLesson(mod.id)}
                  className="text-cvision-green"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Lesson
                </Button>
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
              {modules.length} module{modules.length !== 1 ? "s" : ""} &middot; {totalLessons} lesson{totalLessons !== 1 ? "s" : ""} &middot; ~{Math.round(totalDuration / 60 * 10) / 10} hours
            </span>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => router.push("/company/dashboard")}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={!title || !domain || modules.some((m) => !m.title || m.lessons.some((l) => !l.title))}>
                Create Training
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
