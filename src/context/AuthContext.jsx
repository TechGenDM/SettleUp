import React, { createContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for auth state changes globally to prevent UI flicker
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Display a full-screen loading spinner until the initial auth state is resolved
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-900">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/10 border-t-indigo-600"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};
