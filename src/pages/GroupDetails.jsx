import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { getGroup } from '../services/groupService';
import { useExpenses } from '../hooks/useExpenses';
import AddExpenseForm from '../components/AddExpenseForm';

const GroupDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  
  // Directly extract navigation state avoiding fetching all datasets entirely
  const [currentGroup, setCurrentGroup] = useState(location.state?.group || null);
  const [groupsLoading, setGroupsLoading] = useState(!currentGroup);
  const [groupError, setGroupError] = useState(null);

  const { expenses, loading: expensesLoading, error: expensesError, addExpense } = useExpenses(id);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    // If entered manually via URL, explicitly parse the exact document efficiently natively
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

  if (groupsLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-900 items-center justify-center">
         <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-700 border-t-indigo-500"></div>
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

  const handleCreateExpense = async (payload) => {
    await addExpense(payload);
    setShowAddForm(false);
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-900 text-slate-50">
      <header className="flex items-center justify-between border-b border-slate-700 bg-slate-800 px-4 sm:px-8 py-4 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="rounded bg-slate-700 px-3 py-1 text-sm font-medium text-slate-300 hover:bg-slate-600 transition-colors">
            ← Back
          </Link>
          <h1 className="text-xl font-bold text-indigo-400 truncate max-w-[150px] sm:max-w-md">{currentGroup.name}</h1>
        </div>
        <div className="text-xs font-medium text-slate-400 bg-slate-900 px-3 py-1.5 rounded-full border border-slate-700">
          {currentGroup.members.length} Members
        </div>
      </header>
      
      <main className="mx-auto w-full max-w-[1000px] flex-1 p-4 sm:p-8">
        
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-slate-100">Expenses</h2>
          {!showAddForm && (
            <button 
              onClick={() => setShowAddForm(true)}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-indigo-700 shadow-md hover:shadow-indigo-500/20 active:scale-[0.98]"
            >
              + Add Expense
            </button>
          )}
        </div>

        {showAddForm && (
          <AddExpenseForm 
             members={currentGroup.members} 
             onSubmit={handleCreateExpense} 
             onCancel={() => setShowAddForm(false)} 
          />
        )}

        {expensesError && (
          <div className="mb-6 rounded-lg bg-red-500/10 p-4 text-red-500 border border-red-500/20 font-medium">
            {expensesError}
          </div>
        )}

        {expensesLoading ? (
          <div className="flex py-16 justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-700 border-t-indigo-500"></div>
          </div>
        ) : expenses.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-700 bg-slate-800/50 p-12 text-center animate-[fadeIn_0.5s_ease-out]">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-700 text-2xl">💸</div>
            <h3 className="mb-2 text-lg font-medium text-slate-200">No Expenses Yet</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto mb-4">No expenses yet. Add your first expense.</p>
            {!showAddForm && (
              <button 
                onClick={() => setShowAddForm(true)}
                className="mt-2 text-sm font-medium text-indigo-400 hover:text-indigo-300 hover:underline"
              >
                + Add Expense
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {expenses.map((exp) => (
              <div 
                key={exp.id} 
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-700 bg-slate-800 p-5 transition-all hover:border-slate-600 hover:shadow-md animate-[fadeIn_0.3s_ease-out]"
              >
                <div className="flex flex-col">
                  <span className="text-lg font-semibold text-slate-100 mb-1">{exp.description}</span>
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
                    ${exp.amount.toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default GroupDetails;
