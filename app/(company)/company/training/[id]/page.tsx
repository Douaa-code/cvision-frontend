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
  BookOpen,
  Briefcase,
  Clock,
  PlayCircle,
  FileText,
  HelpCircle,
  Trash2,
  Tag,
  Users,
  Image,
  Paperclip,
} from "lucide-react";
import {
  trainingsApi,
  type ApiCompanyTrainingDetail,
  type ApiTrainingModule,
} from "@/lib/api/trainings";

const moduleIcons: Record<string, React.ElementType> = {
  video: PlayCircle,
  text: FileText,
  mcq_quiz: HelpCircle,
  image: Image,
  file: Paperclip,
};

const moduleLabels: Record<string, string> = {
  video: "Video",
  text: "Reading",
  mcq_quiz: "Quiz",
  image: "Image",
  file: "File",
};

type ModuleContent = {
  url?: string;
  body?: string;
  questions?: any[];
  passing_score?: number;
  name?: string;
};

/// ✅ Type Guard
function isModuleContent(content: unknown): content is ModuleContent {
  return typeof content === "object" && content !== null;
}

function ModuleCard({ module }: { module: ApiTrainingModule }) {
  const Icon = moduleIcons[module.type] ?? FileText;
  const label = moduleLabels[module.type] ?? module.type;

  const content = isModuleContent(module.content)
    ? module.content
    : null;

  return (
    <div className="rounded-lg border border-border bg-cvision-container overflow-hidden">
      <div className="flex items-center gap-3 px-3 py-2.5 border-b border-border">
        <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
        <span className="flex-1 text-sm font-medium">{module.title}</span>
        <span className="text-xs text-muted-foreground shrink-0 bg-cvision-bar px-2 py-0.5 rounded">
          {label}
        </span>
        {module.duration > 0 && (
          <span className="text-xs text-muted-foreground shrink-0 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {module.duration} min
          </span>
        )}
      </div>

      {/* Video */}
      {module.type === "video" && content?.url && (
        <div className="p-3">
          <a
            href={content.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-cvision-green hover:underline font-medium"
          >
            <PlayCircle className="w-4 h-4" />
            Watch Video
          </a>
        </div>
      )}

      {/* Text */}
      {module.type === "text" && content?.body && (
        <div className="p-3">
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
            {content.body}
          </p>
        </div>
      )}

      {/* Quiz */}
      {module.type === "mcq_quiz" && content?.questions && (
        <div className="p-3">
          <p className="text-xs text-muted-foreground">
            {content.questions.length} question(s) · Passing score:{" "}
            {content.passing_score ?? 70}%
          </p>
        </div>
      )}

      {/* File / Image */}
      {(module.type === "file" || module.type === "image") &&
        content?.url && (
          <div className="p-3">
            <a
              href={content.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-cvision-green hover:underline font-medium"
            >
              <Paperclip className="w-4 h-4" />
              {content.name ?? "View File"}
            </a>
          </div>
        )}
    </div>
  );
}

export default function TrainingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [training, setTraining] =
    useState<ApiCompanyTrainingDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    trainingsApi
      .companyShow(id)
      .then((res) => setTraining(res.data))
      .catch(() => setTraining(null))
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!training) return;
    setDeleting(true);
    try {
      await trainingsApi.companyDelete(training.id);
      router.push("/company/training");
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

  if (!training) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Training not found.</p>
        <Link href="/company/training">
          <Button variant="outline" className="mt-4">
            Back to Training
          </Button>
        </Link>
      </div>
    );
  }

  const totalMinutes = training.total_duration;
  const totalHours =
    totalMinutes >= 60
      ? `${Math.floor(totalMinutes / 60)}h ${
          totalMinutes % 60 > 0 ? `${totalMinutes % 60}m` : ""
        }`.trim()
      : `${totalMinutes}m`;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Link
        href="/company/training"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Training
      </Link>

      <Card className="mb-6">
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold mb-2">{training.title}</h1>
          <p className="text-sm text-muted-foreground mb-4">
            {training.description}
          </p>

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span>{training.modules.length} modules</span>
            <span>{totalHours}</span>
            <span>{training.enrolled_count} enrolled</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-3">
          {training.modules.map((module, i) => (
            <div key={module.id}>
              {i > 0 && <Separator />}
              <ModuleCard module={module} />
            </div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}