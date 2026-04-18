import React from 'react';
import { useParams, Link } from 'react-router-dom';

const GroupDetails = () => {
  const { id } = useParams();

  return (
    <div className="flex min-h-screen flex-col bg-slate-900 text-slate-50">
      <header className="flex items-center border-b border-slate-700 bg-slate-800 px-8 py-4">
        <Link to="/dashboard" className="mr-4 text-indigo-400 hover:text-indigo-300">
          ← Back
        </Link>
        <h1 className="text-xl font-bold">Group Details</h1>
      </header>
      
      <main className="mx-auto w-full max-w-[1000px] flex-1 p-8">
        <div className="animate-[fadeIn_0.4s_ease-out] rounded-xl border border-slate-700 bg-slate-800 p-8 shadow-lg">
          <h2 className="mb-2 text-2xl font-semibold text-indigo-400">Group ID: {id}</h2>
          <p className="text-slate-300">
            You have successfully navigated into the distinct isolated route for this group.
          </p>
          <div className="mt-8 rounded-lg border border-dashed border-slate-600 p-8 text-center text-slate-400">
            <p>Expense logic and specific group members visualization will be populated here later.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GroupDetails;
