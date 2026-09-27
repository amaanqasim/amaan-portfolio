import { motion } from "framer-motion";
import { FiGithub, FiExternalLink } from "react-icons/fi";
import { usePortfolioData } from "../hooks/usePortfolioData";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function Projects() {
  const { data } = usePortfolioData();
  const { projects } = data;

  return (
    <section className="section" id="projects">
      <motion.div
        className="section__header"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <p className="section__label">Projects</p>
        <h2 className="section__title">
          Things I've <span className="highlight">built</span>
        </h2>
        <p className="section__subtitle">
          A collection of projects that demonstrate my skills and passion for
          problem-solving.
        </p>
      </motion.div>

      <motion.div
        className="projects-grid"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        {projects.map((project, index) => (
          <motion.article
            key={project.id}
            className="project-card"
            variants={cardVariants}
            whileHover={{ y: -6, transition: { duration: 0.25 } }}
          >
            <div className="project-card__number">
              {String(index + 1).padStart(2, "0")}
            </div>
            <h3 className="project-card__title">{project.title}</h3>
            <p className="project-card__subtitle">{project.subtitle}</p>
            <p className="project-card__desc">{project.description}</p>

            <div className="project-card__tech">
              {project.techStack?.map((tech) => (
                <span key={tech} className="tech-tag">
                  {tech}
                </span>
              ))}
            </div>

            <div className="project-card__links">
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-card__link"
                >
                  <FiGithub size={15} />
                  Source Code
                </a>
              )}
              {project.live && (
                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-card__link"
                >
                  <FiExternalLink size={15} />
                  Live Demo
                </a>
              )}
            </div>
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
}
