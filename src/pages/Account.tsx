import { User, CreditCard, Settings, LogOut, Shield } from "lucide-react";

export function Account() {
  return (
    <div className="min-h-full bg-[#0a0a0a] text-white p-12 pt-24 max-w-5xl mx-auto">
      <h1 className="text-4xl font-black tracking-tight mb-8">
        Account Management
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar */}
        <div className="space-y-2">
          {[
            { icon: User, label: "Profile Settings", active: true },
            {
              icon: CreditCard,
              label: "Subscription & Billing",
              active: false,
            },
            { icon: Shield, label: "Security & Privacy", active: false },
            { icon: Settings, label: "Preferences", active: false },
          ].map((item, i) => (
            <button
              key={i}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors text-left ${
                item.active
                  ? "bg-[#E62429]/10 text-[#E62429] font-bold"
                  : "text-gray-400 hover:bg-[#1a1a1a] hover:text-white font-medium"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
          <div className="pt-4 border-t border-[#2a2a2a] mt-4">
            <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors text-left font-medium">
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-[#141414] border border-[#2a2a2a] rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6">Profile Information</h2>

            <div className="flex items-center space-x-6 mb-8">
              <div className="relative">
                <img
                  src="https://picsum.photos/seed/avatar/150/150"
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-4 border-[#2a2a2a]"
                  referrerPolicy="no-referrer"
                />
                <button className="absolute bottom-0 right-0 bg-[#E62429] text-white p-2 rounded-full border-2 border-[#141414] hover:bg-[#ff333a] transition-colors">
                  <User className="w-4 h-4" />
                </button>
              </div>
              <div>
                <h3 className="text-xl font-bold">John Doe</h3>
                <p className="text-gray-400 text-sm">john.doe@example.com</p>
                <span className="inline-block mt-2 bg-yellow-500/20 text-yellow-500 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  Premium Member
                </span>
              </div>
            </div>

            <form className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    defaultValue="John"
                    className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#E62429] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    defaultValue="Doe"
                    className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#E62429] transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  defaultValue="john.doe@example.com"
                  className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#E62429] transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Bio
                </label>
                <textarea
                  rows={4}
                  defaultValue="Film enthusiast and aspiring creator."
                  className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#E62429] transition-colors resize-none"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-[#E62429] hover:bg-[#ff333a] text-white px-8 py-3 rounded-xl font-bold transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
