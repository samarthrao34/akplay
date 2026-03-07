import { useState } from "react";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";
import { motion } from "motion/react";
import { useAuth, PROFILE_AVATARS } from "../context/AuthContext";

export function ProfileSelector() {
  const { user, selectProfile, addProfile, deleteProfile, updateProfile, setShowProfileSelector } = useAuth();
  const [manageMode, setManageMode] = useState(false);
  const [addingNew, setAddingNew] = useState(false);
  const [newName, setNewName] = useState("");
  const [newAvatar, setNewAvatar] = useState(PROFILE_AVATARS[0]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editAvatar, setEditAvatar] = useState("");

  if (!user) return null;

  const handleAddProfile = () => {
    if (!newName.trim()) return;
    addProfile(newName.trim(), newAvatar);
    setNewName("");
    setNewAvatar(PROFILE_AVATARS[0]);
    setAddingNew(false);
  };

  const handleStartEdit = (id: string, name: string, avatar: string) => {
    setEditingId(id);
    setEditName(name);
    setEditAvatar(avatar);
  };

  const handleSaveEdit = () => {
    if (editingId && editName.trim()) {
      updateProfile(editingId, editName.trim(), editAvatar);
      setEditingId(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[90] bg-[#0a0a0a] flex flex-col items-center justify-center p-4"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-center max-w-3xl w-full"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          {manageMode ? "Manage Profiles" : "Who's Watching?"}
        </h1>
        <p className="text-gray-400 text-sm mb-10">
          {manageMode ? "Edit or delete profiles" : "Select your profile to continue"}
        </p>

        {/* Profile grid */}
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 mb-12">
          {user.profiles.map((profile, i) => (
            <motion.div
              key={profile.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.05 * i }}
              className="relative group"
            >
              {editingId === profile.id ? (
                <div className="flex flex-col items-center gap-3 glass-card rounded-2xl p-4 w-40">
                  <div className="flex flex-wrap gap-2 justify-center">
                    {PROFILE_AVATARS.slice(0, 6).map((a) => (
                      <button
                        key={a}
                        onClick={() => setEditAvatar(a)}
                        className={`w-10 h-10 rounded-xl overflow-hidden border-2 transition-all ${
                          editAvatar === a ? "border-[#E62429] scale-110" : "border-transparent opacity-60 hover:opacity-100"
                        }`}
                      >
                        <img src={a} alt="" className="w-full h-full" />
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full glass-input rounded-xl px-3 py-2 text-sm text-white text-center focus:outline-none"
                  />
                  <div className="flex gap-2">
                    <button onClick={handleSaveEdit} className="p-2 rounded-xl bg-green-500/20 text-green-400 hover:bg-green-500/30">
                      <Check className="w-4 h-4" />
                    </button>
                    <button onClick={() => setEditingId(null)} className="p-2 rounded-xl bg-white/5 text-gray-400 hover:bg-white/10">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => {
                    if (manageMode) {
                      handleStartEdit(profile.id, profile.name, profile.avatar);
                    } else {
                      selectProfile(profile.id);
                    }
                  }}
                  className="flex flex-col items-center gap-3 group"
                >
                  <div className={`w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                    manageMode ? "border-white/20" : "border-transparent group-hover:border-white group-hover:scale-105"
                  }`}>
                    <img src={profile.avatar} alt={profile.name} className="w-full h-full bg-[#1a1a1a]" />
                  </div>
                  <span className="text-gray-300 group-hover:text-white text-sm font-medium transition-colors">
                    {profile.name}
                  </span>
                  {manageMode && (
                    <div className="flex gap-2">
                      <span className="p-1.5 rounded-lg bg-white/5 text-gray-400">
                        <Pencil className="w-3.5 h-3.5" />
                      </span>
                      {user.profiles.length > 1 && (
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteProfile(profile.id); }}
                          className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  )}
                </button>
              )}
            </motion.div>
          ))}

          {/* Add profile */}
          {user.profiles.length < 5 && (
            addingNew ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-3 glass-card rounded-2xl p-4 w-40"
              >
                <div className="flex flex-wrap gap-2 justify-center">
                  {PROFILE_AVATARS.slice(0, 6).map((a) => (
                    <button
                      key={a}
                      onClick={() => setNewAvatar(a)}
                      className={`w-10 h-10 rounded-xl overflow-hidden border-2 transition-all ${
                        newAvatar === a ? "border-[#E62429] scale-110" : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img src={a} alt="" className="w-full h-full" />
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Profile Name"
                  className="w-full glass-input rounded-xl px-3 py-2 text-sm text-white text-center focus:outline-none"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button onClick={handleAddProfile} className="p-2 rounded-xl bg-[#E62429]/20 text-[#E62429] hover:bg-[#E62429]/30">
                    <Check className="w-4 h-4" />
                  </button>
                  <button onClick={() => setAddingNew(false)} className="p-2 rounded-xl bg-white/5 text-gray-400 hover:bg-white/10">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => setAddingNew(true)}
                className="flex flex-col items-center gap-3 group"
              >
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl border-2 border-dashed border-gray-600 flex items-center justify-center group-hover:border-white transition-colors">
                  <Plus className="w-10 h-10 text-gray-600 group-hover:text-white transition-colors" />
                </div>
                <span className="text-gray-500 group-hover:text-white text-sm font-medium transition-colors">
                  Add Profile
                </span>
              </motion.button>
            )
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setManageMode(!manageMode)}
            className={`px-8 py-3 rounded-2xl font-bold text-sm transition-all ${
              manageMode
                ? "bg-gradient-to-r from-[#E62429] to-[#ff333a] text-white"
                : "glass-btn text-gray-300 hover:text-white"
            }`}
          >
            {manageMode ? "Done" : "Manage Profiles"}
          </button>
          {!manageMode && user.profiles.length === 1 && (
            <button
              onClick={() => selectProfile(user.profiles[0].id)}
              className="px-8 py-3 rounded-2xl font-bold text-sm bg-gradient-to-r from-[#E62429] to-[#ff333a] text-white hover:shadow-lg hover:shadow-[#E62429]/30 transition-all"
            >
              Continue
            </button>
          )}
          <button
            onClick={() => setShowProfileSelector(false)}
            className="px-6 py-3 rounded-2xl font-bold text-sm text-gray-500 hover:text-white transition-colors"
          >
            Back
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
