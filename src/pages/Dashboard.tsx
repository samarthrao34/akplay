import { Upload, BarChart2, Video, Settings, PlayCircle } from "lucide-react";

export function Dashboard() {
  return (
    <div className="min-h-full bg-[#0a0a0a] text-white p-12 pt-24">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-black tracking-tight">
          Creator Dashboard
        </h1>
        <button className="bg-[#E62429] hover:bg-[#ff333a] text-white px-6 py-2 rounded-lg font-bold flex items-center space-x-2 transition-colors">
          <Upload className="w-5 h-5" />
          <span>Upload Content</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          {
            label: "Total Views",
            value: "1.2M",
            icon: PlayCircle,
            color: "text-blue-500",
          },
          {
            label: "Subscribers",
            value: "45.6K",
            icon: Video,
            color: "text-green-500",
          },
          {
            label: "Revenue",
            value: "$12,450",
            icon: BarChart2,
            color: "text-yellow-500",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-[#141414] border border-[#2a2a2a] rounded-2xl p-6 flex items-center justify-between"
          >
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">
                {stat.label}
              </p>
              <h3 className="text-3xl font-black">{stat.value}</h3>
            </div>
            <div className={`p-4 rounded-full bg-[#1a1a1a] ${stat.color}`}>
              <stat.icon className="w-8 h-8" />
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold mb-6">Recent Uploads</h2>
      <div className="bg-[#141414] border border-[#2a2a2a] rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#2a2a2a] text-gray-400 text-sm">
              <th className="p-4 font-medium">Video</th>
              <th className="p-4 font-medium">Date</th>
              <th className="p-4 font-medium">Views</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4].map((i) => (
              <tr
                key={i}
                className="border-b border-[#2a2a2a] hover:bg-[#1a1a1a] transition-colors"
              >
                <td className="p-4 flex items-center space-x-4">
                  <div className="w-24 h-14 bg-gray-800 rounded-lg overflow-hidden relative">
                    <img
                      src={`https://picsum.photos/seed/dash${i}/200/100`}
                      alt="Thumbnail"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute bottom-1 right-1 bg-black/80 text-[10px] px-1 rounded">
                      12:34
                    </div>
                  </div>
                  <div>
                    <p className="font-bold line-clamp-1">
                      My Awesome Video Title {i}
                    </p>
                    <p className="text-xs text-gray-500">Entertainment</p>
                  </div>
                </td>
                <td className="p-4 text-sm text-gray-400">
                  Oct {10 + i}, 2023
                </td>
                <td className="p-4 text-sm font-mono">12,345</td>
                <td className="p-4">
                  <span className="bg-green-500/10 text-green-500 px-2 py-1 rounded text-xs font-bold">
                    Published
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button className="text-gray-400 hover:text-white p-2 transition-colors">
                    <Settings className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
