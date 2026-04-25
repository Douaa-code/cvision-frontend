import { cn } from "@/lib/utils";

type StatusType = "Accepted" | "Pending" | "Rejected" | "Approved" | "Active" | "Closed" | "Passed" | "Failed" | "Not Started";

const statusStyles: Record<StatusType, string> = {
  Accepted: "bg-[#CCF4EA] text-[#00C897]",
  Approved: "bg-[#CCF4EA] text-[#00C897]",
  Active: "bg-[#CCF4EA] text-[#00C897]",
  Passed: "bg-[#CCF4EA] text-[#00C897]",
  Pending: "bg-[#FFF3CD] text-[#FFC107]",
  "Not Started": "bg-[#FFF3CD] text-[#FFC107]",
  Rejected: "bg-[#FDEDEB] text-[#E74C3C]",
  Closed: "bg-[#FDEDEB] text-[#E74C3C]",
  Failed: "bg-[#FDEDEB] text-[#E74C3C]",
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const style = statusStyles[status as StatusType] ?? "bg-gray-100 text-gray-500";
  return (
    <span
      className={cn(
        "px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium inline-block whitespace-nowrap",
        style,
        className
      )}
    >
      {status}
    </span>
  );
}
