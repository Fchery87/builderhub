"use client";

import * as React from "react";

const THEME_STORAGE_KEY = "builderhub-theme";

type ThemeMode = "light" | "dark" | "system";

interface ThemeContextValue {
  theme: ThemeMode;
  resolvedTheme: "light" | "dark";
  setTheme: (next: ThemeMode) => void;
}

const ThemeContext = React.createContext<ThemeContextValue | undefined>(
  undefined
);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = React.useState<ThemeMode>("system");
  const [resolvedTheme, setResolvedTheme] = React.useState<"light" | "dark">(
    "light"
  );
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    // Mark as mounted and immediately apply theme from storage
    const storedTheme = window.localStorage.getItem(
      THEME_STORAGE_KEY
    ) as ThemeMode | null;

    const themeToUse = storedTheme || "system";
    setTheme(themeToUse);
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!mounted) {
      return;
    }

    const root = document.documentElement;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = () => {
      const activeTheme =
        theme === "system"
          ? mediaQuery.matches
            ? "dark"
            : "light"
          : theme;

      root.classList.toggle("dark", activeTheme === "dark");
      root.dataset.theme = activeTheme;
      setResolvedTheme(activeTheme);

      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    };

    applyTheme();

    const handleChange = () => {
      if (theme === "system") {
        applyTheme();
      }
    };

    if ("addEventListener" in mediaQuery) {
      mediaQuery.addEventListener("change", handleChange);
    } else {
      mediaQuery.addListener(handleChange);
    }

    return () => {
      if ("removeEventListener" in mediaQuery) {
        mediaQuery.removeEventListener("change", handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, [theme, mounted]);

  return React.createElement(
    ThemeContext.Provider,
    { value: { theme, resolvedTheme, setTheme } },
    children
  );
}

export function useTheme() {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
