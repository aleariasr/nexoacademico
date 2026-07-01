"use client";

import Button from "@/components/ui/Button";
import GlassCard from "@/components/ui/GlassCard";
import type { AcademicTask } from "@/types/academic";
import { motion } from "framer-motion";
import { AlertCircle, Calendar, Edit2, Trash2 } from "lucide-react";
import { useState } from "react";

type TaskCardProps = {
  task: AcademicTask;
  canManage?: boolean;
  onEdit: (task: AcademicTask) => void;
  onDelete: (id: number) => void;
};

const statusStyles = {
  pending: "bg-amber-400/16 text-amber-700",
  in_progress: "bg-[var(--primary-soft)] text-[var(--primary)]",
  completed: "bg-emerald-400/16 text-emerald-700",
  cancelled: "bg-slate-500/14 text-slate-600",
};

const statusLabels = {
  pending: "Pending",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

const priorityStyles = {
  low: "bg-sky-400/12 text-sky-700",
  medium: "bg-amber-400/14 text-amber-700",
  high: "bg-orange-400/14 text-orange-700",
  critical: "bg-red-500/14 text-red-700",
};

export default function TaskCard({
  task,
  canManage = true,
  onEdit,
  onDelete,
}: TaskCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      onDelete(task.id);
    } finally {
      setIsDeleting(false);
    }
  };

  const daysUntilDue = task.due_date
    ? Math.ceil(
        (new Date(task.due_date).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : null;

  return (
    <motion.article
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: "spring", stiffness: 360, damping: 30 }}
    >
      <GlassCard className="group p-4">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <Badge className={statusStyles[task.status]}>
              {statusLabels[task.status]}
            </Badge>

            <Badge className={priorityStyles[task.priority]}>
              {task.priority}
            </Badge>
          </div>

          {task.is_overdue && (
            <Badge className="bg-red-500/16 text-red-700">
              <AlertCircle size={12} />
              Overdue
            </Badge>
          )}
        </div>

        <div className="mb-4 min-w-0">
          <p className="line-clamp-2 text-base font-semibold tracking-[-0.015em] text-slate-950">
            {task.title}
          </p>

          <p className="mt-1 truncate text-sm text-slate-500">
            {task.course_name || "No course"}
          </p>
        </div>

        {task.description && (
          <p className="mb-4 line-clamp-2 text-sm leading-6 text-slate-600">
            {task.description}
          </p>
        )}

        <div className="mb-4 space-y-3 rounded-[var(--radius-lg)] border border-white/35 bg-white/20 p-4">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Calendar size={14} />
            <span>
              {formatTaskDate(task.due_date)}
              {daysUntilDue !== null && (
                <span className={daysUntilDue < 0 ? "text-red-600" : ""}>
                  {" "}
                  ({formatRelativeDays(daysUntilDue)})
                </span>
              )}
            </span>
          </div>

          {task.progress_percentage > 0 && (
            <div>
              <div className="mb-1 flex justify-between text-xs">
                <span className="text-slate-600">Progress</span>
                <span className="font-semibold text-slate-700">
                  {task.progress_percentage}%
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-200/50">
                <div
                  className="h-full bg-[var(--primary)] transition-all duration-300"
                  style={{ width: `${task.progress_percentage}%` }}
                />
              </div>
            </div>
          )}

          {task.grade !== null && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Grade</span>
              <span className="font-semibold text-slate-950">{task.grade}</span>
            </div>
          )}
        </div>
        {canManage && (
          <div className="flex gap-2 border-t border-white/30 pt-4">
            <Button
              variant="primary"
              className="h-9 flex-1 px-3 text-xs"
              onClick={() => onEdit(task)}
            >
              <Edit2 size={14} />
              Edit
            </Button>

            <Button
              variant="glass"
              className="h-9 flex-1 px-3 text-xs text-red-600 hover:bg-red-500/15"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              <Trash2 size={14} />
              {isDeleting ? "…" : "Delete"}
            </Button>
          </div>
        )}
      </GlassCard>
    </motion.article>
  );
}

function Badge({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${className}`}
    >
      {children}
    </span>
  );
}

function formatTaskDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "No date";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function formatRelativeDays(days: number) {
  if (days === 0) return "today";
  if (days > 0) return `in ${days}d`;
  return `${Math.abs(days)}d overdue`;
}