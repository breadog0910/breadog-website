"use client";

import { useAuth } from "@/lib/auth-context";
import type { Hobby } from "@/lib/types";
import { HOBBY_CATEGORIES } from "@/lib/types";
import ImageUpload from "@/components/image-upload";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditHobbyPage() {
  const { supabase } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "other" as Hobby["category"],
    cover_url: "",
    link: "",
    sort_order: 0,
  });

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from("hobbies")
        .select("*")
        .eq("id", id)
        .single();
      if (data) {
        setForm({
          title: data.title,
          description: data.description || "",
          category: data.category,
          cover_url: data.cover_url || "",
          link: data.link || "",
          sort_order: data.sort_order || 0,
        });
      }
      setLoading(false);
    }
    fetch();
  }, [supabase, id]);

  const handleSave = async () => {
    if (!form.title) {
      alert("标题不能为空");
      return;
    }
    setSaving(true);

    const { error } = await supabase
      .from("hobbies")
      .update({
        title: form.title,
        description: form.description,
        category: form.category,
        cover_url: form.cover_url,
        link: form.link,
        sort_order: form.sort_order,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (!error) {
      router.push("/admin/hobbies");
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
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">编辑爱好</h1>
      <div className="space-y-4 p-6 rounded-xl border border-card-border bg-card-bg">
        <Field label="分类">
          <select
            value={form.category}
            onChange={(e) =>
              setForm({
                ...form,
                category: e.target.value as Hobby["category"],
              })
            }
            className="w-full px-3 py-2 rounded-lg bg-background border border-card-border
                       text-foreground text-sm focus:outline-none focus:border-primary/50"
          >
            {HOBBY_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.icon} {c.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="标题">
          <Input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </Field>
        <Field label="描述">
          <TextArea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
          />
        </Field>
        <ImageUpload
          label="封面图片"
          value={form.cover_url}
          onChange={(url) => setForm({ ...form, cover_url: url })}
        />
        <Field label="外链（可选）">
          <Input
            value={form.link}
            onChange={(e) => setForm({ ...form, link: e.target.value })}
            placeholder="https://..."
          />
        </Field>
        <Field label="排序（数字越小越靠前）">
          <Input
            type="number"
            value={form.sort_order}
            onChange={(e) =>
              setForm({ ...form, sort_order: Number(e.target.value) })
            }
          />
        </Field>
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
