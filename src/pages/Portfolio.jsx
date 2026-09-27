import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import About from "../components/About";
import Projects from "../components/Projects";
import Skills from "../components/Skills";
import Experience from "../components/Experience";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import { useTheme } from "../hooks/usePortfolioData";

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState("");

  // Apply theme
  useTheme();

  // Intersection Observer for active section
  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -60% 0px" }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Background effects */}
      <div className="bg-grid" />
      <div className="glow-orb glow-orb--primary" />
      <div className="glow-orb glow-orb--accent" />
      <div className="noise-overlay" />

      {/* App */}
      <div className="app">
        <Navbar activeSection={activeSection} />
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Experience />
        <Contact />
        <Footer />
      </div>
    </>
  );
}
