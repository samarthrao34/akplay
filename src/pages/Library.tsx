import { Filter, Play, Star } from "lucide-react";
import { motion } from "motion/react";

const LIBRARY_ITEMS = Array.from({ length: 12 }).map((_, i) => ({
  id: i,
  title: `Content Title ${i + 1}`,
  rating: (Math.random() * 2 + 3).toFixed(1),
  year: 2020 + Math.floor(Math.random() * 5),
  image: `https://picsum.photos/seed/lib${i}/400/600`,
}));

export function Library() {
  return (
    <div className="min-h-full bg-[#0a0a0a] text-white p-12 pt-24">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-black tracking-tight">Content Library</h1>
        <button className="flex items-center space-x-2 bg-[#1a1a1a] border border-[#333] px-4 py-2 rounded-lg hover:bg-[#2a2a2a] transition-colors">
          <Filter className="w-4 h-4" />
          <span>Filter & Sort</span>
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {LIBRARY_ITEMS.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="group relative rounded-xl overflow-hidden cursor-pointer aspect-[2/3]"
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
              <h3 className="text-white font-bold mb-1 line-clamp-1">
                {item.title}
              </h3>
              <div className="flex items-center justify-between text-xs text-gray-300 mb-3">
                <span>{item.year}</span>
                <span className="flex items-center text-yellow-500">
                  <Star className="w-3 h-3 fill-current mr-1" />
                  {item.rating}
                </span>
              </div>
              <button className="w-full bg-[#E62429] hover:bg-[#ff333a] text-white py-2 rounded-lg font-bold flex items-center justify-center space-x-2 transition-colors">
                <Play className="w-4 h-4 fill-current" />
                <span>Watch</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
