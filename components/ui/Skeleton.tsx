import React from 'react';

interface SkeletonProps {
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
  return (
    <div className={`animate-pulse bg-dark-border/50 rounded-md ${className}`}></div>
  );
};

export const SkeletonTable: React.FC<{ rows?: number, cols?: number }> = ({ rows = 5, cols = 4 }) => {
    return (
        <div className="w-full">
            <div className="grid grid-cols-4 gap-4 mb-4">
                {[...Array(cols)].map((_, i) => <Skeleton key={i} className="h-6" />)}
            </div>
            <div className="space-y-3">
                {[...Array(rows)].map((_, i) => (
                    <div key={i} className="grid grid-cols-4 gap-4">
                        <Skeleton className="h-8" />
                        <Skeleton className="h-8 col-span-1" />
                        <Skeleton className="h-8" />
                        <Skeleton className="h-8" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Skeleton;
