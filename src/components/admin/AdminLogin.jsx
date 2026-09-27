import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiLock, FiEye, FiEyeOff, FiKey, FiArrowLeft, FiAlertTriangle, FiCheckCircle } from "react-icons/fi";
import { loginAdmin, recoverPassword, getLockoutState } from "../../auth/adminAuth";

export default function AdminLogin({ onLogin }) {
  const [mode, setMode] = useState("login"); // "login" | "forgot"
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Forgot password state
  const [recoveryKey, setRecoveryKey] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [lockout, setLockout] = useState({ isLocked: false, remainingSeconds: 0 });

  useEffect(() => {
    const checkLockout = () => {
      const state = getLockoutState();
      setLockout(state);
    };
    checkLockout();
    const timer = setInterval(checkLockout, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const result = await loginAdmin(username, password);
      if (result.success) {
        onLogin(result.isDefaultPassword);
      } else {
        setError(result.error || "Invalid credentials.");
      }
    } catch (err) {
      setError("Authentication error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRecoverySubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);

    try {
      const result = await recoverPassword(recoveryKey, newPassword);
      if (result.success) {
        setSuccessMsg("Password reset successfully! You can now log in with your new password.");
        setMode("login");
        setPassword("");
        setRecoveryKey("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setError(result.error || "Failed to reset password. Check your recovery key.");
      }
    } catch (err) {
      setError("Error resetting password. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatRemainingTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="admin-login">
      <motion.div
        className="admin-login__card"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{ width: "100%", maxWidth: "420px" }}
      >
        <div
          style={{
            width: 50,
            height: 50,
            borderRadius: "var(--radius-md)",
            background: mode === "login" ? "hsla(var(--primary-hsl), 0.1)" : "rgba(239, 68, 68, 0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "1.5rem",
            color: mode === "login" ? "hsl(var(--primary-hsl))" : "#ef4444",
            transition: "all 0.3s ease",
          }}
        >
          {mode === "login" ? <FiLock size={22} /> : <FiKey size={22} />}
        </div>

        <h1 className="admin-login__title">
          {mode === "login" ? "Admin Access" : "Password Recovery"}
        </h1>
        <p className="admin-login__subtitle">
          {mode === "login"
            ? "Authenticate to manage your portfolio content."
            : "Enter your Master Recovery Key to reset your password."}
        </p>

        {lockout.isLocked && mode === "login" && (
          <div
            style={{
              padding: "0.85rem 1rem",
              background: "rgba(239, 68, 68, 0.12)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              borderRadius: "var(--radius-sm)",
              color: "#f87171",
              fontSize: "0.85rem",
              marginBottom: "1.25rem",
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
            }}
          >
            <FiAlertTriangle size={18} style={{ flexShrink: 0 }} />
            <div>
              <strong>Account Locked</strong>
              <div style={{ fontSize: "0.8rem", marginTop: "0.2rem" }}>
                Too many failed attempts. Try again in {formatRemainingTime(lockout.remainingSeconds)} or use your Recovery Key below.
              </div>
            </div>
          </div>
        )}

        {successMsg && (
          <div
            style={{
              padding: "0.85rem 1rem",
              background: "rgba(34, 197, 94, 0.12)",
              border: "1px solid rgba(34, 197, 94, 0.3)",
              borderRadius: "var(--radius-sm)",
              color: "#4ade80",
              fontSize: "0.85rem",
              marginBottom: "1.25rem",
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
            }}
          >
            <FiCheckCircle size={18} style={{ flexShrink: 0 }} />
            <span>{successMsg}</span>
          </div>
        )}

        <AnimatePresence mode="wait">
          {mode === "login" ? (
            <motion.form
              key="login-form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.25 }}
              className="admin-login__form"
              onSubmit={handleLoginSubmit}
            >
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
                disabled={lockout.isLocked}
              />

              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  disabled={lockout.isLocked}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "0.75rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--text-muted)",
                    padding: "0.25rem",
                  }}
                >
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>

              {error && <div className="admin-login__error">{error}</div>}

              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "-0.25rem" }}>
                <button
                  type="button"
                  onClick={() => {
                    setMode("forgot");
                    setError("");
                    setSuccessMsg("");
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    color: "hsl(var(--primary-hsl))",
                    fontSize: "0.82rem",
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                className="btn btn--primary"
                disabled={loading || lockout.isLocked}
                style={{ width: "100%", justifyContent: "center", marginTop: "0.5rem" }}
              >
                {loading ? "Authenticating..." : "Login"}
              </button>
            </motion.form>
          ) : (
            <motion.form
              key="recovery-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="admin-login__form"
              onSubmit={handleRecoverySubmit}
            >
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  placeholder="Master Recovery Key (Default: AQ-2026-RECOVER)"
                  value={recoveryKey}
                  onChange={(e) => setRecoveryKey(e.target.value)}
                  required
                />
              </div>

              <div style={{ position: "relative" }}>
                <input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="New Password (min 8 chars)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  style={{
                    position: "absolute",
                    right: "0.75rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--text-muted)",
                    padding: "0.25rem",
                  }}
                >
                  {showNewPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>

              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              {error && <div className="admin-login__error">{error}</div>}

              <button
                type="submit"
                className="btn btn--primary"
                disabled={loading}
                style={{ width: "100%", justifyContent: "center", marginTop: "0.5rem" }}
              >
                {loading ? "Resetting Password..." : "Reset Password & Unlock"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setError("");
                }}
                className="btn btn--ghost"
                style={{
                  width: "100%",
                  justify: "center",
                  marginTop: "0.5rem",
                  fontSize: "0.85rem",
                }}
              >
                <FiArrowLeft size={14} /> Back to Login
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        <p
          style={{
            marginTop: "1.5rem",
            fontSize: "0.72rem",
            color: "var(--text-muted)",
            textAlign: "center",
          }}
        >
          Protected by PBKDF2 encryption & rate limiting.
        </p>
      </motion.div>
    </div>
  );
}
