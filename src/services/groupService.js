import { collection, addDoc, query, where, onSnapshot, serverTimestamp, getDoc, doc } from "firebase/firestore";
import { db } from "./firebase";

const groupsCollection = collection(db, "groups");

export const createGroup = async (name, currentUser, membersEmails) => {
  try {
    const uniqueEmails = Array.from(new Set([currentUser.email, ...membersEmails]));
    
    const mappedMembers = uniqueEmails.map(email => {
      if (email === currentUser.email) {
         return { uid: currentUser.uid, email: currentUser.email };
      }
      return { uid: `simulated_${email}`, email };
    });

    // Store a flat array of uids for simple, valid Firestore array-contains queries
    const memberUids = mappedMembers.map(m => m.uid);
    
    const docRef = await addDoc(groupsCollection, {
      name,
      createdBy: currentUser.email,
      members: mappedMembers,
      memberUids,
      createdAt: serverTimestamp()
    });
    
    return docRef.id;
  } catch (error) {
    console.error("Error creating group: ", error);
    throw new Error("Could not create group. Please try again.");
  }
};

export const subscribeToUserGroups = (currentUser, onUpdate, onError) => {
  // Query using the flat memberUids array — a single array-contains is valid in Firestore
  const q = query(
    groupsCollection,
    where("memberUids", "array-contains", currentUser.uid)
  );

  return onSnapshot(q, (querySnapshot) => {
    const groups = [];
    querySnapshot.forEach((doc) => {
      groups.push({ id: doc.id, ...doc.data() });
    });
    
    const sortedGroups = groups.sort((a, b) => {
       const timeA = a.createdAt?.toMillis() || 0;
       const timeB = b.createdAt?.toMillis() || 0;
       return timeB - timeA;
    });
    
    onUpdate(sortedGroups);
  }, (error) => {
    console.error("Error subscribing to groups: ", error);
    if (onError) onError(error);
  });
};

export const getGroup = async (groupId) => {
  try {
    const docRef = doc(db, "groups", groupId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error("Group not found");
    }
  } catch (error) {
    console.error("Error fetching single group:", error);
    throw new Error("Could not fetch group details.");
  }
};
