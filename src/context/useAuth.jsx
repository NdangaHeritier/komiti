"use client";

import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../utils/db';
const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [currentTeam, setCurrentTeam] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const signup = (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password);
    }

    const signin = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    }
    const signout = () => {
        return signOut(auth);
    }

    const updateUser = (user, data) => {
        return updateProfile(user, data);
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value ={
        currentUser,
        setCurrentTeam,
        currentTeam,
        signup,
        signin,
        signout,
        updateUser,
        authLoading: loading,
    }
     return (
        <AuthContext.Provider value={ value }>
            { children }
        </AuthContext.Provider>
     );
}