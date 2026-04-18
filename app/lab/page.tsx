import Link from "next/link";
import { getAllProjects } from "@/lib/lab-data";

export default function LabPage() {
  const projects = getAllProjects();

  return (
    <div className="max-w-3xl mx-auto space-y-12 animate-in fade-in duration-700 mt-8 mb-20">
      
      {/* 顶部标题区域 */}
      <header className="space-y-4">
        <div>
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors group mb-4">
            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            返回主页
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 transition-colors">实验室与插件</h1>
        </div>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed transition-colors">
          这里记录了我的一些开发实验、自动化插件以及个人实用工具。
          大多源于解决生活中的实际需求，也是我探索新技术栈的试验场。
        </p>
      </header>

      {/* 项目卡片列表 */}
      <div className="grid grid-cols-1 gap-6">
        {projects.map((project) => (
          <a 
            key={project.id}
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all active:scale-[0.99]"
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {project.title}
              </h2>
              {/* 外链图标 */}
              <svg className="w-5 h-5 text-slate-300 group-hover:text-slate-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </div>
            
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
              {project.description}
            </p>

            <div className="flex flex-wrap gap-2">
              {project.tags.map(tag => (
                <span 
                  key={tag} 
                  className="px-2.5 py-1 text-xs font-semibold bg-slate-50 dark:bg-slate-950/50 text-slate-500 dark:text-slate-400 rounded-md border border-slate-100 dark:border-slate-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          </a>
        ))}
      </div>

      {/* 底部返回按钮 */}
      <div className="pt-8 mt-12 border-t border-slate-200 dark:border-slate-800 flex justify-center">
        <Link href="/" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all hover:scale-105 active:scale-95 cursor-pointer">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          返回主页
        </Link>
      </div>

    </div>
  );
}