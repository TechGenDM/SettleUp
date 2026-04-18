import { collection, addDoc, onSnapshot, serverTimestamp, query, orderBy } from "firebase/firestore";
import { db } from "./firebase";

export const addExpense = async (groupId, expenseData) => {
  try {
    const expensesCollection = collection(db, "groups", groupId, "expenses");
    
    if (expenseData.amount <= 0) throw new Error("Amount must be a positive number.");
    if (!expenseData.paidBy || !expenseData.paidBy.uid) throw new Error("A specific member must pay the expense.");
    
    // Prevent duplicate user entries structurally mapping Set mappings natively
    const uniqueSplitUids = Array.from(new Set(expenseData.splitBetween.map(m => m.uid)));
    if (uniqueSplitUids.length === 0) {
      throw new Error("Expense must be split between at least one member.");
    }
    
    // Remap unique split explicitly
    const finalSplit = uniqueSplitUids.map(uid => expenseData.splitBetween.find(m => m.uid === uid));
    
    const docRef = await addDoc(expensesCollection, {
      amount: expenseData.amount,
      description: expenseData.description || "",
      paidBy: expenseData.paidBy,
      splitBetween: finalSplit,
      createdAt: serverTimestamp()
    });
    
    return docRef.id;
  } catch (error) {
    console.error("Error adding expense: ", error);
    throw new Error(error.message || "Failed to add expense. Please try again.");
  }
};

export const subscribeToExpenses = (groupId, onUpdate, onError) => {
  const expensesCollection = collection(db, "groups", groupId, "expenses");
  
  // Directly bind sorting architecture querying parameters natively avoiding local manual iterations safely
  const q = query(expensesCollection, orderBy("createdAt", "desc"));
  
  return onSnapshot(q, (snapshot) => {
    const expenses = [];
    snapshot.forEach(doc => {
      expenses.push({ id: doc.id, ...doc.data() });
    });
    
    onUpdate(expenses);
  }, (error) => {
    console.error("Error subscribing to expenses: ", error);
    if (onError) onError(error);
  });
};
