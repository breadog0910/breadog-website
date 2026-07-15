"use client";

export const dynamic = "force-dynamic";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const { user, loading, signIn } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.replace("/admin");
    }
  }, [user, loading, router]);

  if (loading || user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const result = await signIn(email, password);
    if (result.error) {
      setError(result.error);
      setSubmitting(false);
    } else {
      router.replace("/admin");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight">
            <span className="text-primary">Brea</span>
            <span>dog</span>
          </h1>
          <p className="text-sm text-muted mt-2">管理后台 · 请登录</p>
        </div>

        {/* 表单 */}
        <form
          onSubmit={handleSubmit}
          className="space-y-4 p-6 rounded-xl border border-card-border bg-card-bg"
        >
          {error && (
            <div className="px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm text-muted mb-1.5">
              邮箱
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@breadog.com"
              className="w-full px-3 py-2 rounded-lg bg-background border border-card-border
                         text-foreground placeholder:text-muted/40 text-sm
                         focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20
                         transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm text-muted mb-1.5"
            >
              密码
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="输入密码"
              className="w-full px-3 py-2 rounded-lg bg-background border border-card-border
                         text-foreground placeholder:text-muted/40 text-sm
                         focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20
                         transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 rounded-lg bg-primary text-white font-medium text-sm
                       hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed
                       transition-colors"
          >
            {submitting ? "登录中..." : "登录"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
