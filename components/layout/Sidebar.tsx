"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  GitBranch,
  FileCode2,
  Plug,
  CreditCard,
  Settings,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";
import { logoutAction } from "@/actions/auth";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/workflows", label: "İş Akışları", icon: GitBranch },
  { href: "/templates", label: "Şablonlar", icon: FileCode2 },
  { href: "/integrations", label: "Entegrasyonlar", icon: Plug },
  { href: "/billing", label: "Faturalama", icon: CreditCard },
  { href: "/settings", label: "Ayarlar", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 flex-col border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
      <div className="flex h-16 items-center gap-2.5 px-6 border-b border-slate-200 dark:border-slate-700">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
          <Zap className="h-4 w-4 text-white" />
        </div>
        <span className="text-lg font-bold text-slate-900 dark:text-white">CartLogic</span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Ana navigasyon">
        <ul className="space-y-1" role="list">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
                  )}
                >
                  <item.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-slate-200 dark:border-slate-700 p-3 flex items-center justify-between">
        <ThemeToggle />
        <form action={logoutAction}>
          <button
            type="submit"
            className="text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
          >
            Çıkış Yap
          </button>
        </form>
      </div>
    </aside>
  );
}
