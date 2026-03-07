import { useEffect, useRef } from "react";
import { Check, Trash2, Bell } from "lucide-react";
import { motion } from "motion/react";
import { useAuth } from "../context/AuthContext";

export function NotificationPanel({ onClose }: { onClose: () => void }) {
  const { notifications, markNotificationRead, clearNotifications, unreadCount } = useAuth();
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

  return (
    <motion.div
      ref={panelRef}
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.15 }}
      className="absolute right-0 top-full mt-2 w-80 md:w-96 glass-card rounded-2xl overflow-hidden shadow-2xl shadow-black/50 z-50"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#E62429]" />
          <h3 className="font-bold text-white text-sm">Notifications</h3>
          {unreadCount > 0 && (
            <span className="bg-[#E62429] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={clearNotifications}
            className="text-xs text-gray-400 hover:text-white transition-colors font-medium"
          >
            Mark all read
          </button>
        )}
      </div>

      {/* Notification List */}
      <div className="max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell className="w-10 h-10 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No notifications yet</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <button
              key={notif.id}
              onClick={() => markNotificationRead(notif.id)}
              className={`w-full flex items-start gap-3 p-4 hover:bg-white/5 transition-colors text-left border-b border-white/3 ${
                !notif.read ? "bg-white/[0.02]" : ""
              }`}
            >
              <span className="text-xl flex-shrink-0 mt-0.5">{notif.icon}</span>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold ${!notif.read ? "text-white" : "text-gray-400"}`}>
                  {notif.title}
                </p>
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{notif.message}</p>
                <p className="text-[10px] text-gray-600 mt-1">{notif.time}</p>
              </div>
              {!notif.read && (
                <div className="w-2 h-2 bg-[#E62429] rounded-full flex-shrink-0 mt-2" />
              )}
            </button>
          ))
        )}
      </div>
    </motion.div>
  );
}
