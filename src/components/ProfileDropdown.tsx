import { useEffect, useRef } from "react";
import { User, Settings, LogOut, Users, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function ProfileDropdown({ onClose }: { onClose: () => void }) {
  const { user, activeProfile, logout, selectProfile, setShowProfileSelector } = useAuth();
  const navigate = useNavigate();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  if (!user || !activeProfile) return null;

  const otherProfiles = user.profiles.filter((p) => p.id !== activeProfile.id);

  return (
    <motion.div
      ref={panelRef}
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.15 }}
      className="absolute right-0 top-full mt-2 w-72 glass-card rounded-2xl overflow-hidden shadow-2xl shadow-black/50 z-50"
    >
      {/* Current profile */}
      <div className="p-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <img
            src={activeProfile.avatar}
            alt={activeProfile.name}
            className="w-12 h-12 rounded-xl bg-[#1a1a1a]"
          />
          <div className="flex-1 min-w-0">
            <p className="text-white font-bold text-sm truncate">{activeProfile.name}</p>
            <p className="text-gray-400 text-xs truncate">{user.email}</p>
            {user.subscription && (
              <span className="inline-block mt-1 bg-[#E62429]/15 text-[#E62429] px-2 py-0.5 rounded-full text-[10px] font-bold uppercase">
                {user.subscription} Plan
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Switch profiles */}
      {otherProfiles.length > 0 && (
        <div className="p-2 border-b border-white/5">
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider px-3 py-1.5">
            Switch Profile
          </p>
          {otherProfiles.map((profile) => (
            <button
              key={profile.id}
              onClick={() => {
                selectProfile(profile.id);
                onClose();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors"
            >
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-8 h-8 rounded-lg bg-[#1a1a1a]"
              />
              <span className="text-gray-300 text-sm font-medium">{profile.name}</span>
            </button>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="p-2">
        <button
          onClick={() => {
            setShowProfileSelector(true);
            onClose();
          }}
          className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
        >
          <div className="flex items-center gap-3">
            <Users className="w-4 h-4" />
            <span className="text-sm font-medium">Manage Profiles</span>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-500" />
        </button>
        <button
          onClick={() => {
            navigate("/account");
            onClose();
          }}
          className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
        >
          <div className="flex items-center gap-3">
            <Settings className="w-4 h-4" />
            <span className="text-sm font-medium">Account Settings</span>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-500" />
        </button>
        <div className="border-t border-white/5 mt-1 pt-1">
          <button
            onClick={() => {
              logout();
              onClose();
              navigate("/");
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Sign Out</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
