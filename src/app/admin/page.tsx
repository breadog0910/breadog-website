"use client";

import { useAuth } from "@/lib/auth-context";
import { useEffect, useState } from "react";
import Link from "next/link";

interface DashboardStats {
  projects: number;
  posts: number;
  publishedPosts: number;
  timeline: number;
}

export default function DashboardPage() {
  const { supabase } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    projects: 0,
    posts: 0,
    publishedPosts: 0,
    timeline: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) return;
    async function fetchStats() {
      try {
        const [projectsRes, postsRes, timelineRes] = await Promise.all([
          supabase.from("projects").select("id", { count: "exact" }),
          supabase.from("posts").select("id, is_published", { count: "exact" }),
          supabase.from("timeline").select("id", { count: "exact" }),
        ]);

        setStats({
          projects: projectsRes.count || 0,
          posts: postsRes.count || 0,
          publishedPosts:
            (postsRes.data || []).filter((p: { is_published: boolean }) => p.is_published).length,
          timeline: timelineRes.count || 0,
        });
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, [supabase]);


  const cards = [
    { label: "作品总数", value: stats.projects, href: "/admin/projects", color: "border-l-purple-500" },
    { label: "文章总数", value: stats.posts, href: "/admin/posts", color: "border-l-blue-500" },
    { label: "已发布文章", value: stats.publishedPosts, href: "/admin/posts", color: "border-l-green-500" },
    { label: "时间线条目", value: stats.timeline, href: "/admin/timeline", color: "border-l-accent" },
  ];

  const quickLinks = [
    { label: "编辑个人名片", href: "/admin/profile", desc: "更新头像、简介、技能、社交链接" },
    { label: "写新文章", href: "/admin/posts/new", desc: "发布一篇新的技术博客" },
    { label: "添加作品", href: "/admin/projects/new", desc: "添加一个新项目展示" },
    { label: "添加时间线条目", href: "/admin/timeline/new", desc: "记录一个学习或工作节点" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">仪表盘</h1>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className={`p-5 rounded-xl border border-card-border bg-card-bg border-l-4 ${card.color}
                       hover:border-primary/30 hover:shadow-md transition-all`}
          >
            <p className="text-sm text-muted mb-1">{card.label}</p>
            <p className="text-3xl font-bold">
              {loading ? "-" : card.value}
            </p>
          </Link>
        ))}
      </div>

      {/* 快捷操作 */}
      <h2 className="text-lg font-semibold mb-4">快捷操作</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {quickLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="p-4 rounded-xl border border-card-border bg-card-bg
                       hover:border-primary/30 hover:shadow-md transition-all"
          >
            <h3 className="font-medium mb-1">{link.label}</h3>
            <p className="text-sm text-muted">{link.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
