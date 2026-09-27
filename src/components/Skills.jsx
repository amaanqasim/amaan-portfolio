import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { usePortfolioData } from "../hooks/usePortfolioData";

const categoryLabels = {
  frontend: "Frontend",
  backend: "Backend",
  tools: "Tools & DevOps",
  languages: "Languages",
};

export default function Skills() {
  const { data } = usePortfolioData();
  const { skills } = data;
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Group skills by category
  const grouped = skills.reduce((acc, skill) => {
    const cat = skill.category || "other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  return (
    <section className="section" id="skills">
      <motion.div
        className="section__header"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <p className="section__label">Skills</p>
        <h2 className="section__title">
          My <span className="highlight">tech stack</span>
        </h2>
        <p className="section__subtitle">
          Technologies and tools I work with, constantly expanding my knowledge.
        </p>
      </motion.div>

      <div ref={ref} style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        {Object.entries(grouped).map(([category, categorySkills], catIdx) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: catIdx * 0.1, duration: 0.5 }}
          >
            <h3
              style={{
                fontSize: "0.8rem",
                fontFamily: "var(--font-mono)",
                fontWeight: 600,
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: "0.75rem",
              }}
            >
              {categoryLabels[category] || category}
            </h3>
            <div className="skills-grid">
              {categorySkills.map((skill, idx) => (
                <motion.div
                  key={skill.name}
                  className="skill-item"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: idx * 0.05 + catIdx * 0.1,
                    duration: 0.4,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  whileHover={{ x: 4, transition: { duration: 0.2 } }}
                >
                  <span className="skill-item__name">{skill.name}</span>
                  {data.theme?.showPercentage ? (
                    <>
                      <div className="skill-item__bar-container">
                        <motion.div
                          className="skill-item__bar"
                          initial={{ width: 0 }}
                          animate={isInView ? { width: `${skill.level}%` } : {}}
                          transition={{
                            delay: idx * 0.08 + catIdx * 0.15,
                            duration: 1,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                        />
                      </div>
                      <span className="skill-item__level">{skill.level}%</span>
                    </>
                  ) : (
                    <span
                      style={{
                        marginLeft: "auto",
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: "hsl(var(--primary-hsl))",
                        boxShadow: "0 0 8px hsla(var(--glow-hsl), 0.6)",
                      }}
                    />
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
