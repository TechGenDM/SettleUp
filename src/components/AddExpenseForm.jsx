import React, { useState } from 'react';

const AddExpenseForm = ({ members, onSubmit, onCancel }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  
  // Track specific mappings initializing with defaults securely
  const [paidByUid, setPaidByUid] = useState(members[0]?.uid || '');
  const [splitBetweenUids, setSplitBetweenUids] = useState(members.map(m => m.uid));
  
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
    setSplitBetweenUids(members.map(m => m.uid));
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

    const paidByMember = members.find(m => m.uid === paidByUid);
    if (!paidByMember) {
      setError("Invalid paid-by member selected.");
      return;
    }

    const splitMembers = splitBetweenUids
      .map(uid => members.find(m => m.uid === uid))
      .filter(Boolean); // Clean any possible undefined mappings implicitly 

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
    <div className="mb-8 rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-xl animate-[fadeIn_0.3s_ease-out]">
      <h3 className="mb-4 text-xl font-bold text-slate-100">Add New Expense</h3>
      
      {error && <div className="mb-4 rounded border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-500">{error}</div>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm text-slate-400">Description</label>
          <input 
            type="text"
            required
            disabled={loading}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Dinner at Mario's"
            className="w-full rounded-lg border border-slate-700 bg-slate-900 p-3 text-slate-50 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-slate-400">Amount ($)</label>
          <input 
            type="number"
            step="0.01"
            min="0.01"
            required
            disabled={loading}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full rounded-lg border border-slate-700 bg-slate-900 p-3 text-slate-50 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-slate-400">Paid By</label>
          <select 
            value={paidByUid}
            onChange={(e) => setPaidByUid(e.target.value)}
            disabled={loading}
            className="w-full rounded-lg border border-slate-700 bg-slate-900 p-3 text-slate-50 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors cursor-pointer"
          >
            {members.map(member => (
              <option key={`paidby-${member.uid}`} value={member.uid}>
                {member.email}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="block text-sm text-slate-400">Split Between</label>
            <div className="flex gap-2 text-xs">
               <button onClick={handleSelectAll} disabled={loading} className="text-indigo-400 hover:text-indigo-300">All</button>
               <span className="text-slate-600">|</span>
               <button onClick={handleClearAll} disabled={loading} className="text-indigo-400 hover:text-indigo-300">None</button>
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 rounded-lg border border-slate-700 bg-slate-900 p-4 max-h-48 overflow-y-auto">
            {members.map(member => (
              <label 
                key={`split-${member.uid}`} 
                className={`flex cursor-pointer items-center gap-3 rounded border p-2 transition-colors ${splitBetweenUids.includes(member.uid) ? 'border-indigo-500/50 bg-indigo-500/10' : 'border-slate-700 hover:bg-slate-800'}`}
              >
                <input 
                  type="checkbox"
                  checked={splitBetweenUids.includes(member.uid)}
                  onChange={() => handleToggleSplit(member.uid)}
                  disabled={loading}
                  className="rounded border-slate-700 bg-slate-900 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-slate-900 cursor-pointer"
                />
                <span className="text-sm text-slate-300 truncate">{member.email}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-700">
          <button 
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg px-4 py-2 font-medium text-slate-400 transition-colors hover:text-slate-200"
          >
            Cancel
          </button>
          <button 
            type="submit"
            disabled={loading || description.trim().length === 0 || amount.length === 0}
            className="flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-2 font-medium text-white transition-all hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-100/30 border-t-white"></div>
                  <span>Saving...</span>
                </div>
            ) : 'Save Expense'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddExpenseForm;
