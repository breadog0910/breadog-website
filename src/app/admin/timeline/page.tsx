"use client";

import { useAuth } from "@/lib/auth-context";
import type { TimelineEntry } from "@/lib/types";
import Link from "next/link";
import { useEffect, useState } from "react";

const TYPE_LABELS: Record<string, string> = {
  education: "🎓 教育",
  work: "💼 工作",
  project: "🚀 项目",
  other: "📌 其他",
};

export default function TimelineManagePage() {
  const { supabase } = useAuth();
  const [entries, setEntries] = useState<TimelineEntry[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchEntries() {
    const { data } = await supabase
      .from("timeline")
      .select("*")
      .order("date", { ascending: false });
    setEntries(data || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchEntries();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("确定删除这个条目？")) return;
    await supabase.from("timeline").delete().eq("id", id);
    fetchEntries();
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
        <h1 className="text-2xl font-bold">时间线管理</h1>
        <Link
          href="/admin/timeline/new"
          className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium
                     hover:bg-primary-dark transition-colors"
        >
          + 新增条目
        </Link>
      </div>

      {entries.length === 0 ? (
        <div className="text-center py-20 text-muted">
          <p className="text-lg">暂无条目</p>
          <p className="text-sm mt-2">点击上方按钮添加第一个时间线条目</p>
        </div>
      ) : (
        <div className="space-y-2">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center gap-4 p-4 rounded-xl border border-card-border bg-card-bg"
            >
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">{entry.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted">
                    {TYPE_LABELS[entry.type] || entry.type}
                  </span>
                  <span className="text-xs text-muted/50">
                    {entry.date}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <Link
                  href={`/admin/timeline/${entry.id}/edit`}
                  className="px-2 py-1.5 text-xs rounded-md bg-card-border/50 text-muted hover:text-foreground transition-colors"
                >
                  编辑
                </Link>
                <button
                  onClick={() => handleDelete(entry.id)}
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
