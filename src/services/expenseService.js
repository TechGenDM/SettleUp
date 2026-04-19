import { collection, addDoc, onSnapshot, serverTimestamp, query, orderBy, limit } from 'firebase/firestore';
import { db } from './firebase';

// PERF: Cap the number of expenses fetched per group. Fetching all expenses
// would cause the page to slow down proportionally as data grows. 20 is enough
// for most views; a "load more" pattern can extend this later.
const EXPENSES_PAGE_SIZE = 20;

export const addExpense = async (groupId, expenseData) => {
  try {
    const expensesCollection = collection(db, 'groups', groupId, 'expenses');

    if (expenseData.amount <= 0) throw new Error('Amount must be a positive number.');
    if (!expenseData.paidBy || !expenseData.paidBy.uid) throw new Error('A specific member must pay the expense.');

    const uniqueSplitUids = Array.from(new Set(expenseData.splitBetween.map(m => m.uid)));
    if (uniqueSplitUids.length === 0) {
      throw new Error('Expense must be split between at least one member.');
    }

    const finalSplit = uniqueSplitUids.map(uid => expenseData.splitBetween.find(m => m.uid === uid));

    const docRef = await addDoc(expensesCollection, {
      amount: expenseData.amount,
      description: expenseData.description || '',
      paidBy: expenseData.paidBy,
      splitBetween: finalSplit,
      createdAt: serverTimestamp(),
    });

    return docRef.id;
  } catch (error) {
    console.error('Error adding expense:', error);
    throw new Error(error.message || 'Failed to add expense. Please try again.');
  }
};

export const subscribeToExpenses = (groupId, onUpdate, onError) => {
  const expensesCollection = collection(db, 'groups', groupId, 'expenses');

  // PERF: orderBy ensures Firestore uses an index (fast server-side sort).
  // limit(EXPENSES_PAGE_SIZE) caps the document reads, reducing cost and latency.
  const q = query(
    expensesCollection,
    orderBy('createdAt', 'desc'),
    limit(EXPENSES_PAGE_SIZE)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const expenses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      onUpdate(expenses);
    },
    (error) => {
      console.error('Error subscribing to expenses:', error);
      if (onError) onError(error);
    }
  );
};
