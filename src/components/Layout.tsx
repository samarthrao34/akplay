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
  Menu,
  X,
  LogIn,
} from "lucide-react";
import { Logo } from "./Logo";
import { Chatbot } from "./Chatbot";
import { AuthModal } from "./AuthModal";
import { NotificationPanel } from "./NotificationPanel";
import { ProfileDropdown } from "./ProfileDropdown";
import { useAuth } from "../context/AuthContext";
import { AnimatePresence } from "motion/react";

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, activeProfile, unreadCount } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setMobileMenuOpen(false);
    }
  };

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Film, label: "Library", path: "/library" },
    { icon: ShieldCheck, label: "Admin", path: "/admin" },
    { icon: Users, label: "Community", path: "/community" },
    { icon: CreditCard, label: "Subscription", path: "/subscription" },
  ];

  // Bottom nav items for mobile (subset)
  const mobileNavItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Film, label: "Library", path: "/library" },
    { icon: Users, label: "Community", path: "/community" },
    { icon: CreditCard, label: "Plans", path: "/subscription" },
    { icon: UserCircle, label: "Account", path: "/account" },
  ];

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden font-sans">
      {/* Desktop Sidebar — hidden on mobile */}
      <aside
        className={`hidden md:flex glass-sidebar flex-col transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
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

      {/* Mobile slide-over menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 glass-sidebar flex flex-col animate-in slide-in-from-left">
            <div className="p-5 flex items-center justify-between border-b border-white/5">
              <Logo className="scale-75 origin-left" />
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3.5 rounded-2xl transition-all ${
                      isActive
                        ? "bg-[#E62429]/12 text-[#E62429]"
                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-semibold text-sm">{item.label}</span>
                  </Link>
                );
              })}
              <Link
                to="/account"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3.5 rounded-2xl transition-all ${
                  location.pathname === "/account"
                    ? "bg-[#E62429]/12 text-[#E62429]"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <UserCircle className="w-5 h-5" />
                <span className="font-semibold text-sm">Account</span>
              </Link>
            </nav>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Header */}
        <header className="glass-header h-16 md:h-20 flex items-center justify-between px-4 md:px-8 sticky top-0 z-10">
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 mr-2"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Mobile logo */}
          <div className="md:hidden mr-3">
            <span className="text-[#E62429] font-black text-xl italic" style={{ transform: "skewX(-10deg)", display: "inline-block" }}>
              AK<span className="text-white">PLAY</span>
            </span>
          </div>

          <div className="flex-1 max-w-xl">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full glass-input rounded-2xl py-2 md:py-2.5 pl-9 md:pl-11 pr-4 text-sm text-white placeholder:text-gray-500 focus:outline-none"
              />
            </form>
          </div>
          <div className="flex items-center space-x-2 md:space-x-5 ml-2 md:ml-8">
            {/* Notification Button */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowProfileDropdown(false);
                }}
                className="relative glass-btn p-2 md:p-2.5 rounded-xl md:rounded-2xl text-gray-400 hover:text-white"
              >
                <Bell className="w-4 h-4 md:w-5 md:h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 md:top-1 md:right-1 w-4 h-4 md:w-[18px] md:h-[18px] bg-[#E62429] rounded-full ring-2 ring-[#050505] flex items-center justify-center">
                    <span className="text-[9px] md:text-[10px] font-bold text-white">{unreadCount}</span>
                  </span>
                )}
              </button>
              <AnimatePresence>
                {showNotifications && (
                  <NotificationPanel onClose={() => setShowNotifications(false)} />
                )}
              </AnimatePresence>
            </div>

            {/* Profile / Sign In Button */}
            {isAuthenticated && activeProfile ? (
              <div className="relative">
                <button
                  onClick={() => {
                    setShowProfileDropdown(!showProfileDropdown);
                    setShowNotifications(false);
                  }}
                  className="hidden md:block w-10 h-10 rounded-2xl bg-gradient-to-br from-[#E62429] to-orange-500 p-[2px] shadow-lg shadow-[#E62429]/20 hover:shadow-xl hover:shadow-[#E62429]/30 transition-all"
                >
                  <img
                    src={activeProfile.avatar}
                    alt="Profile"
                    className="w-full h-full rounded-[14px] border-2 border-[#050505] object-cover bg-[#1a1a1a]"
                  />
                </button>
                <AnimatePresence>
                  {showProfileDropdown && (
                    <ProfileDropdown onClose={() => setShowProfileDropdown(false)} />
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="hidden md:flex items-center gap-2 bg-gradient-to-r from-[#E62429] to-[#ff333a] text-white px-4 py-2 md:px-5 md:py-2.5 rounded-2xl font-bold text-xs md:text-sm hover:shadow-lg hover:shadow-[#E62429]/30 transition-all"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </button>
            )}

            {/* Mobile sign in icon */}
            {!isAuthenticated && (
              <button
                onClick={() => setShowAuthModal(true)}
                className="md:hidden glass-btn p-2 rounded-xl text-gray-400 hover:text-white"
              >
                <LogIn className="w-4 h-4" />
              </button>
            )}
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto scrollbar-hide pb-20 md:pb-0">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden glass-header border-t border-white/6">
        <div className="flex items-center justify-around h-16 px-1">
          {mobileNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
                  isActive ? "text-[#E62429]" : "text-gray-500"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "drop-shadow-[0_0_6px_rgba(230,36,41,0.4)]" : ""}`} />
                <span className="text-[10px] font-semibold mt-0.5">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Chatbot */}
      <Chatbot />

      {/* Auth Modal */}
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </div>
  );
}
