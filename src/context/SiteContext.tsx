import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface TextEntry {
  id: string;
  section: string;
  key: string;
  value: string;
}

export interface VideoEntry {
  id: string;
  title: string;
  description: string;
  file: string;
  status: "published" | "draft";
}

export interface CommunityPost {
  id: string;
  author: string;
  text: string;
  image: string;
  date: string;
}

export interface SiteConfig {
  texts: TextEntry[];
  videos: VideoEntry[];
  communityPosts: CommunityPost[];
}

interface SiteContextValue extends SiteConfig {
  setText: (id: string, value: string) => void;
  setTexts: (texts: TextEntry[]) => void;
  setVideos: (videos: VideoEntry[]) => void;
  setCommunityPosts: (posts: CommunityPost[]) => void;
  getText: (section: string, key: string) => string;
  saveToServer: () => Promise<boolean>;
}

const DEFAULT_CONFIG: SiteConfig = {
  texts: [
    { id: "1", section: "Home", key: "Main Heading", value: "Coming Soon" },
    { id: "2", section: "Home", key: "Subheading", value: "We are building the ultimate streaming experience. Get ready for our first original web series." },
    { id: "3", section: "Home", key: "Video Badge", value: "Official Announcement" },
    { id: "4", section: "Home", key: "Video Title", value: "UNDELETED" },
    { id: "5", section: "Home", key: "Video Subtitle", value: "Season 1 coming soon exclusively on AKPLAY." },
    { id: "6", section: "Library", key: "Page Message", value: "Our content library is being curated. Stay tuned for an amazing collection." },
    { id: "7", section: "Community", key: "Page Message", value: "Our community hub is under construction. Join us soon to connect with creators and fans." },
    { id: "8", section: "Subscription", key: "Heading", value: "Choose Your Plan" },
    { id: "9", section: "Subscription", key: "Subheading", value: "Unlock unlimited entertainment with AKPLAY. Pick the plan that suits you best." },
  ],
  videos: [
    { id: "1", title: "UNDELETED - Season 1 Trailer", description: "Official announcement trailer", file: "/videos/InShot_20260203_184738626.mp4", status: "published" },
  ],
  communityPosts: [],
};

const STORAGE_KEY = "akplay-site-config";

function loadConfig(): SiteConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_CONFIG, ...parsed };
    }
  } catch { /* use default */ }
  return DEFAULT_CONFIG;
}

function persistConfig(config: SiteConfig) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

const SiteContext = createContext<SiteContextValue | null>(null);

export function SiteProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<SiteConfig>(loadConfig);

  // Also try to load from server config on mount (to pick up codebase changes)
  useEffect(() => {
    fetch("/site-config.json")
      .then((r) => r.json())
      .then((serverConfig: SiteConfig) => {
        // Only use server config if localStorage is empty (first load)
        const localRaw = localStorage.getItem(STORAGE_KEY);
        if (!localRaw) {
          setConfig(serverConfig);
          persistConfig(serverConfig);
        }
      })
      .catch(() => {});
  }, []);

  // Persist on every change
  useEffect(() => {
    persistConfig(config);
  }, [config]);

  const setText = (id: string, value: string) => {
    setConfig((prev) => ({
      ...prev,
      texts: prev.texts.map((t) => (t.id === id ? { ...t, value } : t)),
    }));
  };

  const getText = (section: string, key: string): string => {
    const entry = config.texts.find((t) => t.section === section && t.key === key);
    return entry?.value ?? "";
  };

  const saveToServer = async (): Promise<boolean> => {
    try {
      const res = await fetch("/api/save-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      return res.ok;
    } catch {
      return false;
    }
  };

  return (
    <SiteContext.Provider
      value={{
        ...config,
        setText,
        setTexts: (texts) => setConfig((prev) => ({ ...prev, texts })),
        setVideos: (videos) => setConfig((prev) => ({ ...prev, videos })),
        setCommunityPosts: (communityPosts) => setConfig((prev) => ({ ...prev, communityPosts })),
        getText,
        saveToServer,
      }}
    >
      {children}
    </SiteContext.Provider>
  );
}

export function useSiteConfig() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSiteConfig must be used within SiteProvider");
  return ctx;
}
