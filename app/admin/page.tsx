import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  // 1. 【安全检查】从 Cookie 中获取 token
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get("admin_session")?.value === process.env.ADMIN_PASSWORD;

  // --- 服务端动作：登录 ---
  async function login(formData: FormData) {
    "use server";
    const password = formData.get("password");
    if (password === process.env.ADMIN_PASSWORD) {
      // 密码正确，在浏览器存入 Cookie，有效期 1 天
      (await cookies()).set("admin_session", password as string, {
        httpOnly: true, // 安全：防止 JS 脚本读取此 Cookie
        maxAge: 60 * 60 * 24, 
      });
      revalidatePath("/admin");
    }
  }

  // --- 服务端动作：退出 ---
  async function logout() {
    "use server";
    (await cookies()).delete("admin_session");
    revalidatePath("/admin");
  }

  // --- 服务端动作：切换帖子显示状态 ---
  async function toggleVisibility(formData: FormData) {
    "use server";
    const id = formData.get("id");
    const currentStatus = formData.get("currentStatus") === "true";
    await supabase.from("guestbook").update({ is_visible: !currentStatus }).eq("id", id);
    revalidatePath("/admin");
    revalidatePath("/guestbook");
  }

  // 2. 【未登录状态】显示登录框
  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in duration-500">
        <div className="w-full max-w-sm p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl transition-colors">
          <h1 className="text-2xl font-bold mb-6 text-center text-slate-900 dark:text-slate-100 transition-colors">管理员登录</h1>
          <form action={login} className="space-y-4">
            <input 
              name="password" 
              type="password" 
              placeholder="请输入管理员密码" 
              className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-400 outline-none transition-colors"
            />
            <button type="submit" className="w-full py-3 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-xl font-bold hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors cursor-pointer">
              进入后台
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 3. 【已登录状态】显示管理表格
  const { data: posts } = await supabase.from("guestbook").select("*").order("created_at", { ascending: false });

  return (
    <div className="max-w-4xl mx-auto mt-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 transition-colors">后台管理中心</h1>
        <form action={logout}>
          <button type="submit" className="px-4 py-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer">
            安全退出
          </button>
        </form>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm transition-colors">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800 text-sm text-slate-500 dark:text-slate-400 transition-colors">
              <th className="p-4 font-medium">日期</th>
              <th className="p-4 font-medium">昵称</th>
              <th className="p-4 font-medium">内容</th>
              <th className="p-4 font-medium text-center">状态</th>
              <th className="p-4 font-medium text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 transition-colors">
            {posts?.map((post) => (
              <tr key={post.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="p-4 text-sm text-slate-500 dark:text-slate-400">{new Date(post.created_at).toLocaleDateString("zh-CN")}</td>
                <td className="p-4 font-medium text-slate-900 dark:text-slate-100">{post.author}</td>
                <td className="p-4 text-sm text-slate-600 dark:text-slate-300 truncate max-w-[200px]">{post.content}</td>
                <td className="p-4 text-center">
                  <div className={`w-2 h-2 mx-auto rounded-full ${post.is_visible ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" : "bg-red-500 dark:bg-red-600"}`}></div>
                </td>
                <td className="p-4 text-right">
                  <form action={toggleVisibility}>
                    <input type="hidden" name="id" value={post.id} />
                    <input type="hidden" name="currentStatus" value={post.is_visible.toString()} />
                    <button type="submit" className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${post.is_visible ? "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300" : "bg-emerald-100 dark:bg-emerald-900/40 hover:bg-emerald-200 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-400"}`}>
                      {post.is_visible ? "隐藏" : "恢复"}
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}