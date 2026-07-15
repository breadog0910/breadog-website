import { createBrowserClient } from "@supabase/ssr";

let _warned = false;

// 客户端 Supabase 客户端（用于 Client Components）
export function createBrowserSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // 构建时 env 为占位值，返回空壳对象避免崩溃
  // （运行时一定有正确的 env，因为 Vercel 会注入）
  if (!url || !key || url === "your_project_url") {
    if (!_warned) {
      console.warn(
        "[Supabase] 缺少有效环境变量。请在 .env.local 中配置 NEXT_PUBLIC_SUPABASE_URL 和 NEXT_PUBLIC_SUPABASE_ANON_KEY。"
      );
      _warned = true;
    }
    // 返回一个不会崩溃的空壳（只在构建/prerender期间可能用到）
    return createBrowserClient("http://localhost:54321", "placeholder-key");
  }

  return createBrowserClient(url, key);
}
