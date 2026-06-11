import React from 'react';

const Shimmer = ({ className = '' }) => (
  <div className={`animate-pulse rounded-lg bg-slate-100 ${className}`} />
);

export const GroupCardSkeleton = () => (
  <div className="flex h-44 flex-col justify-between rounded-2xl border border-slate-100 bg-white shadow-card-md p-6">
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <Shimmer className="h-10 w-10 rounded-xl" />
        <Shimmer className="h-5 w-2/5" />
      </div>
      <Shimmer className="h-3.5 w-1/3" />
    </div>
    <div className="flex items-center justify-between border-t border-slate-100 pt-4">
      <Shimmer className="h-3 w-1/4" />
      <Shimmer className="h-5 w-20 rounded-full" />
    </div>
  </div>
);

export const ExpenseItemSkeleton = () => (
  <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-white shadow-card p-5">
    <div className="flex items-start gap-4 flex-1">
      <Shimmer className="h-11 w-11 rounded-xl flex-shrink-0" />
      <div className="flex flex-col gap-2.5 flex-1 pt-1">
        <Shimmer className="h-5 w-1/3" />
        <div className="flex gap-4">
          <Shimmer className="h-3 w-20" />
          <Shimmer className="h-3 w-16" />
        </div>
      </div>
    </div>
    <Shimmer className="h-8 w-24 rounded-xl" />
  </div>
);

export const BalanceCardSkeleton = () => (
  <div className="flex items-center justify-between py-1.5">
    <div className="flex items-center gap-3">
      <Shimmer className="h-9 w-9 rounded-full" />
      <Shimmer className="h-4 w-28" />
    </div>
    <Shimmer className="h-4 w-16" />
  </div>
);
