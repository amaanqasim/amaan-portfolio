import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from "../hooks/usePortfolioData";

export default function Navbar({ activeSection }) {
  const { mode, toggleMode } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const links = [
    { label: "About", href: "#about" },
    { label: "Projects", href: "#projects" },
    { label: "Skills", href: "#skills" },
    { label: "Experience", href: "#experience" },
  ];

  const handleLinkClick = (e, href) => {
    e.preventDefault();
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <motion.nav
      className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <a href="#" className="navbar__logo">
        AQ<span className="dot">.</span>
      </a>

      <div className={`navbar__links ${menuOpen ? "navbar__links--open" : ""}`}>
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className={`navbar__link ${
              activeSection === link.href.slice(1) ? "navbar__link--active" : ""
            }`}
            onClick={(e) => handleLinkClick(e, link.href)}
          >
            {link.label}
          </a>
        ))}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleMode();
          }}
          aria-label="Toggle dark/light theme"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0.55rem",
            borderRadius: "var(--radius-sm)",
            border: "1px solid var(--border-light)",
            color: "var(--text-primary)",
            background: "rgba(255,255,255,0.05)",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
        >
          {mode === "light" ? <FiMoon size={18} /> : <FiSun size={18} />}
        </button>
        <a
          href="#contact"
          className="navbar__cta"
          onClick={(e) => handleLinkClick(e, "#contact")}
        >
          Let's Talk
        </a>
      </div>

      <button
        className={`navbar__toggle ${menuOpen ? "navbar__toggle--active" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(4px)",
              zIndex: 102,
            }}
            onClick={() => setMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
