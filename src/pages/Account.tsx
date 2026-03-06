import { User, CreditCard, Settings, LogOut, Shield } from "lucide-react";

export function Account() {
  return (
    <div className="min-h-full bg-[#050505] text-white p-4 md:p-8 pt-6 md:pt-8 max-w-5xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-6 md:mb-8">
        Account Management
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
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
                  ? "bg-[#E62429]/12 text-[#E62429] font-bold shadow-lg shadow-[#E62429]/10"
                  : "text-gray-400 hover:bg-white/5 hover:text-white font-medium"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
          <div className="pt-4 border-t border-white/5 mt-4">
            <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors text-left font-medium">
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-card rounded-3xl p-5 md:p-8">
            <h2 className="text-xl font-bold mb-6">Profile Information</h2>

            <div className="flex items-center space-x-4 md:space-x-6 mb-6 md:mb-8">
              <div className="relative">
                <img
                  src="https://picsum.photos/seed/avatar/150/150"
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-4 border-white/10"
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    defaultValue="John"
                    className="w-full glass-input rounded-2xl px-4 py-3 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    defaultValue="Doe"
                    className="w-full glass-input rounded-2xl px-4 py-3 text-white focus:outline-none"
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
                  className="w-full glass-input rounded-2xl px-4 py-3 text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Bio
                </label>
                <textarea
                  rows={4}
                  defaultValue="Film enthusiast and aspiring creator."
                  className="w-full glass-input rounded-2xl px-4 py-3 text-white focus:outline-none resize-none"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-gradient-to-r from-[#E62429] to-[#ff333a] hover:shadow-lg hover:shadow-[#E62429]/30 text-white px-8 py-3 rounded-2xl font-bold transition-all"
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
