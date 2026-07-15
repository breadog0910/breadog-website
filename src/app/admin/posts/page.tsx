"use client";

import { useAuth } from "@/lib/auth-context";
import type { Post } from "@/lib/types";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function PostsManagePage() {
  const { supabase } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchPosts() {
    const { data } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });
    setPosts(data || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("确定删除这篇文章？")) return;
    await supabase.from("posts").delete().eq("id", id);
    fetchPosts();
  }

  async function handleTogglePublish(id: string, current: boolean) {
    await supabase
      .from("posts")
      .update({ is_published: !current })
      .eq("id", id);
    fetchPosts();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">文章管理</h1>
        <Link
          href="/admin/posts/new"
          className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium
                     hover:bg-primary-dark transition-colors"
        >
          + 写新文章
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-20 text-muted">
          <p className="text-lg">暂无文章</p>
          <p className="text-sm mt-2">点击上方按钮写第一篇文章</p>
        </div>
      ) : (
        <div className="space-y-2">
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex items-center gap-4 p-4 rounded-xl border border-card-border bg-card-bg"
            >
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">{post.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted">
                    {post.is_published ? "🟢 已发布" : "⚫ 草稿"}
                  </span>
                  <span className="text-xs text-muted/50">
                    /blog/{post.slug}
                  </span>
                  <span className="text-xs text-muted/50">
                    {new Date(post.created_at).toLocaleDateString("zh-CN")}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  onClick={() => handleTogglePublish(post.id, post.is_published)}
                  className="px-2 py-1.5 text-xs rounded-md bg-card-border/50 text-muted hover:text-foreground transition-colors"
                >
                  {post.is_published ? "隐藏" : "发布"}
                </button>
                <Link
                  href={`/admin/posts/${post.id}/edit`}
                  className="px-2 py-1.5 text-xs rounded-md bg-card-border/50 text-muted hover:text-foreground transition-colors"
                >
                  编辑
                </Link>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="px-2 py-1.5 text-xs rounded-md bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                >
                  删除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
