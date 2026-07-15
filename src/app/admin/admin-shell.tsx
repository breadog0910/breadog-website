"use client";

import { useAuth } from "@/lib/auth-context";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

const ADMIN_LINKS = [
  { href: "/admin", label: "仪表盘", icon: "📊" },
  { href: "/admin/profile", label: "个人名片", icon: "👤" },
  { href: "/admin/projects", label: "作品管理", icon: "💼" },
  { href: "/admin/posts", label: "文章管理", icon: "📝" },
  { href: "/admin/timeline", label: "时间线", icon: "📅" },
];

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, signOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (!loading && !user && !isLoginPage) {
      router.replace("/admin/login");
    }
  }, [user, loading, isLoginPage, router]);

  // 登录页不需要外壳
  if (isLoginPage) {
    return <>{children}</>;
  }

  // 加载中
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // 未登录
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* 移动端遮罩 */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 侧边栏 */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-60 bg-card-bg border-r border-card-border
                     transform transition-transform lg:transform-none ${
                       sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                     }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="px-5 py-4 border-b border-card-border">
            <Link
              href="/admin"
              className="text-lg font-bold tracking-tight"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="text-primary">Brea</span>
              <span>dog</span>
              <span className="text-xs text-muted ml-2">管理后台</span>
            </Link>
          </div>

          {/* 导航 */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {ADMIN_LINKS.map((link) => {
              const isActive =
                link.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "text-muted hover:text-foreground hover:bg-card-border/50"
                  }`}
                >
                  <span>{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* 底部 */}
          <div className="px-3 py-4 border-t border-card-border space-y-2">
            <Link
              href="/home"
              className="block px-3 py-2 rounded-lg text-sm text-muted hover:text-foreground hover:bg-card-border/50 transition-colors"
            >
              🏠 查看前台网站
            </Link>
            <button
              onClick={() => signOut().then(() => router.push("/admin/login"))}
              className="w-full text-left px-3 py-2 rounded-lg text-sm text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
            >
              🚪 退出登录
            </button>
          </div>
        </div>
      </aside>

      {/* 主内容区 */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* 顶部栏 */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-card-border px-4 lg:px-8 h-14 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 text-muted hover:text-foreground -ml-2"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          </button>
          <div className="text-sm text-muted">
            {user.email}
          </div>
        </header>

        {/* 页面内容 */}
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
