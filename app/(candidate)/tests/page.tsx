"use client";

import { useState, useEffect } from "react";
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
import { ClipboardCheck, Clock, Trophy } from "lucide-react";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  staggerContainerVariants,
  staggerItemVariants,
} from "@/lib/animations/variants";
import { apiClient } from "@/lib/api/client";

interface PendingTest {
  application_id: number;
  job_title: string;
  company_name: string;
  test: {
    id: number;
    title: string;
    description: string;
    duration: number;
    passing_score: number;
    total_questions: number;
  };
}

interface CompletedTest {
  application_id: number;
  job_title: string;
  company_name: string;
  test_status: "passed" | "failed";
  test_score: number | null;
  test: {
    id: number;
    title: string;
    passing_score: number;
  } | null;
  attempt: {
    score: number;
    passed: boolean;
    completed_at: string;
  } | null;
}

export default function TestsPage() {
  const [pendingTests, setPendingTests] = useState<PendingTest[]>([]);
  const [completedTests, setCompletedTests] = useState<CompletedTest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const res = await apiClient.get<any>("/candidate/tests");
        const data = res?.data ?? res;
        setPendingTests(Array.isArray(data?.pending) ? data.pending : []);
        setCompletedTests(Array.isArray(data?.completed) ? data.completed : []);
      } catch {
        // keep empty on error
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const highestScore = completedTests.length > 0
    ? Math.max(...completedTests.map((t) => t.test_score ?? 0))
    : null;

  const stats = [
    {
      label: "Total Tests",
      value: String(pendingTests.length + completedTests.length),
      icon: ClipboardCheck,
      color: "text-cvision-green",
    },
    {
      label: "Pending Tests",
      value: String(pendingTests.length),
      icon: Clock,
      color: "text-cvision-green",
    },
    {
      label: "Highest Score",
      value: highestScore !== null ? `${highestScore}%` : "—",
      icon: Trophy,
      color: "text-cvision-green",
    },
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
      <h1 className="text-2xl font-bold mb-6">Tests & Assessments</h1>

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

      {/* Pending Tests */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        <h2 className="text-lg font-semibold mb-4">Pending Tests</h2>
        {pendingTests.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No pending tests at the moment.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingTests.map((item) => (
              <Card key={item.application_id}>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-1">{item.test.title}</h3>
                  <p className="text-sm text-muted-foreground mb-1">{item.job_title}</p>
                  <p className="text-sm text-muted-foreground mb-1">{item.company_name}</p>
                  <p className="text-sm text-muted-foreground mb-4">{item.test.description}</p>
                  <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Duration:</span>{" "}
                      <span className="font-medium">{item.test.duration} min</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Questions:</span>{" "}
                      <span className="font-medium">{item.test.total_questions}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Passing:</span>{" "}
                      <span className="font-medium">{item.test.passing_score}%</span>
                    </div>
                  </div>
                  <Link href={`/tests/${item.application_id}`}>
                    <Button className="w-full">Start Test</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </motion.div>

      {/* Completed Tests */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-lg font-semibold mb-4">Completed Tests</h2>
        <Card>
          <CardContent className="p-6">
            {completedTests.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No completed tests yet.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Test Name</TableHead>
                      <TableHead>Job Position</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {completedTests.map((item) => (
                      <TableRow key={item.application_id}>
                        <TableCell className="font-medium">
                          {item.test?.title ?? "—"}
                        </TableCell>
                        <TableCell>{item.job_title}</TableCell>
                        <TableCell>
                          <span className="font-semibold">
                            {item.test_score !== null && item.test_score !== undefined
                              ? `${item.test_score}%`
                              : "—"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <StatusBadge
                            status={item.test_status === "passed" ? "Passed" : "Failed"}
                          />
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
    </div>
  );
}
