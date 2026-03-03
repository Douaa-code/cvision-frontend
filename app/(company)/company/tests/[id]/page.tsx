"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Clock,
  Tag,
  Target,
  HelpCircle,
  Trash2,
} from "lucide-react";
import { mockTests } from "@/lib/mock-data/tests";

export default function TestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const test = mockTests.find((t) => t.id === id);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  if (!test) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Test not found.</p>
        <Link href="/company/tests">
          <Button variant="outline" className="mt-4">Back to Tests</Button>
        </Link>
      </div>
    );
  }

  const handleRemove = () => {
    setShowDeleteDialog(false);
    router.push("/company/tests");
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Link
        href="/company/tests"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Tests
      </Link>

      {/* Header card */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold mb-1">{test.testName}</h1>
              {test.description && (
                <p className="text-sm text-muted-foreground mb-4">{test.description}</p>
              )}
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Tag className="w-4 h-4" />
                  {test.domain}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {test.duration} min
                </span>
                <span className="flex items-center gap-1.5 text-cvision-green font-semibold">
                  <Target className="w-4 h-4" />
                  Passing Score: {test.passingScore}%
                </span>
                <span className="flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4" />
                  {test.numberOfQuestions} questions
                </span>
              </div>
            </div>
            <Button
              variant="destructive"
              size="sm"
              className="shrink-0"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Remove Test
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Questions */}
      <Card>
        <CardContent className="p-6">
          <h2 className="font-semibold text-lg mb-4">Questions</h2>
          <div className="space-y-6">
            {test.questions.map((q, qi) => (
              <div key={q.id}>
                {qi > 0 && <Separator className="mb-6" />}
                <p className="text-sm font-medium mb-3">
                  <span className="text-muted-foreground mr-2">Q{qi + 1}.</span>
                  {q.questionText}
                </p>
                <div className="space-y-2 pl-4">
                  {q.options.map((opt) => (
                    <div
                      key={opt.id}
                      className={`flex items-center gap-3 p-2.5 rounded-lg border text-sm ${
                        opt.isCorrect
                          ? "border-cvision-green/40 bg-cvision-green-bg text-cvision-green font-medium"
                          : "border-border bg-cvision-container text-muted-foreground"
                      }`}
                    >
                      <span className="w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0 border-current">
                        {opt.id}
                      </span>
                      {opt.text}
                      {opt.isCorrect && (
                        <span className="ml-auto text-xs font-semibold text-cvision-green">
                          ✓ Correct
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Delete confirmation dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Test</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove &ldquo;{test.testName}&rdquo;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRemove}>
              Remove Test
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
