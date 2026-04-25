"use client";

import { cn } from "@/lib/utils";

interface MatchScoreProps {
  score: number | null;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

function getColor(score: number) {
  if (score >= 67) return "#00C897";
  if (score >= 34) return "#FFC107";
  return "#E74C3C";
}

const sizes = {
  sm: { width: 36, stroke: 3, fontSize: "text-xs" },
  md: { width: 48, stroke: 4, fontSize: "text-sm" },
  lg: { width: 60, stroke: 5, fontSize: "text-base" },
};

export function MatchScore({
  score,
  size = "md",
  showLabel = true,
  className,
}: MatchScoreProps) {
  const { width, stroke, fontSize } = sizes[size];

  if (score === null) {
    return (
      <div className={cn("flex items-center gap-1 sm:gap-2", className)}>
        <svg width={width} height={width} className="-rotate-90">
          <circle cx={width / 2} cy={width / 2} r={(width - stroke) / 2} fill="none" stroke="#E5E7EB" strokeWidth={stroke} />
        </svg>
        {showLabel && (
          <span className={cn("font-bold text-muted-foreground", fontSize)}>N/A</span>
        )}
      </div>
    );
  }

  const color = getColor(score);
  const radius = (width - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className={cn("flex items-center gap-1 sm:gap-2", className)}>
      <svg width={width} height={width} className="-rotate-90">
        <circle
          cx={width / 2}
          cy={width / 2}
          r={radius}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth={stroke}
        />
        <circle
          cx={width / 2}
          cy={width / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      {showLabel && (
        <span className={cn("font-bold", fontSize)} style={{ color }}>
          {score}% Match
        </span>
      )}
    </div>
  );
}
