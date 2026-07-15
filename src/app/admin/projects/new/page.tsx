"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewProjectPage() {
  const { supabase } = useAuth();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    cover_url: "",
    tech_stack: "",
    link: "",
    github_url: "",
    is_published: false,
  });

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase.from("projects").insert({
      title: form.title,
      description: form.description,
      cover_url: form.cover_url,
      tech_stack: form.tech_stack
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      link: form.link,
      github_url: form.github_url,
      is_published: form.is_published,
      sort_order: 0,
    });

    if (!error) {
      router.push("/admin/projects");
    } else {
      alert("保存失败: " + error.message);
    }
    setSaving(false);
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">新建作品</h1>
      <div className="space-y-4 p-6 rounded-xl border border-card-border bg-card-bg">
        <Field label="作品名称">
          <Input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </Field>
        <Field label="描述">
          <TextArea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={5}
          />
        </Field>
        <Field label="封面图 URL">
          <Input
            value={form.cover_url}
            onChange={(e) => setForm({ ...form, cover_url: e.target.value })}
          />
        </Field>
        <Field label="技术栈（逗号分隔）">
          <Input
            value={form.tech_stack}
            onChange={(e) => setForm({ ...form, tech_stack: e.target.value })}
            placeholder="React, Next.js, Tailwind CSS"
          />
        </Field>
        <Field label="项目链接">
          <Input
            value={form.link}
            onChange={(e) => setForm({ ...form, link: e.target.value })}
          />
        </Field>
        <Field label="GitHub 链接">
          <Input
            value={form.github_url}
            onChange={(e) => setForm({ ...form, github_url: e.target.value })}
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
          {saving ? "保存中..." : "创建作品"}
        </button>
      </div>
    </div>
  );
}

// 内联表单组件
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
                 text-foreground text-sm focus:outline-none focus:border-primary/50 resize-none"
      {...props}
    />
  );
}
