import React from 'react';
import { ArrowRight } from 'lucide-react';
import GlassCard from './GlassCard';

const SettlementFlow = ({ transactions, getEmailFromUid }) => {
  if (!transactions || transactions.length === 0) return null;

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-bg-secondary">
      <div className="bg-bg-primary px-4 py-2 border-b border-border text-[11px] font-semibold text-text-secondary uppercase tracking-wider flex items-center justify-between">
        <span>Settlement Plan</span>
        <span className="text-text-muted">{transactions.length} transfer{transactions.length !== 1 ? 's' : ''}</span>
      </div>
      <div className="divide-y divide-border">
        {transactions.map((t, i) => {
          const fromName = getEmailFromUid(t.from).split('@')[0];
          const toName = getEmailFromUid(t.to).split('@')[0];
          return (
            <div key={i} className="flex items-center justify-between p-3 sm:px-4 sm:py-3 hover:bg-bg-hover transition-colors group">
              <div className="flex items-center gap-3">
                <span className="text-[13px] font-medium text-text-primary">{fromName}</span>
                <ArrowRight size={14} className="text-text-muted" strokeWidth={1.5} />
                <span className="text-[13px] font-medium text-text-primary">{toName}</span>
              </div>
              <div className="text-[14px] font-semibold tabular text-text-primary group-hover:text-brand-primary transition-colors">
                ₹{t.amount.toFixed(2)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SettlementFlow;
