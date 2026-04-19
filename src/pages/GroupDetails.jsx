import React, { useState, useEffect, useMemo, useContext, useCallback, memo } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { getGroup } from '../services/groupService';
import { useExpenses } from '../hooks/useExpenses';
import AddExpenseForm from '../components/AddExpenseForm';
import { calculateBalances } from '../utils/calculateBalances';
import { simplifyDebts } from '../utils/simplifyDebts';
import { AuthContext } from '../context/AuthContext';
import { ExpenseItemSkeleton, BalanceCardSkeleton } from '../components/Skeletons';

// PERF: memo'd so it only re-renders when its own expense data ref changes,
// not when unrelated GroupDetails state (e.g. showAddForm) changes.
const ExpenseItem = memo(({ exp }) => (
  <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-700 bg-slate-800 p-5 transition-all hover:border-slate-600 hover:shadow-md animate-[fadeIn_0.3s_ease-out] ${exp._isOptimistic ? 'opacity-60' : ''}`}>
    <div className="flex flex-col">
      <span className="text-lg font-semibold text-slate-100 mb-1">
        {exp.description}
        {exp._isOptimistic && <span className="ml-2 text-xs font-normal text-slate-500">Saving…</span>}
      </span>
      <div className="text-sm text-slate-400 flex items-center gap-1.5">
        <span className="font-medium text-slate-300">Paid by:</span>
        <span className="bg-slate-900 px-2 py-0.5 rounded text-xs border border-slate-700">{exp.paidBy.email}</span>
      </div>
      <div className="text-xs text-slate-500 mt-2">
        Split between {exp.splitBetween.length} member{exp.splitBetween.length !== 1 && 's'}
      </div>
    </div>
    <div className="flex justify-end border-t border-slate-700 sm:border-0 pt-3 sm:pt-0 mt-2 sm:mt-0">
      <div className="text-2xl font-bold text-emerald-400">
        ₹{exp.amount.toFixed(2)}
      </div>
    </div>
  </div>
));

ExpenseItem.displayName = 'ExpenseItem';

// Skeleton rows shown while the first Firestore snapshot is in-flight
const ExpenseListSkeleton = () => (
  <div className="flex flex-col gap-3">
    {[0, 1, 2].map(i => <ExpenseItemSkeleton key={i} />)}
  </div>
);

const GroupDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const { currentUser } = useContext(AuthContext);

  const [currentGroup, setCurrentGroup] = useState(location.state?.group || null);
  const [groupsLoading, setGroupsLoading] = useState(!currentGroup);
  const [groupError, setGroupError] = useState(null);

  const { expenses, loading: expensesLoading, error: expensesError, addExpense } = useExpenses(id);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    // Only fetch if we don't already have the group (passed via navigation state)
    if (!currentGroup) {
      const fetchSpecificGroup = async () => {
        try {
          const groupData = await getGroup(id);
          setCurrentGroup(groupData);
        } catch (err) {
          setGroupError(err.message);
        } finally {
          setGroupsLoading(false);
        }
      };
      fetchSpecificGroup();
    }
  }, [id, currentGroup]);

  // PERF: useMemo ensures calculateBalances (O(n) loop) and simplifyDebts only
  // run when the expenses array reference actually changes — not on every render.
  const userBalances = useMemo(() => calculateBalances(expenses), [expenses]);
  const simplifiedTransactions = useMemo(() => simplifyDebts(userBalances), [userBalances]);

  // PERF: useCallback gives stable references to all event handlers so memo'd
  // children (AddExpenseForm) don't re-render on unrelated parent state changes.
  const handleShowForm = useCallback(() => setShowAddForm(true), []);
  const handleHideForm = useCallback(() => setShowAddForm(false), []);

  const handleCreateExpense = useCallback(async (payload) => {
    await addExpense(payload);
    setShowAddForm(false);
  }, [addExpense]);

  // PERF: Memoize this lookup so it doesn't regenerate a closure on every render
  const getEmailFromUid = useCallback((uid) => {
    const member = currentGroup?.members.find(m => m.uid === uid);
    return member ? member.email : 'Unknown User';
  }, [currentGroup]);

  if (groupsLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-900 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-700 border-t-indigo-500" />
      </div>
    );
  }

  if (groupError || !currentGroup) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-900 text-slate-50 items-center justify-center p-8 text-center">
        <h2 className="text-2xl font-bold text-slate-400 mb-4">Group Not Found</h2>
        <p className="text-slate-500 mb-6">{groupError || "This group doesn't exist or you don't have access to it."}</p>
        <Link to="/dashboard" className="text-indigo-500 hover:text-indigo-400">Return to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-900 text-slate-50">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-700 bg-slate-800 px-4 sm:px-8 py-4 shadow-sm">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="rounded bg-slate-700 px-3 py-1 text-sm font-medium text-slate-300 hover:bg-slate-600 transition-colors">
            ← Back
          </Link>
          <h1 className="max-w-[150px] truncate text-xl font-bold text-indigo-400 sm:max-w-md">{currentGroup.name}</h1>
        </div>
        <div className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-400">
          {currentGroup.members.length} Members
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1000px] flex-1 p-4 sm:p-8">

        {/* Group Balances Section — only shown when there are expenses */}
        {expensesLoading ? (
          // SKELETON: Show balance card placeholders so the layout doesn't jump
          <div className="mb-8 rounded-xl border border-slate-700 bg-slate-800 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-700">
              <div className="animate-pulse h-6 w-40 rounded bg-slate-700" />
            </div>
            <div className="p-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2].map(i => <BalanceCardSkeleton key={i} />)}
            </div>
          </div>
        ) : expenses.length > 0 && (
          <div className="mb-8 rounded-xl border border-slate-700 bg-slate-800 shadow-xl overflow-hidden animate-[fadeIn_0.3s_ease-out]">
            <div className="border-b border-slate-700 bg-slate-800/80 px-6 py-4">
              <h2 className="flex items-center gap-2 text-xl font-bold text-slate-100">
                <span className="text-indigo-400">📊</span> Group Balances
              </h2>
            </div>
            <div className="p-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Object.keys(userBalances).length === 0 ? (
                  <div className="text-slate-400 text-sm">Everyone is fully settled!</div>
                ) : (
                  Object.entries(userBalances).map(([uid, balance]) => {
                    if (Math.abs(balance) < 0.01) return null;
                    const isPositive = balance > 0;
                    const isCurrentUser = currentUser?.uid === uid;
                    const displayName = isCurrentUser ? 'You' : getEmailFromUid(uid);
                    return (
                      <div key={uid} className={`rounded-lg border p-4 ${isPositive ? 'border-emerald-500/30 bg-emerald-500/10' : 'border-rose-500/30 bg-rose-500/10'}`}>
                        <p className="mb-1 truncate text-sm font-medium text-slate-300" title={getEmailFromUid(uid)}>{displayName}</p>
                        <p className={`text-lg font-bold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {isCurrentUser
                            ? (isPositive ? `You should receive ₹${Math.abs(balance).toFixed(2)}` : `You owe ₹${Math.abs(balance).toFixed(2)}`)
                            : (isPositive ? `should receive ₹${Math.abs(balance).toFixed(2)}` : `owes ₹${Math.abs(balance).toFixed(2)}`)}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}

        {/* How to Settle Up Section */}
        {!expensesLoading && simplifiedTransactions.length > 0 && (
          <div className="mb-10 rounded-xl border border-slate-700 bg-slate-800 shadow-xl overflow-hidden animate-[fadeIn_0.3s_ease-out]">
            <div className="border-b border-slate-700 bg-slate-800/80 px-6 py-4">
              <h2 className="flex items-center gap-2 text-xl font-bold text-slate-100">
                <span className="text-rose-400">💸</span> How to Settle Up
              </h2>
            </div>
            <div className="p-6">
              <div className="flex flex-col gap-3">
                {simplifiedTransactions.map((t, index) => {
                  const isCurrentUserFrom = t.from === currentUser?.uid;
                  const isCurrentUserTo = t.to === currentUser?.uid;
                  const fromName = isCurrentUserFrom ? 'You' : getEmailFromUid(t.from);
                  const toName = isCurrentUserTo ? 'You' : getEmailFromUid(t.to);
                  return (
                    <div key={index} className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-900 p-4 transition-colors hover:border-slate-600">
                      <div className="flex items-center gap-2 text-sm sm:text-base">
                        <span className={`font-medium ${isCurrentUserFrom ? 'text-rose-400' : 'text-slate-300'}`}>{fromName}</span>
                        <span className="mx-1 text-sm text-slate-500">pay{isCurrentUserFrom ? '' : 's'}</span>
                        <span className={`font-medium ${isCurrentUserTo ? 'text-emerald-400' : 'text-slate-300'}`}>{toName}</span>
                      </div>
                      <span className="font-bold text-indigo-400">₹{t.amount.toFixed(2)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Expenses List Section */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-slate-100">Expenses</h2>
          {!showAddForm && (
            <button
              onClick={handleShowForm}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:bg-indigo-700 hover:shadow-indigo-500/20 active:scale-[0.98]"
            >
              + Add Expense
            </button>
          )}
        </div>

        {showAddForm && (
          <AddExpenseForm
            members={currentGroup.members}
            onSubmit={handleCreateExpense}
            onCancel={handleHideForm}
          />
        )}

        {expensesError && (
          <div className="mb-6 rounded-lg border border-red-500/20 bg-red-500/10 p-4 font-medium text-red-500">
            {expensesError}
          </div>
        )}

        {/* SKELETON: Expense rows while first snapshot loads */}
        {expensesLoading ? (
          <ExpenseListSkeleton />
        ) : expenses.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-700 bg-slate-800/50 p-12 text-center animate-[fadeIn_0.5s_ease-out]">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-700 text-2xl">💸</div>
            <h3 className="mb-2 text-lg font-medium text-slate-200">No Expenses Yet</h3>
            <p className="mx-auto mb-4 max-w-md text-sm text-slate-500">No expenses yet. Add your first expense.</p>
            {!showAddForm && (
              <button onClick={handleShowForm} className="mt-2 text-sm font-medium text-indigo-400 hover:text-indigo-300 hover:underline">
                + Add Expense
              </button>
            )}
          </div>
        ) : (
          // PERF: Each ExpenseItem is memo'd, so only items whose data changed
          // will re-render when a new expense arrives via onSnapshot.
          <div className="flex flex-col gap-3">
            {expenses.map(exp => (
              <ExpenseItem key={exp.id} exp={exp} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default GroupDetails;
