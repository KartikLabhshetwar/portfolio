'use client';

interface ProjectSkeletonProps {
  className?: string;
}

export const ProjectSkeleton = ({ className = "" }: ProjectSkeletonProps) => {
  return (
    <div className={`rounded-lg border border-neutral-300 dark:border-[#2E2E2E] bg-white dark:bg-zinc-900 p-1 shadow-sm dark:shadow-none animate-pulse ${className}`}>
      <div className="flex flex-col gap-1">
        {/* Image/Video Skeleton */}
        <div className="relative overflow-hidden rounded-lg">
          <div className="w-full h-48 bg-gradient-to-br from-neutral-200/50 via-neutral-300/50 to-neutral-200/50 dark:from-neutral-800/50 dark:via-neutral-700/50 dark:to-neutral-800/50 rounded-lg">
            {/* Shimmer effect */}
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent dark:via-white/10" />
          </div>
          
          {/* Title overlay skeleton */}
          <div className="absolute bottom-0 w-full p-2 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
            <div className="h-4 bg-white/30 rounded w-3/4" />
          </div>
        </div>
        
        {/* Button Skeleton */}
        <div className="px-0">
          <div className="w-full rounded-lg bg-neutral-100 dark:bg-zinc-900 border border-neutral-300 dark:border-[#2E2E2E] px-3 sm:px-4 py-2.5 sm:py-3">
            <div className="h-4 bg-neutral-300/50 dark:bg-neutral-600/50 rounded w-24 mx-auto" />
          </div>
        </div>
      </div>
    </div>
  );
};

interface MasonrySkeletonProps {
  count?: number;
  className?: string;
}

export const MasonrySkeleton = ({ count = 3, className = "" }: MasonrySkeletonProps) => {
  return (
    <div className={`min-h-screen w-full bg-neutral-100 dark:bg-zinc-900 p-2 sm:p-3.5 ${className}`}>
      <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: count }).map((_, index) => (
          <ProjectSkeleton key={`skeleton-${index}`} />
        ))}
      </div>
    </div>
  );
};
