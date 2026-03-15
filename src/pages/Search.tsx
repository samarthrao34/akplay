import { useSearchParams } from 'react-router-dom';
import { Play, Film, Users, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';
import { useSiteConfig } from '../context/SiteContext';

export function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { videos, communityPosts } = useSiteConfig();

  const q = query.toLowerCase();

  const matchedVideos = videos.filter(v =>
    v.title.toLowerCase().includes(q) || v.description.toLowerCase().includes(q)
  );

  const matchedPosts = communityPosts.filter(p =>
    p.text.toLowerCase().includes(q) || p.author.toLowerCase().includes(q)
  );

  const hasResults = matchedVideos.length > 0 || matchedPosts.length > 0;

  return (
    <div className="min-h-full bg-[#050505] text-white p-4 md:p-8 pt-6 md:pt-8">
      <h1 className="text-xl md:text-3xl font-extrabold tracking-tight mb-6 md:mb-8">
        Search Results for "{query}"
      </h1>

      {!hasResults ? (
        <div className="text-center text-gray-400 mt-20">
          <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-600" />
          <p className="text-xl">No results found for "{query}".</p>
          <p className="mt-2">Try searching with different keywords.</p>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Video Results */}
          {matchedVideos.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Film className="w-5 h-5 text-[#E62429]" />
                <h2 className="text-lg font-bold">Videos ({matchedVideos.length})</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {matchedVideos.map((video, index) => (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="glass-card rounded-2xl overflow-hidden group cursor-pointer"
                  >
                    <div className="relative aspect-video bg-black">
                      <video
                        src={video.file}
                        className="w-full h-full object-cover"
                        preload="metadata"
                        muted
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-[#E62429] flex items-center justify-center">
                          <Play className="w-5 h-5 text-white fill-current ml-0.5" />
                        </div>
                      </div>
                      <span className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${video.status === "published" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
                        }`}>
                        {video.status}
                      </span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-sm text-white line-clamp-1">{video.title}</h3>
                      <p className="text-gray-400 text-xs mt-1 line-clamp-2">{video.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Community Post Results */}
          {matchedPosts.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-[#E62429]" />
                <h2 className="text-lg font-bold">Community Posts ({matchedPosts.length})</h2>
              </div>
              <div className="space-y-3 max-w-2xl">
                {matchedPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="glass-card rounded-2xl p-4"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      {post.authorAvatar ? (
                        <img src={post.authorAvatar} alt="" className="w-8 h-8 rounded-full bg-white/10" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-[#E62429]/20 flex items-center justify-center text-white font-bold text-xs">
                          {post.author.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <span className="text-sm font-semibold text-white">{post.author}</span>
                        {post.isAdmin && (
                          <span className="ml-2 text-[10px] font-bold bg-[#E62429]/20 text-[#E62429] px-1.5 py-0.5 rounded">ADMIN</span>
                        )}
                        <span className="text-xs text-gray-500 ml-2">{post.date}</span>
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm whitespace-pre-wrap line-clamp-3">{post.text}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
