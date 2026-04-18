import { useState, useEffect, useContext } from 'react';
import { subscribeToUserGroups, createGroup } from '../services/groupService';
import { AuthContext } from '../context/AuthContext';

export const useGroups = () => {
  const { currentUser } = useContext(AuthContext);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!currentUser?.email) {
       setLoading(false);
       return;
    }
    
    setLoading(true);
    setError(null);
    
    // Subscribe binds immediately replacing isolated fetch mappings gracefully
    const unsubscribe = subscribeToUserGroups(
      currentUser,
      (updatedGroups) => {
        setGroups(updatedGroups);
        setLoading(false);
      },
      (err) => {
        setError("Could not stream groups. " + err.message);
        setLoading(false);
      }
    );

    // Native unmount teardown
    return () => unsubscribe();
  }, [currentUser]);

  const addGroup = async (name, memberEmails) => {
    if (!currentUser) return;
    try {
      await createGroup(name, currentUser, memberEmails);
      // No refetch required automatically synced by onSnapshot callback instantly! 
    } catch (err) {
      throw err;
    }
  };

  return { groups, loading, error, addGroup };
};
