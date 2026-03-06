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
} from "lucide-react";
import { motion } from "motion/react";
import { useSiteConfig, VideoEntry, CommunityPost, TextEntry } from "../context/SiteContext";

const ADMIN_USERNAME = "Sam@ADMIN";
const ADMIN_PASSWORD = "S@ADMIN";

type Tab = "overview" | "videos" | "texts" | "community";

export function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [saveNotif, setSaveNotif] = useState("");
  const [publishing, setPublishing] = useState(false);

  // Use shared site context instead of local state
  const { videos, texts, communityPosts, setVideos, setTexts, setCommunityPosts, saveToServer } = useSiteConfig();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
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
  ];

  // LOGIN SCREEN
  if (!isLoggedIn) {
    return (
      <div className="min-h-full bg-[#050505] text-white flex items-center justify-center p-8">
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
    <div className="min-h-full bg-[#050505] text-white p-8">
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Admin Panel</h1>
          <p className="text-gray-400 text-sm mt-1">Manage your AKPLAY platform</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={publishToCodebase}
            disabled={publishing}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-5 py-2.5 rounded-2xl text-sm font-bold flex items-center space-x-2 hover:shadow-lg hover:shadow-emerald-500/30 transition-all disabled:opacity-50"
          >
            <CloudUpload className="w-4 h-4" />
            <span>{publishing ? "Publishing..." : "Publish to Codebase"}</span>
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
      <div className="flex space-x-2 mb-8 overflow-x-auto scrollbar-hide">
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
    </div>
  );
}
