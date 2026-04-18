"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return <div className="w-[120px] h-[38px]" />;

  // 这里的逻辑：如果当前是 dark，点击就去 light；反之亦然
  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all cursor-pointer group shadow-sm"
    >
      {isDark ? (
        <>
          <Sun className="h-4 w-4 text-orange-500 animate-pulse" />
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Light Mode</span>
        </>
      ) : (
        <>
          <Moon className="h-4 w-4 text-blue-500" />
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Dark mode</span>
        </>
      )}
    </button>
  );
}