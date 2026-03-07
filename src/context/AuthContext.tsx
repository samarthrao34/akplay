import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  profiles: UserProfile[];
  subscription: string | null;
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
  setSubscription: (plan: string | null) => void;
  notifications: Notification[];
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  unreadCount: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon: string;
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

function getUsers(): User[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
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

function getDefaultNotifications(): Notification[] {
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

function loadNotifications(): Notification[] {
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
  const [notifications, setNotifications] = useState<Notification[]>(loadNotifications);

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
    };

    setUsers((prev) => [...prev, newUser]);
    setCurrentUserId(userId);
    setActiveProfileId(defaultProfile.id);
    saveSession({ userId, profileId: defaultProfile.id });
    setNotifications(getDefaultNotifications());
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

  const setSubscription = useCallback((plan: string | null) => {
    if (!currentUserId) return;
    setUsers((prev) =>
      prev.map((u) => (u.id === currentUserId ? { ...u, subscription: plan } : u))
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
        notifications,
        markNotificationRead,
        clearNotifications,
        unreadCount,
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
