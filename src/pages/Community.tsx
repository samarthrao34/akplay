import { MessageSquare, Heart, Share2, MoreHorizontal } from "lucide-react";

export function Community() {
  return (
    <div className="min-h-full bg-[#0a0a0a] text-white p-12 pt-24 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-black tracking-tight">Community</h1>
        <div className="flex space-x-2">
          <button className="bg-[#E62429] text-white px-4 py-2 rounded-full font-bold text-sm">
            Following
          </button>
          <button className="bg-[#1a1a1a] text-gray-400 hover:text-white px-4 py-2 rounded-full font-bold text-sm transition-colors">
            Discover
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-[#141414] border border-[#2a2a2a] rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <img
                  src={`https://picsum.photos/seed/user${i}/50/50`}
                  alt="User"
                  className="w-10 h-10 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="font-bold text-sm">CreatorName{i}</h4>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              <button className="text-gray-500 hover:text-white transition-colors">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>

            <p className="text-gray-300 text-sm mb-4">
              Just dropped a new behind-the-scenes look at our latest
              production! Let me know what you think in the comments below. 👇🎬
            </p>

            <div className="rounded-xl overflow-hidden mb-4 aspect-video">
              <img
                src={`https://picsum.photos/seed/post${i}/800/450`}
                alt="Post content"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="flex items-center space-x-6 border-t border-[#2a2a2a] pt-4">
              <button className="flex items-center space-x-2 text-gray-400 hover:text-[#E62429] transition-colors">
                <Heart className="w-5 h-5" />
                <span className="text-sm font-medium">1.2K</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                <MessageSquare className="w-5 h-5" />
                <span className="text-sm font-medium">342</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                <Share2 className="w-5 h-5" />
                <span className="text-sm font-medium">Share</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
