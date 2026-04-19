import React from 'react';

// A single pulsing shimmer block — the base of every skeleton element
const Shimmer = ({ className = '' }) => (
  <div className={`animate-pulse rounded bg-slate-700/60 ${className}`} />
);

// Mimics the shape of a group card on the Dashboard
export const GroupCardSkeleton = () => (
  <div className="flex h-32 flex-col justify-between rounded-xl border border-slate-700/50 bg-slate-800/50 p-6">
    <div className="space-y-2">
      <Shimmer className="h-5 w-3/4" />
      <Shimmer className="h-3 w-1/3" />
    </div>
    <Shimmer className="h-3 w-1/2" />
  </div>
);

// Mimics the shape of an expense row on the GroupDetails page
export const ExpenseItemSkeleton = () => (
  <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-700/50 bg-slate-800/50 p-5">
    <div className="flex flex-col gap-2 flex-1">
      <Shimmer className="h-5 w-1/2" />
      <Shimmer className="h-3 w-1/3" />
      <Shimmer className="h-3 w-1/4" />
    </div>
    <Shimmer className="h-8 w-20 shrink-0" />
  </div>
);

// Mimics a balance card in the Group Balances section
export const BalanceCardSkeleton = () => (
  <div className="rounded-lg border border-slate-700/50 bg-slate-800/50 p-4 space-y-2">
    <Shimmer className="h-4 w-2/3" />
    <Shimmer className="h-6 w-1/2" />
  </div>
);
