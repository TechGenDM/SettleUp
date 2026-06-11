import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Receipt, IndianRupee, User, Check, Users, Save } from 'lucide-react';
import { cn } from '../utils/cn';

const AddExpenseForm = ({ groupMembers, onSubmit, onCancel }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  
  const [paidByUid, setPaidByUid] = useState(groupMembers[0]?.uid || '');
  const [splitBetweenUids, setSplitBetweenUids] = useState(groupMembers.map(m => m.uid));
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleToggleSplit = (uid) => {
    if (splitBetweenUids.includes(uid)) {
      setSplitBetweenUids(splitBetweenUids.filter(id => id !== uid));
    } else {
      setSplitBetweenUids([...splitBetweenUids, uid]);
    }
  };

  const handleSelectAll = (e) => {
    e.preventDefault();
    setSplitBetweenUids(groupMembers.map(m => m.uid));
  };
  
  const handleClearAll = (e) => {
    e.preventDefault();
    setSplitBetweenUids([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    const parsedAmount = parseFloat(amount);
    
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Amount must be greater than zero.");
      return;
    }
    
    if (!description.trim()) {
      setError("Description cannot be empty.");
      return;
    }

    if (splitBetweenUids.length === 0) {
      setError("Expense must be split between at least one person.");
      return;
    }

    const paidByMember = groupMembers.find(m => m.uid === paidByUid);
    if (!paidByMember) {
      setError("Invalid paid-by member selected.");
      return;
    }

    const splitMembers = splitBetweenUids
      .map(uid => groupMembers.find(m => m.uid === uid))
      .filter(Boolean);

    setLoading(true);
    
    try {
      await onSubmit({
        description: description.trim(),
        amount: parsedAmount,
        paidBy: { uid: paidByMember.uid, email: paidByMember.email },
        splitBetween: splitMembers.map(m => ({ uid: m.uid, email: m.email }))
      });
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="glass-surface rounded-2xl overflow-hidden p-8 shadow-2xl">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-brand-primary/10 p-2.5">
            <Receipt className="h-6 w-6 text-brand-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">Add Expense</h3>
            <p className="text-sm text-text-secondary">Keep track of who owes what.</p>
          </div>
        </div>
        <button 
          onClick={onCancel}
          className="rounded-full p-2 text-text-muted transition-colors hover:bg-glass-bg hover:text-text-primary"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 rounded-xl border border-error/20 bg-error/10 p-4 text-sm text-error flex items-center gap-2"
        >
          <X className="h-4 w-4" />
          {error}
        </motion.div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-secondary">Description</label>
            <div className="relative">
              <input 
                type="text"
                required
                disabled={loading}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What was it for?"
                className="w-full rounded-xl border border-glass-border bg-bg-secondary p-3 text-text-primary outline-none transition-all placeholder:text-text-muted focus:border-brand-primary/50 focus:bg-bg-primary focus:ring-2 focus:ring-brand-primary/20"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-text-secondary">Amount</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <IndianRupee className="h-4 w-4 text-text-muted" />
              </div>
              <input 
                type="number"
                step="0.01"
                min="0.01"
                required
                disabled={loading}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full rounded-xl border border-glass-border bg-bg-secondary p-3 pl-9 text-text-primary outline-none transition-all placeholder:text-text-muted focus:border-brand-primary/50 focus:bg-bg-primary focus:ring-2 focus:ring-brand-primary/20"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-text-secondary">Who paid?</label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <User className="h-4 w-4 text-text-muted" />
            </div>
            <select 
              value={paidByUid}
              onChange={(e) => setPaidByUid(e.target.value)}
              disabled={loading}
              className="w-full appearance-none rounded-xl border border-glass-border bg-bg-secondary p-3 pl-9 text-text-primary outline-none transition-all focus:border-brand-primary/50 focus:bg-bg-primary focus:ring-2 focus:ring-brand-primary/20"
            >
              {groupMembers.map(member => (
                <option key={`paidby-${member.uid}`} value={member.uid} className="bg-bg-secondary text-text-primary">
                  {member.email}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-text-secondary">Split between</label>
            <div className="flex gap-4">
              <button 
                type="button"
                onClick={handleSelectAll} 
                disabled={loading} 
                className="text-xs font-semibold text-brand-primary hover:text-brand-secondary uppercase tracking-wider"
              >
                Select All
              </button>
              <button 
                type="button"
                onClick={handleClearAll} 
                disabled={loading} 
                className="text-xs font-semibold text-text-muted hover:text-text-secondary uppercase tracking-wider"
              >
                Clear
              </button>
            </div>
          </div>
          
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {groupMembers.map(member => {
              const isSelected = splitBetweenUids.includes(member.uid);
              return (
                <label 
                  key={`split-${member.uid}`} 
                  className={cn(
                    "relative flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-all",
                    isSelected 
                      ? "border-brand-primary/50 bg-brand-primary/10 text-text-primary shadow-lg" 
                      : "border-glass-border bg-bg-secondary text-text-secondary hover:bg-glass-bg hover:text-text-primary"
                  )}
                >
                  <div className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-md border transition-all",
                    isSelected ? "border-brand-primary bg-brand-primary text-white" : "border-glass-border"
                  )}>
                    {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                  </div>
                  <input 
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleToggleSplit(member.uid)}
                    disabled={loading}
                    className="sr-only"
                  />
                  <span className="text-xs font-medium truncate">{member.email.split('@')[0]}</span>
                </label>
              );
            })}
          </div>
        </div>

        <div className="flex gap-4 pt-4 border-t border-glass-border">
          <button 
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 rounded-xl border border-glass-border bg-transparent px-6 py-3 font-semibold text-text-secondary transition-all hover:bg-glass-bg hover:text-text-primary"
          >
            Cancel
          </button>
          <button 
            type="submit"
            disabled={loading || !description.trim() || !amount}
            className="flex flex-[2] items-center justify-center gap-2 rounded-xl bg-brand-primary px-6 py-3 font-semibold text-white shadow-lg transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Expense
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddExpenseForm;
