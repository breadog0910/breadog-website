"use client";

import { useAuth } from "@/lib/auth-context";
import type { TimelineEntry } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useState } from "react";

const TYPES = [
  { value: "education", label: "🎓 教育" },
  { value: "work", label: "💼 工作" },
  { value: "project", label: "🚀 项目" },
  { value: "other", label: "📌 其他" },
];

export default function NewTimelinePage() {
  const { supabase } = useAuth();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    type: "other" as TimelineEntry["type"],
    icon: "",
  });

  const handleSave = async () => {
    if (!form.title || !form.date) {
      alert("标题和日期不能为空");
      return;
    }
    setSaving(true);

    const { error } = await supabase.from("timeline").insert({
      title: form.title,
      description: form.description,
      date: form.date,
      type: form.type,
      icon: form.icon,
    });

    if (!error) {
      router.push("/admin/timeline");
    } else {
      alert("保存失败: " + error.message);
    }
    setSaving(false);
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">新增时间线条目</h1>
      <div className="space-y-4 p-6 rounded-xl border border-card-border bg-card-bg">
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
            rows={4}
          />
        </Field>
        <Field label="日期">
          <Input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
        </Field>
        <Field label="类型">
          <select
            value={form.type}
            onChange={(e) =>
              setForm({
                ...form,
                type: e.target.value as TimelineEntry["type"],
              })
            }
            className="w-full px-3 py-2 rounded-lg bg-background border border-card-border
                       text-foreground text-sm focus:outline-none focus:border-primary/50"
          >
            {TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="自定义图标（Emoji）">
          <Input
            value={form.icon}
            onChange={(e) => setForm({ ...form, icon: e.target.value })}
            placeholder="🚀"
          />
        </Field>
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-2.5 rounded-lg bg-primary text-white font-medium text-sm
                     hover:bg-primary-dark disabled:opacity-50 transition-colors"
        >
          {saving ? "保存中..." : "创建条目"}
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
