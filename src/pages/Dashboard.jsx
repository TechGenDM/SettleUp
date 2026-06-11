import React, { useContext, useState, useCallback, memo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LogOut, Plus, ChevronRight, LayoutDashboard, User as UserIcon, Activity, Folders, CheckCircle2
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { logoutUser } from '../services/authService';
import { useGroups } from '../hooks/useGroups';
import CreateGroupForm from '../components/CreateGroupForm';
import { GroupCardSkeleton } from '../components/Skeletons';
import GlassCard from '../components/ui/GlassCard';
import CustomButton from '../components/ui/CustomButton';
import { cn } from '../utils/cn';

/* ── Group Card (Linear Style) ── */
const GroupCard = memo(({ group, currentUserEmail, index }) => {
  return (
    <Link
      to={`/groups/${group.id}`}
      state={{ group }}
      className="block outline-none"
    >
      <GlassCard
        hover={true}
        className={cn(
          'relative flex flex-col justify-between overflow-hidden p-5 group h-full bg-bg-secondary cursor-pointer',
          group._isOptimistic && 'opacity-50 pointer-events-none'
        )}
      >
        <div>
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-[15px] font-semibold text-text-primary group-hover:text-brand-primary transition-colors truncate pr-8">
              {group.name}
            </h3>
            <ChevronRight size={16} className="text-text-muted opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
          </div>
          <p className="text-[13px] text-text-secondary">
            {group.members.length} member{group.members.length !== 1 && 's'}
          </p>
        </div>

        <div className="flex items-center justify-between border-t border-border-subtle pt-3 mt-4">
          <div className="flex items-center gap-1.5 text-[11px] text-text-muted">
            {group._isOptimistic ? (
              <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-warning" /> Saving…</span>
            ) : (
              <span>Created by {group.createdBy === currentUserEmail ? 'you' : group.createdBy?.split('@')[0]}</span>
            )}
          </div>
          <span className="text-[10px] font-semibold text-text-secondary bg-bg-active px-1.5 py-0.5 rounded uppercase tracking-widest flex items-center gap-1">
            <div className="h-1 w-1 rounded-full bg-success" /> Active
          </span>
        </div>
      </GlassCard>
    </Link>
  );
});
GroupCard.displayName = 'GroupCard';

/* ── Dashboard ── */
const Dashboard = () => {
  const { currentUser } = useContext(AuthContext);
  const { groups, loading, error, addGroup } = useGroups();
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleLogout = useCallback(async () => {
    try { await logoutUser(); } catch (e) { console.error(e); }
  }, []);

  const handleCreateGroup = useCallback(async (name, members) => {
    await addGroup(name, members);
    setShowCreateForm(false);
  }, [addGroup]);

  const firstName = currentUser?.email?.split('@')[0] ?? 'User';

  return (
    <div className="min-h-screen bg-bg-primary">

      {/* ── HEADER (Ultra-minimal) ── */}
      <header className="sticky top-0 z-50 bg-bg-secondary border-b border-border">
        <div className="mx-auto max-w-5xl px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-6 w-6 bg-text-primary rounded flex items-center justify-center">
              <span className="text-bg-secondary font-bold text-[10px]">SU</span>
            </div>
            <span className="text-[14px] font-semibold text-text-primary tracking-tight">SettleUP</span>
            <span className="text-border mx-1">/</span>
            <span className="text-[14px] text-text-secondary">Dashboard</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[13px] text-text-secondary hidden sm:block">{currentUser?.email}</span>
            <div className="h-4 w-px bg-border hidden sm:block" />
            <button
              onClick={handleLogout}
              className="text-[13px] font-medium text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1.5"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">

        {/* ── Header Section ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-text-primary tracking-tight mb-1">
              Groups
            </h1>
            <p className="text-[14px] text-text-secondary">
              Manage your shared expenses and balances.
            </p>
          </div>

          {!showCreateForm && (
            <CustomButton icon={Plus} onClick={() => setShowCreateForm(true)}>
              New Group
            </CustomButton>
          )}
        </div>

        {/* ── Create Group Form ── */}
        <AnimatePresence>
          {showCreateForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-8"
            >
              <CreateGroupForm
                onSubmit={handleCreateGroup}
                onCancel={() => setShowCreateForm(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Groups List ── */}
        <div>
          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2].map(i => <GroupCardSkeleton key={i} />)}
            </div>
          ) : error ? (
            <div className="p-4 rounded-md border border-error-bg bg-error-bg/50 text-[13px] text-error flex items-center gap-2">
              <span className="font-semibold">Error:</span> {error}
            </div>
          ) : groups.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center border border-dashed border-border rounded-lg bg-bg-secondary">
              <Folders size={24} className="text-text-muted mb-3" strokeWidth={1.5} />
              <h3 className="text-[14px] font-semibold text-text-primary mb-1">No groups found</h3>
              <p className="text-[13px] text-text-secondary mb-4 max-w-[250px]">
                You aren't part of any groups yet. Create one to start tracking expenses.
              </p>
              <CustomButton variant="secondary" onClick={() => setShowCreateForm(true)} icon={Plus}>
                Create group
              </CustomButton>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {groups.map((group, i) => (
                <GroupCard
                  key={group.id}
                  group={group}
                  currentUserEmail={currentUser?.email}
                  index={i}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
