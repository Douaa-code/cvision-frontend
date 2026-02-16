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
  Lock,
} from "lucide-react";
import { mockTrainings, mockTrainingProgress } from "@/lib/mock-data/training";

const lessonIcons = {
  video: PlayCircle,
  text: FileText,
  quiz: HelpCircle,
};

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

              <div className="space-y-2">
                {module.lessons.map((lesson) => {
                  const isCompleted = completedLessons.includes(lesson.lessonId);
                  const Icon = lessonIcons[lesson.type];

                  return (
                    <button
                      key={lesson.lessonId}
                      onClick={() => toggleLesson(lesson.lessonId)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                        isCompleted
                          ? "bg-cvision-green-bg"
                          : "bg-cvision-container hover:bg-cvision-bar"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-cvision-green flex-shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                      )}
                      <Icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {lesson.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {lesson.type === "video"
                            ? "Video"
                            : lesson.type === "text"
                            ? "Reading"
                            : "Quiz"}{" "}
                          &middot; {lesson.duration} min
                        </p>
                      </div>
                    </button>
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
