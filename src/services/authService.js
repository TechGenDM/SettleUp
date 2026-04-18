import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut 
} from "firebase/auth";
import { auth } from "./firebase";

// Helper function to map Firebase error codes to user-friendly messages
const getFriendlyErrorMessage = (error) => {
  switch (error.code) {
    case 'auth/invalid-email':
      return 'The email address provided is invalid.';
    case 'auth/user-not-found':
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
      return 'Incorrect email or password, or the user does not exist.';
    case 'auth/email-already-in-use':
      return 'An account already exists with this email address.';
    case 'auth/weak-password':
      return 'The password must be at least 6 characters.';
    case 'auth/network-request-failed':
      return 'A network error occurred. Please check your connection.';
    default:
      return error.message || 'An unexpected error occurred. Please try again.';
  }
};

export const registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw new Error(getFriendlyErrorMessage(error));
  }
};

export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw new Error(getFriendlyErrorMessage(error));
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw new Error('Failed to log out. Please try again.');
  }
};
