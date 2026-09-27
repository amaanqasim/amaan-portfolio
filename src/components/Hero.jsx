import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { FiGithub, FiLinkedin, FiArrowDown } from "react-icons/fi";
import { usePortfolioData } from "../hooks/usePortfolioData";

export default function Hero() {
  const { data } = usePortfolioData();
  const { personal } = data;

  return (
    <section className="hero" id="hero">
      <motion.p
        className="hero__pre-title"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        {"// Hello, World! I'm"}
      </motion.p>

      <motion.h1
        className="hero__name"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        {personal.name.split(" ")[0]}{" "}
        <span className="accent">{personal.name.split(" ").slice(1).join(" ")}</span>
      </motion.h1>

      <motion.div
        className="hero__tagline"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
      >
        <TypeAnimation
          key={JSON.stringify(personal.typewriterLines || [])}
          sequence={
            (personal.typewriterLines && personal.typewriterLines.length > 0
              ? personal.typewriterLines
              : [
                  personal.tagline,
                  `Intern @ ${personal.internship?.company || "CogniLearn"}`,
                  "Building practical solutions",
                  "Exploring & always learning",
                ]
            ).flatMap((line) => [line, 2500])
          }
          wrapper="span"
          speed={50}
          repeat={Infinity}
          cursor={true}
          style={{ display: "inline-block" }}
        />
      </motion.div>

      <motion.div
        className="hero__actions"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.6 }}
      >
        <a href="#projects" className="btn btn--primary"
          onClick={(e) => {
            e.preventDefault();
            document.querySelector("#projects")?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          View My Work
        </a>
        <a href="#contact" className="btn btn--ghost"
          onClick={(e) => {
            e.preventDefault();
            document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          Get In Touch
        </a>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", marginLeft: "0.5rem" }}>
          {personal.github && (
            <a
              href={personal.github}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--ghost"
              style={{ padding: "0.75rem" }}
              aria-label="GitHub"
            >
              <FiGithub size={18} />
            </a>
          )}
          {personal.linkedin && (
            <a
              href={personal.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--ghost"
              style={{ padding: "0.75rem" }}
              aria-label="LinkedIn"
            >
              <FiLinkedin size={18} />
            </a>
          )}
        </div>
      </motion.div>

      <motion.div
        className="hero__scroll-indicator"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <span>scroll</span>
        <div className="hero__scroll-line"></div>
        <FiArrowDown size={14} />
      </motion.div>
    </section>
  );
}
