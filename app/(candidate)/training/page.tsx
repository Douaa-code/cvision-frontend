"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PlayCircle, BookOpen, Clock, CheckCircle2 } from "lucide-react";
import { mockTrainings, mockTrainingProgress } from "@/lib/mock-data/training";
import {
  staggerContainerVariants,
  staggerItemVariants,
} from "@/lib/animations/variants";

export default function TrainingPage() {
  const activeTrainings = mockTrainings.map((training) => {
    const progress = mockTrainingProgress.find(
      (p) => p.trainingId === training.id
    );
    return { ...training, progress: progress?.progress ?? 0 };
  });

  const inProgress = activeTrainings.filter((t) => t.progress > 0 && t.progress < 100).length;
  const completed = activeTrainings.filter((t) => t.progress >= 100).length;

  const stats = [
    { label: "Total Modules", value: String(activeTrainings.length), icon: BookOpen, color: "text-cvision-blue" },
    { label: "In Progress", value: String(inProgress), icon: PlayCircle, color: "text-cvision-yellow" },
    { label: "Completed", value: String(completed), icon: CheckCircle2, color: "text-cvision-green" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Training Modules</h1>

      {/* Stats */}
      <motion.div
        variants={staggerContainerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
      >
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.label} variants={staggerItemVariants}>
              <Card>
                <CardContent className="p-6 flex items-center gap-4">
                  <div className={`p-3 rounded-lg bg-cvision-container ${stat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

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
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <h2 className="text-lg font-semibold">Your Trainings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeTrainings.map((training, i) => (
              <motion.div
                key={training.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-lg truncate">{training.title}</h3>
                        {training.position && (
                          <p className="text-sm text-muted-foreground">
                            For Position: {training.position}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-semibold">{training.progress}% Complete</span>
                      </div>
                      <Progress value={training.progress} className="h-2" />
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
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

                    <Link href={`/training/${training.id}`}>
                      {training.progress >= 100 ? (
                        <Button variant="outline" className="w-full">Review</Button>
                      ) : (
                        <Button className="w-full">Continue Training</Button>
                      )}
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
