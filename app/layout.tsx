import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher"; // 👉 新增这行引入

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Zeli | 个人主页",
  description: "软件工程师履历、技术博客与生活记录",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={`${inter.className} antialiased min-h-screen flex flex-col`}>
        <ThemeProvider>
          <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#020617]/80 backdrop-blur-md sticky top-0 z-50 transition-colors">
            <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
              <Link href="/" className="text-xl font-bold tracking-tight hover:opacity-70 transition-opacity text-slate-900 dark:text-slate-100">
                Zeli.
              </Link>
              
              <div className="flex items-center gap-3">
                {/* 👉 替换在这里：原本是占位符，现在变成了我们的交互组件 */}
                <LanguageSwitcher />
                
                {/* 暗黑模式切换按钮保持不变 */}
                <ThemeToggle />
              </div>
            </div>
          </header>

          <main className="flex-1 max-w-4xl mx-auto px-6 py-12 w-full">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}