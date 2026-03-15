import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  User as FirebaseUser
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  onSnapshot,
  getDocs,
  updateDoc,
  addDoc,
  serverTimestamp,
  orderBy
} from "firebase/firestore";
import { auth, db } from "../lib/firebase";

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
}

export interface PaymentRecord {
  id: string;
  plan: string;
  amount: string;
  date: string;
  status: "completed" | "pending" | "failed";
}

export interface User {
  id: string;
  name: string;
  email: string;
  profiles: UserProfile[];
  subscription: string | null;
  subscriptionStartDate: string | null;
  subscriptionExpiry: string | null;
  paymentHistory: PaymentRecord[];
  isAdmin?: boolean;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon: string;
  createdAt?: any;
}

interface AuthContextValue {
  user: User | null;
  activeProfile: UserProfile | null;
  isAuthenticated: boolean;
  showProfileSelector: boolean;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  selectProfile: (profileId: string) => void;
  setShowProfileSelector: (show: boolean) => void;
  addProfile: (name: string, avatar: string) => Promise<boolean>;
  updateProfile: (id: string, name: string, avatar: string) => Promise<void>;
  deleteProfile: (id: string) => Promise<void>;
  updateUser: (updates: Partial<Pick<User, "name">>) => Promise<void>;
  setSubscription: (plan: string | null, amount?: string) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  notifications: AppNotification[];
  markNotificationRead: (id: string) => Promise<void>;
  clearNotifications: () => Promise<void>;
  unreadCount: number;
  isSubscriptionExpired: boolean;
  daysUntilExpiry: number | null;
  getAllUsers: () => Promise<User[]>;
  addNotificationForUser: (userId: string, title: string, message: string, icon: string) => Promise<void>;
  addNotificationForAll: (title: string, message: string, icon: string) => Promise<void>;
}

// Email validation - checks for valid format with real domain patterns
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) return false;
  const domain = email.split("@")[1].toLowerCase();
  const blockedPatterns = ["test.com", "fake.com", "example.com", "asdf.com", "abc.com", "xyz.xyz"];
  if (blockedPatterns.includes(domain)) return false;
  const tld = domain.split(".").pop() || "";
  if (tld.length < 2) return false;
  return true;
}

// Password validation - minimum 6 chars, at least one letter and one number
export function isValidPassword(password: string): { valid: boolean; error?: string } {
  if (password.length < 6) return { valid: false, error: "Password must be at least 6 characters." };
  if (!/[a-zA-Z]/.test(password)) return { valid: false, error: "Password must contain at least one letter." };
  if (!/[0-9]/.test(password)) return { valid: false, error: "Password must contain at least one number." };
  return { valid: true };
}

const SESSION_KEY = "akplay-profile-session";

export const PROFILE_AVATARS = [
  "https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Felix",
  "https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Aneka",
  "https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Bubba",
  "https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Coco",
  "https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Dusty",
  "https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Luna",
  "https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Milo",
  "https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Nala",
  "https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Oscar",
  "https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Pepper",
  "https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Rocky",
  "https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Shadow",
];

function getProfileSession(): string | null {
  try {
    return localStorage.getItem(SESSION_KEY);
  } catch { return null; }
}

function saveProfileSession(profileId: string | null) {
  if (profileId) {
    localStorage.setItem(SESSION_KEY, profileId);
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [fbUser, setFbUser] = useState<FirebaseUser | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);
  const [showProfileSelector, setShowProfileSelector] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loadingInitial, setLoadingInitial] = useState(true);

  // Listen to Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFbUser(user);
      if (user) {
        // Fetch user document from Firestore
        const userDocRef = doc(db, "users", user.uid);
        const unsubscribeDoc = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data() as User;
            setCurrentUser(data);

            // Handle profile selection session
            const storedProfileId = getProfileSession();
            if (storedProfileId && data.profiles.find(p => p.id === storedProfileId)) {
              setActiveProfileId(storedProfileId);
            } else if (data.profiles.length > 0) {
              if (data.profiles.length === 1) {
                setActiveProfileId(data.profiles[0].id);
                saveProfileSession(data.profiles[0].id);
              } else if (!activeProfileId) {
                setShowProfileSelector(true);
              }
            }
          } else {
            setCurrentUser(null);
          }
          setLoadingInitial(false);
        });

        return () => unsubscribeDoc();
      } else {
        setCurrentUser(null);
        setActiveProfileId(null);
        setShowProfileSelector(false);
        setNotifications([]);
        setLoadingInitial(false);
      }
    });

    return unsubscribe;
  }, []);

  // Listen to Notifications from Firestore
  useEffect(() => {
    if (!fbUser) return;

    // We fetch global notifications and user-specific ones
    const q = query(
      collection(db, "notifications"),
      where("targetId", "in", ["all", fbUser.uid]),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const notifs: AppNotification[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        notifs.push({
          id: doc.id,
          title: data.title,
          message: data.message,
          icon: data.icon,
          read: data.readBy?.includes(fbUser.uid) || false,
          time: data.createdAt ? new Date(data.createdAt.toDate()).toLocaleDateString() : "Just now",
        });
      });
      setNotifications(notifs);
    });

    return unsubscribe;
  }, [fbUser]);

  const activeProfile = currentUser?.profiles.find((p) => p.id === activeProfileId) ?? null;

  const signup = useCallback(async (name: string, email: string, password: string) => {
    if (!isValidEmail(email)) return { success: false, error: "Please enter a valid email address." };
    const pwCheck = isValidPassword(password);
    if (!pwCheck.valid) return { success: false, error: pwCheck.error };

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const defaultProfile: UserProfile = {
        id: "p1-" + Date.now().toString(),
        name,
        avatar: PROFILE_AVATARS[0],
      };

      const newUser: User = {
        id: user.uid,
        name,
        email,
        profiles: [defaultProfile],
        subscription: null,
        subscriptionStartDate: null,
        subscriptionExpiry: null,
        paymentHistory: [],
      };

      await setDoc(doc(db, "users", user.uid), newUser);
      setActiveProfileId(defaultProfile.id);
      saveProfileSession(defaultProfile.id);

      // Send welcome email (fire-and-forget)
      fetch("/api/send-welcome-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, type: "signup" }),
      }).catch(() => { });

      return { success: true };
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        return { success: false, error: "An account with this email already exists." };
      }
      return { success: false, error: error.message || "Failed to sign up." };
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);

      // Welcome back email
      fetch("/api/send-welcome-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: email.split('@')[0], email, type: "login" }),
      }).catch(() => { });

      return { success: true };
    } catch (error: any) {
      return { success: false, error: "Invalid email or password." };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await signOut(auth);
      saveProfileSession(null);
    } catch (err) {
      console.error("Logout failed", err);
    }
  }, []);

  const selectProfile = useCallback((profileId: string) => {
    setActiveProfileId(profileId);
    setShowProfileSelector(false);
    saveProfileSession(profileId);
  }, []);

  const addProfile = useCallback(async (name: string, avatar: string): Promise<boolean> => {
    if (!currentUser) return false;
    if (currentUser.profiles.length >= 5) return false;

    const newProfile = { id: Date.now().toString(), name, avatar };
    const updatedProfiles = [...currentUser.profiles, newProfile];

    await updateDoc(doc(db, "users", currentUser.id), {
      profiles: updatedProfiles
    });
    return true;
  }, [currentUser]);

  const updateProfile = useCallback(async (id: string, name: string, avatar: string) => {
    if (!currentUser) return;
    const updatedProfiles = currentUser.profiles.map((p) =>
      p.id === id ? { ...p, name, avatar } : p
    );
    await updateDoc(doc(db, "users", currentUser.id), {
      profiles: updatedProfiles
    });
  }, [currentUser]);

  const deleteProfile = useCallback(async (id: string) => {
    if (!currentUser) return;
    if (currentUser.profiles.length <= 1) return;

    const updatedProfiles = currentUser.profiles.filter((p) => p.id !== id);
    await updateDoc(doc(db, "users", currentUser.id), {
      profiles: updatedProfiles
    });

    if (activeProfileId === id && updatedProfiles.length > 0) {
      setActiveProfileId(updatedProfiles[0].id);
      saveProfileSession(updatedProfiles[0].id);
    }
  }, [currentUser, activeProfileId]);

  const updateUser = useCallback(async (updates: Partial<Pick<User, "name">>) => {
    if (!currentUser) return;
    await updateDoc(doc(db, "users", currentUser.id), updates);
  }, [currentUser]);

  const setSubscription = useCallback(async (plan: string | null, amount?: string) => {
    if (!currentUser) return;
    const now = new Date();
    const expiry = new Date(now);
    expiry.setDate(expiry.getDate() + 30);

    const paymentRecord: PaymentRecord | null = plan && amount ? {
      id: Date.now().toString(),
      plan,
      amount,
      date: now.toISOString(),
      status: "completed",
    } : null;

    const updates: any = {
      subscription: plan,
      subscriptionStartDate: plan ? now.toISOString() : null,
      subscriptionExpiry: plan ? expiry.toISOString() : null,
    };

    if (paymentRecord) {
      updates.paymentHistory = [...(currentUser.paymentHistory || []), paymentRecord];
    } else if (!plan) {
      // Free plan fallback
      updates.paymentHistory = currentUser.paymentHistory || [];
    }

    await updateDoc(doc(db, "users", currentUser.id), updates);
  }, [currentUser]);

  const markNotificationRead = useCallback(async (id: string) => {
    if (!fbUser) return;
    const notifRef = doc(db, "notifications", id);
    try {
      const snap = await getDoc(notifRef);
      if (snap.exists()) {
        const readBy = snap.data().readBy || [];
        if (!readBy.includes(fbUser.uid)) {
          await updateDoc(notifRef, {
            readBy: [...readBy, fbUser.uid]
          });
        }
      }
    } catch { }
  }, [fbUser]);

  const clearNotifications = useCallback(async () => {
    if (!fbUser) return;
    for (const notif of notifications) {
      if (!notif.read) {
        await markNotificationRead(notif.id);
      }
    }
  }, [fbUser, notifications, markNotificationRead]);

  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    if (!fbUser || !currentUser) return { success: false, error: "Not logged in." };
    const pwCheck = isValidPassword(newPassword);
    if (!pwCheck.valid) return { success: false, error: pwCheck.error };

    try {
      const credential = EmailAuthProvider.credential(fbUser.email!, currentPassword);
      await reauthenticateWithCredential(fbUser, credential);
      await updatePassword(fbUser, newPassword);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || "Failed to change password." };
    }
  }, [fbUser, currentUser]);

  const resetPassword = useCallback(async (email: string) => {
    if (!isValidEmail(email)) return { success: false, error: "Invalid email" };
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }, []);

  // Subscription expiry check
  const isSubscriptionExpired = (() => {
    if (!currentUser?.subscription || !currentUser?.subscriptionExpiry) return false;
    return new Date() > new Date(currentUser.subscriptionExpiry);
  })();

  const daysUntilExpiry = (() => {
    if (!currentUser?.subscription || !currentUser?.subscriptionExpiry) return null;
    const diff = new Date(currentUser.subscriptionExpiry).getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  })();

  // Auto-expire subscription
  useEffect(() => {
    if (currentUser && currentUser.subscription && currentUser.subscriptionExpiry && new Date() > new Date(currentUser.subscriptionExpiry)) {
      // Fire and forget update
      updateDoc(doc(db, "users", currentUser.id), { subscription: null }).then(() => {
        addDoc(collection(db, "notifications"), {
          targetId: currentUser.id,
          title: "Subscription Expired ⏰",
          message: "Your subscription has expired. Please renew to continue enjoying AKPLAY content.",
          icon: "⏰",
          createdAt: serverTimestamp(),
          readBy: []
        });
      }).catch(console.error);
    }
  }, [currentUser]);

  // Admin helpers
  const getAllUsers = useCallback(async () => {
    const q = query(collection(db, "users"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as User);
  }, []);

  const addNotificationForUser = useCallback(async (userId: string, title: string, message: string, icon: string) => {
    await addDoc(collection(db, "notifications"), {
      targetId: userId,
      title,
      message,
      icon,
      createdAt: serverTimestamp(),
      readBy: []
    });
  }, []);

  const addNotificationForAll = useCallback(async (title: string, message: string, icon: string) => {
    await addDoc(collection(db, "notifications"), {
      targetId: "all",
      title,
      message,
      icon,
      createdAt: serverTimestamp(),
      readBy: []
    });
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (loadingInitial) {
    return null; // or a loading spinner
  }

  return (
    <AuthContext.Provider
      value={{
        user: currentUser,
        activeProfile,
        isAuthenticated: !!currentUser,
        showProfileSelector,
        signup,
        login,
        logout,
        selectProfile,
        setShowProfileSelector,
        addProfile,
        updateProfile,
        deleteProfile,
        updateUser,
        setSubscription,
        changePassword,
        resetPassword,
        notifications,
        markNotificationRead,
        clearNotifications,
        unreadCount,
        isSubscriptionExpired,
        daysUntilExpiry,
        getAllUsers,
        addNotificationForUser,
        addNotificationForAll,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
