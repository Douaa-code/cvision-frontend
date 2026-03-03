"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, BookOpen, Users, Trophy } from "lucide-react";
import { mockTrainings, mockTrainingProgress } from "@/lib/mock-data/training";
import { mockJobs } from "@/lib/mock-data/jobs";
import {
  staggerContainerVariants,
  staggerItemVariants,
} from "@/lib/animations/variants";

const companyTrainings = mockTrainings.filter((t) => t.companyId === "c1");

function getTrainingType(training: (typeof mockTrainings)[0]): string {
  const types = new Set(
    training.modules.flatMap((m) => m.lessons.map((l) => l.type))
  );
  if (types.size > 1) return "Mixed";
  if (types.has("video")) return "Video";
  if (types.has("text")) return "Text";
  if (types.has("quiz")) return "MCQ";
  return "Mixed";
}

function getJobTitle(jobOfferId?: string): string {
  if (!jobOfferId) return "—";
  return mockJobs.find((j) => j.id === jobOfferId)?.jobTitle ?? "—";
}

const enrolled = mockTrainingProgress.filter((p) =>
  companyTrainings.some((t) => t.id === p.trainingId)
).length;

const completed = mockTrainingProgress.filter(
  (p) =>
    p.progress >= 100 &&
    companyTrainings.some((t) => t.id === p.trainingId)
).length;

const stats = [
  { label: "Total Trainings", value: companyTrainings.length, icon: BookOpen, color: "text-cvision-blue" },
  { label: "Total Applicants Enrolled", value: enrolled, icon: Users, color: "text-cvision-yellow" },
  { label: "Total Applicants Completed", value: completed, icon: Trophy, color: "text-cvision-green" },
];

export default function CompanyTrainingPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Training</h1>
        <Link href="/company/training/create">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Training
          </Button>
        </Link>
      </div>

      {/* Stat Cards */}
      <motion.div
        variants={staggerContainerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6"
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

      {/* Table */}
      <Card>
        <CardContent className="p-6">
          {companyTrainings.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground mb-4">No training programs created yet.</p>
              <Link href="/company/training/create">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create your first training
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Training Title</TableHead>
                    <TableHead>Linked Job Offer</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Created Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {companyTrainings.map((training) => {
                    const hasProgress = mockTrainingProgress.some(
                      (p) => p.trainingId === training.id
                    );
                    return (
                      <TableRow
                        key={training.id}
                        className="cursor-pointer hover:bg-cvision-container transition-colors"
                        onClick={() =>
                          (window.location.href = `/company/training/${training.id}`)
                        }
                      >
                        <TableCell className="max-w-[250px]">
                          <div className="overflow-hidden">
                            <p className="font-medium truncate">{training.title}</p>
                            {training.description && (
                              <p className="text-xs text-muted-foreground truncate">
                                {training.description}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{getJobTitle(training.jobOfferId)}</TableCell>
                        <TableCell>
                          <span className="text-sm">{getTrainingType(training)}</span>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {training.createdAt.toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`text-xs font-medium px-2 py-1 rounded ${
                              hasProgress
                                ? "bg-cvision-green-bg text-cvision-green"
                                : "bg-cvision-container text-muted-foreground"
                            }`}
                          >
                            {hasProgress ? "Active" : "Pending"}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
