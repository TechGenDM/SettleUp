import { useState, useEffect, useCallback } from 'react';
import { subscribeToExpenses, addExpense as serviceAddExpense } from '../services/expenseService';

export const useExpenses = (groupId) => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!groupId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // groupId is a stable string, so this effect only runs when the group changes.
    // The returned unsubscribe fn is called on cleanup, preventing listener leaks.
    const unsubscribe = subscribeToExpenses(
      groupId,
      (data) => {
        setExpenses(data);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [groupId]);

  // PERF: useCallback with [groupId] dependency — stable reference across renders
  // unless the group changes, preventing unnecessary re-renders in child components.
  const addExpense = useCallback(async (expenseData) => {
    if (!groupId) throw new Error('No group specified.');

    // OPTIMISTIC UPDATE: Show the expense in the list instantly so the user
    // doesn't perceive any lag from the Firestore write (~200-600ms).
    const tempId = `temp_${Date.now()}`;
    const optimisticExpense = {
      id: tempId,
      ...expenseData,
      createdAt: null, // Firestore timestamp will arrive via onSnapshot
      _isOptimistic: true,
    };

    setExpenses(prev => [optimisticExpense, ...prev]);

    try {
      await serviceAddExpense(groupId, expenseData);
      // onSnapshot fires and replaces the optimistic entry with the real document.
    } catch (err) {
      // ROLLBACK: Remove the fake entry if the write fails.
      setExpenses(prev => prev.filter(e => e.id !== tempId));
      throw err;
    }
  }, [groupId]);

  return { expenses, loading, error, addExpense };
};
