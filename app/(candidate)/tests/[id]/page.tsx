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
import { mockTests } from "@/lib/mock-data/tests";

export default function TestInterfacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const test = mockTests.find((t) => t.id === id) ?? mockTests[0];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(test.duration * 60);
  const [submitted, setSubmitted] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [score, setScore] = useState(0);

  const question = test.questions[currentQuestion];
  const totalQuestions = test.questions.length;
  const answeredCount = Object.keys(answers).length;

  const calculateScore = useCallback(() => {
    let correct = 0;
    test.questions.forEach((q) => {
      const answer = answers[q.id];
      const correctOption = q.options.find((o) => o.isCorrect);
      if (answer && correctOption && answer === correctOption.id) {
        correct++;
      }
    });
    return Math.round((correct / totalQuestions) * 100);
  }, [answers, test.questions, totalQuestions]);

  const handleSubmit = useCallback(() => {
    const s = calculateScore();
    setScore(s);
    setSubmitted(true);
    setShowConfirmDialog(false);
  }, [calculateScore]);

  // Timer
  useEffect(() => {
    if (submitted || timeLeft <= 0) {
      if (timeLeft <= 0 && !submitted) handleSubmit();
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, submitted, handleSubmit]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const passed = score >= test.passingScore;

  // Results screen
  if (submitted) {
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
              <p className="text-4xl font-bold" style={{ color: passed ? "#00C897" : "#E74C3C" }}>
                {score}%
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Passing score: {test.passingScore}%
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

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold">{test.testName}</h1>
          <p className="text-sm text-muted-foreground">{test.domain}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono font-semibold ${
            timeLeft < 300 ? "bg-cvision-red-bg text-cvision-red" : "bg-cvision-container text-foreground"
          }`}>
            <Clock className="w-4 h-4" />
            {formatTime(timeLeft)}
          </div>
          <span className="text-sm text-muted-foreground">
            {currentQuestion + 1}/{totalQuestions}
          </span>
        </div>
      </div>

      {/* Progress */}
      <Progress value={((currentQuestion + 1) / totalQuestions) * 100} className="mb-6 h-2" />

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
            <h2 className="text-lg font-semibold mb-6">{question.questionText}</h2>

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
                    htmlFor={`${question.id}-${option.id}`}
                    className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                      answers[question.id] === option.id
                        ? "border-cvision-green bg-cvision-green-bg"
                        : "border-border hover:border-cvision-green/50"
                    }`}
                  >
                    <RadioGroupItem
                      value={option.id}
                      id={`${question.id}-${option.id}`}
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
            <Button onClick={() => setShowConfirmDialog(true)}>
              Submit Test
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
              {answeredCount < totalQuestions && " Unanswered questions will be marked as incorrect."}
              {" "}This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Continue Test
            </Button>
            <Button onClick={handleSubmit}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
