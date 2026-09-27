import { useState, useEffect } from "react";
import { isAdminAuthenticated } from "../../auth/adminAuth";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";
import { useTheme } from "../../hooks/usePortfolioData";

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [showPasswordWarning, setShowPasswordWarning] = useState(false);
  
  // Apply theme
  useTheme();

  useEffect(() => {
    setAuthenticated(isAdminAuthenticated());
  }, []);

  const handleLogin = (isDefaultPassword) => {
    setAuthenticated(true);
    if (isDefaultPassword) {
      setShowPasswordWarning(true);
    }
  };

  const handleLogout = () => {
    setAuthenticated(false);
  };

  if (!authenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <>
      {showPasswordWarning && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: "260px",
            right: 0,
            zIndex: 200,
            padding: "0.75rem 1.5rem",
            background: "rgba(234, 179, 8, 0.15)",
            borderBottom: "1px solid rgba(234, 179, 8, 0.3)",
            color: "#eab308",
            fontSize: "0.85rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>
            ⚠️ You're using the default password. Please change it in{" "}
            <strong>Security Settings</strong>.
          </span>
          <button
            onClick={() => setShowPasswordWarning(false)}
            style={{ color: "#eab308", fontSize: "1.2rem", padding: "0.25rem" }}
          >
            ×
          </button>
        </div>
      )}
      <AdminDashboard onLogout={handleLogout} />
    </>
  );
}
