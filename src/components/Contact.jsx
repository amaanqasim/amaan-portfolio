import { useState } from "react";
import { motion } from "framer-motion";
import { FiMail, FiMapPin, FiSend, FiGithub, FiLinkedin } from "react-icons/fi";
import { usePortfolioData } from "../hooks/usePortfolioData";

export default function Contact() {
  const { data } = usePortfolioData();
  const { personal } = data;
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState(null); // 'sending' | 'sent' | 'error'

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    
    // mailto fallback — simple and works without backend
    const subject = encodeURIComponent(`Portfolio Contact from ${formData.name}`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`
    );
    window.location.href = `mailto:${personal.email}?subject=${subject}&body=${body}`;
    
    setStatus("sent");
    setTimeout(() => {
      setStatus(null);
      setFormData({ name: "", email: "", message: "" });
    }, 3000);
  };

  return (
    <section className="section" id="contact">
      <motion.div
        className="section__header"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <p className="section__label">Contact</p>
        <h2 className="section__title">
          Let's <span className="highlight">connect</span>
        </h2>
        <p className="section__subtitle">
          Have a question or want to work together? I'd love to hear from you.
        </p>
      </motion.div>

      <div className="contact-grid">
        <motion.div
          className="contact-info"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <a href={`mailto:${personal.email}`} className="contact-item" style={{ textDecoration: "none" }}>
            <div className="contact-item__icon">
              <FiMail />
            </div>
            <div>
              <div className="contact-item__label">Email</div>
              <div className="contact-item__value">{personal.email}</div>
            </div>
          </a>

          {personal.github && (
            <a href={personal.github} target="_blank" rel="noopener noreferrer" className="contact-item" style={{ textDecoration: "none" }}>
              <div className="contact-item__icon">
                <FiGithub />
              </div>
              <div>
                <div className="contact-item__label">GitHub</div>
                <div className="contact-item__value">@amaanqasim</div>
              </div>
            </a>
          )}

          {personal.linkedin && (
            <a href={personal.linkedin} target="_blank" rel="noopener noreferrer" className="contact-item" style={{ textDecoration: "none" }}>
              <div className="contact-item__icon">
                <FiLinkedin />
              </div>
              <div>
                <div className="contact-item__label">LinkedIn</div>
                <div className="contact-item__value">Amaan Qasim</div>
              </div>
            </a>
          )}

          <div className="contact-item">
            <div className="contact-item__icon">
              <FiMapPin />
            </div>
            <div>
              <div className="contact-item__label">Location</div>
              <div className="contact-item__value">India</div>
            </div>
          </div>
        </motion.div>

        <motion.form
          className="contact-form"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="form-group">
            <input
              type="text"
              placeholder="Your Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <textarea
              placeholder="Your Message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn--primary"
            disabled={status === "sending"}
            style={{ width: "100%", justifyContent: "center" }}
          >
            {status === "sent" ? (
              "Message Sent! ✓"
            ) : status === "sending" ? (
              "Opening Email..."
            ) : (
              <>
                <FiSend size={16} />
                Send Message
              </>
            )}
          </button>
        </motion.form>
      </div>
    </section>
  );
}
