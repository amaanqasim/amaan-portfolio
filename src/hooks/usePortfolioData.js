// usePortfolioData.js — React hook for reactive portfolio data
import { useState, useEffect, useCallback } from "react";
import {
  getPortfolioData,
  savePortfolioData,
  THEME_PRESETS,
} from "../data/portfolioData";

export function usePortfolioData() {
  const [data, setData] = useState(() => getPortfolioData());

  useEffect(() => {
    const handler = () => {
      setData(getPortfolioData());
    };
    window.addEventListener("portfolio-data-updated", handler);
    return () => window.removeEventListener("portfolio-data-updated", handler);
  }, []);

  const updateData = useCallback((updater) => {
    const currentData = getPortfolioData();
    const next = typeof updater === "function" ? updater(currentData) : updater;
    savePortfolioData(next);
  }, []);

  return { data, updateData };
}

export function useTheme() {
  const { data, updateData } = usePortfolioData();
  const preset = THEME_PRESETS[data.theme?.preset] || THEME_PRESETS.amber;

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--primary-hsl", preset.primary);
    root.style.setProperty("--primary-rgb", preset.primaryRGB);
    root.style.setProperty("--accent-hsl", preset.accent);
    root.style.setProperty("--glow-hsl", preset.glow);
    root.setAttribute("data-theme", data.theme?.mode || "dark");

    // Dynamic browser tab favicon color update
    const color = preset.hex || "#ffaa00";
    const svgFavicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color}"/>
          <stop offset="100%" style="stop-color:${color}"/>
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx="20" fill="#0f0f17"/>
      <text x="50" y="68" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-weight="900" font-size="52" fill="url(#g)">AQ</text>
    </svg>`;
    const encoded = `data:image/svg+xml;base64,${btoa(svgFavicon)}`;
    let link = document.querySelector("link[rel*='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = encoded;
  }, [preset, data.theme?.mode]);

  const setThemePreset = (presetKey) => {
    updateData((prev) => ({
      ...prev,
      theme: { ...prev.theme, preset: presetKey },
    }));
  };

  const toggleMode = () => {
    const currentMode = document.documentElement.getAttribute("data-theme") || data.theme?.mode || "dark";
    const newMode = currentMode === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", newMode);
    updateData((prev) => ({
      ...prev,
      theme: {
        ...prev.theme,
        mode: newMode,
      },
    }));
  };

  const setMode = (modeName) => {
    updateData((prev) => ({
      ...prev,
      theme: {
        ...prev.theme,
        mode: modeName,
      },
    }));
  };

  return { preset, presetKey: data.theme?.preset, setThemePreset, toggleMode, setMode, mode: data.theme?.mode || "dark" };
}
