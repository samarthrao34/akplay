import { useState } from "react";
import { User, CreditCard, Settings, LogOut, Shield, Plus, Pencil, Trash2, Check, X, Users, AlertTriangle } from "lucide-react";
import { motion } from "motion/react";
import { useAuth, PROFILE_AVATARS } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

type TabId = "profile" | "profiles" | "subscription" | "security";

export function Account() {
  const { user, activeProfile, isAuthenticated, logout, updateUser, updateProfile, addProfile, deleteProfile, setSubscription, changePassword, isSubscriptionExpired, daysUntilExpiry } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>("profile");
  const [editingProfile, setEditingProfile] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editAvatar, setEditAvatar] = useState("");
  const [addingProfile, setAddingProfile] = useState(false);
  const [newProfileName, setNewProfileName] = useState("");
  const [newProfileAvatar, setNewProfileAvatar] = useState(PROFILE_AVATARS[0]);

  // Profile settings form state
  const [firstName, setFirstName] = useState(activeProfile?.name.split(" ")[0] ?? "");
  const [lastName, setLastName] = useState(activeProfile?.name.split(" ").slice(1).join(" ") ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [bio, setBio] = useState("Film enthusiast and aspiring creator.");
  const [saved, setSaved] = useState(false);

  if (!isAuthenticated || !user || !activeProfile) {
    return (
      <div className="min-h-full bg-[#050505] text-white flex items-center justify-center p-8">
        <div className="text-center glass-card rounded-3xl p-12 max-w-md">
          <User className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Sign in Required</h2>
          <p className="text-gray-400 text-sm mb-6">Please sign in to access your account settings.</p>
          <button
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-[#E62429] to-[#ff333a] text-white px-8 py-3 rounded-2xl font-bold text-sm hover:shadow-lg hover:shadow-[#E62429]/30 transition-all"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  const tabs: { id: TabId; icon: typeof User; label: string }[] = [
    { id: "profile", icon: User, label: "Profile Settings" },
    { id: "profiles", icon: Users, label: "Manage Profiles" },
    { id: "subscription", icon: CreditCard, label: "Subscription & Billing" },
    { id: "security", icon: Shield, label: "Security & Privacy" },
  ];

  const handleSaveProfile = () => {
    const fullName = `${firstName} ${lastName}`.trim();
    updateProfile(activeProfile.id, fullName, activeProfile.avatar);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleStartEditProfile = (id: string, name: string, avatar: string) => {
    setEditingProfile(id);
    setEditName(name);
    setEditAvatar(avatar);
  };

  const handleSaveEditProfile = () => {
    if (editingProfile && editName.trim()) {
      updateProfile(editingProfile, editName.trim(), editAvatar);
      setEditingProfile(null);
    }
  };

  const handleAddNewProfile = () => {
    if (newProfileName.trim()) {
      addProfile(newProfileName.trim(), newProfileAvatar);
      setNewProfileName("");
      setNewProfileAvatar(PROFILE_AVATARS[0]);
      setAddingProfile(false);
    }
  };

  return (
    <div className="min-h-full bg-[#050505] text-white p-4 md:p-8 pt-6 md:pt-8 max-w-5xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-6 md:mb-8">
        Account Management
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Sidebar Tabs */}
        <div className="space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors text-left ${activeTab === tab.id
                ? "bg-[#E62429]/12 text-[#E62429] font-bold shadow-lg shadow-[#E62429]/10"
                : "text-gray-400 hover:bg-white/5 hover:text-white font-medium"
                }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          ))}
          <div className="pt-4 border-t border-white/5 mt-4">
            <button
              onClick={() => { logout(); navigate("/"); }}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors text-left font-medium"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Profile Settings Tab */}
          {activeTab === "profile" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-3xl p-5 md:p-8">
              <h2 className="text-xl font-bold mb-6">Profile Information</h2>

              <div className="flex items-center space-x-4 md:space-x-6 mb-6 md:mb-8">
                <div className="relative">
                  <img
                    src={activeProfile.avatar}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-4 border-white/10 bg-[#1a1a1a]"
                  />
                  <button className="absolute bottom-0 right-0 bg-[#E62429] text-white p-2 rounded-full border-2 border-[#141414] hover:bg-[#ff333a] transition-colors">
                    <User className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <h3 className="text-xl font-bold">{activeProfile.name}</h3>
                  <p className="text-gray-400 text-sm">{user.email}</p>
                  {user.subscription && (
                    <span className="inline-block mt-2 bg-yellow-500/20 text-yellow-500 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                      {user.subscription} Plan
                    </span>
                  )}
                </div>
              </div>

              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">First Name</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full glass-input rounded-2xl px-4 py-3 text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Last Name</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full glass-input rounded-2xl px-4 py-3 text-white focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full glass-input rounded-2xl px-4 py-3 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Bio</label>
                  <textarea
                    rows={4}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full glass-input rounded-2xl px-4 py-3 text-white focus:outline-none resize-none"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleSaveProfile}
                    className="bg-gradient-to-r from-[#E62429] to-[#ff333a] hover:shadow-lg hover:shadow-[#E62429]/30 text-white px-8 py-3 rounded-2xl font-bold transition-all flex items-center gap-2"
                  >
                    {saved ? <><Check className="w-4 h-4" /> Saved!</> : "Save Changes"}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Manage Profiles Tab */}
          {activeTab === "profiles" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-3xl p-5 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Manage Profiles</h2>
                {user.profiles.length < 5 && (
                  <button
                    onClick={() => setAddingProfile(true)}
                    className="flex items-center gap-2 text-sm font-bold text-[#E62429] hover:text-[#ff333a] transition-colors"
                  >
                    <Plus className="w-4 h-4" /> Add Profile
                  </button>
                )}
              </div>
              <p className="text-gray-400 text-sm mb-6">
                You can have up to 5 profiles. Each profile has its own personalized experience.
              </p>

              <div className="space-y-4">
                {user.profiles.map((profile) => (
                  <div key={profile.id} className="flex items-center gap-4 bg-white/[0.02] rounded-2xl p-4 border border-white/5">
                    {editingProfile === profile.id ? (
                      <div className="flex-1">
                        <div className="flex flex-wrap gap-2 mb-3">
                          {PROFILE_AVATARS.map((a) => (
                            <button
                              key={a}
                              onClick={() => setEditAvatar(a)}
                              className={`w-10 h-10 rounded-xl overflow-hidden border-2 transition-all ${editAvatar === a ? "border-[#E62429] scale-110" : "border-transparent opacity-50 hover:opacity-100"
                                }`}
                            >
                              <img src={a} alt="" className="w-full h-full" />
                            </button>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="flex-1 glass-input rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
                          />
                          <button onClick={handleSaveEditProfile} className="p-2 rounded-xl bg-green-500/20 text-green-400 hover:bg-green-500/30">
                            <Check className="w-4 h-4" />
                          </button>
                          <button onClick={() => setEditingProfile(null)} className="p-2 rounded-xl bg-white/5 text-gray-400 hover:bg-white/10">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <img src={profile.avatar} alt={profile.name} className="w-14 h-14 rounded-xl bg-[#1a1a1a]" />
                        <div className="flex-1">
                          <p className="text-white font-semibold text-sm">{profile.name}</p>
                          {profile.id === activeProfile.id && (
                            <span className="text-[10px] text-[#E62429] font-bold uppercase">Active Profile</span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleStartEditProfile(profile.id, profile.name, profile.avatar)}
                            className="p-2 rounded-xl bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          {user.profiles.length > 1 && (
                            <button
                              onClick={() => deleteProfile(profile.id)}
                              className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                ))}

                {/* Add new profile inline */}
                {addingProfile && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white/[0.02] rounded-2xl p-4 border border-[#E62429]/20">
                    <p className="text-sm font-bold text-white mb-3">New Profile</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {PROFILE_AVATARS.map((a) => (
                        <button
                          key={a}
                          onClick={() => setNewProfileAvatar(a)}
                          className={`w-10 h-10 rounded-xl overflow-hidden border-2 transition-all ${newProfileAvatar === a ? "border-[#E62429] scale-110" : "border-transparent opacity-50 hover:opacity-100"
                            }`}
                        >
                          <img src={a} alt="" className="w-full h-full" />
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newProfileName}
                        onChange={(e) => setNewProfileName(e.target.value)}
                        placeholder="Profile Name"
                        className="flex-1 glass-input rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
                        autoFocus
                      />
                      <button onClick={handleAddNewProfile} className="p-2 rounded-xl bg-[#E62429]/20 text-[#E62429] hover:bg-[#E62429]/30">
                        <Check className="w-4 h-4" />
                      </button>
                      <button onClick={() => setAddingProfile(false)} className="p-2 rounded-xl bg-white/5 text-gray-400 hover:bg-white/10">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {/* Subscription Tab */}
          {activeTab === "subscription" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-3xl p-5 md:p-8">
              <h2 className="text-xl font-bold mb-6">Subscription & Billing</h2>
              {isSubscriptionExpired && (
                <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6 mb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-red-500/15 flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-red-400" />
                    </div>
                    <div>
                      <p className="text-red-400 font-bold">Subscription Expired</p>
                      <p className="text-gray-400 text-xs">Please renew your subscription to continue streaming.</p>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate("/subscription")}
                    className="mt-3 bg-gradient-to-r from-[#E62429] to-[#ff333a] text-white px-6 py-2.5 rounded-2xl font-bold text-sm hover:shadow-lg hover:shadow-[#E62429]/30 transition-all"
                  >
                    Renew Now
                  </button>
                </div>
              )}
              {user.subscription && !isSubscriptionExpired ? (
                <div className="space-y-4">
                  <div className="bg-green-500/5 border border-green-500/20 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-green-500/15 flex items-center justify-center">
                        <Check className="w-5 h-5 text-green-400" />
                      </div>
                      <div>
                        <p className="text-white font-bold capitalize">{user.subscription} Plan</p>
                        <p className="text-gray-400 text-xs">Active subscription</p>
                      </div>
                    </div>
                    {daysUntilExpiry !== null && (
                      <p className={`text-sm mt-2 ${daysUntilExpiry <= 5 ? "text-yellow-400 font-medium" : "text-gray-500"}`}>
                        {daysUntilExpiry <= 5
                          ? `⚠️ Expires in ${daysUntilExpiry} day${daysUntilExpiry !== 1 ? "s" : ""}!`
                          : `${daysUntilExpiry} days remaining`}
                      </p>
                    )}
                    {user.subscriptionExpiry && (
                      <p className="text-gray-600 text-xs mt-1">
                        Expires: {new Date(user.subscriptionExpiry).toLocaleDateString()}
                      </p>
                    )}
                    {user.subscriptionStartDate && (
                      <p className="text-gray-600 text-xs">
                        Started: {new Date(user.subscriptionStartDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  {/* Payment History */}
                  {user.paymentHistory && user.paymentHistory.length > 0 && (
                    <div className="border-t border-white/5 pt-4">
                      <p className="text-sm font-bold text-gray-400 mb-3">Payment History</p>
                      <div className="space-y-2">
                        {user.paymentHistory.map((p) => (
                          <div key={p.id} className="flex items-center justify-between bg-white/[0.02] rounded-xl px-4 py-3">
                            <div>
                              <p className="text-white text-sm font-medium capitalize">{p.plan} Plan</p>
                              <p className="text-gray-500 text-xs">{new Date(p.date).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-white text-sm font-bold">{p.amount}</p>
                              <p className={`text-[10px] font-bold uppercase ${p.status === "completed" ? "text-green-400" : "text-yellow-400"}`}>{p.status}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={() => navigate("/subscription")}
                      className="px-6 py-3 rounded-2xl font-bold text-sm glass-btn text-white hover:bg-white/12 transition-all"
                    >
                      Change Plan
                    </button>
                    <button
                      onClick={() => setSubscription(null)}
                      className="px-6 py-3 rounded-2xl font-bold text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      Cancel Subscription
                    </button>
                  </div>
                </div>
              ) : !isSubscriptionExpired ? (
                <div className="text-center py-8">
                  <CreditCard className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm mb-4">You don't have an active subscription.</p>
                  <button
                    onClick={() => navigate("/subscription")}
                    className="bg-gradient-to-r from-[#E62429] to-[#ff333a] text-white px-8 py-3 rounded-2xl font-bold text-sm hover:shadow-lg hover:shadow-[#E62429]/30 transition-all"
                  >
                    View Plans
                  </button>
                </div>
              ) : null}
            </motion.div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <SecurityTab changePassword={changePassword} />
          )}
        </div>
      </div>
    </div>
  );
}

function SecurityTab({ changePassword }: { changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }> }) {
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPw, setShowPw] = useState(false);

  const handleChangePassword = async () => {
    setError("");
    setSuccess("");
    if (!currentPw || !newPw || !confirmPw) {
      setError("Please fill all fields.");
      return;
    }
    if (newPw !== confirmPw) {
      setError("New passwords don't match.");
      return;
    }
    if (newPw.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    const result = await changePassword(currentPw, newPw);
    if (!result.success) {
      setError(result.error || "Failed to change password.");
      return;
    }
    setSuccess("Password changed successfully!");
    setCurrentPw("");
    setNewPw("");
    setConfirmPw("");
    setTimeout(() => setSuccess(""), 3000);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-3xl p-5 md:p-8">
      <h2 className="text-xl font-bold mb-6">Security & Privacy</h2>
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Current Password</label>
          <input
            type={showPw ? "text" : "password"}
            value={currentPw}
            onChange={(e) => setCurrentPw(e.target.value)}
            placeholder="Enter current password"
            className="w-full glass-input rounded-2xl px-4 py-3 text-white focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">New Password</label>
          <input
            type={showPw ? "text" : "password"}
            value={newPw}
            onChange={(e) => setNewPw(e.target.value)}
            placeholder="Min 6 chars, with letter + number"
            className="w-full glass-input rounded-2xl px-4 py-3 text-white focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Confirm New Password</label>
          <input
            type={showPw ? "text" : "password"}
            value={confirmPw}
            onChange={(e) => setConfirmPw(e.target.value)}
            placeholder="Confirm new password"
            className="w-full glass-input rounded-2xl px-4 py-3 text-white focus:outline-none"
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
          <input
            type="checkbox"
            checked={showPw}
            onChange={(e) => setShowPw(e.target.checked)}
            className="rounded"
          />
          Show passwords
        </label>
        {error && (
          <p className="text-red-400 text-sm bg-red-500/10 rounded-xl py-2 px-4">{error}</p>
        )}
        {success && (
          <p className="text-green-400 text-sm bg-green-500/10 rounded-xl py-2 px-4">{success}</p>
        )}
        <button
          onClick={handleChangePassword}
          className="bg-gradient-to-r from-[#E62429] to-[#ff333a] hover:shadow-lg hover:shadow-[#E62429]/30 text-white px-8 py-3 rounded-2xl font-bold transition-all"
        >
          Update Password
        </button>

        <div className="pt-6 border-t border-white/5 mt-6">
          <h3 className="text-lg font-bold mb-4">Multi-Factor Authentication (MFA)</h3>
          <p className="text-sm text-gray-400 mb-4">
            Add an extra layer of security to your account. To enable MFA, please ensure it is turned on in your Firebase Console, then contact support to enroll your device.
          </p>
          <button
            onClick={() => alert("MFA Enrollment flow would trigger here. Make sure MFA is enabled in Firebase Authentication settings first.")}
            className="bg-white/5 hover:bg-white/10 text-white px-8 py-3 rounded-2xl font-bold transition-all border border-white/10"
          >
            Enable 2-Step Verification
          </button>
        </div>
      </div>
    </motion.div>
  );
}
