"use client";

import { createTask, updateTask, getTaskTypes } from "@/services/academic.service";
import type { AcademicTask, TaskPayload, TaskType, Course } from "@/types/academic";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

type TaskModalProps = {
  open: boolean;
  task?: AcademicTask | null;
  courses: Course[];
  onClose: () => void;
  onSaved: () => void;
};

const initialForm: TaskPayload = {
  course: 0,
  task_type: 0,
  title: "",
  description: "",
  due_date: "",
  priority: "medium",
  status: "pending",
  progress_percentage: 0,
};

export default function TaskModal({
  open,
  task = null,
  courses,
  onClose,
  onSaved,
}: TaskModalProps) {
  const [form, setForm] = useState<TaskPayload>(initialForm);
  const [taskTypes, setTaskTypes] = useState<TaskType[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingTypes, setLoadingTypes] = useState(true);

  const editing = Boolean(task);

  useEffect(() => {
    const loadTaskTypes = async () => {
      try {
        const types = await getTaskTypes();
        setTaskTypes(types);
      } catch (err) {
        console.error("Failed to load task types:", err);
      } finally {
        setLoadingTypes(false);
      }
    };

    if (open && taskTypes.length === 0 && loadingTypes) {
      loadTaskTypes();
    }
  }, [open, taskTypes.length, loadingTypes]);

  useEffect(() => {
    if (!open) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setError(null);

    if (task) {
      setForm({
        course: task.course,
        task_type: task.task_type,
        title: task.title,
        description: task.description,
        due_date: task.due_date,
        priority: task.priority,
        status: task.status,
        progress_percentage: task.progress_percentage,
        reminder_at: task.reminder_at,
        weight_percentage: task.weight_percentage,
        grade: task.grade,
      });
    } else {
      setForm(initialForm);
    }
  }, [open, task]);

  if (!open) return null;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (task) {
        await updateTask(task.id, form);
      } else {
        await createTask(form);
      }

      onSaved();
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not save task.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 px-4 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-2xl rounded-[32px] border border-white/50 bg-white/70 p-6 shadow-[0_30px_120px_rgba(15,23,42,0.24)] backdrop-blur-2xl my-8">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
              {editing ? "Edit task" : "New task"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {editing
                ? "Update task details and progress."
                : "Create a new academic task to track progress."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/55 text-slate-700 ring-1 ring-white/60 transition hover:bg-white/80"
          >
            <X size={19} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Course" required>
              <select
                value={form.course}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    course: Number(event.target.value),
                  }))
                }
                required
                className="h-12 w-full rounded-[18px] border border-white/60 bg-white/55 px-4 text-slate-950 outline-none transition focus:bg-white/80"
              >
                <option value="">Select a course</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.code} - {course.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Type" required>
              <select
                value={form.task_type}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    task_type: Number(event.target.value),
                  }))
                }
                required
                disabled={loadingTypes}
                className="h-12 w-full rounded-[18px] border border-white/60 bg-white/55 px-4 text-slate-950 outline-none transition focus:bg-white/80 disabled:opacity-50"
              >
                <option value="">{loadingTypes ? "Loading..." : "Select type"}</option>
                {taskTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Title" required>
            <input
              value={form.title}
              onChange={(event) =>
                setForm((current) => ({ ...current, title: event.target.value }))
              }
              required
              className="h-12 w-full rounded-[18px] border border-white/60 bg-white/55 px-4 text-slate-950 outline-none transition focus:bg-white/80"
            />
          </Field>

          <Field label="Description">
            <textarea
              value={form.description}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
              rows={3}
              className="w-full rounded-[18px] border border-white/60 bg-white/55 px-4 py-3 text-slate-950 outline-none transition focus:bg-white/80"
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Due Date" required>
              <input
                type="date"
                value={form.due_date}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    due_date: event.target.value,
                  }))
                }
                required
                className="h-12 w-full rounded-[18px] border border-white/60 bg-white/55 px-4 text-slate-950 outline-none transition focus:bg-white/80"
              />
            </Field>

            <Field label="Priority" required>
              <select
                value={form.priority}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    priority: event.target.value as TaskPayload["priority"],
                  }))
                }
                required
                className="h-12 w-full rounded-[18px] border border-white/60 bg-white/55 px-4 text-slate-950 outline-none transition focus:bg-white/80"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Status">
              <select
                value={form.status}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    status: event.target.value as TaskPayload["status"],
                  }))
                }
                className="h-12 w-full rounded-[18px] border border-white/60 bg-white/55 px-4 text-slate-950 outline-none transition focus:bg-white/80"
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </Field>

            <Field label="Progress (%)">
              <input
                type="number"
                min={0}
                max={100}
                value={form.progress_percentage}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    progress_percentage: Number(event.target.value),
                  }))
                }
                className="h-12 w-full rounded-[18px] border border-white/60 bg-white/55 px-4 text-slate-950 outline-none transition focus:bg-white/80"
              />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Grade">
              <input
                value={form.grade || ""}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    grade: event.target.value || null,
                  }))
                }
                placeholder="e.g., A, 95, 4.0"
                className="h-12 w-full rounded-[18px] border border-white/60 bg-white/55 px-4 text-slate-950 outline-none transition focus:bg-white/80"
              />
            </Field>

            <Field label="Weight (%)">
              <input
                value={form.weight_percentage || ""}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    weight_percentage: event.target.value || null,
                  }))
                }
                placeholder="e.g., 20"
                className="h-12 w-full rounded-[18px] border border-white/60 bg-white/55 px-4 text-slate-950 outline-none transition focus:bg-white/80"
              />
            </Field>
          </div>

          {error && (
            <p className="rounded-[18px] bg-red-500/15 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 border-t border-white/20 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="h-11 rounded-full bg-white/55 px-5 text-sm font-semibold text-slate-700 ring-1 ring-white/60 transition hover:bg-white/80"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="h-11 rounded-full bg-[#007AFF] px-5 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(0,122,255,0.24)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving..." : editing ? "Save changes" : "Create task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
  required = false,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-600">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </span>
      {children}
    </label>
  );
}
