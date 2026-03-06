import { Play, Info } from "lucide-react";
import { motion } from "motion/react";

export function Home() {
  return (
    <div className="min-h-full bg-[#0a0a0a] text-white pb-20 flex flex-col items-center pt-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12 px-4"
      >
        <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-gray-500">
          Coming Soon
        </h1>
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
          We are building the ultimate streaming experience. Get ready for our first original web series.
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-full max-w-5xl px-8"
      >
        <div className="relative aspect-video rounded-2xl overflow-hidden border border-[#2a2a2a] shadow-2xl shadow-[#E62429]/20 bg-black group">
          <video 
            // TODO: Replace this URL with your actual "UNDELETED" teaser video URL
            src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4" 
            controls
            className="w-full h-full object-cover"
          />
          <div className="absolute top-0 left-0 w-full p-8 bg-gradient-to-b from-black/90 via-black/40 to-transparent pointer-events-none transition-opacity duration-300 group-hover:opacity-0">
            <span className="text-[#E62429] font-bold tracking-widest text-sm uppercase mb-2 block">Official Teaser</span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">UNDELETED</h2>
            <p className="text-gray-300 mt-2 max-w-xl font-medium">Season 1 coming soon exclusively on AKPLAY.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
