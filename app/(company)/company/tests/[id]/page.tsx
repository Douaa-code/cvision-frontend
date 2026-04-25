"use client";

import { use, useState, useEffect } from "react";
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
  Users,
  CheckCircle2,
} from "lucide-react";
import { testsApi, type ApiCompanyTestDetail } from "@/lib/api/tests";

export default function TestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [test, setTest] = useState<ApiCompanyTestDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    testsApi
      .companyShow(id)
      .then((res) => setTest(res.data))
      .catch(() => setTest(null))
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!test) return;
    setDeleting(true);
    try {
      await testsApi.companyDelete(test.id);
      router.push("/company/tests");
    } catch {
      setDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cvision-green" />
      </div>
    );
  }

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
              <h1 className="text-2xl font-bold mb-1">{test.title}</h1>
              {test.description && (
                <p className="text-sm text-muted-foreground mb-4">{test.description}</p>
              )}
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                {test.job_offer && (
                  <span className="flex items-center gap-1.5">
                    <Tag className="w-4 h-4" />
                    {test.job_offer.title}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {test.duration} min
                </span>
                <span className="flex items-center gap-1.5 text-cvision-green font-semibold">
                  <Target className="w-4 h-4" />
                  Passing Score: {test.passing_score}%
                </span>
                <span className="flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4" />
                  {test.questions.length} questions
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  {test.stats.total_taken} taken · {test.stats.total_passed} passed
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
                  {q.question_text}
                </p>
                <div className="space-y-2 pl-4">
                  {q.options.map((opt) => {
                    const isCorrect = opt.id === q.correct_answer;
                    return (
                      <div
                        key={opt.id}
                        className={`flex items-center gap-3 p-2.5 rounded-lg border text-sm ${
                          isCorrect
                            ? "border-cvision-green/40 bg-cvision-green-bg text-cvision-green font-medium"
                            : "border-border bg-cvision-container text-muted-foreground"
                        }`}
                      >
                        <span className="w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0 border-current">
                          {opt.id}
                        </span>
                        {opt.text}
                        {isCorrect && (
                          <span className="ml-auto flex items-center gap-1 text-xs font-semibold text-cvision-green">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Correct
                          </span>
                        )}
                      </div>
                    );
                  })}
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
              Are you sure you want to remove &ldquo;{test.title}&rdquo;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? "Removing…" : "Remove Test"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
