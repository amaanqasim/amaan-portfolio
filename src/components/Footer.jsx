import { FiGithub, FiLinkedin, FiMail, FiHeart } from "react-icons/fi";
import { usePortfolioData } from "../hooks/usePortfolioData";

export default function Footer() {
  const { data } = usePortfolioData();
  const { personal } = data;
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__links">
        {personal.github && (
          <a href={personal.github} target="_blank" rel="noopener noreferrer" className="footer__link" aria-label="GitHub">
            <FiGithub />
          </a>
        )}
        {personal.linkedin && (
          <a href={personal.linkedin} target="_blank" rel="noopener noreferrer" className="footer__link" aria-label="LinkedIn">
            <FiLinkedin />
          </a>
        )}
        <a href={`mailto:${personal.email}`} className="footer__link" aria-label="Email">
          <FiMail />
        </a>
      </div>
      <p>
        Designed & Built with{" "}
        <FiHeart
          size={12}
          style={{
            display: "inline",
            verticalAlign: "middle",
            color: "hsl(var(--primary-hsl))",
          }}
        />{" "}
        by {personal.name} · {year}
      </p>
    </footer>
  );
}
