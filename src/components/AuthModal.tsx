import { useState } from "react";
import { X, Mail, Lock, User, Eye, EyeOff, KeyRound } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { isValidEmail, isValidPassword } from "../context/AuthContext";

type AuthTab = "login" | "signup" | "forgot";

export function AuthModal({ onClose }: { onClose: () => void }) {
  const { login, signup, resetPassword } = useAuth();
  const [tab, setTab] = useState<AuthTab>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (tab === "forgot") {
      if (!email.trim()) {
        setError("Please enter your email address.");
        return;
      }
      if (!isValidEmail(email.trim())) {
        setError("Please enter a valid email address.");
        return;
      }
      if (!newPassword.trim() || !confirmPassword.trim()) {
        setError("Please enter and confirm your new password.");
        return;
      }
      if (newPassword !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
      const pwCheck = isValidPassword(newPassword);
      if (!pwCheck.valid) {
        setError(pwCheck.error || "Invalid password.");
        return;
      }
      setLoading(true);
      setTimeout(() => {
        const result = resetPassword(email.trim(), newPassword);
        if (!result.success) {
          setError(result.error || "Reset failed.");
          setLoading(false);
          return;
        }
        setSuccess("Password reset successfully! You can now sign in.");
        setLoading(false);
        setTimeout(() => {
          setTab("login");
          setSuccess("");
          setPassword("");
          setNewPassword("");
          setConfirmPassword("");
        }, 2000);
      }, 600);
      return;
    }

    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    if (!isValidEmail(email.trim())) {
      setError("Please enter a valid email address (e.g. name@gmail.com).");
      return;
    }
    if (tab === "signup" && !name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (tab === "signup") {
      const pwCheck = isValidPassword(password);
      if (!pwCheck.valid) {
        setError(pwCheck.error || "Invalid password.");
        return;
      }
    }

    setLoading(true);
    setTimeout(() => {
      if (tab === "signup") {
        const result = signup(name.trim(), email.trim(), password);
        if (!result.success) {
          setError(result.error || "Signup failed.");
          setLoading(false);
          return;
        }
      } else {
        const result = login(email.trim(), password);
        if (!result.success) {
          setError(result.error || "Login failed.");
          setLoading(false);
          return;
        }
      }
      setLoading(false);
      onClose();
    }, 600);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md glass-card rounded-3xl p-8 z-10"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Logo */}
          <div className="text-center mb-6">
            <span
              className="text-3xl font-black italic inline-block"
              style={{ transform: "skewX(-10deg)" }}
            >
              <span className="text-[#E62429]">AK</span>
              <span className="text-white">PLAY</span>
            </span>
            <p className="text-gray-400 text-sm mt-2">
              {tab === "login" ? "Welcome back! Sign in to continue." : tab === "signup" ? "Create your account to get started." : "Reset your password"}
            </p>
          </div>

          {/* Tabs */}
          {tab !== "forgot" ? (
            <div className="flex rounded-2xl bg-white/5 p-1 mb-6">
              {(["login", "signup"] as AuthTab[]).map((t) => (
                <button
                  key={t}
                  onClick={() => { setTab(t); setError(""); setSuccess(""); }}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1a1a] ${
                    tab === t
                      ? "bg-[#E62429] text-white shadow-lg shadow-[#E62429]/30"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {t === "login" ? "Sign In" : "Sign Up"}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#E62429] to-orange-500 flex items-center justify-center">
                <KeyRound className="w-8 h-8 text-white" />
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {tab === "signup" && (
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name"
                  aria-label="Full Name"
                  className="w-full glass-input rounded-2xl py-3 pl-11 pr-4 text-sm text-white placeholder:text-gray-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E62429]"
                />
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                aria-label="Email Address"
                className="w-full glass-input rounded-2xl py-3 pl-11 pr-4 text-sm text-white placeholder:text-gray-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E62429]"
              />
            </div>
            {tab !== "forgot" && (
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  aria-label="Password"
                  className="w-full glass-input rounded-2xl py-3 pl-11 pr-11 text-sm text-white placeholder:text-gray-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E62429]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white rounded-md focus-visible:ring-2 focus-visible:ring-[#E62429]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            )}
            {tab === "forgot" && (
              <>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New Password"
                    aria-label="New Password"
                    className="w-full glass-input rounded-2xl py-3 pl-11 pr-11 text-sm text-white placeholder:text-gray-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E62429]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white rounded-md focus-visible:ring-2 focus-visible:ring-[#E62429]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm New Password"
                    aria-label="Confirm New Password"
                    className="w-full glass-input rounded-2xl py-3 pl-11 pr-4 text-sm text-white placeholder:text-gray-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E62429]"
                  />
                </div>
              </>
            )}

            {tab === "signup" && (
              <p className="text-gray-500 text-[11px] px-1">
                Password must be at least 6 characters with at least one letter and one number.
              </p>
            )}

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-sm text-center bg-red-500/10 rounded-xl py-2"
              >
                {error}
              </motion.p>
            )}

            {success && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-green-400 text-sm text-center bg-green-500/10 rounded-xl py-2"
              >
                {success}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#E62429] to-[#ff333a] hover:shadow-lg hover:shadow-[#E62429]/30 text-white py-3.5 rounded-2xl font-bold text-sm transition-all disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </span>
              ) : tab === "login" ? (
                "Sign In"
              ) : tab === "signup" ? (
                "Create Account"
              ) : (
                "Reset Password"
              )}
            </button>
          </form>

          <div className="mt-4 space-y-2 text-center">
            {tab === "login" && (
              <button
                onClick={() => { setTab("forgot"); setError(""); setSuccess(""); }}
                className="text-gray-400 hover:text-[#E62429] text-xs font-medium transition-colors"
              >
                Forgot Password?
              </button>
            )}
            <p className="text-gray-500 text-xs">
              {tab === "login" ? (
                <>Don't have an account?{" "}
                  <button onClick={() => { setTab("signup"); setError(""); setSuccess(""); }} className="text-[#E62429] hover:underline font-semibold">
                    Sign Up
                  </button>
                </>
              ) : tab === "signup" ? (
                <>Already have an account?{" "}
                  <button onClick={() => { setTab("login"); setError(""); setSuccess(""); }} className="text-[#E62429] hover:underline font-semibold">
                    Sign In
                  </button>
                </>
              ) : (
                <>Remember your password?{" "}
                  <button onClick={() => { setTab("login"); setError(""); setSuccess(""); setNewPassword(""); setConfirmPassword(""); }} className="text-[#E62429] hover:underline font-semibold">
                    Sign In
                  </button>
                </>
              )}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
