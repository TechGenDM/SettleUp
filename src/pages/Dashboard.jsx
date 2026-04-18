import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { logoutUser } from '../services/authService';
import { useGroups } from '../hooks/useGroups';
import CreateGroupForm from '../components/CreateGroupForm';

const Dashboard = () => {
  const { currentUser } = useContext(AuthContext);
  const { groups, loading, error, addGroup } = useGroups();
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error("Failed to log out", err);
    }
  };

  const handleCreateGroup = async (name, members) => {
    await addGroup(name, members);
    setShowCreateForm(false);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between border-b border-slate-700 bg-slate-800 px-8 py-4">
        <h1 className="text-2xl font-bold text-indigo-500">SettleUp Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-400 hidden md:inline">{currentUser?.email}</span>
          <button 
            onClick={handleLogout}
            className="rounded-md border border-slate-700 bg-transparent px-4 py-2 text-sm text-slate-400 transition-all hover:border-red-500/20 hover:bg-red-500/10 hover:text-red-500"
          >
            Log Out
          </button>
        </div>
      </header>
      
      <main className="mx-auto w-full max-w-[1000px] flex-1 p-8">
        
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-slate-100">Your Groups</h2>
          {!showCreateForm && (
            <button 
              onClick={() => setShowCreateForm(true)}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-indigo-700"
            >
              + New Group
            </button>
          )}
        </div>

        {showCreateForm && (
          <div className="mb-8">
            <CreateGroupForm 
              onSubmit={handleCreateGroup} 
              onCancel={() => setShowCreateForm(false)} 
            />
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-lg bg-red-500/10 p-4 text-red-500 border border-red-500/20">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex py-12 justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-700 border-t-indigo-500"></div>
          </div>
        ) : groups.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-700 bg-slate-800/50 p-12 text-center animate-[fadeIn_0.5s_ease-out]">
            <h3 className="mb-2 text-lg font-medium text-slate-300">No Groups Found</h3>
            <p className="text-slate-500">You aren't a part of any existing groups yet.</p>
            {!showCreateForm && (
              <button 
                onClick={() => setShowCreateForm(true)}
                className="mt-4 text-indigo-400 hover:text-indigo-300 hover:underline"
              >
                Create your first group
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {groups.map((group) => (
              <Link 
                key={group.id} 
                to={`/groups/${group.id}`}
                className="group flex h-32 flex-col justify-between rounded-xl border border-slate-700 bg-slate-800 p-6 transition-all hover:-translate-y-1 hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/10 animate-[fadeIn_0.3s_ease-out]"
              >
                <div>
                  <h3 className="mb-1 text-xl font-bold text-slate-100 group-hover:text-indigo-400 truncate">{group.name}</h3>
                  <div className="text-sm text-slate-400">
                    {group.members.length} member{group.members.length !== 1 && 's'}
                  </div>
                </div>
                <div className="mt-4 text-xs text-slate-500 truncate">
                  Created by {group.createdBy === currentUser?.email ? 'you' : group.createdBy}
                </div>
              </Link>
            ))}
          </div>
        )}

      </main>
    </div>
  );
};

export default Dashboard;
