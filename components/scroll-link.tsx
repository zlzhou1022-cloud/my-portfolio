"use client";

import Link from "next/link";

// 💡 修复：去掉了末尾多余的 }) 
export function ScrollLink({ href, children, className }: { href: string, children: React.ReactNode, className?: string }) {
  return (
    <Link 
      href={href} 
      className={className}
      scroll={false} 
      onClick={() => {
        if (window.innerWidth < 1024) {
          setTimeout(() => {
            document.getElementById('photo-viewer')?.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'start' 
            });
          }, 50);
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }}
    >
      {children}
    </Link>
  );
}