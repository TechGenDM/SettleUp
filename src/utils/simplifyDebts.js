export const simplifyDebts = (balances) => {
  const transactions = [];

  if (!balances || Object.keys(balances).length === 0) return transactions;

  const creditors = [];
  const debtors = [];

  // Categorize explicit balances natively parsing precision safely
  Object.entries(balances).forEach(([uid, balance]) => {
    if (balance > 0.009) {
      creditors.push({ uid, balance });
    } else if (balance < -0.009) {
      // Mapping absolutely enforcing positive scalar parameters evaluating comparisons
      debtors.push({ uid, balance: Math.abs(balance) });
    }
  });

  // Sort inherently driving greedy loop mapping highest thresholds logically reducing iterations sequentially
  creditors.sort((a, b) => b.balance - a.balance);
  debtors.sort((a, b) => b.balance - a.balance);

  let i = 0; // Debtors pointer tracking
  let j = 0; // Creditors pointer tracking

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];

    // Mathematically restrict transfer parsing exact minimums required limiting overflowing outputs exclusively 
    const amount = Math.min(debtor.balance, creditor.balance);
    
    if (amount < 0.01) {
      break; 
    }

    transactions.push({
      from: debtor.uid,
      to: creditor.uid,
      amount: Number(amount.toFixed(2)) // Formal explicit UI boundary constraint natively avoiding drifting
    });

    debtor.balance -= amount;
    creditor.balance -= amount;

    // Advance bounds ensuring nested loops prevent lockups actively pushing logic downwards linearly
    if (debtor.balance < 0.01) i++;
    if (creditor.balance < 0.01) j++;
  }

  return transactions;
};
