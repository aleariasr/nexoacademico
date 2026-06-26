"use client";

import type { AcademicTask } from "@/types/academic";
import { Calendar, Edit2, Trash2, AlertCircle } from "lucide-react";
import { useState } from "react";

type TaskCardProps = {
  task: AcademicTask;
  onEdit: (task: AcademicTask) => void;
  onDelete: (id: number) => void;
};

const statusColors = {
  pending: { bg: "bg-yellow-500/20", text: "text-yellow-600", label: "Pending" },
  in_progress: {
    bg: "bg-blue-500/20",
    text: "text-blue-600",
    label: "In Progress",
  },
  completed: {
    bg: "bg-green-500/20",
    text: "text-green-600",
    label: "Completed",
  },
  cancelled: {
    bg: "bg-slate-500/20",
    text: "text-slate-600",
    label: "Cancelled",
  },
};

const priorityColors = {
  low: "bg-blue-500/10 text-blue-600",
  medium: "bg-yellow-500/10 text-yellow-600",
  high: "bg-orange-500/10 text-orange-600",
  critical: "bg-red-500/10 text-red-600",
};

export default function TaskCard({
  task,
  onEdit,
  onDelete,
}: TaskCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const statusColor = statusColors[task.status];
  const priorityColor = priorityColors[task.priority];

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
    <div className="group rounded-[20px] border border-white/45 bg-white/30 p-4 shadow-sm transition-all duration-300 hover:border-white/60 hover:bg-white/40 hover:shadow-[0_20px_50px_rgba(15,23,42,0.1)]">
      {/* Header with status and priority */}
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex gap-2">
          <span
            className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${statusColor.bg} ${statusColor.text}`}
          >
            {statusColor.label}
          </span>
          <span
            className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold uppercase tracking-wide ${priorityColor}`}
          >
            {task.priority}
          </span>
        </div>

        {task.is_overdue && (
          <div className="flex items-center gap-1 rounded-full bg-red-500/20 px-2 py-1 text-xs font-semibold text-red-600">
            <AlertCircle size={12} />
            Overdue
          </div>
        )}
      </div>

      {/* Title and course */}
      <div className="mb-4">
        <p className="line-clamp-2 font-semibold text-slate-950">
          {task.title}
        </p>
        <p className="mt-1 truncate text-sm text-slate-500">
          {task.course_name || "No course"}
        </p>
      </div>

      {/* Description if present */}
      {task.description && (
        <p className="mb-4 line-clamp-2 text-sm text-slate-600">
          {task.description}
        </p>
      )}

      {/* Due date and progress */}
      <div className="mb-4 space-y-2">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Calendar size={14} />
          <span>
            {new Intl.DateTimeFormat("en", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }).format(new Date(task.due_date))}
            {daysUntilDue !== null && (
              <span className={daysUntilDue < 0 ? "text-red-600" : ""}>
                {" "}
                ({daysUntilDue === 0 ? "today" : daysUntilDue > 0 ? `in ${daysUntilDue}d` : `${Math.abs(daysUntilDue)}d overdue`})
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
            <div className="h-2 rounded-full bg-slate-200/50 overflow-hidden">
              <div
                className="h-full bg-[#007AFF] transition-all duration-300"
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

      {/* Actions */}
      <div className="flex gap-2 border-t border-white/20 pt-4">
        <button
          onClick={() => onEdit(task)}
          className="flex-1 flex items-center justify-center gap-2 rounded-full bg-[#007AFF] px-3 py-2 text-xs font-semibold text-white transition-all duration-200 hover:brightness-110 active:scale-95"
        >
          <Edit2 size={14} />
          Edit
        </button>

        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="flex-1 flex items-center justify-center gap-2 rounded-full bg-red-500/20 px-3 py-2 text-xs font-semibold text-red-600 transition-all duration-200 hover:bg-red-500/30 active:scale-95 disabled:opacity-60"
        >
          <Trash2 size={14} />
          {isDeleting ? "…" : "Delete"}
        </button>
      </div>
    </div>
  );
}
