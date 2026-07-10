"use client";

interface SkeletonLoaderProps {
  limit?: number;
}

export default function SkeletonLoader({ limit = 5 }: SkeletonLoaderProps) {
  return (
    <div className="space-y-4">
      {/* Desktop Table Skeleton */}
      <div className="hidden md:block w-full overflow-hidden rounded-2xl border border-white/5 bg-card-bg/30">
        <div className="py-4 px-6 border-b border-white/5 bg-white/[0.01] flex items-center justify-between">
          <div className="h-4 w-12 bg-white/5 rounded animate-shimmer" />
          <div className="h-4 w-48 bg-white/5 rounded animate-shimmer" />
          <div className="h-4 w-28 bg-white/5 rounded animate-shimmer" />
          <div className="h-4 w-20 bg-white/5 rounded animate-shimmer" />
          <div className="h-4 w-20 bg-white/5 rounded animate-shimmer" />
        </div>
        <div className="divide-y divide-white/5">
          {[...Array(limit)].map((_, i) => (
            <div key={i} className="py-5 px-6 flex items-center justify-between">
              <div className="h-7 w-7 rounded-full bg-white/5 animate-shimmer" />
              <div className="flex-1 max-w-sm ml-6">
                <div className="h-4 w-32 bg-white/5 rounded animate-shimmer mb-2" />
                <div className="h-3 w-48 bg-white/5 rounded animate-shimmer" />
              </div>
              <div className="h-6 w-24 bg-white/5 rounded-full animate-shimmer ml-4" />
              <div className="h-4 w-16 bg-white/5 rounded animate-shimmer ml-4" />
              <div className="h-6 w-20 bg-white/5 rounded-full animate-shimmer ml-4" />
              <div className="h-8 w-20 bg-white/5 rounded-xl animate-shimmer ml-4" />
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Card Skeleton */}
      <div className="block md:hidden space-y-4">
        {[...Array(limit)].map((_, i) => (
          <div
            key={i}
            className="glass-panel rounded-2xl p-5 border border-white/5 bg-card-bg/25 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white/5 animate-shimmer" />
                <div className="space-y-2">
                  <div className="h-4 w-28 bg-white/5 rounded animate-shimmer" />
                  <div className="h-3 w-16 bg-white/5 rounded animate-shimmer" />
                </div>
              </div>
              <div className="w-9 h-9 rounded-xl bg-white/5 animate-shimmer" />
            </div>
            
            <div className="space-y-2">
              <div className="h-3.5 w-full bg-white/5 rounded animate-shimmer" />
              <div className="h-3.5 w-3/4 bg-white/5 rounded animate-shimmer" />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/5">
              {[...Array(4)].map((_, j) => (
                <div key={j} className="space-y-1.5">
                  <div className="h-2.5 w-10 bg-white/5 rounded animate-shimmer" />
                  <div className="h-3.5 w-16 bg-white/5 rounded animate-shimmer" />
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-white/5">
              <div className="h-5 w-20 bg-white/5 rounded-full animate-shimmer" />
              <div className="h-7 w-20 bg-white/5 rounded-xl animate-shimmer" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
