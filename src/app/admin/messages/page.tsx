"use client";

import { useAuth } from "@/lib/auth-context";
import type { ContactMessage } from "@/lib/types";
import { useEffect, useState } from "react";

export default function MessagesManagePage() {
  const { supabase } = useAuth();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchMessages() {
    const { data } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });
    setMessages(data || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchMessages();
  }, []);

  async function toggleRead(id: string, current: boolean) {
    await supabase
      .from("contact_messages")
      .update({ is_read: !current })
      .eq("id", id);
    fetchMessages();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const unread = messages.filter((m) => !m.is_read).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">留言管理</h1>
          {messages.length > 0 && (
            <p className="text-sm text-muted mt-1">
              共 {messages.length} 条留言，{unread} 条未读
            </p>
          )}
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="text-center py-20 text-muted">
          <p className="text-lg">暂无留言</p>
          <p className="text-sm mt-2">当访客提交联系表单后，留言会出现在这里</p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-5 rounded-xl border transition-colors ${
                msg.is_read
                  ? "bg-card-bg border-card-border"
                  : "bg-primary/5 border-primary/20"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {/* 发件人 & 时间 */}
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className="font-semibold text-foreground">
                      {msg.name}
                    </span>
                    <span className="text-sm text-primary-light">
                      {msg.email}
                    </span>
                    {!msg.is_read && (
                      <span className="inline-block w-2 h-2 rounded-full bg-primary flex-shrink-0" title="未读" />
                    )}
                  </div>

                  {/* 内容 */}
                  <p className="text-muted text-sm leading-relaxed whitespace-pre-wrap">
                    {msg.message}
                  </p>

                  {/* 时间 */}
                  <p className="text-xs text-muted/50 mt-2">
                    {new Date(msg.created_at).toLocaleString("zh-CN")}
                  </p>
                </div>

                {/* 标记已读按钮 */}
                <button
                  onClick={() => toggleRead(msg.id, msg.is_read)}
                  className={`flex-shrink-0 px-3 py-1.5 text-xs rounded-lg transition-colors ${
                    msg.is_read
                      ? "bg-card-border/50 text-muted hover:text-foreground"
                      : "bg-primary/10 text-primary hover:bg-primary/20"
                  }`}
                >
                  {msg.is_read ? "标为未读" : "标为已读"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
