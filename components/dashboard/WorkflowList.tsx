import Link from "next/link";
import { GitBranch, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatRelativeDate } from "@/lib/utils";
import type { Workflow } from "@/types/database";

interface WorkflowListProps {
  workflows: Workflow[];
}

export function WorkflowList({ workflows }: WorkflowListProps) {
  if (workflows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
          <GitBranch className="h-6 w-6 text-slate-400" aria-hidden="true" />
        </div>
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
          Henüz iş akışı yok
        </p>
        <p className="mt-1 text-xs text-slate-400">
          İlk iş akışınızı oluşturmak için şablonlara göz atın.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-100 dark:divide-slate-700">
      {workflows.map((workflow) => (
        <Link
          key={workflow.id}
          href={`/workflows/${workflow.id}`}
          className="flex items-center justify-between px-1 py-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 rounded-lg transition-colors group"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`h-2 w-2 rounded-full shrink-0 ${
                workflow.is_active ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"
              }`}
              aria-label={workflow.is_active ? "Aktif" : "Pasif"}
            />
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                {workflow.name}
              </p>
              {workflow.last_executed_at && (
                <p className="text-xs text-slate-400 mt-0.5">
                  Son çalışma: {formatRelativeDate(workflow.last_executed_at)}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3 ml-4 shrink-0">
            <Badge variant={workflow.is_published ? "success" : "default"}>
              {workflow.is_published ? "Yayında" : "Taslak"}
            </Badge>
            <span className="text-xs text-slate-400">{workflow.execution_count} çalışma</span>
            <ChevronRight
              className="h-4 w-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors"
              aria-hidden="true"
            />
          </div>
        </Link>
      ))}
    </div>
  );
}
