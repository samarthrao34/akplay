import React, { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Film,
  ShieldCheck,
  Users,
  UserCircle,
  Search,
  Bell,
  CreditCard,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";
import { Logo } from "./Logo";
import { Chatbot } from "./Chatbot";

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Film, label: "Library", path: "/library" },
    { icon: ShieldCheck, label: "Admin", path: "/admin" },
    { icon: Users, label: "Community", path: "/community" },
    { icon: CreditCard, label: "Subscription", path: "/subscription" },
  ];

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden font-sans">
      {/* Sidebar */}
      <aside
        className={`glass-sidebar flex flex-col transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          sidebarOpen ? "w-64" : "w-20"
        }`}
      >
        <div className={`p-6 pb-4 flex items-center ${sidebarOpen ? "" : "justify-center"}`}>
          {sidebarOpen ? (
            <Logo className="scale-75 origin-left" />
          ) : (
            <span className="text-[#E62429] font-black text-2xl italic" style={{ transform: "skewX(-10deg)" }}>
              AK
            </span>
          )}
        </div>

        <nav className="flex-1 px-3 space-y-1.5">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                title={item.label}
                className={`flex items-center ${sidebarOpen ? "space-x-3 px-4" : "justify-center px-0"} py-3 rounded-2xl transition-all duration-300 ${
                  isActive
                    ? "bg-[#E62429]/12 text-[#E62429] shadow-lg shadow-[#E62429]/10"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span className="font-semibold text-sm">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 pb-2">
          <Link
            to="/account"
            title="Account"
            className={`flex items-center ${sidebarOpen ? "space-x-3 px-4" : "justify-center px-0"} py-3 rounded-2xl transition-all duration-300 ${
              location.pathname === "/account"
                ? "bg-[#E62429]/12 text-[#E62429] shadow-lg shadow-[#E62429]/10"
                : "text-gray-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <UserCircle className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span className="font-semibold text-sm">Account</span>}
          </Link>
        </div>

        {/* Toggle Button */}
        <div className="px-3 pb-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`flex items-center ${sidebarOpen ? "space-x-3 px-4" : "justify-center px-0"} py-3 w-full rounded-2xl text-gray-500 hover:bg-white/5 hover:text-white transition-all duration-300`}
          >
            {sidebarOpen ? (
              <>
                <PanelLeftClose className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium text-sm">Collapse</span>
              </>
            ) : (
              <PanelLeft className="w-5 h-5 flex-shrink-0" />
            )}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Header */}
        <header className="glass-header h-20 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex-1 max-w-xl">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search movies, shows, creators..."
                className="w-full glass-input rounded-2xl py-2.5 pl-11 pr-4 text-sm text-white placeholder:text-gray-500 focus:outline-none"
              />
            </form>
          </div>
          <div className="flex items-center space-x-5 ml-8">
            <button className="relative glass-btn p-2.5 rounded-2xl text-gray-400 hover:text-white">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#E62429] rounded-full ring-2 ring-[#050505]"></span>
            </button>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#E62429] to-orange-500 p-[2px] shadow-lg shadow-[#E62429]/20">
              <img
                src="https://picsum.photos/seed/avatar/100/100"
                alt="Profile"
                className="w-full h-full rounded-[14px] border-2 border-[#050505] object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <Outlet />
        </div>
      </main>

      {/* Chatbot */}
      <Chatbot />
    </div>
  );
}
