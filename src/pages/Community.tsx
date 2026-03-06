import { Users } from "lucide-react";
import { motion } from "motion/react";
import { useSiteConfig } from "../context/SiteContext";

export function Community() {
  const { getText, communityPosts } = useSiteConfig();

  return (
    <div className="min-h-full bg-[#050505] text-white flex flex-col items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <div className="w-20 h-20 mx-auto mb-6 rounded-3xl glass-card flex items-center justify-center">
          <Users className="w-10 h-10 text-[#E62429]" />
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-200 to-gray-500 mb-4">
          Coming Soon
        </h1>
        <p className="text-gray-400 text-lg max-w-md mx-auto">
          {getText("Community", "Page Message")}
        </p>
      </motion.div>

      {communityPosts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 w-full max-w-2xl space-y-6"
        >
          {communityPosts.map((post) => (
            <div key={post.id} className="glass-card rounded-3xl p-6">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E62429] to-orange-500 flex items-center justify-center text-white font-bold text-sm">
                  {post.author.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-sm">{post.author}</p>
                  <p className="text-xs text-gray-500">{post.date}</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm">{post.text}</p>
              {post.image && (
                <img src={post.image} alt="" className="mt-4 rounded-2xl w-full object-cover max-h-72" />
              )}
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
