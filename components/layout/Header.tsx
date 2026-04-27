"use client";

import { usePathname } from "next/navigation";
import { ChevronRight, Zap } from "lucide-react";
import type { Profile } from "@/types/database";

const routeLabels: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/workflows": "İş Akışları",
  "/templates": "Şablonlar",
  "/integrations": "Entegrasyonlar",
  "/billing": "Faturalama",
  "/settings": "Ayarlar",
};

interface HeaderProps {
  profile: Profile | null;
}

export function Header({ profile }: HeaderProps) {
  const pathname = usePathname();
  const parts = pathname.split("/").filter(Boolean);
  const currentLabel = routeLabels[`/${parts[0]}`] ?? parts[0];

  const usagePercent = profile
    ? Math.min((profile.task_count / profile.task_limit) * 100, 100)
    : 0;

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-6">
      <nav aria-label="Breadcrumb">
        <ol className="flex items-center gap-1.5 text-sm" role="list">
          <li>
            <span className="text-slate-500 dark:text-slate-400">CartLogic</span>
          </li>
          <li aria-hidden="true">
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
          </li>
          <li>
            <span className="font-medium text-slate-900 dark:text-slate-100" aria-current="page">
              {currentLabel}
            </span>
          </li>
        </ol>
      </nav>

      <div className="flex items-center gap-4">
        {profile && (
          <div className="hidden sm:flex items-center gap-3">
            <div className="flex flex-col items-end gap-1">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {profile.task_count.toLocaleString()} / {profile.task_limit === 999999 ? "∞" : profile.task_limit.toLocaleString()} task
              </span>
              <div
                className="h-1.5 w-32 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden"
                role="progressbar"
                aria-valuenow={usagePercent}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Task kullanımı"
              >
                <div
                  className={`h-full rounded-full transition-all ${
                    usagePercent > 80 ? "bg-red-500" : usagePercent > 60 ? "bg-amber-500" : "bg-blue-500"
                  }`}
                  style={{ width: `${usagePercent}%` }}
                />
              </div>
            </div>
            <div className="flex h-8 items-center gap-1.5 rounded-full bg-blue-50 dark:bg-blue-950/50 px-3">
              <Zap className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
              <span className="text-xs font-medium text-blue-600 dark:text-blue-400 capitalize">
                {profile.plan}
              </span>
            </div>
          </div>
        )}

        {profile && (
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs font-bold"
            aria-label={`${profile.full_name ?? profile.email} profili`}
          >
            {(profile.full_name ?? profile.email).charAt(0).toUpperCase()}
          </div>
        )}
      </div>
    </header>
  );
}
