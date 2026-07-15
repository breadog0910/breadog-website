"use client";

import { useAuth } from "@/lib/auth-context";
import ImageUpload from "@/components/image-upload";
import type { Post } from "@/lib/types";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditPostPage() {
  const { supabase } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from("posts")
        .select("*")
        .eq("id", id)
        .single();
      if (data) {
        setForm({
          title: data.title,
          slug: data.slug,
          content: data.content,
          excerpt: data.excerpt || "",
          cover_url: data.cover_url || "",
          tags: Array.isArray(data.tags) ? data.tags.join(", ") : "",
          is_published: data.is_published,
        });
      }
      setLoading(false);
    }
    fetch();
  }, [supabase, id]);

  const handleSave = async () => {
    if (!form.title || !form.slug) {
      alert("标题和 Slug 不能为空");
      return;
    }
    setSaving(true);

    const { error } = await supabase
      .from("posts")
      .update({
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
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (!error) {
      router.push("/admin/posts");
    } else {
      alert("保存失败: " + error.message);
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">编辑文章</h1>
      <div className="space-y-4 p-6 rounded-xl border border-card-border bg-card-bg">
        <Field label="标题">
          <Input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </Field>
        <Field label="Slug（URL 标识）">
          <Input
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
          />
        </Field>
        <Field label="摘要">
          <TextArea
            value={form.excerpt}
            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
            rows={3}
          />
        </Field>
        <ImageUpload
          label="封面图"
          value={form.cover_url}
          onChange={(url) => setForm({ ...form, cover_url: url })}
        />
        <Field label="标签（逗号分隔）">
          <Input
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
          />
        </Field>
        <Field label="内容（Markdown）">
          <TextArea
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            rows={16}
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
          已发布
        </label>
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-2.5 rounded-lg bg-primary text-white font-medium text-sm
                     hover:bg-primary-dark disabled:opacity-50 transition-colors"
        >
          {saving ? "保存中..." : "保存修改"}
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
