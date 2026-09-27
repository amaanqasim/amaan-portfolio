import { motion } from "framer-motion";
import { usePortfolioData } from "../hooks/usePortfolioData";

export default function Experience() {
  const { data } = usePortfolioData();
  const { experience } = data;

  return (
    <section className="section" id="experience">
      <motion.div
        className="section__header"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <p className="section__label">Experience</p>
        <h2 className="section__title">
          Where I've <span className="highlight">worked</span>
        </h2>
      </motion.div>

      <div className="timeline">
        {experience.map((item, idx) => (
          <motion.div
            key={item.id}
            className={`timeline-item ${item.current ? "timeline-item--current" : ""}`}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.15, duration: 0.5 }}
          >
            <h3 className="timeline-item__role">{item.role}</h3>
            <p className="timeline-item__company">{item.company}</p>
            <p className="timeline-item__duration">
              {item.duration}
              {item.current && (
                <span
                  style={{
                    marginLeft: "0.5rem",
                    padding: "0.15rem 0.5rem",
                    background: "hsla(var(--primary-hsl), 0.15)",
                    color: "hsl(var(--primary-hsl))",
                    borderRadius: "100px",
                    fontSize: "0.65rem",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Current
                </span>
              )}
            </p>
            <p className="timeline-item__desc">{item.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
