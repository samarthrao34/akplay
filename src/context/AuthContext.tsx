import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { isValidEmail } from "../utils/emailValidation";

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
  password: string;
  profiles: UserProfile[];
  subscription: string | null;
  subscriptionStartDate: string | null;
  subscriptionExpiry: string | null;
  paymentHistory: PaymentRecord[];
}

interface AuthContextValue {
  user: User | null;
  activeProfile: UserProfile | null;
  isAuthenticated: boolean;
  showProfileSelector: boolean;
  signup: (name: string, email: string, password: string) => { success: boolean; error?: string };
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  selectProfile: (profileId: string) => void;
  setShowProfileSelector: (show: boolean) => void;
  addProfile: (name: string, avatar: string) => boolean;
  updateProfile: (id: string, name: string, avatar: string) => void;
  deleteProfile: (id: string) => void;
  updateUser: (updates: Partial<Pick<User, "name" | "email">>) => void;
  setSubscription: (plan: string | null, amount?: string) => void;
  changePassword: (currentPassword: string, newPassword: string) => { success: boolean; error?: string };
  resetPassword: (email: string, newPassword: string) => { success: boolean; error?: string };
  notifications: AppNotification[];
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  unreadCount: number;
  isSubscriptionExpired: boolean;
  daysUntilExpiry: number | null;
  getAllUsers: () => User[];
  addNotificationForUser: (userId: string, title: string, message: string, icon: string) => void;
  addNotificationForAll: (title: string, message: string, icon: string) => void;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon: string;
}

export { isValidEmail };

// Password validation - minimum 6 chars, at least one letter and one number
export function isValidPassword(password: string): { valid: boolean; error?: string } {
  if (password.length < 6) return { valid: false, error: "Password must be at least 6 characters." };
  if (!/[a-zA-Z]/.test(password)) return { valid: false, error: "Password must contain at least one letter." };
  if (!/[0-9]/.test(password)) return { valid: false, error: "Password must contain at least one number." };
  return { valid: true };
}

const USERS_KEY = "akplay-users";
const SESSION_KEY = "akplay-session";
const NOTIF_KEY = "akplay-notifications";

const PROFILE_AVATARS = [
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

export { PROFILE_AVATARS };

function migrateUser(u: any): User {
  return {
    ...u,
    subscriptionStartDate: u.subscriptionStartDate ?? null,
    subscriptionExpiry: u.subscriptionExpiry ?? null,
    paymentHistory: u.paymentHistory ?? [],
  };
}

function getUsers(): User[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? (JSON.parse(raw) as any[]).map(migrateUser) : [];
  } catch { return []; }
}

function saveUsers(users: User[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getSession(): { userId: string; profileId: string } | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function saveSession(session: { userId: string; profileId: string } | null) {
  if (session) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
}

function getDefaultNotifications(): AppNotification[] {
  return [
    {
      id: "1",
      title: "Welcome to AKPLAY! 🎬",
      message: "Start exploring our content library and enjoy streaming.",
      time: "Just now",
      read: false,
      icon: "🎉",
    },
    {
      id: "2",
      title: "UNDELETED Season 1",
      message: "Our first original web series is coming soon. Stay tuned!",
      time: "1 hour ago",
      read: false,
      icon: "🎥",
    },
    {
      id: "3",
      title: "New Features Available",
      message: "Check out our subscription plans for the best streaming experience.",
      time: "2 hours ago",
      read: false,
      icon: "✨",
    },
  ];
}

function loadNotifications(): AppNotification[] {
  try {
    const raw = localStorage.getItem(NOTIF_KEY);
    return raw ? JSON.parse(raw) : getDefaultNotifications();
  } catch { return getDefaultNotifications(); }
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(getUsers);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);
  const [showProfileSelector, setShowProfileSelector] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>(loadNotifications);

  // Restore session
  useEffect(() => {
    const session = getSession();
    if (session) {
      const allUsers = getUsers();
      const u = allUsers.find((u) => u.id === session.userId);
      if (u) {
        setCurrentUserId(u.id);
        setActiveProfileId(session.profileId);
      }
    }
  }, []);

  // Persist users
  useEffect(() => { saveUsers(users); }, [users]);

  // Persist notifications
  useEffect(() => { localStorage.setItem(NOTIF_KEY, JSON.stringify(notifications)); }, [notifications]);

  const user = users.find((u) => u.id === currentUserId) ?? null;
  const activeProfile = user?.profiles.find((p) => p.id === activeProfileId) ?? null;

  const signup = useCallback((name: string, email: string, password: string) => {
    if (!isValidEmail(email)) return { success: false, error: "Please enter a valid email address (e.g. name@gmail.com)." };
    const pwCheck = isValidPassword(password);
    if (!pwCheck.valid) return { success: false, error: pwCheck.error };

    const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) return { success: false, error: "An account with this email already exists." };

    const userId = Date.now().toString();
    const defaultProfile: UserProfile = {
      id: userId + "-p1",
      name,
      avatar: PROFILE_AVATARS[Math.floor(Math.random() * PROFILE_AVATARS.length)],
    };

    const newUser: User = {
      id: userId,
      name,
      email,
      password,
      profiles: [defaultProfile],
      subscription: null,
      subscriptionStartDate: null,
      subscriptionExpiry: null,
      paymentHistory: [],
    };

    setUsers((prev) => [...prev, newUser]);
    setCurrentUserId(userId);
    setActiveProfileId(defaultProfile.id);
    saveSession({ userId, profileId: defaultProfile.id });
    setNotifications(getDefaultNotifications());

    // Send welcome email (fire-and-forget)
    fetch("/api/send-welcome-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, type: "signup" }),
    }).catch(() => {});

    return { success: true };
  }, [users]);

  const login = useCallback((email: string, password: string) => {
    const u = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!u) return { success: false, error: "Invalid email or password." };

    setCurrentUserId(u.id);
    if (u.profiles.length > 1) {
      setShowProfileSelector(true);
      setActiveProfileId(null);
      saveSession({ userId: u.id, profileId: u.profiles[0].id });
    } else {
      setActiveProfileId(u.profiles[0].id);
      saveSession({ userId: u.id, profileId: u.profiles[0].id });
    }

    // Send welcome-back email (fire-and-forget)
    fetch("/api/send-welcome-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: u.name, email: u.email, type: "login" }),
    }).catch(() => {});

    return { success: true };
  }, [users]);

  const logout = useCallback(() => {
    setCurrentUserId(null);
    setActiveProfileId(null);
    setShowProfileSelector(false);
    saveSession(null);
  }, []);

  const selectProfile = useCallback((profileId: string) => {
    setActiveProfileId(profileId);
    setShowProfileSelector(false);
    if (currentUserId) {
      saveSession({ userId: currentUserId, profileId });
    }
  }, [currentUserId]);

  const addProfile = useCallback((name: string, avatar: string): boolean => {
    if (!currentUserId) return false;
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== currentUserId) return u;
        if (u.profiles.length >= 5) return u;
        return {
          ...u,
          profiles: [
            ...u.profiles,
            { id: Date.now().toString(), name, avatar },
          ],
        };
      })
    );
    return true;
  }, [currentUserId]);

  const updateProfile = useCallback((id: string, name: string, avatar: string) => {
    if (!currentUserId) return;
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== currentUserId) return u;
        return {
          ...u,
          profiles: u.profiles.map((p) =>
            p.id === id ? { ...p, name, avatar } : p
          ),
        };
      })
    );
  }, [currentUserId]);

  const deleteProfile = useCallback((id: string) => {
    if (!currentUserId) return;
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== currentUserId) return u;
        if (u.profiles.length <= 1) return u;
        return { ...u, profiles: u.profiles.filter((p) => p.id !== id) };
      })
    );
    if (activeProfileId === id) {
      const u = users.find((u) => u.id === currentUserId);
      const remaining = u?.profiles.filter((p) => p.id !== id);
      if (remaining?.length) {
        setActiveProfileId(remaining[0].id);
        saveSession({ userId: currentUserId, profileId: remaining[0].id });
      }
    }
  }, [currentUserId, activeProfileId, users]);

  const updateUser = useCallback((updates: Partial<Pick<User, "name" | "email">>) => {
    if (!currentUserId) return;
    setUsers((prev) =>
      prev.map((u) => (u.id === currentUserId ? { ...u, ...updates } : u))
    );
  }, [currentUserId]);

  const setSubscription = useCallback((plan: string | null, amount?: string) => {
    if (!currentUserId) return;
    const now = new Date();
    const expiry = new Date(now);
    expiry.setDate(expiry.getDate() + 30);

    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== currentUserId) return u;
        const paymentRecord: PaymentRecord | null = plan && amount ? {
          id: Date.now().toString(),
          plan,
          amount,
          date: now.toISOString(),
          status: "completed",
        } : null;
        return {
          ...u,
          subscription: plan,
          subscriptionStartDate: plan ? now.toISOString() : null,
          subscriptionExpiry: plan ? expiry.toISOString() : null,
          paymentHistory: paymentRecord ? [...(u.paymentHistory || []), paymentRecord] : (u.paymentHistory || []),
        };
      })
    );
  }, [currentUserId]);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const changePassword = useCallback((currentPassword: string, newPassword: string) => {
    if (!currentUserId) return { success: false, error: "Not logged in." };
    const u = users.find((u) => u.id === currentUserId);
    if (!u) return { success: false, error: "User not found." };
    if (u.password !== currentPassword) return { success: false, error: "Current password is incorrect." };
    const pwCheck = isValidPassword(newPassword);
    if (!pwCheck.valid) return { success: false, error: pwCheck.error };
    setUsers((prev) =>
      prev.map((usr) => (usr.id === currentUserId ? { ...usr, password: newPassword } : usr))
    );
    return { success: true };
  }, [currentUserId, users]);

  const resetPassword = useCallback((email: string, newPassword: string) => {
    const u = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!u) return { success: false, error: "No account found with this email address." };
    const pwCheck = isValidPassword(newPassword);
    if (!pwCheck.valid) return { success: false, error: pwCheck.error };
    setUsers((prev) =>
      prev.map((usr) => (usr.email.toLowerCase() === email.toLowerCase() ? { ...usr, password: newPassword } : usr))
    );
    return { success: true };
  }, [users]);

  // Subscription expiry check
  const isSubscriptionExpired = (() => {
    if (!user?.subscription || !user?.subscriptionExpiry) return false;
    return new Date() > new Date(user.subscriptionExpiry);
  })();

  const daysUntilExpiry = (() => {
    if (!user?.subscription || !user?.subscriptionExpiry) return null;
    const diff = new Date(user.subscriptionExpiry).getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  })();

  // Auto-expire subscription
  useEffect(() => {
    if (user && user.subscription && user.subscriptionExpiry && new Date() > new Date(user.subscriptionExpiry)) {
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, subscription: null } : u))
      );
      setNotifications((prev) => [
        {
          id: Date.now().toString(),
          title: "Subscription Expired ⏰",
          message: "Your subscription has expired. Please renew to continue enjoying AKPLAY content.",
          time: "Just now",
          read: false,
          icon: "⏰",
        },
        ...prev,
      ]);
    }
  }, [user]);

  // Admin helpers
  const getAllUsers = useCallback(() => {
    return getUsers();
  }, [users]);

  const addNotificationForUser = useCallback((userId: string, title: string, message: string, icon: string) => {
    // Store notification per user in localStorage
    const key = `akplay-notif-${userId}`;
    const existing = JSON.parse(localStorage.getItem(key) || "[]");
    const newNotif: AppNotification = {
      id: Date.now().toString(),
      title,
      message,
      time: "Just now",
      read: false,
      icon,
    };
    localStorage.setItem(key, JSON.stringify([newNotif, ...existing]));
    // If this is the current user, add to their notifications
    if (userId === currentUserId) {
      setNotifications((prev) => [newNotif, ...prev]);
    }
  }, [currentUserId]);

  const addNotificationForAll = useCallback((title: string, message: string, icon: string) => {
    const allUsers = getUsers();
    allUsers.forEach((u) => {
      const key = `akplay-notif-${u.id}`;
      const existing = JSON.parse(localStorage.getItem(key) || "[]");
      const newNotif: AppNotification = {
        id: Date.now().toString() + u.id,
        title,
        message,
        time: "Just now",
        read: false,
        icon,
      };
      localStorage.setItem(key, JSON.stringify([newNotif, ...existing]));
    });
    // Add to current user's notifications too
    const newNotif: AppNotification = {
      id: Date.now().toString(),
      title,
      message,
      time: "Just now",
      read: false,
      icon,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  }, []);

  // Load user-specific notifications on login
  useEffect(() => {
    if (currentUserId) {
      const key = `akplay-notif-${currentUserId}`;
      const userNotifs = JSON.parse(localStorage.getItem(key) || "null");
      if (userNotifs) {
        setNotifications((prev) => {
          const existingIds = new Set(prev.map((n) => n.id));
          const newOnes = userNotifs.filter((n: AppNotification) => !existingIds.has(n.id));
          return [...newOnes, ...prev];
        });
      }
    }
  }, [currentUserId]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <AuthContext.Provider
      value={{
        user,
        activeProfile,
        isAuthenticated: !!user,
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
