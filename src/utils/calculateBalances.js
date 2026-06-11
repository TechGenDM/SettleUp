export const calculateBalances = (expenses) => {
  const balances = {};

  if (!Array.isArray(expenses) || expenses.length === 0) {
    return balances;
  }

  expenses.forEach(expense => {
    const { amount, paidBy, splitBetween } = expense;
    
    // Safety check preventing NaN calculations implicitly
    if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) return;
    if (!splitBetween || splitBetween.length === 0) return;
    
    const splitCount = splitBetween.length;
    
    // Convert logic entirely to cents ensuring deterministic math avoiding floating drift
    const amountInCents = Math.round(amount * 100);
    const baseShareInCents = Math.floor(amountInCents / splitCount);
    let remainderInCents = amountInCents % splitCount;

    // Distribute negative debts smoothly adding hanging pennies cleanly to the initial array members
    splitBetween.forEach((member, index) => {
      const userShareInCents = baseShareInCents + (index < remainderInCents ? 1 : 0);
      const userShare = userShareInCents / 100;
      
      balances[member.uid] = (balances[member.uid] || 0) - userShare;
    });

    // Credit the individual who resolved the total balance proactively (using cents-rounded value for consistency)
    if (paidBy && paidBy.uid) {
      balances[paidBy.uid] = (balances[paidBy.uid] || 0) + amountInCents / 100;
    }
  });

  // Notice: Formatting (like toFixed) is intentionally bypassed ensuring pure javascript numerical limits natively!
  return balances;
};
