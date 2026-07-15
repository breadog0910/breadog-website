"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewPostPage() {
  const { supabase } = useAuth();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    cover_url: "",
    tags: "",
    is_published: false,
  });

  const handleSave = async () => {
    if (!form.title || !form.slug) {
      alert("标题和 Slug（URL 标识）不能为空");
      return;
    }
    setSaving(true);

    const { error } = await supabase.from("posts").insert({
      title: form.title,
      slug: form.slug,
      content: form.content,
      excerpt: form.excerpt,
      cover_url: form.cover_url,
      tags: form.tags
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      is_published: form.is_published,
    });

    if (!error) {
      router.push("/admin/posts");
    } else {
      alert("保存失败: " + error.message);
    }
    setSaving(false);
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">写新文章</h1>
      <div className="space-y-4 p-6 rounded-xl border border-card-border bg-card-bg">
        <Field label="标题">
          <Input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </Field>
        <Field label="Slug（URL 标识，如：my-first-post）">
          <Input
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            placeholder="my-first-post"
          />
        </Field>
        <Field label="摘要">
          <TextArea
            value={form.excerpt}
            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
            rows={3}
          />
        </Field>
        <Field label="封面图 URL">
          <Input
            value={form.cover_url}
            onChange={(e) => setForm({ ...form, cover_url: e.target.value })}
          />
        </Field>
        <Field label="标签（逗号分隔）">
          <Input
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
            placeholder="JavaScript, React, 教程"
          />
        </Field>
        <Field label="内容（Markdown）">
          <TextArea
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            rows={16}
            placeholder="# 开始写你的文章...&#10;&#10;支持 Markdown 语法"
          />
        </Field>
        <label className="flex items-center gap-2 text-sm text-muted cursor-pointer">
          <input
            type="checkbox"
            checked={form.is_published}
            onChange={(e) =>
              setForm({ ...form, is_published: e.target.checked })
            }
            className="w-4 h-4 rounded accent-primary"
          />
          立即发布
        </label>
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-2.5 rounded-lg bg-primary text-white font-medium text-sm
                     hover:bg-primary-dark disabled:opacity-50 transition-colors"
        >
          {saving ? "保存中..." : "发布文章"}
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm text-muted mb-1.5">{label}</label>
      {children}
    </div>
  );
}
function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type="text"
      className="w-full px-3 py-2 rounded-lg bg-background border border-card-border
                 text-foreground text-sm focus:outline-none focus:border-primary/50"
      {...props}
    />
  );
}
function TextArea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>
) {
  return (
    <textarea
      className="w-full px-3 py-2 rounded-lg bg-background border border-card-border
                 text-foreground text-sm focus:outline-none focus:border-primary/50 resize-none
                 font-mono"
      {...props}
    />
  );
}
