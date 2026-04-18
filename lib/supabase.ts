import { createClient } from '@supabase/supabase-js';

// 获取我们在 .env.local 中配置的环境变量
// 末尾的 ! 是 TypeScript 的非空断言，告诉编译器“放心，这个变量一定存在”
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// 创建并导出一个唯一的 supabase 实例供全站使用
export const supabase = createClient(supabaseUrl, supabaseKey);