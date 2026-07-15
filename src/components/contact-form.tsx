"use client";

import { useState } from "react";
import ElectricBorder from "./ElectricBorder";
import "./ElectricBorder.css";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 客户端校验
    if (!form.name.trim()) {
      setErrorMsg("请输入姓名");
      setStatus("error");
      return;
    }
    if (!form.email.trim()) {
      setErrorMsg("请输入联系方式");
      setStatus("error");
      return;
    }
    if (!form.message.trim()) {
      setErrorMsg("请输入留言内容");
      setStatus("error");
      return;
    }

    setStatus("submitting");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!json.success) {
        setErrorMsg(json.error || "发送失败，请稍后重试");
        setStatus("error");
        return;
      }
      setStatus("success");
    } catch {
      setErrorMsg("网络错误，请稍后重试");
      setStatus("error");
    }
  };

  // — 成功状态 —
  if (status === "success") {
    return (
      <div className="p-8 rounded-2xl bg-green-500/10 border border-green-500/20 text-center">
        <svg
          className="w-12 h-12 mx-auto mb-3 text-green-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
        <p className="text-green-400 font-medium text-lg">消息已发送！</p>
        <p className="text-muted text-sm mt-1">感谢你的留言，我会尽快回复。</p>
      </div>
    );
  }

  // — 表单 —
  return (
    <div className="p-6 sm:p-8 rounded-2xl bg-card-bg border border-card-border">
      {errorMsg && (
        <div className="mb-5 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* 姓名 */}
        <div>
          <label className="block text-sm text-muted mb-1.5">姓名</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-lg bg-background border border-card-border
                       text-foreground text-sm placeholder:text-muted/50
                       focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20
                       transition-colors"
            placeholder="你的名字"
            disabled={status === "submitting"}
          />
        </div>

        {/* 联系方式 */}
        <div>
          <label className="block text-sm text-muted mb-1.5">联系方式</label>
          <input
            type="text"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-lg bg-background border border-card-border
                       text-foreground text-sm placeholder:text-muted/50
                       focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20
                       transition-colors"
            placeholder="邮箱 / QQ / 微信 / 手机号..."
            disabled={status === "submitting"}
          />
        </div>

        {/* 留言 */}
        <div>
          <label className="block text-sm text-muted mb-1.5">留言</label>
          <textarea
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            rows={4}
            className="w-full px-3.5 py-2.5 rounded-lg bg-background border border-card-border
                       text-foreground text-sm placeholder:text-muted/50 resize-none
                       focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20
                       transition-colors"
            placeholder="说点什么吧..."
            disabled={status === "submitting"}
          />
        </div>

        {/* 提交按钮 — 电动画边框 */}
        <ElectricBorder color="#6366f1" speed={0.8} chaos={0.1} borderRadius={12}>
          <button
            type="submit"
            disabled={status === "submitting"}
            className="w-full py-2.5 rounded-lg bg-card-bg text-primary-light font-medium text-sm
                       hover:bg-primary/10 disabled:opacity-50 transition-colors
                       flex items-center justify-center gap-2"
          >
            {status === "submitting" ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-light border-t-transparent rounded-full animate-spin" />
                发送中...
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 2L11 13" />
                  <path d="M22 2l-7 20-4-9-9-4 20-7z" />
                </svg>
                发送留言
              </>
            )}
          </button>
        </ElectricBorder>
      </form>
    </div>
  );
}
