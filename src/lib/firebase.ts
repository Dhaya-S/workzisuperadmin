import { initializeApp, getApps, getApp, deleteApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, sendPasswordResetEmail, signOut } from "firebase/auth";
import { initializeFirestore, getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

export const firebaseConfig = {
  apiKey: "AIzaSyBnzd38x3CF2f2ccntI6iHLjSGoq4IyqRE",
  authDomain: "attendence-a56dd.firebaseapp.com",
  projectId: "attendence-a56dd",
  storageBucket: "attendence-a56dd.firebasestorage.app",
  messagingSenderId: "128720778231",
  appId: "1:128720778231:web:1b2b550516dc30e5ebf4f2",
  measurementId: "G-SHEWTL71B7"
};

// Initialize primary Firebase App
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});
export const storage = getStorage(app);

/**
 * Creates a tenant HR Admin auth account in Firebase Auth
 * using a separate temporary Firebase app instance so the currently logged-in Super Admin is NOT logged out.
 */
export async function createTenantAdminAuthAccount(
  email: string,
  password: string
): Promise<{ uid: string | null; isExisting: boolean; error?: string }> {
  const cleanEmail = email.trim().toLowerCase();
  const cleanPassword = password.trim();
  const tempAppName = `superadmin_provision_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  let tempApp: any = null;

  try {
    tempApp = initializeApp(firebaseConfig, tempAppName);
    const tempAuth = getAuth(tempApp);
    const cred = await createUserWithEmailAndPassword(tempAuth, cleanEmail, cleanPassword);
    const uid = cred.user.uid;
    return { uid, isExisting: false };
  } catch (err: any) {
    if (err.code === "auth/email-already-in-use") {
      return { uid: null, isExisting: true, error: "email-already-in-use" };
    }
    console.warn("createTenantAdminAuthAccount error:", err);
    return { uid: null, isExisting: false, error: err.message };
  } finally {
    if (tempApp) {
      try {
        await deleteApp(tempApp);
      } catch (cleanupErr) {
        console.warn("Could not delete temporary firebase app:", cleanupErr);
      }
    }
  }
}
