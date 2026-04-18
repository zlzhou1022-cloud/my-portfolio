"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface ImageViewerProps {
  src: string;
  alt: string;
}

export function ImageViewer({ src, alt }: ImageViewerProps) {
  const [isOpen, setIsOpen] = useState(false);

  // 监听键盘 ESC 键关闭悬浮窗
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // 当悬浮窗打开时，锁定底层页面的滚动条
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  return (
    <>
      {/* 1. 页面上的基础图片（可点击） */}
      <div 
        className="relative aspect-[3/2] w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-[#020617] border border-slate-200 dark:border-slate-800 shadow-xl transition-colors cursor-zoom-in group"
        onClick={() => setIsOpen(true)}
      >
        <Image 
          src={src} 
          alt={alt} 
          fill 
          className="object-contain transition-transform duration-500 group-hover:scale-105" 
          priority
        />
        {/* 鼠标悬浮时的黑色半透明遮罩与放大镜图标 */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center pointer-events-none">
           <svg className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
           </svg>
        </div>
      </div>

      {/* 2. 全屏悬浮窗 (Lightbox) */}
      {isOpen && (
        <div 
          // z-[100] 确保它盖过页面顶部的导航栏
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-200"
          onClick={() => setIsOpen(false)} // 点击背景区域关闭
        >
          {/* 右上角的关闭按钮 X */}
          <button 
            onClick={(e) => {
              e.stopPropagation(); // 阻止点击事件冒泡到背景上
              setIsOpen(false);
            }}
            className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white/70 hover:text-white transition-colors z-[101] cursor-pointer"
            title="关闭 (Esc)"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* 放大后的图片容器 */}
          <div 
            className="relative w-[95vw] h-[90vh]"
            onClick={(e) => e.stopPropagation()} // 点击图片本身不会关闭
          >
            <Image 
              src={src} 
              alt={alt} 
              fill 
              className="object-contain" 
              quality={100} // 在全屏模式下请求最高画质
            />
          </div>
          
          {/* 底部也可以选择性地显示一下描述文字 */}
          <div className="absolute bottom-6 left-0 right-0 text-center pointer-events-none">
            <span className="bg-black/50 text-white/90 px-4 py-2 rounded-full text-sm backdrop-blur-md">
              {alt}
            </span>
          </div>
        </div>
      )}
    </>
  );
}