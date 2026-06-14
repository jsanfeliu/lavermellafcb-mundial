import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Theme = "light" | "dark";
const ThemeCtx = createContext<{ theme: Theme; toggle: () => void }>({
  theme: "dark",
  toggle: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  // App "dark-first": per defecte mode fosc (ambient d'estadi nocturn).
  // L'usuari pot canviar a clar amb el botó del tema.
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <ThemeCtx.Provider value={{ theme, toggle: () => setTheme((t) => (t === "dark" ? "light" : "dark")) }}>
      {children}
    </ThemeCtx.Provider>
  );
}

export const useTheme = () => useContext(ThemeCtx);
