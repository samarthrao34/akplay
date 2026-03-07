import { useState, useRef } from "react";
import {
  Lock,
  LogOut,
  Upload,
  Type,
  Users,
  Film,
  Settings,
  Save,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Check,
  X,
  Image,
  Video,
  MessageSquare,
  CloudUpload,
  CreditCard,
  Bell,
  Send,
  Search,
  UserCheck,
  Clock,
} from "lucide-react";
import { motion } from "motion/react";
import { useSiteConfig, VideoEntry, CommunityPost, TextEntry } from "../context/SiteContext";
import { useAuth, User as AppUser } from "../context/AuthContext";

const ADMIN_CREDENTIALS = [
  { username: "Sam@ADMIN", password: "S@ADMIN" },
  { username: "Kundan@ADMIN", password: "K@ADMIN" },
  { username: "Amar@ADMIN", password: "A@ADMIN" },
];

type Tab = "overview" | "videos" | "texts" | "community" | "users" | "notifications";

export function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [saveNotif, setSaveNotif] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [searchUser, setSearchUser] = useState("");
  const [notifTitle, setNotifTitle] = useState("");
  const [notifMessage, setNotifMessage] = useState("");
  const [notifIcon, setNotifIcon] = useState("🎬");
  const [notifTarget, setNotifTarget] = useState<"all" | string>("all");
  const [notifSent, setNotifSent] = useState(false);

  // Use shared site context instead of local state
  const { videos, texts, communityPosts, setVideos, setTexts, setCommunityPosts, saveToServer } = useSiteConfig();
  const { getAllUsers, addNotificationForUser, addNotificationForAll } = useAuth();

  const allUsers = getAllUsers();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const validCred = ADMIN_CREDENTIALS.find(
      (c) => c.username === username && c.password === password
    );
    if (validCred) {
      setIsLoggedIn(true);
      setLoginError("");
    } else {
      setLoginError("Invalid credentials. Please try again.");
    }
  };

  const showSave = (msg: string) => {
    setSaveNotif(msg);
    setTimeout(() => setSaveNotif(""), 2000);
  };

  const publishToCodebase = async () => {
    setPublishing(true);
    const ok = await saveToServer();
    setPublishing(false);
    showSave(ok ? "Changes saved & published!" : "Saved locally! Server sync will retry on next save.");
  };

  // Video management
  const addVideo = () => {
    const newVideo: VideoEntry = {
      id: Date.now().toString(),
      title: "New Video",
      description: "",
      file: "",
      status: "draft",
    };
    setVideos([...videos, newVideo]);
  };

  const updateVideo = (id: string, field: keyof VideoEntry, value: string) => {
    setVideos(videos.map((v) => (v.id === id ? { ...v, [field]: value } : v)));
  };

  const deleteVideo = (id: string) => {
    setVideos(videos.filter((v) => v.id !== id));
  };

  // Community post management
  const addPost = () => {
    const newPost: CommunityPost = {
      id: Date.now().toString(),
      author: "AKPLAY Official",
      text: "",
      image: "",
      date: new Date().toLocaleDateString(),
    };
    setCommunityPosts([...communityPosts, newPost]);
  };

  const updatePost = (id: string, field: keyof CommunityPost, value: string) => {
    setCommunityPosts(communityPosts.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  };

  const deletePost = (id: string) => {
    setCommunityPosts(communityPosts.filter((p) => p.id !== id));
  };

  // Text management
  const updateText = (id: string, value: string) => {
    setTexts(texts.map((t) => (t.id === id ? { ...t, value } : t)));
  };

  const addText = () => {
    const newText: TextEntry = {
      id: Date.now().toString(),
      section: "Custom",
      key: "New Field",
      value: "",
    };
    setTexts([...texts, newText]);
  };

  const deleteText = (id: string) => {
    setTexts(texts.filter((t) => t.id !== id));
  };

  const tabs: { id: Tab; label: string; icon: typeof Settings }[] = [
    { id: "overview", label: "Overview", icon: Settings },
    { id: "videos", label: "Videos", icon: Video },
    { id: "texts", label: "Text Content", icon: Type },
    { id: "community", label: "Community Posts", icon: MessageSquare },
    { id: "users", label: "Users & Payments", icon: CreditCard },
    { id: "notifications", label: "Send Notifications", icon: Bell },
  ];

  // LOGIN SCREEN
  if (!isLoggedIn) {
    return (
      <div className="min-h-full bg-[#050505] text-white flex items-center justify-center p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <div className="glass-card rounded-3xl p-10">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#E62429] to-orange-500 flex items-center justify-center shadow-lg shadow-[#E62429]/30">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-extrabold">Admin Login</h1>
              <p className="text-gray-400 text-sm mt-1">Access the AKPLAY Control Panel</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full glass-input rounded-2xl px-4 py-3 text-white focus:outline-none"
                  placeholder="Enter admin username"
                  autoComplete="username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full glass-input rounded-2xl px-4 py-3 pr-12 text-white focus:outline-none"
                    placeholder="Enter password"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {loginError && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#E62429] to-orange-500 text-white py-3.5 rounded-2xl font-bold hover:shadow-lg hover:shadow-[#E62429]/30 transition-all"
              >
                Sign In
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  // ADMIN PANEL
  return (
    <div className="min-h-full bg-[#050505] text-white p-4 md:p-8">
      {/* Save notification */}
      {saveNotif && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="fixed top-6 right-6 z-50 bg-green-500/15 border border-green-500/30 text-green-400 px-5 py-3 rounded-2xl flex items-center space-x-2 text-sm font-medium shadow-lg"
        >
          <Check className="w-4 h-4" />
          <span>{saveNotif}</span>
        </motion.div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 md:mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Admin Panel</h1>
          <p className="text-gray-400 text-sm mt-1">Manage your AKPLAY platform</p>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={publishToCodebase}
            disabled={publishing}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-5 py-2.5 rounded-2xl text-sm font-bold flex items-center space-x-2 hover:shadow-lg hover:shadow-emerald-500/30 transition-all disabled:opacity-50"
          >
            <CloudUpload className="w-4 h-4" />
            <span className="hidden sm:inline">{publishing ? "Publishing..." : "Publish to Codebase"}</span>
            <span className="sm:hidden">{publishing ? "..." : "Publish"}</span>
          </button>
          <button
            onClick={() => {
              setIsLoggedIn(false);
              setUsername("");
              setPassword("");
            }}
            className="glass-btn px-5 py-2.5 rounded-2xl text-sm font-medium flex items-center space-x-2 text-red-400 hover:text-red-300"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 mb-6 md:mb-8 overflow-x-auto scrollbar-hide pb-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-5 py-2.5 rounded-2xl text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "bg-[#E62429]/12 text-[#E62429] shadow-lg shadow-[#E62429]/10"
                  : "glass-btn text-gray-400 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB: Overview */}
      {activeTab === "overview" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { label: "Total Videos", value: videos.length.toString(), icon: Video, color: "text-blue-400" },
              { label: "Community Posts", value: communityPosts.length.toString(), icon: MessageSquare, color: "text-green-400" },
              { label: "Text Entries", value: texts.length.toString(), icon: Type, color: "text-yellow-400" },
              { label: "Total Users", value: allUsers.length.toString(), icon: Users, color: "text-purple-400" },
              { label: "Active Subscribers", value: allUsers.filter((u) => u.subscription).length.toString(), icon: UserCheck, color: "text-emerald-400" },
              { label: "Total Payments", value: allUsers.reduce((acc, u) => acc + (u.paymentHistory?.length || 0), 0).toString(), icon: CreditCard, color: "text-orange-400" },
            ].map((stat, i) => (
              <div key={i} className="glass-card rounded-3xl p-6 flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium mb-1">{stat.label}</p>
                  <h3 className="text-3xl font-extrabold">{stat.value}</h3>
                </div>
                <div className={`p-4 rounded-2xl bg-white/5 ${stat.color}`}>
                  <stat.icon className="w-8 h-8" />
                </div>
              </div>
            ))}
          </div>

          <div className="glass-card rounded-3xl p-8">
            <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                onClick={() => { setActiveTab("videos"); addVideo(); }}
                className="glass-btn rounded-2xl p-4 text-left hover:bg-white/8"
              >
                <Upload className="w-6 h-6 text-[#E62429] mb-2" />
                <p className="font-semibold text-sm">Upload Video</p>
                <p className="text-xs text-gray-400">Add new content</p>
              </button>
              <button
                onClick={() => { setActiveTab("community"); addPost(); }}
                className="glass-btn rounded-2xl p-4 text-left hover:bg-white/8"
              >
                <Plus className="w-6 h-6 text-green-400 mb-2" />
                <p className="font-semibold text-sm">New Post</p>
                <p className="text-xs text-gray-400">Add community post</p>
              </button>
              <button
                onClick={() => setActiveTab("texts")}
                className="glass-btn rounded-2xl p-4 text-left hover:bg-white/8"
              >
                <Type className="w-6 h-6 text-yellow-400 mb-2" />
                <p className="font-semibold text-sm">Edit Text</p>
                <p className="text-xs text-gray-400">Update website content</p>
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* TAB: Videos */}
      {activeTab === "videos" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Video Management</h2>
            <button
              onClick={addVideo}
              className="bg-gradient-to-r from-[#E62429] to-orange-500 text-white px-5 py-2.5 rounded-2xl font-bold text-sm flex items-center space-x-2 hover:shadow-lg hover:shadow-[#E62429]/30 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Video</span>
            </button>
          </div>

          <input type="file" ref={fileInputRef} accept="video/*" className="hidden" />

          {videos.map((video) => (
            <div key={video.id} className="glass-card rounded-3xl p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Title</label>
                    <input
                      type="text"
                      value={video.title}
                      onChange={(e) => updateVideo(video.id, "title", e.target.value)}
                      className="w-full glass-input rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Description</label>
                    <textarea
                      value={video.description}
                      onChange={(e) => updateVideo(video.id, "description", e.target.value)}
                      rows={2}
                      className="w-full glass-input rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">File Path / URL</label>
                    <input
                      type="text"
                      value={video.file}
                      onChange={(e) => updateVideo(video.id, "file", e.target.value)}
                      className="w-full glass-input rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                      placeholder="/videos/filename.mp4"
                    />
                  </div>
                  <div className="flex items-center space-x-4">
                    <select
                      value={video.status}
                      onChange={(e) => updateVideo(video.id, "status", e.target.value)}
                      className="glass-input rounded-xl px-4 py-2 text-sm text-white focus:outline-none"
                    >
                      <option value="draft" className="bg-[#141414]">Draft</option>
                      <option value="published" className="bg-[#141414]">Published</option>
                    </select>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                      video.status === "published" ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400"
                    }`}>
                      {video.status === "published" ? "Published" : "Draft"}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => deleteVideo(video.id)}
                  className="ml-4 p-2 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={publishToCodebase}
                  disabled={publishing}
                  className="bg-gradient-to-r from-[#E62429] to-orange-500 text-white px-6 py-2 rounded-xl font-bold text-sm flex items-center space-x-2 hover:shadow-lg hover:shadow-[#E62429]/30 transition-all disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{publishing ? "Saving..." : "Save"}</span>
                </button>
              </div>
            </div>
          ))}

          {videos.length === 0 && (
            <div className="glass-card rounded-3xl p-12 text-center">
              <Video className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No videos yet. Click "Add Video" to get started.</p>
            </div>
          )}
        </motion.div>
      )}

      {/* TAB: Text Content */}
      {activeTab === "texts" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Text Content Management</h2>
            <button
              onClick={addText}
              className="bg-gradient-to-r from-[#E62429] to-orange-500 text-white px-5 py-2.5 rounded-2xl font-bold text-sm flex items-center space-x-2 hover:shadow-lg hover:shadow-[#E62429]/30 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Field</span>
            </button>
          </div>

          {/* Group by section */}
          {Array.from(new Set(texts.map((t) => t.section))).map((section) => (
            <div key={section} className="glass-card rounded-3xl p-6">
              <h3 className="text-lg font-bold mb-4 text-[#E62429]">{section}</h3>
              <div className="space-y-4">
                {texts
                  .filter((t) => t.section === section)
                  .map((entry) => (
                    <div key={entry.id} className="flex items-start space-x-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-1.5">
                          <input
                            type="text"
                            value={entry.key}
                            onChange={(e) => {
                              setTexts(texts.map((t) => (t.id === entry.id ? { ...t, key: e.target.value } : t)));
                            }}
                            className="text-xs font-medium text-gray-400 bg-transparent border-none focus:outline-none"
                          />
                          <input
                            type="text"
                            value={entry.section}
                            onChange={(e) => {
                              setTexts(texts.map((t) => (t.id === entry.id ? { ...t, section: e.target.value } : t)));
                            }}
                            className="text-[10px] font-medium text-gray-600 bg-transparent border-none focus:outline-none w-16"
                          />
                        </div>
                        <textarea
                          value={entry.value}
                          onChange={(e) => updateText(entry.id, e.target.value)}
                          rows={2}
                          className="w-full glass-input rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none resize-none"
                        />
                      </div>
                      <button
                        onClick={() => deleteText(entry.id)}
                        className="p-2 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors mt-6"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          ))}

          <div className="flex justify-end">
            <button
              onClick={publishToCodebase}
              disabled={publishing}
              className="bg-gradient-to-r from-[#E62429] to-orange-500 text-white px-8 py-3 rounded-2xl font-bold text-sm flex items-center space-x-2 hover:shadow-lg hover:shadow-[#E62429]/30 transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{publishing ? "Saving..." : "Save All Changes"}</span>
            </button>
          </div>
        </motion.div>
      )}

      {/* TAB: Community Posts */}
      {activeTab === "community" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Community Posts</h2>
            <button
              onClick={addPost}
              className="bg-gradient-to-r from-[#E62429] to-orange-500 text-white px-5 py-2.5 rounded-2xl font-bold text-sm flex items-center space-x-2 hover:shadow-lg hover:shadow-[#E62429]/30 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>New Post</span>
            </button>
          </div>

          {communityPosts.map((post) => (
            <div key={post.id} className="glass-card rounded-3xl p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Author</label>
                    <input
                      type="text"
                      value={post.author}
                      onChange={(e) => updatePost(post.id, "author", e.target.value)}
                      className="w-full glass-input rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Post Content</label>
                    <textarea
                      value={post.text}
                      onChange={(e) => updatePost(post.id, "text", e.target.value)}
                      rows={3}
                      className="w-full glass-input rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none resize-none"
                      placeholder="Write your post content..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Image URL (optional)</label>
                    <input
                      type="text"
                      value={post.image}
                      onChange={(e) => updatePost(post.id, "image", e.target.value)}
                      className="w-full glass-input rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <p className="text-xs text-gray-500">Created: {post.date}</p>
                </div>
                <button
                  onClick={() => deletePost(post.id)}
                  className="ml-4 p-2 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={publishToCodebase}
                  disabled={publishing}
                  className="bg-gradient-to-r from-[#E62429] to-orange-500 text-white px-6 py-2 rounded-xl font-bold text-sm flex items-center space-x-2 hover:shadow-lg hover:shadow-[#E62429]/30 transition-all disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{publishing ? "Saving..." : "Save Post"}</span>
                </button>
              </div>
            </div>
          ))}

          {communityPosts.length === 0 && (
            <div className="glass-card rounded-3xl p-12 text-center">
              <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No community posts yet. Click "New Post" to create one.</p>
            </div>
          )}
        </motion.div>
      )}

      {/* TAB: Users & Payments */}
      {activeTab === "users" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-xl font-bold">Users & Payment Tracking</h2>
            <div className="relative max-w-xs w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
                placeholder="Search by name or email..."
                className="w-full glass-input rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: "Total Users", value: allUsers.length.toString(), icon: Users, color: "text-blue-400" },
              { label: "Active Subscribers", value: allUsers.filter((u) => u.subscription).length.toString(), icon: UserCheck, color: "text-green-400" },
              { label: "Total Payments", value: allUsers.reduce((acc, u) => acc + (u.paymentHistory?.length || 0), 0).toString(), icon: CreditCard, color: "text-yellow-400" },
              { label: "Expired/Free", value: allUsers.filter((u) => !u.subscription).length.toString(), icon: Clock, color: "text-red-400" },
            ].map((stat, i) => (
              <div key={i} className="glass-card rounded-2xl p-5 flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-xs font-medium mb-1">{stat.label}</p>
                  <h3 className="text-2xl font-extrabold">{stat.value}</h3>
                </div>
                <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            ))}
          </div>

          {/* Users List */}
          <div className="space-y-4">
            {allUsers
              .filter((u) => {
                if (!searchUser.trim()) return true;
                const q = searchUser.toLowerCase();
                return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
              })
              .map((u) => {
                const isExpired = u.subscriptionExpiry ? new Date() > new Date(u.subscriptionExpiry) : false;
                const daysLeft = u.subscriptionExpiry
                  ? Math.max(0, Math.ceil((new Date(u.subscriptionExpiry).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
                  : null;
                return (
                  <div key={u.id} className="glass-card rounded-2xl p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#E62429] to-orange-500 flex items-center justify-center text-white font-bold text-lg">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-white font-bold text-sm">{u.name}</p>
                          <p className="text-gray-400 text-xs">{u.email}</p>
                          <p className="text-gray-500 text-[10px]">ID: {u.id}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {u.subscription ? (
                          <div className="text-right">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase ${
                              isExpired ? "bg-red-500/15 text-red-400" : "bg-green-500/15 text-green-400"
                            }`}>
                              {isExpired ? "Expired" : `${u.subscription} Plan`}
                            </span>
                            {daysLeft !== null && !isExpired && (
                              <p className="text-gray-500 text-[10px] mt-1">{daysLeft} days left</p>
                            )}
                            {u.subscriptionExpiry && (
                              <p className="text-gray-600 text-[10px]">Expires: {new Date(u.subscriptionExpiry).toLocaleDateString()}</p>
                            )}
                          </div>
                        ) : (
                          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase bg-gray-500/15 text-gray-400">
                            Free User
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Payment History */}
                    {u.paymentHistory && u.paymentHistory.length > 0 && (
                      <div className="mt-4 border-t border-white/5 pt-3">
                        <p className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Payment History</p>
                        <div className="space-y-2">
                          {u.paymentHistory.map((p) => (
                            <div key={p.id} className="flex items-center justify-between bg-white/[0.02] rounded-xl px-4 py-2">
                              <div className="flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full ${p.status === "completed" ? "bg-green-400" : p.status === "pending" ? "bg-yellow-400" : "bg-red-400"}`} />
                                <div>
                                  <p className="text-white text-xs font-medium capitalize">{p.plan} Plan</p>
                                  <p className="text-gray-500 text-[10px]">{new Date(p.date).toLocaleDateString()}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-white text-sm font-bold">{p.amount}</p>
                                <p className={`text-[10px] font-bold uppercase ${p.status === "completed" ? "text-green-400" : "text-yellow-400"}`}>{p.status}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            {allUsers.length === 0 && (
              <div className="glass-card rounded-3xl p-12 text-center">
                <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No registered users yet.</p>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* TAB: Send Notifications */}
      {activeTab === "notifications" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <h2 className="text-xl font-bold">Send Custom Notifications</h2>
          <p className="text-gray-400 text-sm">Send personalized notifications to engage users and pull them back to watch more content.</p>

          <div className="glass-card rounded-3xl p-6 space-y-5">
            {/* Target selection */}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">Send To</label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setNotifTarget("all")}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    notifTarget === "all" ? "bg-[#E62429] text-white" : "glass-btn text-gray-400"
                  }`}
                >
                  All Users
                </button>
                {allUsers.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => setNotifTarget(u.id)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      notifTarget === u.id ? "bg-[#E62429] text-white" : "glass-btn text-gray-400"
                    }`}
                  >
                    {u.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Notification icon */}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">Icon</label>
              <div className="flex gap-2 flex-wrap">
                {["🎬", "🔥", "⭐", "🎉", "📢", "🎥", "💎", "🆕", "❤️", "🎭"].map((icon) => (
                  <button
                    key={icon}
                    onClick={() => setNotifIcon(icon)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all ${
                      notifIcon === icon ? "bg-[#E62429]/20 ring-2 ring-[#E62429] scale-110" : "bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">Title</label>
              <input
                type="text"
                value={notifTitle}
                onChange={(e) => setNotifTitle(e.target.value)}
                placeholder="e.g. New Movie Alert! 🎬"
                className="w-full glass-input rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">Message</label>
              <textarea
                value={notifMessage}
                onChange={(e) => setNotifMessage(e.target.value)}
                rows={3}
                placeholder="e.g. Hey! We just added a new blockbuster movie. Come watch it now on AKPLAY!"
                className="w-full glass-input rounded-xl px-4 py-3 text-sm text-white focus:outline-none resize-none"
              />
            </div>

            {/* Preview */}
            {(notifTitle || notifMessage) && (
              <div className="border border-white/5 rounded-2xl p-4 bg-white/[0.02]">
                <p className="text-[10px] text-gray-500 font-bold uppercase mb-2">Preview</p>
                <div className="flex items-start gap-3">
                  <span className="text-xl">{notifIcon}</span>
                  <div>
                    <p className="text-white font-semibold text-sm">{notifTitle || "Title"}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{notifMessage || "Message"}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Templates */}
            <div>
              <p className="text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">Quick Templates</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { title: "New Content Alert! 🎬", message: "We just uploaded fresh new content on AKPLAY. Don't miss out — come watch now!", icon: "🎬" },
                  { title: "We Miss You! ❤️", message: "It's been a while since you visited AKPLAY. Come back and discover what's new!", icon: "❤️" },
                  { title: "Exclusive Release 🔥", message: "A brand new exclusive is now streaming only on AKPLAY. Watch it before everyone else!", icon: "🔥" },
                  { title: "Your Subscription is Expiring ⏰", message: "Your subscription is about to expire. Renew now to keep enjoying unlimited streaming!", icon: "⏰" },
                ].map((tmpl, i) => (
                  <button
                    key={i}
                    onClick={() => { setNotifTitle(tmpl.title); setNotifMessage(tmpl.message); setNotifIcon(tmpl.icon); }}
                    className="glass-btn rounded-xl p-3 text-left hover:bg-white/8 transition-all"
                  >
                    <p className="text-white text-xs font-semibold">{tmpl.icon} {tmpl.title}</p>
                    <p className="text-gray-500 text-[10px] mt-1 line-clamp-1">{tmpl.message}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Send button */}
            <button
              onClick={() => {
                if (!notifTitle.trim() || !notifMessage.trim()) return;
                if (notifTarget === "all") {
                  addNotificationForAll(notifTitle.trim(), notifMessage.trim(), notifIcon);
                } else {
                  addNotificationForUser(notifTarget, notifTitle.trim(), notifMessage.trim(), notifIcon);
                }
                setNotifSent(true);
                setTimeout(() => setNotifSent(false), 3000);
                setNotifTitle("");
                setNotifMessage("");
              }}
              disabled={!notifTitle.trim() || !notifMessage.trim()}
              className="w-full bg-gradient-to-r from-[#E62429] to-orange-500 text-white py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[#E62429]/30 transition-all disabled:opacity-50"
            >
              {notifSent ? (
                <><Check className="w-4 h-4" /> Notification Sent!</>
              ) : (
                <><Send className="w-4 h-4" /> Send Notification</>
              )}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
