import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUser,
  FiFolder,
  FiCode,
  FiBriefcase,
  FiSun,
  FiLogOut,
  FiShield,
  FiSave,
  FiPlus,
  FiTrash2,
  FiArrowLeft,
  FiCheck,
} from "react-icons/fi";
import { logoutAdmin, changePassword, getCredentials } from "../../auth/adminAuth";
import { usePortfolioData, useTheme } from "../../hooks/usePortfolioData";
import { THEME_PRESETS } from "../../data/portfolioData";

const TABS = [
  { id: "personal", label: "Personal Info", icon: FiUser },
  { id: "projects", label: "Projects", icon: FiFolder },
  { id: "skills", label: "Skills", icon: FiCode },
  { id: "experience", label: "Experience", icon: FiBriefcase },
  { id: "theme", label: "Theme", icon: FiSun },
  { id: "security", label: "Security", icon: FiShield },
];

export default function AdminDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState("personal");
  const [toast, setToast] = useState(null);
  const { data, updateData } = usePortfolioData();

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogout = () => {
    logoutAdmin();
    onLogout();
  };

  const handleSave = () => {
    showToast("Changes saved successfully!");
  };

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar__logo">
          AQ <span className="badge">Admin</span>
        </div>

        <nav className="admin-nav">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                className={`admin-nav__item ${
                  activeTab === tab.id ? "admin-nav__item--active" : ""
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </nav>

        <div className="admin-sidebar__footer">
          <a
            href="/"
            className="admin-nav__item"
            style={{ textDecoration: "none" }}
          >
            <FiArrowLeft size={18} />
            View Portfolio
          </a>
          <button className="admin-nav__item" onClick={handleLogout}>
            <FiLogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            {activeTab === "personal" && (
              <PersonalTab data={data} updateData={updateData} onSave={handleSave} />
            )}
            {activeTab === "projects" && (
              <ProjectsTab data={data} updateData={updateData} onSave={handleSave} />
            )}
            {activeTab === "skills" && (
              <SkillsTab data={data} updateData={updateData} onSave={handleSave} />
            )}
            {activeTab === "experience" && (
              <ExperienceTab data={data} updateData={updateData} onSave={handleSave} />
            )}
            {activeTab === "theme" && <ThemeTab />}
            {activeTab === "security" && <SecurityTab showToast={showToast} />}
          </motion.div>
        </AnimatePresence>

        {/* Toast */}
        <AnimatePresence>
          {toast && (
            <motion.div
              className={`toast toast--${toast.type}`}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
            >
              <FiCheck size={16} />
              {toast.message}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

// ── Personal Info Tab ──
function PersonalTab({ data, updateData, onSave }) {
  const [form, setForm] = useState(data.personal);

  const handleSave = () => {
    updateData((prev) => ({ ...prev, personal: form }));
    onSave();
  };

  return (
    <>
      <div className="admin-content__header">
        <h2 className="admin-content__title">Personal Information</h2>
      </div>
      <div className="admin-form">
        <div className="admin-form__group">
          <label className="admin-form__label">Full Name</label>
          <input className="admin-form__input" value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div className="admin-form__group">
          <label className="admin-form__label">Primary Tagline</label>
          <input className="admin-form__input" value={form.tagline}
            onChange={(e) => setForm({ ...form, tagline: e.target.value })}
          />
        </div>
        <div className="admin-form__group">
          <label className="admin-form__label">Animated Subtitle Lines (Typewriter Sequence)</label>
          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
            These lines dynamically type and cycle under your name on the hero section. Add, edit, or delete as many as you like.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {(form.typewriterLines || [
              form.tagline,
              `Intern @ ${form.internship?.company || "CogniLearn"}`,
              "Building practical solutions",
              "Exploring & always learning",
            ]).map((line, idx) => (
              <div key={idx} style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <input
                  className="admin-form__input"
                  style={{ flex: 1 }}
                  value={line}
                  onChange={(e) => {
                    const newLines = [...(form.typewriterLines || [])];
                    newLines[idx] = e.target.value;
                    setForm({ ...form, typewriterLines: newLines });
                  }}
                  placeholder={`Line ${idx + 1}`}
                />
                <button
                  type="button"
                  onClick={() => {
                    const newLines = (form.typewriterLines || []).filter((_, i) => i !== idx);
                    setForm({ ...form, typewriterLines: newLines });
                  }}
                  style={{ color: "#ef4444", padding: "0.4rem", cursor: "pointer" }}
                  title="Remove Line"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            ))}
            <button
              type="button"
              className="btn btn--ghost"
              style={{ alignSelf: "flex-start", marginTop: "0.25rem", fontSize: "0.8rem" }}
              onClick={() => {
                const current = form.typewriterLines || [];
                setForm({ ...form, typewriterLines: [...current, "New tagline line..."] });
              }}
            >
              <FiPlus size={14} /> Add Subtitle Line
            </button>
          </div>
        </div>
        <div className="admin-form__group">
          <label className="admin-form__label">Bio</label>
          <textarea className="admin-form__input admin-form__textarea" value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
          />
        </div>
        <div className="admin-form__group">
          <label className="admin-form__label">Email</label>
          <input className="admin-form__input" type="email" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div className="admin-form__group">
          <label className="admin-form__label">GitHub URL</label>
          <input className="admin-form__input" value={form.github}
            onChange={(e) => setForm({ ...form, github: e.target.value })}
          />
        </div>
        <div className="admin-form__group">
          <label className="admin-form__label">LinkedIn URL</label>
          <input className="admin-form__input" value={form.linkedin}
            onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
          />
        </div>
        <div className="admin-form__group">
          <label className="admin-form__label">College</label>
          <input className="admin-form__input" value={form.college}
            onChange={(e) => setForm({ ...form, college: e.target.value })}
          />
        </div>
        <div className="admin-form__group">
          <label className="admin-form__label">Current Company</label>
          <input className="admin-form__input" value={form.internship?.company || ""}
            onChange={(e) => setForm({ ...form, internship: { ...form.internship, company: e.target.value } })}
          />
        </div>
        <div className="admin-form__group">
          <label className="admin-form__label">Current Role</label>
          <input className="admin-form__input" value={form.internship?.role || ""}
            onChange={(e) => setForm({ ...form, internship: { ...form.internship, role: e.target.value } })}
          />
        </div>
        <div className="admin-form__actions">
          <button className="btn btn--primary" onClick={handleSave}>
            <FiSave size={16} /> Save Changes
          </button>
        </div>
      </div>
    </>
  );
}

// ── Projects Tab ──
function ProjectsTab({ data, updateData, onSave }) {
  const [projects, setProjects] = useState(data.projects);
  const [editing, setEditing] = useState(null);

  const handleSave = () => {
    updateData((prev) => ({ ...prev, projects }));
    onSave();
  };

  const addProject = () => {
    const newProject = {
      id: `proj-${Date.now()}`,
      title: "New Project",
      subtitle: "Project Description",
      description: "Describe your project here...",
      techStack: ["React"],
      github: "",
      live: "",
      featured: true,
    };
    setProjects([...projects, newProject]);
    setEditing(newProject.id);
  };

  const removeProject = (id) => {
    setProjects(projects.filter((p) => p.id !== id));
  };

  const updateProject = (id, updates) => {
    setProjects(projects.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  return (
    <>
      <div className="admin-content__header">
        <h2 className="admin-content__title">Projects</h2>
        <button className="btn btn--primary" onClick={addProject}>
          <FiPlus size={16} /> Add Project
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {projects.map((project) => (
          <motion.div
            key={project.id}
            layout
            style={{
              background: "var(--bg-card)",
              border: `1px solid ${editing === project.id ? "hsla(var(--primary-hsl), 0.4)" : "var(--border-subtle)"}`,
              borderRadius: "var(--radius-md)",
              padding: "1.25rem",
              transition: "border-color 0.3s ease",
            }}
          >
            {editing === project.id ? (
              <div className="admin-form" style={{ gap: "0.75rem" }}>
                <input className="admin-form__input" value={project.title} placeholder="Project Title"
                  onChange={(e) => updateProject(project.id, { title: e.target.value })}
                />
                <input className="admin-form__input" value={project.subtitle} placeholder="Subtitle"
                  onChange={(e) => updateProject(project.id, { subtitle: e.target.value })}
                />
                <textarea className="admin-form__input admin-form__textarea" value={project.description}
                  placeholder="Description"
                  onChange={(e) => updateProject(project.id, { description: e.target.value })}
                />
                <input className="admin-form__input" value={project.techStack?.join(", ") || ""}
                  placeholder="Tech Stack (comma-separated)"
                  onChange={(e) => updateProject(project.id, { techStack: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })}
                />
                <input className="admin-form__input" value={project.github} placeholder="GitHub URL"
                  onChange={(e) => updateProject(project.id, { github: e.target.value })}
                />
                <input className="admin-form__input" value={project.live} placeholder="Live Demo URL"
                  onChange={(e) => updateProject(project.id, { live: e.target.value })}
                />
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button className="btn btn--primary" style={{ fontSize: "0.8rem" }}
                    onClick={() => setEditing(null)}>
                    <FiCheck size={14} /> Done
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                <div>
                  <h3 style={{ fontWeight: 700, marginBottom: "0.25rem" }}>{project.title}</h3>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>{project.subtitle}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginTop: "0.5rem" }}>
                    {project.techStack?.map((t) => (
                      <span key={t} className="tech-tag">{t}</span>
                    ))}
                  </div>
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button className="btn btn--ghost" style={{ padding: "0.5rem", fontSize: "0.8rem" }}
                    onClick={() => setEditing(project.id)}>
                    Edit
                  </button>
                  <button className="btn btn--ghost" style={{ padding: "0.5rem", color: "#ef4444" }}
                    onClick={() => removeProject(project.id)}>
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <div className="admin-form__actions" style={{ marginTop: "1.5rem" }}>
        <button className="btn btn--primary" onClick={handleSave}>
          <FiSave size={16} /> Save All Projects
        </button>
      </div>
    </>
  );
}

// ── Skills Tab ──
function SkillsTab({ data, updateData, onSave }) {
  const [skills, setSkills] = useState(data.skills);

  const handleSave = () => {
    updateData((prev) => ({ ...prev, skills }));
    onSave();
  };

  const addSkill = () => {
    setSkills([...skills, { name: "New Skill", category: "frontend", level: 50 }]);
  };

  const removeSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const updateSkill = (index, updates) => {
    setSkills(skills.map((s, i) => (i === index ? { ...s, ...updates } : s)));
  };

  return (
    <>
      <div className="admin-content__header">
        <h2 className="admin-content__title">Skills & Tech Stack</h2>
        <button className="btn btn--primary" onClick={addSkill}>
          <FiPlus size={16} /> Add Skill
        </button>
      </div>

      <div style={{ marginBottom: "1.5rem", padding: "1.25rem", background: "var(--bg-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h4 style={{ fontWeight: 600, marginBottom: "0.25rem" }}>Display Layout Mode</h4>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
            Choose whether to display percentage bars or clean glowing dots on your public portfolio.
          </p>
        </div>
        <button
          className={`btn ${Boolean(data.theme?.showPercentage) ? "btn--primary" : "btn--ghost"}`}
          onClick={() => {
            const nextValue = !data.theme?.showPercentage;
            updateData((prev) => ({
              ...prev,
              theme: {
                ...prev.theme,
                showPercentage: nextValue,
              },
            }));
            onSave();
          }}
        >
          {Boolean(data.theme?.showPercentage) ? "📊 Progress Bars Enabled" : "🏷️ Pill View (Glowing Dots)"}
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {skills.map((skill, index) => (
          <div
            key={index}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 150px 80px 40px",
              gap: "0.75rem",
              alignItems: "center",
              padding: "0.75rem 1rem",
              background: "var(--bg-card)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-sm)",
            }}
          >
            <input className="admin-form__input" value={skill.name} placeholder="Skill Name"
              style={{ padding: "0.5rem 0.75rem" }}
              onChange={(e) => updateSkill(index, { name: e.target.value })}
            />
            <select className="admin-form__input" value={skill.category}
              style={{ padding: "0.5rem 0.75rem", background: "var(--bg-secondary)" }}
              onChange={(e) => updateSkill(index, { category: e.target.value })}
            >
              <option value="frontend">Frontend</option>
              <option value="backend">Backend</option>
              <option value="tools">Tools</option>
              <option value="languages">Languages</option>
            </select>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <input
                type="range"
                min="10"
                max="100"
                value={skill.level}
                onChange={(e) => updateSkill(index, { level: parseInt(e.target.value) })}
                style={{ width: "100%" }}
              />
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", minWidth: "30px" }}>
                {skill.level}%
              </span>
            </div>
            <button onClick={() => removeSkill(index)} style={{ color: "#ef4444", padding: "0.25rem" }}>
              <FiTrash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      <div className="admin-form__actions" style={{ marginTop: "1.5rem" }}>
        <button className="btn btn--primary" onClick={handleSave}>
          <FiSave size={16} /> Save Skills
        </button>
      </div>
    </>
  );
}

// ── Experience Tab ──
function ExperienceTab({ data, updateData, onSave }) {
  const [experience, setExperience] = useState(data.experience);

  const handleSave = () => {
    updateData((prev) => ({ ...prev, experience }));
    onSave();
  };

  const addExperience = () => {
    setExperience([
      ...experience,
      {
        id: `exp-${Date.now()}`,
        role: "New Role",
        company: "Company",
        duration: "Present",
        description: "Describe your role...",
        current: false,
      },
    ]);
  };

  const removeExperience = (id) => {
    setExperience(experience.filter((e) => e.id !== id));
  };

  const updateExp = (id, updates) => {
    setExperience(experience.map((e) => (e.id === id ? { ...e, ...updates } : e)));
  };

  return (
    <>
      <div className="admin-content__header">
        <h2 className="admin-content__title">Experience</h2>
        <button className="btn btn--primary" onClick={addExperience}>
          <FiPlus size={16} /> Add Experience
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {experience.map((exp) => (
          <div
            key={exp.id}
            style={{
              padding: "1.25rem",
              background: "var(--bg-card)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-md)",
            }}
          >
            <div className="admin-form" style={{ gap: "0.75rem" }}>
              <input className="admin-form__input" value={exp.role} placeholder="Role"
                onChange={(e) => updateExp(exp.id, { role: e.target.value })}
              />
              <input className="admin-form__input" value={exp.company} placeholder="Company"
                onChange={(e) => updateExp(exp.id, { company: e.target.value })}
              />
              <input className="admin-form__input" value={exp.duration} placeholder="Duration"
                onChange={(e) => updateExp(exp.id, { duration: e.target.value })}
              />
              <textarea className="admin-form__input admin-form__textarea" value={exp.description}
                placeholder="Description"
                onChange={(e) => updateExp(exp.id, { description: e.target.value })}
              />
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.85rem" }}>
                  <input type="checkbox" checked={exp.current}
                    onChange={(e) => updateExp(exp.id, { current: e.target.checked })}
                  />
                  Currently working here
                </label>
                <button onClick={() => removeExperience(exp.id)} style={{ color: "#ef4444", marginLeft: "auto" }}>
                  <FiTrash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="admin-form__actions" style={{ marginTop: "1.5rem" }}>
        <button className="btn btn--primary" onClick={handleSave}>
          <FiSave size={16} /> Save Experience
        </button>
      </div>
    </>
  );
}

// ── Theme Tab ──
function ThemeTab() {
  const { presetKey, setThemePreset, mode, setMode } = useTheme();

  const presetColors = {
    amber: "#ffaa00",
    cyan: "#00dcff",
    violet: "#8250e6",
    emerald: "#17cf82",
    rose: "#e63c6e",
  };

  const { data, updateData } = usePortfolioData();

  const togglePercentageDisplay = () => {
    const nextValue = !data.theme?.showPercentage;
    updateData((prev) => ({
      ...prev,
      theme: {
        ...prev.theme,
        showPercentage: nextValue,
      },
    }));
  };

  return (
    <>
      <div className="admin-content__header">
        <h2 className="admin-content__title">Theme & Layout Customization</h2>
      </div>

      <div style={{ marginBottom: "1rem", padding: "1.25rem", background: "var(--bg-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h4 style={{ fontWeight: 600, marginBottom: "0.25rem" }}>Color Theme Mode</h4>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Set default color mode for your portfolio visitors.</p>
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            className={`btn ${mode === "dark" ? "btn--primary" : "btn--ghost"}`}
            onClick={() => setMode("dark")}
          >
            🌙 Dark Mode
          </button>
          <button
            className={`btn ${mode === "light" ? "btn--primary" : "btn--ghost"}`}
            onClick={() => setMode("light")}
          >
            ☀️ Light Mode
          </button>
        </div>
      </div>

      <div style={{ marginBottom: "2rem", padding: "1.25rem", background: "var(--bg-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h4 style={{ fontWeight: 600, marginBottom: "0.25rem" }}>Show Skill Percentages</h4>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Display percentage progress bars or clean glowing dots.</p>
        </div>
        <button className={`btn ${Boolean(data.theme?.showPercentage) ? "btn--primary" : "btn--ghost"}`} onClick={togglePercentageDisplay}>
          {Boolean(data.theme?.showPercentage) ? "Percentages Enabled ✓" : "Pill View Active (Dots)"}
        </button>
      </div>

      <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
        Choose a color accent for your portfolio. Changes apply instantly.
      </p>

      <div className="theme-selector">
        {Object.entries(THEME_PRESETS).map(([key, preset]) => (
          <motion.div
            key={key}
            className={`theme-option ${presetKey === key ? "theme-option--active" : ""}`}
            onClick={() => setThemePreset(key)}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.97 }}
          >
            <div
              className="theme-option__preview"
              style={{ background: presetColors[key] }}
            />
            <div className="theme-option__name">{preset.name}</div>
            {presetKey === key && (
              <div
                style={{
                  marginTop: "0.5rem",
                  fontSize: "0.7rem",
                  color: "hsl(var(--primary-hsl))",
                  fontWeight: 600,
                }}
              >
                ✓ Active
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </>
  );
}

// ── Security Tab ──
function SecurityTab({ showToast }) {
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [recoveryKey, setRecoveryKey] = useState("");

  useEffect(() => {
    const creds = getCredentials();
    if (creds.recoveryKey) {
      setRecoveryKey(creds.recoveryKey);
    }
  }, []);

  const handleChangePassword = async () => {
    if (!currentPwd) {
      showToast("Please enter your current password", "error");
      return;
    }
    if (newPwd !== confirmPwd) {
      showToast("New passwords don't match", "error");
      return;
    }
    if (newPwd.length < 8) {
      showToast("New password must be at least 8 characters", "error");
      return;
    }
    if (recoveryKey && recoveryKey.trim().length < 6) {
      showToast("Recovery key must be at least 6 characters", "error");
      return;
    }

    const result = await changePassword(currentPwd, newPwd, recoveryKey);
    if (result.success) {
      showToast("Security settings updated successfully!");
      setCurrentPwd("");
      setNewPwd("");
      setConfirmPwd("");
    } else {
      showToast(result.error || "Current password is incorrect", "error");
    }
  };

  return (
    <>
      <div className="admin-content__header">
        <h2 className="admin-content__title">Security Settings</h2>
      </div>

      <div className="admin-form" style={{ maxWidth: "500px" }}>
        <p style={{ color: "var(--text-secondary)", marginBottom: "0.5rem", fontSize: "0.9rem" }}>
          Update your admin password and custom Master Recovery Key.
        </p>

        <div className="admin-form__group">
          <label className="admin-form__label">Current Password</label>
          <input className="admin-form__input" type="password" value={currentPwd}
            onChange={(e) => setCurrentPwd(e.target.value)}
            placeholder="Enter current password"
          />
        </div>
        <div className="admin-form__group">
          <label className="admin-form__label">New Password</label>
          <input className="admin-form__input" type="password" value={newPwd}
            onChange={(e) => setNewPwd(e.target.value)}
            placeholder="Min 8 characters"
          />
        </div>
        <div className="admin-form__group">
          <label className="admin-form__label">Confirm New Password</label>
          <input className="admin-form__input" type="password" value={confirmPwd}
            onChange={(e) => setConfirmPwd(e.target.value)}
            placeholder="Re-enter new password"
          />
        </div>

        <div className="admin-form__group" style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid var(--border-subtle)" }}>
          <label className="admin-form__label">Master Recovery Key</label>
          <input className="admin-form__input" type="text" value={recoveryKey}
            onChange={(e) => setRecoveryKey(e.target.value)}
            placeholder="e.g. AQ-2026-RECOVER"
          />
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
            Used to reset your password if you ever forget it. Save this key in a safe place.
          </span>
        </div>

        <div className="admin-form__actions" style={{ marginTop: "1rem" }}>
          <button className="btn btn--primary" onClick={handleChangePassword}>
            <FiShield size={16} /> Save Security Settings
          </button>
        </div>
      </div>
    </>
  );
}
