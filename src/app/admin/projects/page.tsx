"use client";

import { useAuth } from "@/lib/auth-context";
import type { Project } from "@/lib/types";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ProjectsManagePage() {
  const { supabase } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchProjects() {
    const { data } = await supabase
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: true });
    setProjects(data || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("确定删除这个作品？")) return;
    await supabase.from("projects").delete().eq("id", id);
    fetchProjects();
  }

  async function handleTogglePublish(id: string, current: boolean) {
    await supabase
      .from("projects")
      .update({ is_published: !current })
      .eq("id", id);
    fetchProjects();
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
        <h1 className="text-2xl font-bold">作品管理</h1>
        <Link
          href="/admin/projects/new"
          className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium
                     hover:bg-primary-dark transition-colors"
        >
          + 新建作品
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-20 text-muted">
          <p className="text-lg">暂无作品</p>
          <p className="text-sm mt-2">点击上方按钮添加第一个作品</p>
        </div>
      ) : (
        <div className="space-y-2">
          {projects.map((project) => (
            <div
              key={project.id}
              className="flex items-center gap-4 p-4 rounded-xl border border-card-border bg-card-bg"
            >
              {/* 封面缩略图 */}
              <div className="flex-shrink-0 w-16 h-10 rounded-md overflow-hidden bg-background">
                {project.cover_url ? (
                  <img
                    src={project.cover_url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted/30 text-xs">
                    无图
                  </div>
                )}
              </div>

              {/* 信息 */}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">{project.title}</h3>
                <p className="text-xs text-muted">
                  {project.is_published ? "🟢 已发布" : "⚫ 草稿"}
                </p>
              </div>

              {/* 操作 */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  onClick={() => handleTogglePublish(project.id, project.is_published)}
                  className="px-2 py-1.5 text-xs rounded-md bg-card-border/50 text-muted hover:text-foreground transition-colors"
                >
                  {project.is_published ? "隐藏" : "发布"}
                </button>
                <Link
                  href={`/admin/projects/${project.id}/edit`}
                  className="px-2 py-1.5 text-xs rounded-md bg-card-border/50 text-muted hover:text-foreground transition-colors"
                >
                  编辑
                </Link>
                <button
                  onClick={() => handleDelete(project.id)}
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
