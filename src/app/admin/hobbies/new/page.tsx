"use client";

import { useAuth } from "@/lib/auth-context";
import type { Hobby } from "@/lib/types";
import { HOBBY_CATEGORIES } from "@/lib/types";
import ImageUpload from "@/components/image-upload";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewHobbyPage() {
  const { supabase } = useAuth();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "other" as Hobby["category"],
    cover_url: "",
    link: "",
  });

  const handleSave = async () => {
    if (!form.title) {
      alert("标题不能为空");
      return;
    }
    setSaving(true);

    const { error } = await supabase.from("hobbies").insert({
      title: form.title,
      description: form.description,
      category: form.category,
      cover_url: form.cover_url,
      link: form.link,
    });

    if (!error) {
      router.push("/admin/hobbies");
    } else {
      alert("保存失败: " + error.message);
    }
    setSaving(false);
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">新增爱好</h1>
      <div className="space-y-4 p-6 rounded-xl border border-card-border bg-card-bg">
        <Field label="分类">
          <select
            value={form.category}
            onChange={(e) =>
              setForm({ ...form, category: e.target.value as Hobby["category"] })
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
            placeholder="例：周杰伦、CS2、三体..."
          />
        </Field>
        <Field label="描述">
          <TextArea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            placeholder="简短描述..."
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
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-2.5 rounded-lg bg-primary text-white font-medium text-sm
                     hover:bg-primary-dark disabled:opacity-50 transition-colors"
        >
          {saving ? "保存中..." : "创建爱好"}
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
