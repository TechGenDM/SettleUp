import React, { useState } from 'react';

const CreateGroupForm = ({ onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isValidEmail = (emailStr) => /\S+@\S+\.\S+/.test(emailStr);

  const handleAddMember = () => {
    const email = emailInput.trim().toLowerCase();
    
    if (!email) return;
    
    if (!isValidEmail(email)) {
      setError("Please provide a valid email format.");
      return;
    }
    
    if (members.includes(email)) {
      setError("This email has already been added.");
      return;
    }
    
    setError(null);
    setMembers([...members, email]);
    setEmailInput('');
  };

  const handleRemoveMember = (emailToRemove) => {
    setMembers(members.filter(email => email !== emailToRemove));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Group name cannot be logically empty.");
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      await onSubmit(name.trim(), members);
      // Execution hands gracefully back resolving external variables securely
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="animate-[fadeIn_0.2s_ease-out] rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-xl">
      <h3 className="mb-4 text-xl font-bold text-slate-100">Create New Group</h3>
      
      {error && <div className="mb-4 rounded border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-500">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="mb-1 block text-sm text-slate-400">Group Name</label>
          <input 
            type="text"
            required
            value={name}
            onChange={(e) => { setName(e.target.value); setError(null); }}
            disabled={loading}
            placeholder="e.g. Trip to Hawaii"
            className="w-full rounded-lg border border-slate-700 bg-slate-900 p-3 text-slate-50 outline-none transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="mb-4">
          <label className="mb-1 block text-sm text-slate-400">Add Members (Emails)</label>
          <div className="flex gap-2">
            <input 
              type="email"
              value={emailInput}
              onChange={(e) => { setEmailInput(e.target.value); setError(null); }}
              disabled={loading}
              placeholder="friend@example.com"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddMember();
                }
              }}
              className="flex-1 rounded-lg border border-slate-700 bg-slate-900 p-3 text-slate-50 outline-none transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
            <button 
              type="button"
              onClick={handleAddMember}
              disabled={loading || !emailInput.trim()}
              className="rounded-lg bg-slate-700 px-5 py-2 font-medium text-slate-200 transition-colors hover:bg-slate-600 disabled:opacity-50"
            >
              Add
            </button>
          </div>
          
          {members.length > 0 && (
             <div className="mt-3 flex flex-wrap gap-2">
               {members.map(member => (
                 <span key={member} className="flex items-center gap-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-sm text-indigo-400">
                   {member}
                   <button 
                     type="button" 
                     onClick={() => handleRemoveMember(member)}
                     disabled={loading}
                     className="ml-1 text-indigo-300 hover:text-white"
                   >×</button>
                 </span>
               ))}
             </div>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-3">
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
            disabled={loading || !name.trim()}
            className="flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-2 font-medium text-white transition-all hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-100/30 border-t-white"></div>
                  <span>Creating...</span>
                </div>
            ) : 'Create Group'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateGroupForm;
