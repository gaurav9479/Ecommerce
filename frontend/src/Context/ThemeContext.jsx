import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  // Check localStorage for saved theme, default to 'theme-classic'
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("app-theme") || "theme-classic";
  });

  useEffect(() => {
    // Save to localStorage whenever theme changes
    localStorage.setItem("app-theme", theme);
    
    // Remove all previous theme classes from body
    document.body.classList.remove(
      "theme-classic",
      "theme-dark",
      "theme-ocean",
      "theme-sunset",
      "theme-forest"
    );
    
    // Add new theme class
    document.body.classList.add(theme);
  }, [theme]);

  const themes = [
    { id: "theme-classic", name: "Classic Purple", color: "#8b5cf6" },
    { id: "theme-dark", name: "Midnight Dark", color: "#0f172a" },
    { id: "theme-ocean", name: "Ocean Blue", color: "#0ea5e9" },
    { id: "theme-sunset", name: "Sunset Orange", color: "#f97316" },
    { id: "theme-forest", name: "Forest Green", color: "#10b981" },
  ];

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
};
