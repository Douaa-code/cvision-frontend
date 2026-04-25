"use client";

import { use, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Clock, ChevronLeft, ChevronRight, CheckCircle2, XCircle } from "lucide-react";
import { apiClient } from "@/lib/api/client";

interface TestQuestion {
  id: number;
  question_text: string;
  options: { id: "A" | "B" | "C" | "D"; text: string }[];
}

interface TestData {
  test: {
    id: number;
    title: string;
    description: string;
    duration: number;      // minutes
    passing_score: number; // percentage
  };
  questions: TestQuestion[];
}

interface SubmitResult {
  score: number;
  passed: boolean;
  test_status: string;
}

export default function TestInterfacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params); // this is the application_id
  const router = useRouter();

  const [testData, setTestData]       = useState<TestData | null>(null);
  const [isLoading, setIsLoading]     = useState(true);
  const [loadError, setLoadError]     = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers]         = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft]       = useState(0);
  const [submitted, setSubmitted]     = useState(false);
  const [submitting, setSubmitting]   = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [result, setResult]           = useState<SubmitResult | null>(null);

  // Load test data and immediately start the attempt
  useEffect(() => {
    (async () => {
      try {
        // 1. Fetch test questions
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const res = await apiClient.get<any>(`/candidate/tests/${id}`);
        const data: TestData = res?.data ?? res;
        setTestData(data);
        setTimeLeft(data.test.duration * 60);

        // 2. Record that the attempt has started (removes from pending list)
        await apiClient.post(`/candidate/tests/${id}/start`, {});
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Failed to load test.";
        setLoadError(msg);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [id]);

  const handleSubmit = useCallback(async () => {
    if (!testData || submitting) return;
    setSubmitting(true);
    setShowConfirmDialog(false);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res = await apiClient.post<any>(`/candidate/tests/${id}/submit`, { answers });
      const data: SubmitResult = res?.data ?? res;
      setResult(data);
      setSubmitted(true);
    } catch {
      // If submit fails, still show a generic result screen
      setResult({ score: 0, passed: false, test_status: "failed" });
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  }, [testData, submitting, id, answers]);

  // Timer countdown — auto-submit when time runs out
  useEffect(() => {
    if (!testData || submitted || timeLeft <= 0) {
      if (testData && timeLeft <= 0 && !submitted) handleSubmit();
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, submitted, handleSubmit, testData]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // ── Loading / error states ────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cvision-green" />
      </div>
    );
  }

  if (loadError || !testData) {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <p className="text-muted-foreground mb-4">
          {loadError ?? "Test not available. It may have already been started or completed."}
        </p>
        <Button variant="outline" onClick={() => router.push("/tests")}>
          Back to Tests
        </Button>
      </div>
    );
  }

  const { test, questions } = testData;
  const totalQuestions  = questions.length;
  const answeredCount   = Object.keys(answers).length;
  const question        = questions[currentQuestion];

  // ── Results screen ────────────────────────────────────────────────────────

  if (submitted && result) {
    const passed = result.passed;
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg mx-auto"
      >
        <Card>
          <CardContent className="p-8 text-center">
            {passed ? (
              <CheckCircle2 className="w-16 h-16 text-cvision-green mx-auto mb-4" />
            ) : (
              <XCircle className="w-16 h-16 text-cvision-red mx-auto mb-4" />
            )}
            <h1 className="text-2xl font-bold mb-2">
              {passed ? "Congratulations!" : "Test Completed"}
            </h1>
            <p className="text-muted-foreground mb-6">
              {passed
                ? "You have passed the assessment."
                : "Unfortunately, you did not reach the passing score."}
            </p>

            <div className="bg-cvision-container rounded-xl p-6 mb-6">
              <p
                className="text-4xl font-bold"
                style={{ color: passed ? "#00C897" : "#E74C3C" }}
              >
                {result.score}%
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Passing score: {test.passing_score}%
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm mb-6">
              <div className="bg-white rounded-lg p-3 border border-border">
                <p className="text-muted-foreground">Questions</p>
                <p className="font-semibold">{totalQuestions}</p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-border">
                <p className="text-muted-foreground">Answered</p>
                <p className="font-semibold">{answeredCount}</p>
              </div>
            </div>

            <Button className="w-full" onClick={() => router.push("/tests")}>
              Back to Tests
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // ── Test taking screen ────────────────────────────────────────────────────

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold">{test.title}</h1>
          {test.description && (
            <p className="text-sm text-muted-foreground">{test.description}</p>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono font-semibold ${
              timeLeft < 300
                ? "bg-cvision-red-bg text-cvision-red"
                : "bg-cvision-container text-foreground"
            }`}
          >
            <Clock className="w-4 h-4" />
            {formatTime(timeLeft)}
          </div>
          <span className="text-sm text-muted-foreground">
            {currentQuestion + 1}/{totalQuestions}
          </span>
        </div>
      </div>

      {/* Progress */}
      <Progress
        value={((currentQuestion + 1) / totalQuestions) * 100}
        className="mb-6 h-2"
      />

      {/* Question */}
      <motion.div
        key={question.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <CardContent className="p-6">
            <p className="text-xs font-semibold text-cvision-green mb-2 uppercase">
              Question {currentQuestion + 1}
            </p>
            <h2 className="text-lg font-semibold mb-6">{question.question_text}</h2>

            <RadioGroup
              value={answers[question.id] ?? ""}
              onValueChange={(value) =>
                setAnswers((prev) => ({ ...prev, [question.id]: value }))
              }
            >
              <div className="space-y-3">
                {question.options.map((option) => (
                  <Label
                    key={option.id}
                    htmlFor={`q${question.id}-${option.id}`}
                    className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                      answers[question.id] === option.id
                        ? "border-cvision-green bg-cvision-green-bg"
                        : "border-border hover:border-cvision-green/50"
                    }`}
                  >
                    <RadioGroupItem
                      value={option.id}
                      id={`q${question.id}-${option.id}`}
                    />
                    <span className="font-medium text-sm mr-2">{option.id}.</span>
                    <span className="text-sm">{option.text}</span>
                  </Label>
                ))}
              </div>
            </RadioGroup>
          </CardContent>
        </Card>
      </motion.div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6">
        <Button
          variant="outline"
          onClick={() => setCurrentQuestion((c) => c - 1)}
          disabled={currentQuestion === 0}
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </Button>

        <div className="flex gap-2">
          {currentQuestion < totalQuestions - 1 ? (
            <Button onClick={() => setCurrentQuestion((c) => c + 1)}>
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button onClick={() => setShowConfirmDialog(true)} disabled={submitting}>
              {submitting ? "Submitting…" : "Submit Test"}
            </Button>
          )}
        </div>
      </div>

      {/* Confirm Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Test?</DialogTitle>
            <DialogDescription>
              You have answered {answeredCount} out of {totalQuestions} questions.
              {answeredCount < totalQuestions &&
                " Unanswered questions will be marked as incorrect."}
              {" "}This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Continue Test
            </Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? "Submitting…" : "Submit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
