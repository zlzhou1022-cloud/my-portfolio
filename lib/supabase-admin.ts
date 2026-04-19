import { createClient } from '@supabase/supabase-js';

// 💡 必须使用 SERVICE_ROLE_KEY，它才能绕过 RLS 权限限制！
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! 
);