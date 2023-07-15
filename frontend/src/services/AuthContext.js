import React, { createContext, useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

const config = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
};

firebase.initializeApp(config);

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isSecondFactorAuthDone, setIsSecondFactorAuthDone] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Retrieve the value of `isSecondFactorAuthDone` from local storage
    const storedValue = localStorage.getItem('isSecondFactorAuthDone');
    if (storedValue) {
      setIsSecondFactorAuthDone(JSON.parse(storedValue));
    }
  }, []);

  useEffect(() => {
    setIsAuthenticated(currentUser !== null && isSecondFactorAuthDone);
  }, [currentUser, isSecondFactorAuthDone]);

  return (
    <AuthContext.Provider value={{ currentUser, isSecondFactorAuthDone, setIsSecondFactorAuthDone, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
