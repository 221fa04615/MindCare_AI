import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { auth } from '../firebase';
import { signInAnonymously, signInWithCustomToken } from 'firebase/auth';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User, firebaseToken?: string) => void;
  logout: () => void;
  updateUser: (user: User) => void;
  isLoading: boolean;
  isFirebaseReady: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFirebaseReady, setIsFirebaseReady] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    const initializeAuth = async () => {
      if (storedToken && storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && parsedUser.id) {
          setToken(storedToken);
          setUser(parsedUser);
          
          try {
            // Bridge to Firebase Auth
            const res = await fetch('/api/auth/firebase-token', {
              headers: { 'Authorization': `Bearer ${storedToken}` }
            });
            const data = await res.json();
            
            if (data.token) {
              const result = await signInWithCustomToken(auth, data.token);
              console.log("✅ Firebase Auth Bridge Success. UID:", result.user.uid);
            } else {
              const result = await signInAnonymously(auth);
              console.log("ℹ️ Firebase Auth Bridge: Using Anonymous. UID:", result.user.uid);
            }
            setIsFirebaseReady(true);
          } catch (err: any) {
            console.warn("Firebase auth bridge failed, attempting anonymous fallback:", err.message);
            try {
              const result = await signInAnonymously(auth);
              console.log("ℹ️ Firebase Auth Bridge (Fallback): Using Anonymous. UID:", result.user.uid);
              setIsFirebaseReady(true);
            } catch (anonErr: any) {
              if (anonErr.code === 'auth/admin-restricted-operation') {
                console.error("CRITICAL: Firebase Auth is restricted. Please enable 'Anonymous' provider in Firebase Console.");
              }
            }
          }
        } else {
          // Clear stale/invalid user data
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = (newToken: string, newUser: User, firebaseToken?: string) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    
    // Bridge to Firebase Auth
    if (firebaseToken) {
      signInWithCustomToken(auth, firebaseToken).then((result) => {
        console.log("✅ Firebase Auth Bridge (Login) Success. UID:", result.user.uid);
        setIsFirebaseReady(true);
      }).catch(err => {
        console.error("Firebase custom auth failed:", err);
      });
    } else {
      signInAnonymously(auth).then((result) => {
        console.log("ℹ️ Firebase Auth Bridge (Login): Using Anonymous. UID:", result.user.uid);
        setIsFirebaseReady(true);
      }).catch(err => {
        if (err.code === 'auth/admin-restricted-operation') {
          console.error("CRITICAL: Firebase Auth is restricted. Please enable 'Anonymous' provider in Firebase Console.");
        } else {
          console.error("Firebase anonymous auth failed:", err);
        }
      });
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setIsFirebaseReady(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    auth.signOut();
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateUser, isLoading, isFirebaseReady }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
