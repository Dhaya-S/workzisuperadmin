import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  sendPasswordResetEmail
} from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { verifySuperAdmin, bootstrapSuperAdmin as createAdminProfile, recordAuditLog } from "../lib/superadmin-service";
import type { SuperAdminUser } from "../lib/types";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";

interface SuperAdminAuthContextType {
  user: User | null;
  adminProfile: SuperAdminUser | null;
  loading: boolean;
  error: string | null;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signup: (fullName: string, email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  claimSuperAdmin: (name?: string) => Promise<boolean>;
  sendResetEmail: (email: string) => Promise<boolean>;
}

const SuperAdminAuthContext = createContext<SuperAdminAuthContextType | undefined>(undefined);

export const SuperAdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [adminProfile, setAdminProfile] = useState<SuperAdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const profile = await verifySuperAdmin(currentUser.uid);
          if (profile) {
            setAdminProfile(profile);
            setError(null);
          } else {
            // Automatically ensure super admin document exists in Firestore
            const adminDocRef = doc(db, "admin_users", currentUser.uid);
            const profileData: SuperAdminUser = {
              uid: currentUser.uid,
              email: currentUser.email || "",
              name: currentUser.displayName || (currentUser.email ? currentUser.email.split("@")[0] : "Super Admin"),
              role: "super_admin",
              twoFaEnabled: false
            };
            await setDoc(adminDocRef, {
              ...profileData,
              status: "active",
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp()
            }, { merge: true });

            setAdminProfile(profileData);
            setError(null);
          }
        } catch (err: any) {
          console.error("SuperAdmin Auth verification error:", err);
          setError("Failed to verify platform administrator credentials.");
        }
      } else {
        setAdminProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signup = async (fullName: string, email: string, pass: string) => {
    setError(null);
    try {
      const cleanEmail = email.trim().toLowerCase();
      const cred = await createUserWithEmailAndPassword(auth, cleanEmail, pass);

      try {
        await updateProfile(cred.user, { displayName: fullName.trim() });
      } catch (pErr) {
        console.warn("Could not set displayName on auth user:", pErr);
      }

      // Store in admin_users in Firestore
      const adminDocRef = doc(db, "admin_users", cred.user.uid);
      const profileData: SuperAdminUser = {
        uid: cred.user.uid,
        email: cleanEmail,
        name: fullName.trim() || cleanEmail.split("@")[0],
        role: "super_admin",
        twoFaEnabled: false
      };

      await setDoc(adminDocRef, {
        ...profileData,
        status: "active",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastLoginAt: serverTimestamp()
      }, { merge: true });

      await recordAuditLog(cleanEmail, "Admin Account Registered", `admin_users/${cred.user.uid}`, "Workzi Global");

      setAdminProfile(profileData);
      setUser(cred.user);
      return { success: true };
    } catch (err: any) {
      console.error("Signup error:", err);
      const msg = err.code === "auth/email-already-in-use"
        ? "An account with this email already exists. Please sign in instead."
        : err.code === "auth/weak-password"
        ? "Password should be at least 6 characters."
        : err.message || "Failed to create administrator account.";
      setError(msg);
      return { success: false, error: msg };
    }
  };

  const login = async (email: string, pass: string) => {
    setError(null);
    try {
      const cleanEmail = email.trim().toLowerCase();
      const cred = await signInWithEmailAndPassword(auth, cleanEmail, pass);
      const profile = await verifySuperAdmin(cred.user.uid);
      if (profile) {
        setAdminProfile(profile);
        await updateDoc(doc(db, "admin_users", cred.user.uid), {
          lastLoginAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        }).catch(() => {});
      } else {
        // Automatically create and store the super admin record in Firestore admin_users
        const newProfile = await createAdminProfile(
          cred.user.uid,
          cred.user.email || cleanEmail,
          cred.user.displayName || cleanEmail.split("@")[0]
        );
        setAdminProfile(newProfile);
      }
      return { success: true };
    } catch (err: any) {
      const msg = err.code === "auth/invalid-credential" || err.code === "auth/wrong-password" || err.code === "auth/user-not-found"
        ? "Invalid email or password."
        : err.message || "Failed to sign in.";
      setError(msg);
      return { success: false, error: msg };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setAdminProfile(null);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const claimSuperAdmin = async (name?: string) => {
    if (!user) return false;
    try {
      const profile = await createAdminProfile(
        user.uid,
        user.email || "",
        name || user.displayName || "Super Admin"
      );
      setAdminProfile(profile);
      return true;
    } catch (err) {
      console.error("claimSuperAdmin error:", err);
      return false;
    }
  };

  const sendResetEmail = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email.trim().toLowerCase());
      return true;
    } catch (err) {
      console.error("sendResetEmail error:", err);
      return false;
    }
  };

  return (
    <SuperAdminAuthContext.Provider
      value={{
        user,
        adminProfile,
        loading,
        error,
        login,
        signup,
        logout,
        claimSuperAdmin,
        sendResetEmail
      }}
    >
      {children}
    </SuperAdminAuthContext.Provider>
  );
};

export function useSuperAdminAuth() {
  const context = useContext(SuperAdminAuthContext);
  if (!context) {
    throw new Error("useSuperAdminAuth must be used within a SuperAdminAuthProvider");
  }
  return context;
}
