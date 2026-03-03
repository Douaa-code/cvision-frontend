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
import { Plus, ClipboardList, Clock, Target, HelpCircle, Users, Trophy } from "lucide-react";
import { mockTests } from "@/lib/mock-data/tests";
import { mockCompanyApplications } from "@/lib/mock-data/company";
import {
  staggerContainerVariants,
  staggerItemVariants,
} from "@/lib/animations/variants";

const companyTests = mockTests.filter((t) => t.companyId === "c1");
const totalTested = mockCompanyApplications.filter((a) => a.testStatus != null).length;
const totalPassed = mockCompanyApplications.filter((a) => a.testStatus === "Passed").length;

const stats = [
  { label: "Total Tests", value: companyTests.length, icon: ClipboardList, color: "text-cvision-blue" },
  { label: "Total Applicants Tested", value: totalTested, icon: Users, color: "text-cvision-yellow" },
  { label: "Total Applicants Passed Test", value: totalPassed, icon: Trophy, color: "text-cvision-green" },
];

export default function CompanyTestsPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Tests</h1>
        <Link href="/company/tests/create">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Test
          </Button>
        </Link>
      </div>

      {/* Summary Cards */}
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

      {/* Tests Table */}
      <Card>
        <CardContent className="p-6">
          {companyTests.length === 0 ? (
            <div className="text-center py-12">
              <ClipboardList className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground mb-4">No tests created yet.</p>
              <Link href="/company/tests/create">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create your first test
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Test Name</TableHead>
                    <TableHead>Domain</TableHead>
                    <TableHead>Questions</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Passing Score</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {companyTests.map((test) => (
                    <TableRow
                      key={test.id}
                      className="cursor-pointer hover:bg-cvision-container transition-colors"
                      onClick={() => window.location.href = `/company/tests/${test.id}`}
                    >
                      <TableCell className="max-w-[250px]">
                        <div className="overflow-hidden">
                          <p className="font-medium truncate">{test.testName}</p>
                          {test.description && (
                            <p className="text-xs text-muted-foreground truncate">
                              {test.description}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{test.domain}</TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1 text-sm">
                          <HelpCircle className="w-3 h-3" />
                          {test.numberOfQuestions}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1 text-sm">
                          <Clock className="w-3 h-3" />
                          {test.duration} min
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1 text-sm font-semibold text-cvision-green">
                          <Target className="w-3 h-3" />
                          {test.passingScore}%
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {test.createdAt.toLocaleDateString()}
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
