import FrontLayout from "@/components/front-layout";
import { createClient } from "@/lib/supabase";
import type { Post } from "@/lib/types";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

async function getPost(slug: string): Promise<Post | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("posts")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .single();
    return data;
  } catch {
    return null;
  }
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) notFound();

  return (
    <FrontLayout>
      <article className="max-w-3xl mx-auto px-4 py-16 sm:py-24">
        {/* 封面 */}
        {post.cover_url && (
          <div className="aspect-video rounded-xl overflow-hidden mb-8 bg-card-bg">
            <img
              src={post.cover_url}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* 标题 */}
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">{post.title}</h1>

        {/* 元信息 */}
        <div className="flex items-center gap-4 mb-8 text-sm text-muted">
          <time>
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
                  className="px-2 py-0.5 rounded-md bg-card-bg border border-card-border text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 内容 */}
        <div className="prose text-foreground/90">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </div>
      </article>
    </FrontLayout>
  );
}
