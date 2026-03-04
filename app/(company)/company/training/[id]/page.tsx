"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  BookOpen,
  Briefcase,
  Clock,
  PlayCircle,
  FileText,
  HelpCircle,
  Trash2,
  Tag,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { mockTrainings } from "@/lib/mock-data/training";
import { mockJobs } from "@/lib/mock-data/jobs";

const lessonIcons = {
  video: PlayCircle,
  text: FileText,
  quiz: HelpCircle,
};

const lessonLabels = {
  video: "Video",
  text: "Reading",
  quiz: "Quiz",
};

function getJobTitle(jobOfferId?: string): string {
  if (!jobOfferId) return "—";
  return mockJobs.find((j) => j.id === jobOfferId)?.jobTitle ?? "—";
}

export default function TrainingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const training = mockTrainings.find((t) => t.id === id);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  if (!training) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Training not found.</p>
        <Link href="/company/training">
          <Button variant="outline" className="mt-4">Back to Training</Button>
        </Link>
      </div>
    );
  }

  const totalLessons = training.modules.reduce(
    (acc, m) => acc + m.lessons.length,
    0
  );

  const handleRemove = () => {
    setShowDeleteDialog(false);
    router.push("/company/training");
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Link
        href="/company/training"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Training
      </Link>

      {/* Header card */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold mb-1">{training.title}</h1>
              {training.description && (
                <p className="text-sm text-muted-foreground mb-4">
                  {training.description}
                </p>
              )}
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4" />
                  {getJobTitle(training.jobOfferId)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Tag className="w-4 h-4" />
                  {training.domain}
                </span>
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" />
                  {training.modules.length} modules · {totalLessons} lessons
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {training.totalHours}h total
                </span>
              </div>
            </div>
            <Button
              variant="destructive"
              size="sm"
              className="shrink-0"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Remove Training
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Content preview */}
      <Card>
        <CardContent className="p-6">
          <h2 className="font-semibold text-lg mb-4">Content</h2>
          <div className="space-y-4">
            {training.modules.map((module, mi) => {
              const moduleDuration = module.lessons.reduce((acc, l) => acc + l.duration, 0);
              const completedCount = module.lessons.filter((l) => l.completed).length;
              return (
                <div key={module.moduleId}>
                  {mi > 0 && <Separator className="mb-4" />}
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-sm">
                      Module {mi + 1}: {module.moduleTitle}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cvision-green" />
                        {completedCount}/{module.lessons.length} completed
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {moduleDuration} min
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3 pl-4">
                    {module.lessons.map((lesson) => {
                      const Icon =
                        lessonIcons[lesson.type as keyof typeof lessonIcons] ??
                        FileText;
                      return (
                        <div
                          key={lesson.lessonId}
                          className="rounded-lg border border-border bg-cvision-container overflow-hidden"
                        >
                          {/* Lesson header */}
                          <div className="flex items-center gap-3 px-3 py-2.5 border-b border-border">
                            {lesson.completed ? (
                              <CheckCircle2 className="w-4 h-4 text-cvision-green shrink-0" />
                            ) : (
                              <Circle className="w-4 h-4 text-muted-foreground shrink-0" />
                            )}
                            <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
                            <span className="flex-1 text-sm font-medium">
                              {lesson.title}
                            </span>
                            <span className="text-xs text-muted-foreground shrink-0">
                              {lesson.duration} min
                            </span>
                          </div>

                          {/* Video */}
                          {lesson.type === "video" && lesson.videoUrl && lesson.videoUrl !== "#" && (
                            <div className="p-3">
                              <a
                                href={lesson.videoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-sm text-cvision-green hover:underline font-medium"
                              >
                                <PlayCircle className="w-4 h-4" />
                                Watch Video
                              </a>
                            </div>
                          )}

                          {/* Text */}
                          {lesson.type === "text" && lesson.content && (
                            <div className="p-3">
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                {lesson.content}
                              </p>
                            </div>
                          )}

                          {/* Quiz */}
                          {lesson.type === "quiz" && lesson.questionText && (
                            <div className="p-3 space-y-3">
                              <p className="text-sm font-medium">{lesson.questionText}</p>
                              <div className="space-y-1.5">
                                {lesson.options?.map((opt) => (
                                  <div
                                    key={opt.id}
                                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm border ${
                                      opt.id === lesson.correctAnswer
                                        ? "border-cvision-green bg-cvision-green/10 text-cvision-green font-medium"
                                        : "border-border bg-background"
                                    }`}
                                  >
                                    <span className="font-semibold w-5 shrink-0">{opt.id}.</span>
                                    <span>{opt.text}</span>
                                    {opt.id === lesson.correctAnswer && (
                                      <CheckCircle2 className="w-3.5 h-3.5 ml-auto shrink-0" />
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Delete confirmation dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Training</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove &ldquo;{training.title}&rdquo;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRemove}>
              Remove Training
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
