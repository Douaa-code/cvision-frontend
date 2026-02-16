export function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-4 sm:space-y-6">
      {/* Title */}
      <div className="h-8 w-32 sm:w-48 bg-cvision-bar rounded" />

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-20 sm:h-24 bg-cvision-bar rounded-xl" />
        ))}
      </div>

      {/* Content cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6">
        <div className="h-48 sm:h-64 bg-cvision-bar rounded-xl" />
        <div className="h-48 sm:h-64 bg-cvision-bar rounded-xl" />
      </div>
    </div>
  );
}
