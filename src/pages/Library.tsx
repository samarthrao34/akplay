import { Film } from "lucide-react";
import { motion } from "motion/react";
import { useSiteConfig } from "../context/SiteContext";

export function Library() {
  const { getText } = useSiteConfig();

  return (
    <div className="min-h-full bg-[#050505] text-white flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <div className="w-20 h-20 mx-auto mb-6 rounded-3xl glass-card flex items-center justify-center">
          <Film className="w-10 h-10 text-[#E62429]" />
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-200 to-gray-500 mb-4">
          Coming Soon
        </h1>
        <p className="text-gray-400 text-lg max-w-md mx-auto">
          {getText("Library", "Page Message")}
        </p>
      </motion.div>
    </div>
  );
}
