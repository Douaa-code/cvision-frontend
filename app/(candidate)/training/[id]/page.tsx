"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  PlayCircle,
  FileText,
  HelpCircle,
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  FileIcon,
  AlertTriangle,
} from "lucide-react";
import { apiClient } from "@/lib/api/client";

// ─── API types ────────────────────────────────────────────────────────────────

interface ApiModule {
  id: number;
  title: string;
  type: "video" | "text" | "image" | "file" | "mcq_quiz";
  content: Record<string, unknown> | null;
  duration: number;
  order: number;
  completed: boolean;
  completed_at: string | null;
}

interface ApiTraining {
  id: number;
  title: string;
  description: string | null;
  total_duration: number;
  modules: ApiModule[];
  total_modules: number;
  completed_modules: number;
  progress_percent: number;
}

// ─── Content block renderers ──────────────────────────────────────────────────

function getYoutubeEmbedUrl(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([A-Za-z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return `https://www.youtube.com/embed/${m[1]}`;
  }
  return null;
}

function VideoBlock({ content, title, duration }: { content: Record<string, unknown> | null; title: string; duration: number }) {
  // Filament stores video_url; React form stores url — use || so empty string falls through
  const url = ((content?.url || content?.video_url) as string | undefined) || undefined;
  const embedUrl = url ? getYoutubeEmbedUrl(url) : null;
  return (
    <div className="mt-3 rounded-lg overflow-hidden border border-border">
      {embedUrl ? (
        <iframe
          src={embedUrl}
          className="w-full"
          style={{ height: 280 }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={title}
        />
      ) : url ? (
        <video controls className="w-full max-h-64 bg-black" src={url} />
      ) : (
        <div className="relative w-full h-36 bg-gradient-to-br from-gray-800 to-gray-600 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
            <PlayCircle className="w-8 h-8 text-white" />
          </div>
          {duration > 0 && (
            <span className="absolute bottom-2 right-3 text-xs text-white/80 bg-black/40 px-2 py-0.5 rounded">
              {duration} min
            </span>
          )}
        </div>
      )}
      <div className="p-3 bg-cvision-container">
        <p className="text-sm font-medium">{title}</p>
      </div>
    </div>
  );
}

function TextBlock({ content }: { content: Record<string, unknown> | null }) {
  const body = (content?.body ?? content?.text) as string | undefined;
  if (!body) return null;
  return (
    <div className="mt-3 rounded-lg border border-border overflow-hidden">
      <div className="p-4 bg-cvision-container">
        <p className="text-sm text-foreground whitespace-pre-wrap">{body}</p>
      </div>
    </div>
  );
}

function ImageBlock({ content, title }: { content: Record<string, unknown> | null; title: string }) {
  const url = ((content?.image_url || content?.url) as string | undefined) || undefined;
  return (
    <div className="mt-3 rounded-lg border border-border overflow-hidden">
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt={title} className="w-full max-h-64 object-contain bg-cvision-container" />
      ) : (
        <div className="w-full h-28 bg-gradient-to-br from-cvision-container to-cvision-bar flex items-center justify-center">
          <ImageIcon className="w-8 h-8 text-muted-foreground" />
        </div>
      )}
    </div>
  );
}

function FileBlock({ content, title }: { content: Record<string, unknown> | null; title: string }) {
  const url = ((content?.file_url || content?.url) as string | undefined) || undefined;
  return (
    <div className="mt-3 rounded-lg border border-border overflow-hidden">
      <div className="p-4 bg-cvision-container flex items-center gap-3">
        <FileIcon className="w-5 h-5 text-cvision-blue flex-shrink-0" />
        <p className="text-sm font-medium flex-1">{title}</p>
        {url && (
          <a href={url} target="_blank" rel="noopener noreferrer">
            <Button size="sm" variant="outline">Download</Button>
          </a>
        )}
      </div>
    </div>
  );
}

interface QuizState {
  answers: string[];
  submitted: boolean;
  score: number | null;
  passed: boolean | null;
  submitting: boolean;
}

function QuizBlock({
  moduleId,
  content,
  onPassed,
}: {
  moduleId: number;
  content: Record<string, unknown> | null;
  onPassed: () => void;
}) {
  // Normalize all known quiz formats into { text, options: [{id,text}], correct_answer }
  // Format A (Filament): questions[].question (string), questions[].options (object {A,B,C,D})
  // Format B (React form): questions[].text (string), questions[].options (array [{id,text}])
  type NormalizedQuestion = { text: string; options: { id: string; text: string }[]; correct_answer: string };

  function normalizeQuestion(q: Record<string, unknown>): NormalizedQuestion {
    const text = (q.text ?? q.question ?? "") as string;
    const correct_answer = (q.correct_answer ?? "A") as string;
    let options: { id: string; text: string }[];
    if (Array.isArray(q.options)) {
      // React form format: [{id:"A", text:"..."}]
      options = q.options as { id: string; text: string }[];
    } else if (q.options && typeof q.options === "object") {
      // Filament format: {A:"...", B:"...", C:"...", D:"..."}
      options = Object.entries(q.options as Record<string, string>).map(([id, text]) => ({ id, text }));
    } else {
      options = [];
    }
    return { text, options, correct_answer };
  }

  const rawQuestions = content?.questions as Record<string, unknown>[] | undefined;
  const questions: NormalizedQuestion[] = rawQuestions
    ? rawQuestions.map(normalizeQuestion)
    : content?.question
    ? [normalizeQuestion(content as Record<string, unknown>)]
    : [];
  const passingScore = (content?.passing_score as number) ?? 70;

  const [state, setState] = useState<QuizState>({
    answers: Array(questions.length).fill(""),
    submitted: false,
    score: null,
    passed: null,
    submitting: false,
  });

  const handleAnswer = (qIndex: number, value: string) => {
    setState((prev) => {
      const next = [...prev.answers];
      next[qIndex] = value;
      return { ...prev, answers: next };
    });
  };

  const handleSubmit = async () => {
    setState((prev) => ({ ...prev, submitting: true }));
    try {
      const res = await apiClient.post<{ success: boolean; data: { score: number; passed: boolean } }>(
        `/candidate/training-modules/${moduleId}/quiz`,
        { answers: state.answers }
      );
      const { score, passed } = res.data;
      setState((prev) => ({ ...prev, submitted: true, score, passed, submitting: false }));
      if (passed) onPassed();
    } catch {
      setState((prev) => ({ ...prev, submitting: false }));
    }
  };

  if (questions.length === 0) {
    return <p className="mt-3 text-sm text-muted-foreground">No questions available for this quiz.</p>;
  }

  return (
    <div className="mt-3 space-y-4">
      {questions.map((q, i) => (
        <div key={i} className="rounded-lg border border-border p-4 bg-cvision-container">
          <p className="text-sm font-medium mb-3">
            {i + 1}. {q.text}
          </p>
          <div className="space-y-2">
            {q.options.map((opt) => (
              <label
                key={opt.id}
                className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer text-sm transition-colors ${
                  state.answers[i] === opt.id
                    ? "border-cvision-green bg-cvision-green-bg text-cvision-green"
                    : "border-border bg-background text-muted-foreground hover:border-cvision-green/40"
                } ${state.submitted ? "pointer-events-none" : ""}`}
              >
                <input
                  type="radio"
                  name={`q-${moduleId}-${i}`}
                  value={opt.id}
                  checked={state.answers[i] === opt.id}
                  onChange={() => handleAnswer(i, opt.id)}
                  className="sr-only"
                />
                <span className="font-mono font-semibold">{opt.id}.</span>
                {opt.text}
              </label>
            ))}
          </div>
        </div>
      ))}

      {state.submitted ? (
        <div className={`rounded-lg p-4 text-sm font-medium ${state.passed ? "bg-cvision-green-bg text-cvision-green" : "bg-red-50 text-red-600"}`}>
          {state.passed
            ? `✓ Passed with ${state.score}% — module completed.`
            : `✗ Score: ${state.score}% (minimum ${passingScore}%). Try again.`}
          {!state.passed && (
            <Button
              size="sm"
              variant="outline"
              className="ml-3"
              onClick={() => setState({ answers: Array(questions.length).fill(""), submitted: false, score: null, passed: null, submitting: false })}
            >
              Retry
            </Button>
          )}
        </div>
      ) : (
        <Button
          size="sm"
          onClick={handleSubmit}
          disabled={state.submitting || state.answers.some((a) => !a)}
        >
          {state.submitting ? "Submitting…" : "Submit Quiz"}
        </Button>
      )}
    </div>
  );
}

// ─── Module row ───────────────────────────────────────────────────────────────

const MODULE_ICONS = {
  video:    PlayCircle,
  text:     FileText,
  image:    ImageIcon,
  file:     FileIcon,
  mcq_quiz: HelpCircle,
} as const;

const MODULE_LABELS = {
  video:    "Video",
  text:     "Reading",
  image:    "Image",
  file:     "File",
  mcq_quiz: "Quiz",
} as const;

function ModuleRow({
  module,
  onComplete,
}: {
  module: ApiModule;
  onComplete: (id: number) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [completing, setCompleting] = useState(false);
  const Icon = MODULE_ICONS[module.type] ?? FileText;
  const label = MODULE_LABELS[module.type] ?? module.type;
  const isQuiz = module.type === "mcq_quiz";

  const handleMarkComplete = async () => {
    if (module.completed || completing) return;
    setCompleting(true);
    try {
      await apiClient.post(`/candidate/training-modules/${module.id}/complete`, {});
      onComplete(module.id);
    } catch {
      // silent
    } finally {
      setCompleting(false);
    }
  };

  return (
    <div
      className={`rounded-lg border transition-colors ${
        module.completed
          ? "border-cvision-green/30 bg-cvision-green-bg"
          : "border-border bg-cvision-container"
      }`}
    >
      {/* Header row */}
      <div className="flex items-center gap-3 p-3">
        <div className="flex-shrink-0">
          {module.completed ? (
            <CheckCircle2 className="w-5 h-5 text-cvision-green" />
          ) : (
            <Circle className="w-5 h-5 text-muted-foreground" />
          )}
        </div>
        <Icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{module.title}</p>
          <p className="text-xs text-muted-foreground">
            {label} {module.duration > 0 ? `· ${module.duration} min` : ""}
          </p>
        </div>
        <button
          onClick={() => setExpanded((v) => !v)}
          className="text-muted-foreground hover:text-foreground flex-shrink-0"
          aria-label="Expand"
        >
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="px-3 pb-3">
          {module.type === "video" && (
            <VideoBlock content={module.content} title={module.title} duration={module.duration} />
          )}
          {module.type === "text" && <TextBlock content={module.content} />}
          {module.type === "image" && <ImageBlock content={module.content} title={module.title} />}
          {module.type === "file" && <FileBlock content={module.content} title={module.title} />}
          {isQuiz ? (
            <QuizBlock
              moduleId={module.id}
              content={module.content}
              onPassed={() => onComplete(module.id)}
            />
          ) : (
            !module.completed && (
              <div className="mt-3 flex justify-end">
                <Button size="sm" onClick={handleMarkComplete} disabled={completing}>
                  {completing ? "Saving…" : "Mark Complete"}
                </Button>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TrainingContentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [training, setTraining] = useState<ApiTraining | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiClient
      .get<{ success: boolean; data: ApiTraining }>(`/candidate/trainings/${id}`)
      .then((res) => setTraining(res.data))
      .catch(() => setError("Training not found or access denied."))
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleModuleComplete = (moduleId: number) => {
    setTraining((prev) => {
      if (!prev) return prev;
      const modules = prev.modules.map((m) =>
        m.id === moduleId ? { ...m, completed: true } : m
      );
      // Group-based progress (mirrors backend: floor((order-1)/100))
      const groups = new Map<number, ApiModule[]>();
      for (const m of modules) {
        const g = Math.floor((m.order - 1) / 100);
        if (!groups.has(g)) groups.set(g, []);
        groups.get(g)!.push(m);
      }
      const total_modules = groups.size;
      const completed_modules = [...groups.values()].filter((g) => g.every((m) => m.completed)).length;
      const progress_percent = total_modules > 0 ? Math.round((completed_modules / total_modules) * 100) : 0;
      return { ...prev, modules, total_modules, completed_modules, progress_percent };
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cvision-green" />
      </div>
    );
  }

  if (error || !training) {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Link
          href="/training"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Training
        </Link>
        <Card>
          <CardContent className="p-12 text-center">
            <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">{error ?? "Training not found."}</p>
            <Button className="mt-4" onClick={() => router.push("/training")}>
              Back to Training
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Link
        href="/training"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Training
      </Link>

      {/* Header */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold mb-1">{training.title}</h1>
          {training.description && (
            <p className="text-sm text-muted-foreground mb-4">{training.description}</p>
          )}
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">
              {training.completed_modules}/{training.total_modules} modules completed
            </span>
            <span className="font-semibold">{training.progress_percent}%</span>
          </div>
          <Progress value={training.progress_percent} className="h-2" />
        </CardContent>
      </Card>

      {/* Modules */}
      <Card>
        <CardContent className="p-6">
          <h2 className="font-semibold text-lg mb-4">Modules</h2>
          <Separator className="mb-4" />
          {training.modules.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No modules available for this training yet.
            </p>
          ) : (
            <div className="space-y-3">
              {training.modules
                .sort((a, b) => a.order - b.order)
                .map((module) => (
                  <ModuleRow
                    key={module.id}
                    module={module}
                    onComplete={handleModuleComplete}
                  />
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
