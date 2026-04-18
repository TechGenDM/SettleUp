import { useState, useEffect } from 'react';
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

  const addExpense = async (expenseData) => {
    if (!groupId) throw new Error("No group specified.");
    try {
      await serviceAddExpense(groupId, expenseData);
    } catch (err) {
      throw err;
    }
  };

  return { expenses, loading, error, addExpense };
};
