export default function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="skeleton h-10 w-48 rounded-lg"></div>
        <div className="skeleton h-8 w-32 rounded-full"></div>
      </div>

      {/* Table skeleton */}
      <div className="overflow-hidden rounded-card-lg">
        {/* Table header */}
        <div className="bg-wise-surface px-6 py-3 flex justify-between">
          <div className="skeleton h-4 w-24 rounded"></div>
          <div className="skeleton h-4 w-20 rounded"></div>
        </div>

        {/* Table rows */}
        {[...Array(8)].map((_, i) => (
          <div key={i} className="px-6 py-4 flex justify-between items-center border-t border-wise-surface">
            <div className="flex items-center gap-3">
              <div className="skeleton h-8 w-8 rounded-full"></div>
              <div className="space-y-2">
                <div className="skeleton h-4 w-12 rounded"></div>
                <div className="skeleton h-3 w-24 rounded"></div>
              </div>
            </div>
            <div className="skeleton h-6 w-20 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
