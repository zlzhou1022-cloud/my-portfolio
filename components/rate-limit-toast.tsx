"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function RateLimitToast() {
  const searchParams = useSearchParams();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (searchParams.get("error") === "ratelimit") {
      // 💡 修复：用 setTimeout 把状态更新推迟到下一个事件循环，消除级联渲染警告
      const initTimer = setTimeout(() => {
        setShow(true);
        window.history.replaceState(null, "", window.location.pathname);
      }, 0);

      const hideTimer = setTimeout(() => setShow(false), 5000);
      
      return () => {
        clearTimeout(initTimer);
        clearTimeout(hideTimer);
      };
    }
  }, [searchParams]);

  if (!show) return null;

  return (
    // 使用 fixed 定位，让它悬浮在屏幕正上方偏下一点（避开可能存在的 Navbar）
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-8 fade-in duration-300">
      <div className="flex items-center gap-3 px-5 py-3.5 bg-white dark:bg-slate-900 border-2 border-red-100 dark:border-red-900/50 rounded-2xl shadow-2xl shadow-red-500/10 transition-colors">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/40 text-red-500">
          ⏳
        </div>
        <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
          您提交太快了，请 1 分钟后再试
        </p>
        <button 
          onClick={() => setShow(false)}
          className="ml-2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}