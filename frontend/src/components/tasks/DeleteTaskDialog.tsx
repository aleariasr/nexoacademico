"use client";

import { deleteTask } from "@/services/academic.service";
import { AlertTriangle, X } from "lucide-react";
import { useState } from "react";

type DeleteTaskDialogProps = {
  open: boolean;
  taskId: number | null;
  taskTitle: string;
  onClose: () => void;
  onDeleted: () => void;
};

export default function DeleteTaskDialog({
  open,
  taskId,
  taskTitle,
  onClose,
  onDeleted,
}: DeleteTaskDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open || !taskId) return null;

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      await deleteTask(taskId);
      onDeleted();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete task.");
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 px-4 backdrop-blur-md">
      <div className="w-full max-w-md rounded-[32px] border border-white/50 bg-white/70 p-6 shadow-[0_30px_120px_rgba(15,23,42,0.24)] backdrop-blur-2xl">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="flex gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-500/15">
              <AlertTriangle size={24} className="text-red-600" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-950">
                Delete &quot;{taskTitle}&quot;?
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                This action cannot be undone. The task will be permanently deleted.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/55 text-slate-700 ring-1 ring-white/60 transition hover:bg-white/80 disabled:opacity-50"
          >
            <X size={19} />
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 rounded-[18px] bg-red-500/15 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 h-11 rounded-full bg-white/55 px-5 text-sm font-semibold text-slate-700 ring-1 ring-white/60 transition hover:bg-white/80 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleConfirmDelete}
            disabled={isDeleting}
            className="flex-1 h-11 rounded-full bg-red-500 px-5 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(239,68,68,0.24)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
