"use client";

import { use, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  PlayCircle,
  FileText,
  HelpCircle,
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
} from "lucide-react";
import { mockTrainings, mockTrainingProgress } from "@/lib/mock-data/training";

type LessonType = "video" | "text" | "quiz";

const lessonIcons: Record<LessonType, React.ElementType> = {
  video: PlayCircle,
  text: FileText,
  quiz: HelpCircle,
};

const lessonLabels: Record<LessonType, string> = {
  video: "Video",
  text: "Reading",
  quiz: "Quiz",
};

function VideoBlock({ title, duration }: { title: string; duration: number }) {
  return (
    <div className="mt-3 rounded-lg overflow-hidden border border-border">
      <div className="relative w-full h-36 bg-gradient-to-br from-gray-800 to-gray-600 flex items-center justify-center">
        <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
          <PlayCircle className="w-8 h-8 text-white" />
        </div>
        <span className="absolute bottom-2 right-3 text-xs text-white/80 bg-black/40 px-2 py-0.5 rounded">
          {duration} min
        </span>
      </div>
      <div className="p-3 bg-cvision-container">
        <p className="text-sm font-medium">{title}</p>
      </div>
    </div>
  );
}

function TextBlock({ title }: { title: string }) {
  return (
    <div className="mt-3 rounded-lg border border-border overflow-hidden">
      <div className="p-4 bg-cvision-container flex items-start gap-3">
        <FileText className="w-5 h-5 text-cvision-blue mt-0.5 flex-shrink-0" />
        <div className="space-y-1.5 flex-1">
          <p className="text-sm font-medium">{title}</p>
          <div className="space-y-1">
            <div className="h-2 rounded bg-border w-full" />
            <div className="h-2 rounded bg-border w-4/5" />
            <div className="h-2 rounded bg-border w-3/5" />
          </div>
        </div>
      </div>
    </div>
  );
}

function QuizBlock({ title }: { title: string }) {
  const options = ["Option A", "Option B", "Option C", "Option D"];
  return (
    <div className="mt-3 rounded-lg border border-border overflow-hidden">
      <div className="p-4 bg-cvision-container">
        <div className="flex items-center gap-2 mb-3">
          <HelpCircle className="w-4 h-4 text-cvision-yellow" />
          <p className="text-sm font-medium">{title}</p>
        </div>
        <div className="space-y-2">
          {options.map((opt) => (
            <div
              key={opt}
              className="flex items-center gap-2 p-2 rounded-lg border border-border bg-background text-sm text-muted-foreground"
            >
              <div className="w-4 h-4 rounded-full border-2 border-muted-foreground flex-shrink-0" />
              {opt}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ImageBlock() {
  return (
    <div className="mt-3 rounded-lg border border-border overflow-hidden">
      <div className="w-full h-28 bg-gradient-to-br from-cvision-container to-cvision-bar flex items-center justify-center">
        <ImageIcon className="w-8 h-8 text-muted-foreground" />
      </div>
    </div>
  );
}

export default function TrainingContentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const training = mockTrainings.find((t) => t.id === id) ?? mockTrainings[0];
  const progressData = mockTrainingProgress.find(
    (p) => p.trainingId === training.id
  );
  const [completedLessons, setCompletedLessons] = useState<string[]>(
    progressData?.completedLessons ?? []
  );
  const [expandedLesson, setExpandedLesson] = useState<string | null>(null);

  const totalLessons = training.modules.reduce(
    (acc, m) => acc + m.lessons.length,
    0
  );
  const progressPercent = Math.round(
    (completedLessons.length / totalLessons) * 100
  );

  const toggleLesson = (lessonId: string) => {
    setCompletedLessons((prev) =>
      prev.includes(lessonId)
        ? prev.filter((id) => id !== lessonId)
        : [...prev, lessonId]
    );
  };

  const toggleExpand = (lessonId: string) => {
    setExpandedLesson((prev) => (prev === lessonId ? null : lessonId));
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Link
        href="/training"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Training
      </Link>

      {/* Header */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold mb-1">{training.title}</h1>
          <p className="text-sm text-muted-foreground mb-4">
            {training.description}
          </p>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Overall Progress</span>
            <span className="font-semibold">{progressPercent}%</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </CardContent>
      </Card>

      {/* Modules */}
      <div className="space-y-4">
        {training.modules.map((module, mi) => (
          <Card key={module.moduleId}>
            <CardContent className="p-6">
              <h2 className="font-semibold text-lg mb-1">
                Module {mi + 1}: {module.moduleTitle}
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                {module.lessons.length} lessons
              </p>
              <Separator className="mb-4" />

              <div className="space-y-3">
                {module.lessons.map((lesson) => {
                  const isCompleted = completedLessons.includes(lesson.lessonId);
                  const isExpanded = expandedLesson === lesson.lessonId;
                  const Icon = lessonIcons[lesson.type as LessonType] ?? FileText;

                  return (
                    <div
                      key={lesson.lessonId}
                      className={`rounded-lg border transition-colors ${
                        isCompleted
                          ? "border-cvision-green/30 bg-cvision-green-bg"
                          : "border-border bg-cvision-container"
                      }`}
                    >
                      {/* Lesson header row */}
                      <div className="flex items-center gap-3 p-3">
                        <button
                          onClick={() => toggleLesson(lesson.lessonId)}
                          className="flex-shrink-0"
                          aria-label="Toggle complete"
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="w-5 h-5 text-cvision-green" />
                          ) : (
                            <Circle className="w-5 h-5 text-muted-foreground" />
                          )}
                        </button>
                        <Icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{lesson.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {lessonLabels[lesson.type as LessonType] ?? lesson.type} &middot; {lesson.duration} min
                          </p>
                        </div>
                        <button
                          onClick={() => toggleExpand(lesson.lessonId)}
                          className="text-muted-foreground hover:text-foreground flex-shrink-0"
                          aria-label="Expand content"
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      </div>

                      {/* Modular content block (expanded) */}
                      {isExpanded && (
                        <div className="px-3 pb-3">
                          {lesson.type === "video" && (
                            <VideoBlock title={lesson.title} duration={lesson.duration} />
                          )}
                          {lesson.type === "text" && (
                            <>
                              <TextBlock title={lesson.title} />
                              <ImageBlock />
                            </>
                          )}
                          {lesson.type === "quiz" && (
                            <QuizBlock title={lesson.title} />
                          )}
                          <div className="mt-3 flex justify-end">
                            <Button
                              size="sm"
                              variant={isCompleted ? "outline" : "default"}
                              onClick={() => toggleLesson(lesson.lessonId)}
                            >
                              {isCompleted ? "Mark Incomplete" : "Mark Complete"}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}
