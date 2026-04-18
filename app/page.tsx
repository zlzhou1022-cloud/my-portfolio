import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 头部简介区块 */}
      <section className="mt-10 md:mt-20">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-slate-900 dark:text-slate-100 transition-colors">
          你好，我是 Zeli 👋
        </h1>
        <h2 className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 font-medium mb-6 transition-colors">
          IT Engineer & Consultant
        </h2>
        <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl transition-colors">
          拥有东京大学硕士学位及 Deloitte 端到端数字化解决方案咨询背景，致力于通过技术手段解决复杂的业务挑战。工作之外，我也会自己开发一些有意思的小工具，并带着相机记录走遍日本 47 都道府县，或是探索其它国家的旅程。
        </p>
      </section>

      {/* 模块入口区块 */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-slate-200 dark:border-slate-800 transition-colors">
        
        {/* 第一行左侧：个人主页 */}
        {/* 注意这里的 dark:bg-slate-900 和深色边框，完美区分背景 */}
        <Link href="/profile" className="group p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer block">
          <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
            👤
          </div>
          <h3 className="text-lg font-bold mb-2 text-slate-900 dark:text-slate-100 transition-colors">个人主页</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2 transition-colors">
            我的教育背景、职场履历。简单介绍我的成长轨迹。
          </p>
          <div className="text-sm font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1 transition-colors">
            查看履历 <span className="group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </Link>

        {/* 第一行右侧：实验室与插件 */}
        <Link href="/lab" className="group p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer block">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
            💻
          </div>
          <h3 className="text-lg font-bold mb-2 text-slate-900 dark:text-slate-100 transition-colors">实验室与插件</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2 transition-colors">
            一些我认为有趣的工程实践，可能没用但有意思。
          </p>
          <div className="text-sm font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1 transition-colors">
            进入实验室 <span className="group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </Link>

        {/* 第二行左侧：光影与足迹 */}
        <Link href="/travels" className="group p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer block">
          <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
            📸
          </div>
          <h3 className="text-lg font-bold mb-2 text-slate-900 dark:text-slate-100 transition-colors">光影与足迹</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2 transition-colors">
            收录日本各地，以及各个国家的旅行记忆，通过 Fujifilm XS20 视角下的风景记录。
          </p>
          <div className="text-sm font-medium text-orange-600 dark:text-orange-400 flex items-center gap-1 transition-colors">
            浏览游记 <span className="group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </Link>

        {/* 第二行右侧：留言板 */}
        <Link href="/guestbook" className="group p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer block">
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
            💬
          </div>
          <h3 className="text-lg font-bold mb-2 text-slate-900 dark:text-slate-100 transition-colors">留言板</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2 transition-colors">
            在这里留下你的足迹吧~
          </p>
          <div className="text-sm font-medium text-purple-600 dark:text-purple-400 flex items-center gap-1 transition-colors">
            去留言 <span className="group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </Link>

      </section>
    </div>
  );
}