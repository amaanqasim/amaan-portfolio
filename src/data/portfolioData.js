// portfolioData.js — Central data store with localStorage & Firebase sync
const DEFAULT_DATA = {
  personal: {
    name: "Amaan Qasim",
    tagline: "CSE Student · Software Developer Intern",
    typewriterLines: [
      "CSE Student · Software Developer Intern",
      "Intern @ CogniLearn",
      "Building practical solutions",
      "Exploring & always learning",
    ],
    bio: "I'm a 3rd-year B.Tech CSE student currently interning at CogniLearn, where I'm exploring diverse domains in software development. I love building practical solutions that solve real-world problems, and I'm constantly pushing myself to learn new technologies and grow as a developer.",
    email: "amaanqasim000@gmail.com",
    github: "https://github.com/amaanqasim",
    linkedin: "https://www.linkedin.com/in/amaan-qasim-062159328/",
    resumeLink: "",
    college: "AWH Engineering College",
    degree: "B.Tech in Computer Science & Engineering",
    internship: {
      company: "CogniLearn",
      role: "Software Developer Intern",
    },
  },

  projects: [
    {
      id: "proj-1",
      title: "FixFlow",
      subtitle: "Technical Issue & Complaint Management Web Application",
      description:
        "Contributed to frontend–backend integration and authentication, while fixing issues and implementing features across the application.",
      techStack: ["React", "Node.js", "Authentication", "REST API"],
      github: "https://github.com/amaanqasim/FixFlow",
      live: "",
      featured: true,
    },
    {
      id: "proj-2",
      title: "MedLink",
      subtitle: "Medicine Donation & Redistribution Platform",
      description:
        "Developed a platform connecting medicine donors with people in need while helping reduce medication wastage.",
      techStack: ["HTML", "CSS", "JavaScript"],
      github: "",
      live: "",
      featured: true,
    },
    {
      id: "proj-3",
      title: "Public Bus Tracking System",
      subtitle: "Smart India Hackathon Project",
      description:
        "Proposed a real-time public bus tracking solution with bus location, speed tracking, and complaint registration.",
      techStack: ["Python", "Real-time Tracking", "IoT"],
      github: "",
      live: "",
      featured: true,
    },
  ],

  skills: [
    { name: "React", category: "frontend", level: 70 },
    { name: "JavaScript", category: "frontend", level: 75 },
    { name: "HTML & CSS", category: "frontend", level: 85 },
    { name: "Node.js", category: "backend", level: 60 },
    { name: "Python", category: "backend", level: 65 },
    { name: "MongoDB", category: "backend", level: 55 },
    { name: "Git & GitHub", category: "tools", level: 70 },
    { name: "REST APIs", category: "backend", level: 65 },
    { name: "C/C++", category: "languages", level: 60 },
    { name: "Java", category: "languages", level: 55 },
  ],

  experience: [
    {
      id: "exp-1",
      role: "Software Developer Intern",
      company: "CogniLearn",
      duration: "Present",
      description:
        "Exploring multiple domains in software development. Working on real-world projects and improving engineering skills across the stack.",
      current: true,
    },
  ],

  theme: {
    preset: "amber",
    mode: "dark",
    showPercentage: true,
  },
};

export const THEME_PRESETS = {
  amber: {
    name: "Warm Amber",
    primary: "35, 100%, 55%",
    primaryRGB: "255, 170, 0",
    accent: "25, 95%, 53%",
    glow: "35, 100%, 55%",
    hex: "#ffaa00",
  },
  cyan: {
    name: "Cyber Cyan",
    primary: "185, 100%, 50%",
    primaryRGB: "0, 220, 255",
    accent: "195, 95%, 50%",
    glow: "185, 100%, 50%",
    hex: "#00dcff",
  },
  violet: {
    name: "Electric Violet",
    primary: "265, 90%, 60%",
    primaryRGB: "130, 80, 230",
    accent: "280, 85%, 55%",
    glow: "265, 90%, 60%",
    hex: "#8250e6",
  },
  emerald: {
    name: "Matrix Green",
    primary: "155, 80%, 45%",
    primaryRGB: "23, 207, 130",
    accent: "140, 75%, 45%",
    glow: "155, 80%, 45%",
    hex: "#17cf82",
  },
  rose: {
    name: "Neon Rose",
    primary: "340, 90%, 60%",
    primaryRGB: "230, 60, 110",
    accent: "350, 85%, 55%",
    glow: "340, 90%, 60%",
    hex: "#e63c6e",
  },
};

const STORAGE_KEY = "amaan_portfolio_data";

export function getPortfolioData() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return deepMerge(DEFAULT_DATA, parsed);
    }
  } catch (e) {
    console.warn("Failed to load portfolio data from storage", e);
  }
  return { ...DEFAULT_DATA };
}

export function savePortfolioData(data, emitEvent = true) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    if (emitEvent) {
      window.dispatchEvent(new CustomEvent("portfolio-data-updated"));
    }
  } catch (e) {
    console.error("Failed to save portfolio data", e);
  }
}

export function resetPortfolioData() {
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new CustomEvent("portfolio-data-updated"));
}

function deepMerge(target, source) {
  const output = { ...target };
  if (source && typeof source === "object") {
    for (const key of Object.keys(source)) {
      if (
        source[key] &&
        typeof source[key] === "object" &&
        !Array.isArray(source[key])
      ) {
        output[key] = deepMerge(target[key] || {}, source[key]);
      } else {
        output[key] = source[key];
      }
    }
  }
  return output;
}

export default DEFAULT_DATA;
