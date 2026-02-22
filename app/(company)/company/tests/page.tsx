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
import { Plus, ClipboardList, Clock, Target, HelpCircle } from "lucide-react";
import { mockTests } from "@/lib/mock-data/tests";

const companyTests = mockTests.filter((t) => t.companyId === "c1");

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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{companyTests.length}</p>
            <p className="text-sm text-muted-foreground">Total Tests</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-cvision-green">
              {companyTests.reduce((acc, t) => acc + t.numberOfQuestions, 0)}
            </p>
            <p className="text-sm text-muted-foreground">Total Questions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-cvision-blue">
              {companyTests.length > 0
                ? Math.round(companyTests.reduce((acc, t) => acc + t.duration, 0) / companyTests.length)
                : 0} min
            </p>
            <p className="text-sm text-muted-foreground">Avg. Duration</p>
          </CardContent>
        </Card>
      </div>

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
                    <TableRow key={test.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{test.testName}</p>
                          {test.description && (
                            <p className="text-xs text-muted-foreground line-clamp-1">
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
