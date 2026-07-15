"use client";

export const dynamic = "force-dynamic";

import { AuthProvider } from "@/lib/auth-context";
import AdminShell from "./admin-shell";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <AdminShell>{children}</AdminShell>
    </AuthProvider>
  );
}
