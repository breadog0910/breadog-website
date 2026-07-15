"use client";

import { useAuth } from "@/lib/auth-context";
import { useEffect, useState } from "react";
import type { Profile } from "@/lib/types";

export default function ProfileEditPage() {
  const { supabase } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // 表单状态
  const [form, setForm] = useState({
    name: "",
    title: "",
    avatar_url: "",
    bio: "",
    skills: "",
    social_links: "",
    contact_email: "",
  });

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase.from("profile").select("*").single();
      if (data) {
        setProfile(data);
        setForm({
          name: data.name || "",
          title: data.title || "",
          avatar_url: data.avatar_url || "",
          bio: data.bio || "",
          skills: Array.isArray(data.skills) ? data.skills.join(", ") : "",
          social_links:
            typeof data.social_links === "object"
              ? JSON.stringify(data.social_links, null, 2)
              : "",
          contact_email: data.contact_email || "",
        });
      }
      setLoading(false);
    }
    fetch();
  }, [supabase]);

  const handleSave = async () => {
    setSaving(true);
    setMessage("");

    // 解析 social_links
    let socialLinks = {};
    try {
      socialLinks = JSON.parse(form.social_links || "{}");
    } catch {
      setMessage("社交链接格式错误，请输入有效的 JSON");
      setSaving(false);
      return;
    }

    const payload = {
      name: form.name,
      title: form.title,
      avatar_url: form.avatar_url,
      bio: form.bio,
      skills: form.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      social_links: socialLinks,
      contact_email: form.contact_email,
    };

    const { error } = await supabase
      .from("profile")
      .upsert({ id: profile?.id, ...payload })
      .select()
      .single();

    if (error) {
      setMessage("保存失败: " + error.message);
    } else {
      setMessage("保存成功！");
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
      <h1 className="text-2xl font-bold mb-6">编辑个人名片</h1>

      {message && (
        <div
          className={`mb-6 px-4 py-3 rounded-lg text-sm ${
            message.includes("成功")
              ? "bg-green-500/10 border border-green-500/20 text-green-400"
              : "bg-red-500/10 border border-red-500/20 text-red-400"
          }`}
        >
          {message}
        </div>
      )}

      <div className="space-y-5 p-6 rounded-xl border border-card-border bg-card-bg">
        <div>
          <label className="block text-sm text-muted mb-1.5">姓名 / 昵称</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-3 py-2 rounded-lg bg-background border border-card-border
                       text-foreground text-sm focus:outline-none focus:border-primary/50"
          />
        </div>

        <div>
          <label className="block text-sm text-muted mb-1.5">身份描述</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="例：软件工程学生 · 全栈开发者"
            className="w-full px-3 py-2 rounded-lg bg-background border border-card-border
                       text-foreground text-sm focus:outline-none focus:border-primary/50"
          />
        </div>

        <div>
          <label className="block text-sm text-muted mb-1.5">头像 URL</label>
          <input
            type="text"
            value={form.avatar_url}
            onChange={(e) => setForm({ ...form, avatar_url: e.target.value })}
            placeholder="https://example.com/avatar.jpg"
            className="w-full px-3 py-2 rounded-lg bg-background border border-card-border
                       text-foreground text-sm focus:outline-none focus:border-primary/50"
          />
        </div>

        <div>
          <label className="block text-sm text-muted mb-1.5">个人简介</label>
          <textarea
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            rows={4}
            placeholder="写一段介绍自己的话..."
            className="w-full px-3 py-2 rounded-lg bg-background border border-card-border
                       text-foreground text-sm focus:outline-none focus:border-primary/50 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm text-muted mb-1.5">
            技能标签（逗号分隔）
          </label>
          <input
            type="text"
            value={form.skills}
            onChange={(e) => setForm({ ...form, skills: e.target.value })}
            placeholder="JavaScript, React, Next.js, TypeScript..."
            className="w-full px-3 py-2 rounded-lg bg-background border border-card-border
                       text-foreground text-sm focus:outline-none focus:border-primary/50"
          />
        </div>

        <div>
          <label className="block text-sm text-muted mb-1.5">
            社交链接（JSON 格式）
          </label>
          <textarea
            value={form.social_links}
            onChange={(e) => setForm({ ...form, social_links: e.target.value })}
            rows={5}
            placeholder='{"github": "https://github.com/xxx", "email": "xxx@example.com", "linkedin": "..."}'
            className="w-full px-3 py-2 rounded-lg bg-background border border-card-border
                       text-foreground text-sm focus:outline-none focus:border-primary/50
                       font-mono resize-none"
          />
        </div>

        <div>
          <label className="block text-sm text-muted mb-1.5">联系邮箱</label>
          <input
            type="email"
            value={form.contact_email}
            onChange={(e) => setForm({ ...form, contact_email: e.target.value })}
            className="w-full px-3 py-2 rounded-lg bg-background border border-card-border
                       text-foreground text-sm focus:outline-none focus:border-primary/50"
          />
        </div>

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
