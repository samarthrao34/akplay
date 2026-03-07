import { useState } from "react";
import { Users, Send, Heart, MessageSquare, Image, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useSiteConfig, CommunityPost } from "../context/SiteContext";
import { useAuth } from "../context/AuthContext";

export function Community() {
  const { communityPosts, addUserPost, toggleLike } = useSiteConfig();
  const { user, activeProfile, isAuthenticated } = useAuth();
  const [newPost, setNewPost] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [showImageInput, setShowImageInput] = useState(false);

  const handlePost = () => {
    if (!newPost.trim() || !user || !activeProfile) return;

    const post: CommunityPost = {
      id: Date.now().toString(),
      author: activeProfile.name,
      authorId: user.id,
      authorAvatar: activeProfile.avatar,
      text: newPost.trim(),
      image: imageUrl.trim(),
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      isAdmin: false,
      likes: [],
    };

    addUserPost(post);
    setNewPost("");
    setImageUrl("");
    setShowImageInput(false);
  };

  const userId = user?.id || "";

  return (
    <div className="min-h-full bg-[#050505] text-white p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: "rgba(230,36,41,0.15)" }}>
              <Users className="w-5 h-5 text-[#E62429]" />
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold">Community</h1>
          </div>
          <p className="text-gray-400 text-sm ml-[52px]">Talk about AKPLAY, web series, and everything entertainment</p>
        </motion.div>

        {/* Post Composer */}
        {isAuthenticated && activeProfile ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl p-4 mb-8 border border-white/10"
            style={{ background: "rgba(255,255,255,0.03)", backdropFilter: "blur(12px)" }}
          >
            <div className="flex gap-3">
              <img src={activeProfile.avatar} alt="" className="w-10 h-10 rounded-full bg-white/10 flex-shrink-0" />
              <div className="flex-1">
                <textarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="What's on your mind about AKPLAY?"
                  rows={3}
                  className="w-full bg-transparent text-white placeholder-gray-500 text-sm resize-none focus:outline-none"
                />
                <AnimatePresence>
                  {showImageInput && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="flex items-center gap-2 mt-2">
                        <input
                          type="text"
                          value={imageUrl}
                          onChange={(e) => setImageUrl(e.target.value)}
                          placeholder="Paste image URL..."
                          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#E62429]/50"
                        />
                        <button onClick={() => { setShowImageInput(false); setImageUrl(""); }} className="p-2 text-gray-400 hover:text-white">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                  <button
                    onClick={() => setShowImageInput(!showImageInput)}
                    className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#E62429] transition-colors"
                  >
                    <Image className="w-4 h-4" />
                    <span>Image</span>
                  </button>
                  <button
                    onClick={handlePost}
                    disabled={!newPost.trim()}
                    className="flex items-center gap-2 bg-[#E62429] hover:bg-[#c91e23] disabled:opacity-30 disabled:cursor-not-allowed text-white px-5 py-2 rounded-xl font-bold text-sm transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Post</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-2xl p-6 mb-8 border border-white/10 text-center"
            style={{ background: "rgba(255,255,255,0.03)" }}
          >
            <MessageSquare className="w-8 h-8 text-gray-500 mx-auto mb-2" />
            <p className="text-gray-400 text-sm">Sign in and select a profile to post in the community</p>
          </motion.div>
        )}

        {/* Posts Feed */}
        <div className="space-y-4">
          {communityPosts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500">No posts yet. Be the first to share something!</p>
            </motion.div>
          ) : (
            communityPosts.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-2xl p-5 border border-white/8"
                style={{ background: "rgba(255,255,255,0.03)", backdropFilter: "blur(8px)" }}
              >
                <div className="flex items-start gap-3">
                  {post.authorAvatar ? (
                    <img src={post.authorAvatar} alt="" className="w-10 h-10 rounded-full bg-white/10 flex-shrink-0" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#E62429]/20 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {post.author.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-white">{post.author}</span>
                      {post.isAdmin && (
                        <span className="text-[10px] font-bold bg-[#E62429]/20 text-[#E62429] px-1.5 py-0.5 rounded">ADMIN</span>
                      )}
                      <span className="text-xs text-gray-500">{post.date}</span>
                    </div>
                    <p className="text-gray-200 text-sm mt-2 whitespace-pre-wrap">{post.text}</p>
                    {post.image && (
                      <img src={post.image} alt="" className="mt-3 rounded-xl w-full object-cover max-h-80 border border-white/5" />
                    )}
                    <div className="flex items-center gap-4 mt-3 pt-2">
                      <button
                        onClick={() => isAuthenticated && userId && toggleLike(post.id, userId)}
                        className={`flex items-center gap-1.5 text-xs transition-colors ${
                          (post.likes || []).includes(userId) ? "text-[#E62429]" : "text-gray-500 hover:text-[#E62429]"
                        } ${!isAuthenticated ? "opacity-40 cursor-not-allowed" : ""}`}
                        disabled={!isAuthenticated}
                      >
                        <Heart className={`w-4 h-4 ${(post.likes || []).includes(userId) ? "fill-current" : ""}`} />
                        <span>{(post.likes || []).length > 0 ? (post.likes || []).length : ""}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
