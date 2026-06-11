import React, { useState, useEffect, useMemo, useContext, useCallback, memo, useRef } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Plus, Receipt, User as UserIcon, Calendar, CheckCircle2, AlertCircle,
  Activity, ArrowRightLeft, AlignLeft, Users
} from 'lucide-react';
import { getGroup } from '../services/groupService';
import { useExpenses } from '../hooks/useExpenses';
import AddExpenseForm from '../components/AddExpenseForm';
import { calculateBalances } from '../utils/calculateBalances';
import { simplifyDebts } from '../utils/simplifyDebts';
import { AuthContext } from '../context/AuthContext';
import { ExpenseItemSkeleton, BalanceCardSkeleton } from '../components/Skeletons';
import GlassCard from '../components/ui/GlassCard';
import CustomButton from '../components/ui/CustomButton';
import SettlementFlow from '../components/ui/SettlementFlow';
import { cn } from '../utils/cn';

/* ── Expense Item (Linear Style) ── */
const ExpenseItem = memo(({ exp }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:px-4 sm:py-3 border-b border-border last:border-0 hover:bg-bg-hover transition-colors group cursor-pointer">
    <div className="flex items-start gap-3">
      <div className="mt-0.5 h-7 w-7 rounded bg-bg-primary border border-border flex items-center justify-center flex-shrink-0 text-text-muted group-hover:text-text-primary group-hover:border-text-muted transition-colors">
        <Receipt size={14} strokeWidth={1.5} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="text-[14px] font-semibold text-text-primary group-hover:text-brand-primary transition-colors truncate">
            {exp.description}
          </h4>
          {exp._isOptimistic && (
            <span className="text-[10px] font-medium text-warning bg-warning/10 px-1.5 py-0.5 rounded uppercase tracking-widest">
              Saving…
            </span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-[12px] text-text-secondary">
          <span className="flex items-center gap-1">
            <UserIcon size={12} strokeWidth={1.5} />
            <span className="font-medium">{exp.paidBy.email.split('@')[0]}</span> paid
          </span>
          <span className="flex items-center gap-1">
            <Users size={12} strokeWidth={1.5} />
            {exp.splitBetween.length} split
          </span>
          <span className="flex items-center gap-1 text-text-muted">
            <Calendar size={12} strokeWidth={1.5} />
            {exp.createdAt?.seconds
              ? new Date(exp.createdAt.seconds * 1000).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
              : 'Just now'}
          </span>
        </div>
      </div>
    </div>
    <div className="text-[14px] font-semibold text-text-primary tabular sm:text-right flex-shrink-0 mt-2 sm:mt-0">
      ₹{exp.amount.toFixed(2)}
    </div>
  </div>
));
ExpenseItem.displayName = 'ExpenseItem';

/* ── GroupDetails ── */
const GroupDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [currentGroup, setCurrentGroup] = useState(location.state?.group || null);
  const [groupsLoading, setGroupsLoading] = useState(!currentGroup);
  const [groupError, setGroupError] = useState(null);

  const { expenses, loading: expensesLoading, addExpense } = useExpenses(id);
  const [showAddForm, setShowAddForm] = useState(false);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (currentGroup || hasFetched.current) return;
    hasFetched.current = true;
    (async () => {
      try { setCurrentGroup(await getGroup(id)); }
      catch (err) { setGroupError(err.message); }
      finally { setGroupsLoading(false); }
    })();
  }, [id]);

  const userBalances = useMemo(() => calculateBalances(expenses), [expenses]);
  const simplifiedTransactions = useMemo(() => simplifyDebts(userBalances), [userBalances]);
  const userNetPosition = useMemo(() => currentUser ? (userBalances[currentUser.uid] || 0) : 0, [userBalances, currentUser]);

  const handleCreateExpense = useCallback(async (payload) => {
    await addExpense(payload);
    setShowAddForm(false);
  }, [addExpense]);

  const getEmailFromUid = useCallback((uid) => {
    const m = currentGroup?.members.find(m => m.uid === uid);
    return m ? m.email : 'Unknown';
  }, [currentGroup]);

  if (groupsLoading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-text-primary" />
      </div>
    );
  }

  if (groupError || !currentGroup) {
    return (
      <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center p-8 text-center">
        <AlertCircle size={24} className="text-error mb-4" strokeWidth={1.5} />
        <h2 className="text-[16px] font-semibold text-text-primary mb-2">Group Not Found</h2>
        <p className="text-[13px] text-text-secondary mb-6 max-w-sm">{groupError || "This group doesn't exist or you don't have access."}</p>
        <CustomButton variant="secondary" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </CustomButton>
      </div>
    );
  }

  const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col">

      {/* ── HEADER (Ultra-minimal) ── */}
      <header className="sticky top-0 z-50 bg-bg-secondary border-b border-border">
        <div className="mx-auto max-w-[1100px] px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="text-text-muted hover:text-text-primary transition-colors">
              <ArrowLeft size={16} strokeWidth={2} />
            </Link>
            <span className="text-border">/</span>
            <span className="text-[14px] font-semibold text-text-primary tracking-tight truncate max-w-[200px] sm:max-w-xs">
              {currentGroup.name}
            </span>
            <span className="hidden sm:inline-flex px-1.5 py-0.5 rounded bg-bg-primary border border-border text-[10px] font-medium text-text-secondary">
              {currentGroup.members.length} members
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-[12px]">
              <span className="text-text-secondary">Your Net:</span>
              <span className={cn('font-semibold', userNetPosition > 0 ? 'text-success' : userNetPosition < 0 ? 'text-error' : 'text-text-primary')}>
                {userNetPosition > 0 ? '+' : ''}₹{Math.abs(userNetPosition).toFixed(2)}
              </span>
            </div>
            <div className="h-4 w-px bg-border hidden sm:block" />
            <CustomButton onClick={() => setShowAddForm(true)} icon={Plus}>
              New Expense
            </CustomButton>
          </div>
        </div>
      </header>

      <main className="flex-1 mx-auto max-w-[1100px] w-full px-6 py-8">
        
        {/* ── 2-Col Layout ── */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Left: Balances & Ledger (The most important flow) */}
          <div className="w-full lg:w-[320px] flex-shrink-0 space-y-6">
            
            {/* Balances Board */}
            <div>
              <h3 className="text-[12px] font-semibold text-text-secondary uppercase tracking-widest mb-3 flex items-center gap-2">
                <AlignLeft size={14} /> Balances
              </h3>
              
              <GlassCard className="overflow-hidden">
                <div className="bg-bg-primary px-4 py-3 border-b border-border flex items-center justify-between">
                  <span className="text-[13px] font-semibold text-text-primary">Total Group Spend</span>
                  <span className="text-[14px] font-bold tabular text-text-primary">₹{totalSpent.toFixed(2)}</span>
                </div>
                
                <div className="p-2">
                  {expensesLoading ? (
                    <div className="p-4"><BalanceCardSkeleton /></div>
                  ) : Object.keys(userBalances).length === 0 ? (
                    <div className="flex flex-col items-center py-6 text-center">
                      <CheckCircle2 size={20} className="text-success mb-2" strokeWidth={1.5} />
                      <p className="text-[13px] font-medium text-text-secondary">All settled up!</p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {Object.entries(userBalances).map(([uid, balance]) => {
                        if (Math.abs(balance) < 0.01) return null;
                        const isPos = balance > 0;
                        const isMe = currentUser?.uid === uid;
                        const name = isMe ? 'You' : getEmailFromUid(uid).split('@')[0];
                        return (
                          <div key={uid} className="flex items-center justify-between p-2 rounded-md hover:bg-bg-primary transition-colors">
                            <div className="flex items-center gap-2.5">
                              <div className={cn(
                                'h-6 w-6 rounded flex items-center justify-center text-[11px] font-bold',
                                isPos ? 'bg-success-bg text-success' : 'bg-error-bg text-error'
                              )}>
                                {name.charAt(0).toUpperCase()}
                              </div>
                              <span className="text-[13px] font-medium text-text-primary">{name}</span>
                            </div>
                            <span className={cn('text-[13px] font-semibold tabular', isPos ? 'text-success' : 'text-error')}>
                              {isPos ? '+' : '-'}₹{Math.abs(balance).toFixed(2)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </GlassCard>
            </div>

            {/* Optimal Settlement */}
            {!expensesLoading && simplifiedTransactions.length > 0 && (
              <div>
                <SettlementFlow
                  transactions={simplifiedTransactions}
                  getEmailFromUid={getEmailFromUid}
                />
              </div>
            )}
          </div>

          {/* Right: Expenses List */}
          <div className="flex-1 w-full min-w-0">
            <h3 className="text-[12px] font-semibold text-text-secondary uppercase tracking-widest mb-3 flex items-center gap-2">
              <Activity size={14} /> Expense Ledger
            </h3>

            <AnimatePresence>
              {showAddForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden mb-6"
                >
                  <AddExpenseForm
                    groupMembers={currentGroup.members}
                    onSubmit={handleCreateExpense}
                    onCancel={() => setShowAddForm(false)}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <GlassCard className="overflow-hidden">
              {expensesLoading ? (
                <div className="p-4 space-y-4">
                  {[0, 1, 2].map(i => <ExpenseItemSkeleton key={i} />)}
                </div>
              ) : expenses.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <Receipt size={24} className="text-text-muted mb-3" strokeWidth={1.5} />
                  <h3 className="text-[14px] font-semibold text-text-primary mb-1">No expenses yet</h3>
                  <p className="text-[13px] text-text-secondary mb-4 max-w-[250px]">
                    Record your first expense to begin tracking balances.
                  </p>
                  <CustomButton variant="secondary" onClick={() => setShowAddForm(true)} icon={Plus}>
                    Add expense
                  </CustomButton>
                </div>
              ) : (
                <div className="flex flex-col">
                  {expenses.map((exp) => (
                    <ExpenseItem key={exp.id} exp={exp} />
                  ))}
                </div>
              )}
            </GlassCard>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GroupDetails;
