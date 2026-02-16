"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PlayCircle, BookOpen, Clock } from "lucide-react";
import { mockTrainings, mockTrainingProgress } from "@/lib/mock-data/training";

export default function TrainingPage() {
  const activeTrainings = mockTrainings.map((training) => {
    const progress = mockTrainingProgress.find(
      (p) => p.trainingId === training.id
    );
    return { ...training, progress: progress?.progress ?? 0 };
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Training Modules</h1>

      {activeTrainings.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              No training modules available yet. Trainings will be assigned after
              you are accepted by a company.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {activeTrainings.map((training, i) => (
            <motion.div
              key={training.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                      <h2 className="text-lg font-semibold">{training.title}</h2>
                      {training.position && (
                        <p className="text-sm text-muted-foreground">
                          For Position: {training.position}
                        </p>
                      )}
                    </div>
                    {training.progress >= 100 ? (
                      <Link href={`/training/${training.id}`}>
                        <Button variant="outline">Review</Button>
                      </Link>
                    ) : (
                      <Link href={`/training/${training.id}`}>
                        <Button>Continue Training</Button>
                      </Link>
                    )}
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-semibold">{training.progress}% Complete</span>
                    </div>
                    <Progress value={training.progress} className="h-2" />
                  </div>

                  <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <PlayCircle className="w-4 h-4" />
                      {training.totalVideos} videos
                    </span>
                    <span className="flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4" />
                      {training.totalCourses} courses
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      {training.totalHours} hours
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
