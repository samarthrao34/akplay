import { useSearchParams } from 'react-router-dom';
import { Play, Star } from 'lucide-react';
import { motion } from 'motion/react';

// Mock data with titles and descriptions
const ALL_CONTENT = [
  { id: 1, title: 'The Silent Echo', description: 'A thriller about a silent town.', rating: '4.5', year: 2023, image: 'https://picsum.photos/seed/movie1/400/600' },
  { id: 2, title: 'Neon Nights', description: 'Sci-Fi adventure in a cyberpunk city.', rating: '4.8', year: 2024, image: 'https://picsum.photos/seed/movie2/400/600' },
  { id: 3, title: 'Desert Rose', description: 'A drama set in the harsh desert.', rating: '4.2', year: 2022, image: 'https://picsum.photos/seed/movie3/400/600' },
  { id: 4, title: 'Urban Legends', description: 'Horror stories from the city.', rating: '3.9', year: 2021, image: 'https://picsum.photos/seed/movie4/400/600' },
  { id: 5, title: 'The Quantum Paradox', description: 'When a brilliant physicist discovers a way to manipulate time, she must race against a shadowy organization to prevent the unraveling of reality itself.', rating: '4.9', year: 2025, image: 'https://picsum.photos/seed/hero/400/600' },
  { id: 6, title: 'Ocean Deep', description: 'Documentary exploring the deepest parts of the ocean.', rating: '4.7', year: 2023, image: 'https://picsum.photos/seed/doc1/400/600' },
  { id: 7, title: 'Mountain High', description: 'Following climbers on their journey to the peak.', rating: '4.4', year: 2022, image: 'https://picsum.photos/seed/doc2/400/600' },
  { id: 8, title: 'City Lights', description: 'A romantic comedy set in the bustling city.', rating: '4.1', year: 2024, image: 'https://picsum.photos/seed/romcom1/400/600' },
];

export function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const results = ALL_CONTENT.filter(item => 
    item.title.toLowerCase().includes(query.toLowerCase()) || 
    item.description.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-full bg-[#050505] text-white p-4 md:p-8 pt-6 md:pt-8">
      <h1 className="text-xl md:text-3xl font-extrabold tracking-tight mb-6 md:mb-8">
        Search Results for "{query}"
      </h1>

      {results.length === 0 ? (
        <div className="text-center text-gray-400 mt-20">
          <p className="text-xl">No results found for "{query}".</p>
          <p className="mt-2">Try searching with different keywords.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 md:gap-6">
          {results.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="group relative rounded-2xl overflow-hidden cursor-pointer aspect-[2/3] glass-card"
            >
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <h3 className="text-white font-bold mb-1 line-clamp-1">{item.title}</h3>
                <p className="text-gray-300 text-xs mb-2 line-clamp-2">{item.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-300 mb-3">
                  <span>{item.year}</span>
                  <span className="flex items-center text-yellow-500">
                    <Star className="w-3 h-3 fill-current mr-1" />
                    {item.rating}
                  </span>
                </div>
                <button className="w-full bg-gradient-to-r from-[#E62429] to-[#ff333a] text-white py-2 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all hover:shadow-lg hover:shadow-[#E62429]/30 text-sm">
                  <Play className="w-4 h-4 fill-current" />
                  <span>Watch</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
