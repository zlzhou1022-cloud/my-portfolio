"use client";

import * as React from "react";
import { Globe } from "lucide-react";

const languages = [
  { code: "cn", label: "中文 (CN)" },
  { code: "jp", label: "日本語 (JP)" },
  { code: "en", label: "English (EN)" },
];

export function LanguageSwitcher() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [currentLang, setCurrentLang] = React.useState("cn");
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // 点击外部自动关闭下拉菜单
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (code: string) => {
    setCurrentLang(code);
    setIsOpen(false);
    // 💡 未来这里可以加入真正的路由跳转，例如：router.push(`/${code}/profile`)
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* 触发按钮 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-full border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all cursor-pointer shadow-sm group"
      >
        <Globe className="w-4 h-4 text-slate-500 dark:text-slate-400 group-hover:text-blue-500 transition-colors" />
        <span className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase">
          {/* 这里会显示 Lan (ZH) 或者单纯的 Lan，取决于你的喜好，目前设为动态显示 */}
          Lan : {currentLang}
        </span>
      </button>

      {/* 下拉菜单 (添加了淡入淡出的动画) */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="py-1">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                className={`block w-full text-left px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
                  currentLang === lang.code
                    ? "bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}