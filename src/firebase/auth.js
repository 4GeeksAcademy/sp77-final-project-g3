import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  updatePassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  TwitterAuthProvider,
  GithubAuthProvider,
} from "firebase/auth";

// Email/password sign-up
export const doCreateUserWithEmailAndPassword = async (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

// Email/password sign-in
export const doSignInWithEmailAndPassword = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// Google sign-in
export const doSignInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  // Handle user data here (optional)
  return user;
};

// Facebook sign-in
export const doSignInWithFacebook = async () => {
  const provider = new FacebookAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  // Handle user data here (optional)
  return user;
};

// Twitter sign-in
export const doSignInWithTwitter = async () => {
  const provider = new TwitterAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  // Handle user data here (optional)
  return user;
};

// GitHub sign-in
export const doSignInWithGithub = async () => {
  const provider = new GithubAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  // Handle user data here (optional)
  return user;
};

// Sign out
export const doSignOut = () => {
  return auth.signOut();
};

// Password reset
export const doPasswordReset = (email) => {
  return sendPasswordResetEmail(auth, email);
};

// Password change
export const doPasswordChange = (password) => {
  return updatePassword(auth.currentUser, password);
};

// Send email verification
export const doSendEmailVerification = () => {
  return sendEmailVerification(auth.currentUser, {
    url: `${window.location.origin}/home`,
  });
};
