"use client";

import { useEffect, useState } from "react";
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
import { trainingsApi, type ApiCompanyTraining } from "@/lib/api/trainings";
import {
  staggerContainerVariants,
  staggerItemVariants,
} from "@/lib/animations/variants";

export default function CompanyTrainingPage() {
  const [trainings, setTrainings] = useState<ApiCompanyTraining[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    trainingsApi.companyList()
      .then((r) => setTrainings(r?.data ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const totalEnrolled   = trainings.reduce((s, t) => s + t.enrolled_count, 0);

  const stats = [
    { label: "Total Trainings",              value: trainings.length, icon: BookOpen, color: "text-cvision-green" },
    { label: "Total Candidates Enrolled",    value: totalEnrolled,    icon: Users,    color: "text-cvision-green" },
    { label: "Total Modules",                value: trainings.reduce((s, t) => s + t.modules_count, 0), icon: Trophy, color: "text-cvision-green" },
  ];

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
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Loading…</div>
          ) : trainings.length === 0 ? (
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
                    <TableHead>Domain</TableHead>
                    <TableHead>Modules</TableHead>
                    <TableHead>Enrolled</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trainings.map((training) => (
                    <TableRow key={training.id} className="hover:bg-cvision-container transition-colors">
                      <TableCell className="max-w-[220px]">
                        <p className="font-medium truncate">{training.title}</p>
                        {training.description && (
                          <p className="text-xs text-muted-foreground truncate">{training.description}</p>
                        )}
                      </TableCell>
                      <TableCell className="text-sm">
                        {training.job_offer?.title ?? <span className="text-muted-foreground">—</span>}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {training.job_offer?.domain ?? "—"}
                      </TableCell>
                      <TableCell className="text-sm">{training.modules_count}</TableCell>
                      <TableCell className="text-sm">{training.enrolled_count}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(training.created_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
