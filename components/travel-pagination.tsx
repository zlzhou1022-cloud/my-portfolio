"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Props {
  tripId: string;
  currentPage: number;
  totalPage: number;
}

export function TravelPagination({ tripId, currentPage, totalPage }: Props) {
  const router = useRouter();
  const [jumpValue, setJumpValue] = useState("");
  const [error, setError] = useState("");

  const handleJump = () => {
    const pageNum = parseInt(jumpValue);
    if (isNaN(pageNum) || pageNum < 1 || pageNum > totalPage) {
      setError(`请输入 1 到 ${totalPage} 之间的页数`);
      setTimeout(() => setError(""), 3000); // 3秒后自动清除报错
      return;
    }
    router.push(`/travels/${tripId}?p=${pageNum}`);
    setJumpValue("");
  };

  // 核心分页窗口算法：显示当前页前后的 2 个数字
  const getPageNumbers = () => {
    const pages = [];
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPage, currentPage + 2);
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="space-y-8 mt-12 pb-20">
      {/* 报错提示 */}
      {error && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-4">
          <div className="bg-red-500 text-white px-6 py-2 rounded-full shadow-lg text-sm font-bold">
            ⚠️ {error}
          </div>
        </div>
      )}

      {/* 数字分页条 */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {/* 上一张 */}
        <Link 
          href={`/travels/${tripId}?p=${Math.max(1, currentPage - 1)}`}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${currentPage === 1 ? 'pointer-events-none opacity-30' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
        >
          ← 上一张
        </Link>

        {getPageNumbers().map(num => (
          <Link
            key={num}
            href={`/travels/${tripId}?p=${num}`}
            className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-bold transition-all ${
              num === currentPage 
              ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 scale-110' 
              : 'hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {num}
          </Link>
        ))}

        {/* 下一张 */}
        <Link 
          href={`/travels/${tripId}?p=${Math.min(totalPage, currentPage + 1)}`}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${currentPage === totalPage ? 'pointer-events-none opacity-30' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
        >
          下一张 →
        </Link>
      </div>

      {/* 跳转输入框 */}
      <div className="flex items-center justify-center gap-2">
        <input 
          type="text"
          value={jumpValue}
          onChange={(e) => setJumpValue(e.target.value)}
          placeholder={`1 ~ ${totalPage}`}
          className="w-20 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-400"
        />
        <button 
          onClick={handleJump}
          className="px-4 py-1.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-lg text-sm font-bold hover:opacity-80 transition-opacity cursor-pointer"
        >
          跳转
        </button>
      </div>
    </div>
  );
}