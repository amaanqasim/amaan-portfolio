import { motion } from "framer-motion";
import { usePortfolioData } from "../hooks/usePortfolioData";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function About() {
  const { data } = usePortfolioData();
  const { personal, projects, skills } = data;

  const stats = [
    { value: projects.length + "+", label: "Projects" },
    { value: skills.length + "+", label: "Technologies" },
    { value: "3rd Year", label: "B.Tech CSE" },
    { value: "1+", label: "Internship" },
  ];

  return (
    <section className="section" id="about">
      <motion.div
        className="section__header"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="section__label">About Me</p>
        <h2 className="section__title">
          Passionate about creating{" "}
          <span className="highlight">meaningful software</span>
        </h2>
      </motion.div>

      <div className="about-content">
        <motion.div
          className="about-text"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <p>{personal.bio}</p>
          <p style={{ marginTop: "1rem" }}>
            Currently interning at <strong style={{ color: "hsl(var(--primary-hsl))" }}>{personal.internship?.company}</strong> as a {personal.internship?.role}, 
            where I'm exploring multiple domains and sharpening my engineering skills daily.
          </p>
          <p style={{ marginTop: "1rem" }}>
            I'm pursuing my {personal.degree} at {personal.college}, 
            and I believe in learning by building — every project is an opportunity to grow.
          </p>
        </motion.div>

        <motion.div
          className="about-stats"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              className="stat-card"
              variants={itemVariants}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              <div className="stat-card__value">{stat.value}</div>
              <div className="stat-card__label">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
