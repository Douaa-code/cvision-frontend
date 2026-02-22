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
  status: StatusType;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium inline-block whitespace-nowrap",
        statusStyles[status],
        className
      )}
    >
      {status}
    </span>
  );
}
