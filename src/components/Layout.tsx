import React, { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Film,
  LayoutDashboard,
  Users,
  UserCircle,
  Search,
  Bell,
} from "lucide-react";
import { Logo } from "./Logo";
import { Chatbot } from "./Chatbot";

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Film, label: "Library", path: "/library" },
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Users, label: "Community", path: "/community" },
  ];

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#141414] border-r border-[#2a2a2a] flex flex-col">
        <div className="p-6 pb-8">
          <Logo className="scale-75 origin-left" />
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive
                    ? "bg-[#E62429]/10 text-[#E62429]"
                    : "text-gray-400 hover:bg-[#2a2a2a] hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#2a2a2a]">
          <Link
            to="/account"
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
              location.pathname === "/account"
                ? "bg-[#E62429]/10 text-[#E62429]"
                : "text-gray-400 hover:bg-[#2a2a2a] hover:text-white"
            }`}
          >
            <UserCircle className="w-5 h-5" />
            <span className="font-medium">Account</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Header */}
        <header className="h-20 flex items-center justify-between px-8 absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-[#0a0a0a] to-transparent">
          <div className="flex-1 max-w-xl">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search movies, shows, creators..."
                className="w-full bg-[#1a1a1a]/80 backdrop-blur-md border border-[#333] rounded-full py-2.5 pl-12 pr-4 text-sm focus:outline-none focus:border-[#E62429] transition-colors"
              />
            </form>
          </div>
          <div className="flex items-center space-x-6 ml-8">
            <button className="relative text-gray-400 hover:text-white transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-[#E62429] rounded-full"></span>
            </button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#E62429] to-orange-500 p-[2px]">
              <img
                src="https://picsum.photos/seed/avatar/100/100"
                alt="Profile"
                className="w-full h-full rounded-full border-2 border-[#0a0a0a] object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </main>

      {/* Chatbot */}
      <Chatbot />
    </div>
  );
}
