"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, CheckCircle2, GripVertical, ClipboardList } from "lucide-react";
import { DOMAINS } from "@/lib/constants/domains";
import { mockJobs } from "@/lib/mock-data/jobs";

const companyJobs = mockJobs.filter((j) => j.companyId === "c1");

type QuestionDraft = {
  id: string;
  questionText: string;
  options: { id: "A" | "B" | "C" | "D"; text: string }[];
  correctAnswer: "A" | "B" | "C" | "D";
};

const emptyQuestion = (): QuestionDraft => ({
  id: `q-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  questionText: "",
  options: [
    { id: "A", text: "" },
    { id: "B", text: "" },
    { id: "C", text: "" },
    { id: "D", text: "" },
  ],
  correctAnswer: "A",
});

export default function CreateTestPage() {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);

  const [jobOffer, setJobOffer] = useState("");
  const [testName, setTestName] = useState("");
  const [domain, setDomain] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("60");
  const [passingScore, setPassingScore] = useState("70");
  const [questions, setQuestions] = useState<QuestionDraft[]>([emptyQuestion()]);

  const addQuestion = () => {
    setQuestions((prev) => [...prev, emptyQuestion()]);
  };

  const removeQuestion = (id: string) => {
    if (questions.length <= 1) return;
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const updateQuestion = (id: string, field: string, value: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    );
  };

  const updateOption = (questionId: string, optionId: string, text: string) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map((o) =>
                o.id === optionId ? { ...o, text } : o
              ),
            }
          : q
      )
    );
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg mx-auto"
      >
        <Card>
          <CardContent className="p-8 text-center">
            <CheckCircle2 className="w-16 h-16 text-cvision-green mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Test Created!</h1>
            <p className="text-muted-foreground mb-2">
              &ldquo;{testName}&rdquo; with {questions.length} question{questions.length !== 1 ? "s" : ""} has been created.
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              You can now link this test to a job offer.
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => router.push("/company/jobs")}>
                View Job Offers
              </Button>
              <Button variant="outline" onClick={() => { setSubmitted(false); setQuestions([emptyQuestion()]); setTestName(""); setDescription(""); }}>
                Create Another
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Create Test</h1>
        <Link href="/company/tests">
          <Button variant="outline">
            <ClipboardList className="w-4 h-4 mr-2" />
            View Tests
          </Button>
        </Link>
      </div>

      {/* Test Info */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <h2 className="font-semibold text-lg mb-4">Test Information</h2>
          <Separator className="mb-4" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Job Offer</Label>
              <Select value={jobOffer} onValueChange={setJobOffer}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Choose Job Offer" /></SelectTrigger>
                <SelectContent>
                  {companyJobs.map((j) => (
                    <SelectItem key={j.id} value={j.id}>{j.jobTitle}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Domain *</Label>
              <Select value={domain} onValueChange={setDomain}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Select domain" /></SelectTrigger>
                <SelectContent>
                  {DOMAINS.map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Test Name *</Label>
              <Input value={testName} onChange={(e) => setTestName(e.target.value)} placeholder="e.g. PHP Developer Assessment" />
            </div>
            <div className="space-y-2">
              <Label>Duration (minutes) *</Label>
              <Input value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="60" />
            </div>
            <div className="space-y-2">
              <Label>Passing Score (%) *</Label>
              <Input value={passingScore} onChange={(e) => setPassingScore(e.target.value)} placeholder="70" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Description</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe what this test evaluates..." rows={3} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Questions */}
      <div className="space-y-4 mb-6">
        {questions.map((question, qi) => (
          <Card key={question.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <GripVertical className="w-4 h-4 text-muted-foreground" />
                  <h3 className="font-semibold">Question {qi + 1}</h3>
                </div>
                {questions.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeQuestion(question.id)}
                  >
                    <Trash2 className="w-4 h-4 text-cvision-red" />
                  </Button>
                )}
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Question Text *</Label>
                  <Textarea
                    value={question.questionText}
                    onChange={(e) => updateQuestion(question.id, "questionText", e.target.value)}
                    placeholder="Enter your question..."
                    rows={2}
                  />
                </div>

                <div className="space-y-3">
                  <Label>Options *</Label>
                  {question.options.map((option) => (
                    <div key={option.id} className="flex items-center gap-3">
                      <span className="text-sm font-semibold w-6 text-center">{option.id}.</span>
                      <Input
                        value={option.text}
                        onChange={(e) => updateOption(question.id, option.id, e.target.value)}
                        placeholder={`Option ${option.id}`}
                        className="flex-1"
                      />
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <Label>Correct Answer *</Label>
                  <RadioGroup
                    value={question.correctAnswer}
                    onValueChange={(v) => updateQuestion(question.id, "correctAnswer", v)}
                    className="flex gap-4"
                  >
                    {(["A", "B", "C", "D"] as const).map((letter) => (
                      <div key={letter} className="flex items-center gap-1.5">
                        <RadioGroupItem value={letter} id={`${question.id}-correct-${letter}`} />
                        <Label htmlFor={`${question.id}-correct-${letter}`} className="cursor-pointer text-sm">{letter}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button variant="outline" onClick={addQuestion} className="w-full mb-6">
        <Plus className="w-4 h-4 mr-2" />
        Add Question
      </Button>

      {/* Summary & Submit */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {questions.length} question{questions.length !== 1 ? "s" : ""} &middot; {duration} min &middot; Passing: {passingScore}%
            </span>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => router.push("/company/dashboard")}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={!testName || !domain || questions.some((q) => !q.questionText || q.options.some((o) => !o.text))}>
                Create Test
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
