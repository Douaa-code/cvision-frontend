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
import { ClipboardCheck, Clock, Trophy } from "lucide-react";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { mockTests, mockCandidateTestResults } from "@/lib/mock-data/tests";
import {
  staggerContainerVariants,
  staggerItemVariants,
} from "@/lib/animations/variants";

const stats = [
  { label: "Total Tests", value: "12", icon: ClipboardCheck, color: "text-cvision-blue" },
  { label: "Not Started Tests", value: "2", icon: Clock, color: "text-cvision-yellow" },
  { label: "Highest Score", value: "88%", icon: Trophy, color: "text-cvision-green" },
];

export default function TestsPage() {
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

      {/* Not Started Tests */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        <h2 className="text-lg font-semibold mb-4">Not Started Tests</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockTests.map((test) => (
            <Card key={test.id}>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-1">{test.testName}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {test.description}
                </p>
                <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Duration:</span>{" "}
                    <span className="font-medium">{test.duration} min</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Questions:</span>{" "}
                    <span className="font-medium">{test.numberOfQuestions}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Passing:</span>{" "}
                    <span className="font-medium">{test.passingScore}%</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Domain:</span>{" "}
                    <span className="font-medium">{test.domain}</span>
                  </div>
                </div>
                <Link href={`/tests/${test.id}`}>
                  <Button className="w-full">Start Test</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
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
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Test Name</TableHead>
                    <TableHead>Job Position</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Completed Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockCandidateTestResults.map((result) => (
                    <TableRow key={result.testId}>
                      <TableCell className="font-medium">{result.testName}</TableCell>
                      <TableCell>{result.jobTitle}</TableCell>
                      <TableCell>
                        <span className="font-semibold">
                          {result.score}/{result.total} ({result.score}%)
                        </span>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={result.status} />
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {result.completedDate.toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
