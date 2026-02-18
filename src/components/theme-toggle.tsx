"use client";

import { useState, useEffect } from "react";
import { Sun, Moon, Monitor } from "lucide-react";

type Theme = "light" | "dark" | "system";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("system");

  useEffect(() => {
    const stored = localStorage.getItem("luggagex-theme") as Theme | null;
    if (stored) {
      setTheme(stored);
      applyTheme(stored);
    }
  }, []);

  function applyTheme(t: Theme) {
    const root = document.documentElement;
    if (t === "dark") {
      root.classList.add("dark");
    } else if (t === "light") {
      root.classList.remove("dark");
    } else {
      // system
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
  }

  function handleChange(newTheme: Theme) {
    setTheme(newTheme);
    localStorage.setItem("luggagex-theme", newTheme);
    applyTheme(newTheme);
  }

  const options: { value: Theme; icon: typeof Sun; label: string }[] = [
    { value: "light", icon: Sun, label: "Hell" },
    { value: "dark", icon: Moon, label: "Dunkel" },
    { value: "system", icon: Monitor, label: "System" },
  ];

  return (
    <div className="flex items-center rounded-lg border bg-muted p-1 gap-1">
      {options.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => handleChange(value)}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors ${
            theme === value
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
          title={label}
        >
          <Icon className="h-4 w-4" />
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  );
}
