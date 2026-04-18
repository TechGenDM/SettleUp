import { collection, addDoc, query, where, or, onSnapshot, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

const groupsCollection = collection(db, "groups");

export const createGroup = async (name, currentUser, membersEmails) => {
  try {
    // Generate an object array removing duplicates explicitly
    const uniqueEmails = Array.from(new Set([currentUser.email, ...membersEmails]));
    
    // Map emails to robust objects simulating UIDs if real UID wasn't available instantly
    const mappedMembers = uniqueEmails.map(email => {
      if (email === currentUser.email) {
         return { uid: currentUser.uid, email: currentUser.email };
      }
      return { uid: `simulated_${email}`, email };
    });
    
    const docRef = await addDoc(groupsCollection, {
      name,
      createdBy: currentUser.email,
      members: mappedMembers,
      createdAt: serverTimestamp()
    });
    
    return docRef.id;
  } catch (error) {
    console.error("Error creating group: ", error);
    throw new Error("Could not create group. Please try again.");
  }
};

export const subscribeToUserGroups = (currentUser, onUpdate, onError) => {
  // Leverage 'or' enforcing deep backward compatibility across array schemas natively
  const q = query(
    groupsCollection, 
    or(
      where("members", "array-contains", currentUser.email), // Fallback: older scalar strings
      where("members", "array-contains", { uid: currentUser.uid, email: currentUser.email }), // Native object schema (active match)
      where("members", "array-contains", { uid: `simulated_${currentUser.email}`, email: currentUser.email }) // Simulated mapping
    )
  );

  return onSnapshot(q, (querySnapshot) => {
    const groups = [];
    querySnapshot.forEach((doc) => {
      groups.push({ id: doc.id, ...doc.data() });
    });
    
    // Offline local timestamp sort averting compound structural schema overrides natively
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
