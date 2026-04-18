import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import Link from "next/link";

export default async function GuestbookPage() {
  
  const { data: posts, error } = await supabase
    .from('guestbook')
    .select('*')
    .eq('is_visible', true)
    .order('created_at', { ascending: false });

  async function addPost(formData: FormData) {
    'use server'; 
    const author = formData.get('author') as string;
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;

    if (!author || !title || !content) return;

    await supabase.from('guestbook').insert([{ author, title, content, is_visible: true }]);
    revalidatePath('/guestbook');
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 animate-in slide-in-from-bottom-4 duration-700 mb-20">
      
      {/* 顶部返回按钮 */}
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors group">
          <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          返回主页
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2 transition-colors">留言板</h1>
      <p className="text-slate-600 dark:text-slate-400 mb-8 transition-colors">在这里留下你的足迹吧~</p>

      {/* 发帖表单区 */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm mb-12 transition-colors">
        <h2 className="text-lg font-bold mb-4 text-slate-900 dark:text-slate-100 transition-colors">发布新留言</h2>
        <form action={addPost} className="space-y-4">
          <div className="flex gap-4">
            <input required name="author" type="text" placeholder="昵称" className="flex-1 px-4 py-2 rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors" />
            <input required name="title" type="text" placeholder="标题" className="flex-2 w-full px-4 py-2 rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors" />
          </div>
          <textarea required name="content" placeholder="说点什么吧..." rows={3} className="w-full px-4 py-2 rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-colors"></textarea>
          <button type="submit" className="px-6 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors font-bold cursor-pointer">
            提交留言
          </button>
        </form>
      </div>

      {/* 留言列表区 */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 pb-2 transition-colors">最新留言</h2>
        
        {error && <p className="text-red-500 dark:text-red-400">无法加载留言：{error.message}</p>}
        {!posts || posts.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400 italic transition-colors">还没有人留言，来抢沙发吧！</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 transition-colors">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-slate-800 dark:text-slate-200 transition-colors">{post.title}</span>
                <span className="text-xs text-slate-400 dark:text-slate-500 transition-colors">
                  {new Date(post.created_at).toLocaleDateString('zh-CN')}
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-sm mb-3 transition-colors">{post.content}</p>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium transition-colors">— {post.author}</div>
            </div>
          ))
        )}
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