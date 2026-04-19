import { useState, useEffect, useContext, useCallback, useRef } from 'react';
import { subscribeToUserGroups, createGroup } from '../services/groupService';
import { AuthContext } from '../context/AuthContext';

export const useGroups = () => {
  const { currentUser } = useContext(AuthContext);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Ref to hold the active Firestore unsubscribe function, preventing duplicate listeners
  const unsubscribeRef = useRef(null);

  useEffect(() => {
    // PERF: Depend only on uid (primitive), not the entire currentUser object.
    // The auth object reference changes on every render, which would previously
    // tear down and recreate the onSnapshot listener on every render cycle.
    if (!currentUser?.uid) {
      setLoading(false);
      setGroups([]);
      return;
    }

    // PERF: Guard against creating a second listener if one is already active.
    // This handles React StrictMode's double-invoke in development.
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
    }

    setLoading(true);
    setError(null);

    unsubscribeRef.current = subscribeToUserGroups(
      currentUser,
      (updatedGroups) => {
        setGroups(updatedGroups);
        setLoading(false);
      },
      (err) => {
        setError('Could not load groups. ' + err.message);
        setLoading(false);
      }
    );

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [currentUser?.uid]); // Only re-subscribe when the user's uid actually changes

  // PERF: useCallback prevents a new function reference being created on every
  // render of Dashboard, which would otherwise cause child memoized components
  // that receive this as a prop to re-render unnecessarily.
  const addGroup = useCallback(async (name, memberEmails) => {
    if (!currentUser) return;

    // OPTIMISTIC UPDATE: Immediately add a placeholder group to the UI so the
    // user sees instant feedback instead of waiting for Firestore round-trip (~200-500ms).
    const tempId = `temp_${Date.now()}`;
    const optimisticGroup = {
      id: tempId,
      name,
      createdBy: currentUser.email,
      members: [{ uid: currentUser.uid, email: currentUser.email }],
      memberUids: [currentUser.uid],
      createdAt: { toMillis: () => Date.now() },
      _isOptimistic: true,
    };

    setGroups(prev => [optimisticGroup, ...prev]);

    try {
      await createGroup(name, currentUser, memberEmails);
      // onSnapshot fires automatically and replaces the optimistic entry with
      // the real Firestore document (including the actual createdAt timestamp).
    } catch (err) {
      // ROLLBACK: If Firestore write failed, remove the fake entry from state.
      setGroups(prev => prev.filter(g => g.id !== tempId));
      throw err;
    }
  }, [currentUser]);

  return { groups, loading, error, addGroup };
};
