import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UserPlus, Trash2, Send } from 'lucide-react';
import { cn } from '../utils/cn';

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
    } catch (err) { 
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="glass-surface rounded-2xl overflow-hidden p-8 shadow-2xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-text-primary">Create New Group</h3>
          <p className="text-sm text-text-secondary">Add friends and start splitting expenses.</p>
        </div>
        <button 
          onClick={onCancel}
          className="rounded-full p-2 text-text-muted transition-colors hover:bg-glass-bg hover:text-text-primary"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 rounded-xl border border-error/20 bg-error/10 p-4 text-sm text-error"
        >
          {error}
        </motion.div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="mb-2 block text-sm font-medium text-text-secondary">Group Name</label>
          <input 
            type="text"
            required
            value={name}
            onChange={(e) => { setName(e.target.value); setError(null); }}
            disabled={loading}
            placeholder="e.g. Weekend Trip, Flatmates"
            className="w-full rounded-xl border border-glass-border bg-bg-secondary p-3 text-text-primary outline-none transition-all placeholder:text-text-muted focus:border-brand-primary/50 focus:bg-bg-primary focus:ring-2 focus:ring-brand-primary/20"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-text-secondary">Add Members</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
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
                className="w-full rounded-xl border border-glass-border bg-bg-secondary p-3 text-text-primary outline-none transition-all placeholder:text-text-muted focus:border-brand-primary/50 focus:bg-bg-primary focus:ring-2 focus:ring-brand-primary/20"
              />
            </div>
            <button 
              type="button"
              onClick={handleAddMember}
              disabled={loading || !emailInput.trim()}
              className="flex items-center gap-2 rounded-xl bg-bg-secondary border border-glass-border px-6 py-3 font-semibold text-text-primary transition-all hover:bg-glass-bg disabled:opacity-50"
            >
              <UserPlus className="h-4 w-4" />
              Add
            </button>
          </div>
          
          <div className="mt-4 flex flex-wrap gap-2">
            <AnimatePresence>
              {members.map((email) => (
                <motion.div
                  key={email}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-2 rounded-full bg-brand-primary/10 border border-brand-primary/20 px-3 py-1 text-sm text-brand-primary"
                >
                  <span className="truncate max-w-[150px]">{email}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveMember(email)}
                    className="rounded-full p-0.5 hover:bg-brand-primary/20"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-xl border border-glass-border bg-transparent px-6 py-3 font-semibold text-text-secondary transition-all hover:bg-glass-bg hover:text-text-primary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-primary px-6 py-3 font-semibold text-white shadow-lg transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
            ) : (
              <>
                <Send className="h-4 w-4" />
                Create Group
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateGroupForm;
