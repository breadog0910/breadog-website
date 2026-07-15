import FrontLayout from "@/components/front-layout";
import { createClient } from "@/lib/supabase";
import type { Post } from "@/lib/types";
import Link from "next/link";

async function getPosts(): Promise<Post[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("posts")
      .select("*")
      .eq("is_published", true)
      .order("created_at", { ascending: false });
    return data || [];
  } catch {
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <FrontLayout>
      <div className="max-w-3xl mx-auto px-4 py-16 sm:py-24">
        {/* 页面标题 */}
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">博客</h1>
          <p className="text-muted">技术学习记录和思考分享</p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted text-lg">还没有文章</p>
            <p className="text-muted/60 text-sm mt-2">
              开始写一些技术文章吧
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group flex flex-col sm:flex-row gap-6 p-5 rounded-xl border border-card-border
                           bg-card-bg hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5
                           transition-all duration-300"
              >
                {/* 封面缩略图 */}
                {post.cover_url && (
                  <div className="flex-shrink-0 sm:w-48 aspect-video sm:aspect-square rounded-lg overflow-hidden bg-card-bg">
                    <img
                      src={post.cover_url}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}

                {/* 信息 */}
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-sm text-muted line-clamp-2 mb-3">
                    {post.excerpt || "暂无摘要"}
                  </p>
                  <div className="flex items-center gap-3 flex-wrap">
                    <time className="text-xs text-muted/60">
                      {new Date(post.created_at).toLocaleDateString("zh-CN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                    {post.tags?.length > 0 && (
                      <div className="flex gap-1.5">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 text-xs rounded-md bg-background border border-card-border text-muted"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </FrontLayout>
  );
}
