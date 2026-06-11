import React from 'react';
import GlassCard from './GlassCard';
import { cn } from '../../utils/cn';

const SummaryCard = ({ title, amount, variant = 'neutral', className = '' }) => {
  const colors = {
    positive: 'border-success text-success',
    negative: 'border-error text-error',
    neutral: 'border-brand-primary text-text-primary'
  };

  const sign = variant === 'positive' ? '+' : variant === 'negative' ? '-' : '';

  return (
    <GlassCard className={cn('flex flex-col justify-between border-b-4 h-full', colors[variant], className)} hover={false}>
      <span className="text-sm font-medium text-text-secondary uppercase tracking-wider">{title}</span>
      <span className="text-4xl md:text-5xl font-bold tabular mt-4">
        {sign}₹{Math.abs(amount).toFixed(2)}
      </span>
    </GlassCard>
  );
};

export default SummaryCard;
