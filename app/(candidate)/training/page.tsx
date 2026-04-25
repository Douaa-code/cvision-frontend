"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Clock, CheckCircle2, Layers } from "lucide-react";
import {
  staggerContainerVariants,
  staggerItemVariants,
} from "@/lib/animations/variants";
import { apiClient } from "@/lib/api/client";

interface ApiTrainingItem {
  id: number;
  title: string;
  description: string;
  total_duration: number | null;
  job_offer_id: number;
  total_modules: number;
  completed_modules: number;
  progress_percent: number;
}

export default function TrainingPage() {
  const [trainings, setTrainings] = useState<ApiTrainingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const res = await apiClient.get<any>("/candidate/trainings");
        const data = res?.data ?? res;
        setTrainings(Array.isArray(data) ? data : []);
      } catch {
        // keep empty on error
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const inProgress = trainings.filter(
    (t) => t.progress_percent > 0 && t.progress_percent < 100
  ).length;
  const completed = trainings.filter((t) => t.progress_percent >= 100).length;
  const totalModules = trainings.reduce((sum, t) => sum + t.total_modules, 0);

  const stats = [
    { label: "Total Modules", value: String(totalModules), icon: Layers, color: "text-cvision-green" },
    { label: "In Progress", value: String(inProgress), icon: BookOpen, color: "text-cvision-green" },
    { label: "Completed", value: String(completed), icon: CheckCircle2, color: "text-cvision-green" },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cvision-green" />
      </div>
    );
  }

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

      {trainings.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              No training modules available yet. Trainings will be assigned after
              you confirm an accepted job offer.
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
            {trainings.map((training, i) => (
              <motion.div
                key={training.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="mb-3">
                      <h3 className="font-semibold text-lg truncate">{training.title}</h3>
                      {training.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                          {training.description}
                        </p>
                      )}
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-semibold">{training.progress_percent}% Complete</span>
                      </div>
                      <Progress value={training.progress_percent} className="h-2" />
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                      <span className="flex items-center gap-1.5">
                        <Layers className="w-4 h-4" />
                        {training.completed_modules}/{training.total_modules} modules
                      </span>
                      {!!training.total_duration && training.total_duration > 0 && (
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4" />
                          {training.total_duration} min
                        </span>
                      )}
                    </div>

                    <Link href={`/training/${training.id}`}>
                      {training.progress_percent >= 100 ? (
                        <Button variant="outline" className="w-full">Review</Button>
                      ) : training.progress_percent > 0 ? (
                        <Button className="w-full">Continue Training</Button>
                      ) : (
                        <Button className="w-full">Start Training</Button>
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
