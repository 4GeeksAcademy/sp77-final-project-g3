import React, { useContext, useState, useEffect } from "react";
import { auth } from "../../firebase/firebase";
import { onAuthStateChanged, GoogleAuthProvider, FacebookAuthProvider, TwitterAuthProvider, GithubAuthProvider } from "firebase/auth";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [isEmailUser, setIsEmailUser] = useState(false);
  const [isGoogleUser, setIsGoogleUser] = useState(false);
  const [isFacebookUser, setIsFacebookUser] = useState(false);
  const [isTwitterUser, setIsTwitterUser] = useState(false);
  const [isGithubUser, setIsGithubUser] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, initializeUser);
    return unsubscribe;
  }, []);

  async function initializeUser(user) {
    if (user) {
      // console.log("User is logged in:", user); // Log user details to console
      setCurrentUser({ ...user });

      const isEmail = user.providerData.some(
        (provider) => provider.providerId === "password"
      );
      setIsEmailUser(isEmail);

      const isGoogle = user.providerData.some(
        (provider) => provider.providerId === GoogleAuthProvider.PROVIDER_ID
      );
      setIsGoogleUser(isGoogle);

      const isFacebook = user.providerData.some(
        (provider) => provider.providerId === FacebookAuthProvider.PROVIDER_ID
      );
      setIsFacebookUser(isFacebook);

      const isTwitter = user.providerData.some(
        (provider) => provider.providerId === TwitterAuthProvider.PROVIDER_ID
      );
      setIsTwitterUser(isTwitter);

      const isGithub = user.providerData.some(
        (provider) => provider.providerId === GithubAuthProvider.PROVIDER_ID
      );
      setIsGithubUser(isGithub);

      setUserLoggedIn(true);
    } else {
      // console.log("No user is logged in."); // Log message when user is not logged in
      setCurrentUser(null);
      setUserLoggedIn(false);
    }

    setLoading(false);
  }

  const value = {
    userLoggedIn,
    isEmailUser,
    isGoogleUser,
    isFacebookUser,
    isTwitterUser,
    isGithubUser,
    currentUser,
    setCurrentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
