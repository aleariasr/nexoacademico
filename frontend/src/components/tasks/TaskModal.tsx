"use client";

import { createTask, updateTask, getTaskTypes } from "@/services/academic.service";
import type { AcademicTask, TaskPayload, TaskType, Course } from "@/types/academic";
import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import TextInput from "@/components/ui/TextInput";
import Select from "@/components/ui/Select";
import Modal from "@/components/ui/Modal";

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
        due_date: task.due_date.slice(0, 10),
        priority: task.priority,
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
      <Modal
        open={open}
        title={editing ? "Edit assignment" : "New assignment"}
        description={
          editing
            ? "Update task details and progress."
            : "Create an assignment for the selected course."
        }
        onClose={onClose}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="max-h-[70vh] space-y-4 overflow-y-auto">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Course" required>
              <Select
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
              </Select>
            </Field>

            <Field label="Type" required>
              <Select
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
              </Select>
            </Field>
          </div>

          <Field label="Title" required>
            <TextInput
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
              <TextInput
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
          </div>
          {error && (
            <p className="rounded-[18px] bg-red-500/15 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 border-t border-white/20 pt-6">
            <Button variant="glass" onClick={onClose}>
              Cancel
            </Button>

            <Button variant="primary" type="submit" disabled={saving}>
              {saving ? "Saving..." : editing ? "Save changes" : "Create assignment"}
            </Button>
          </div>
        </form>
      </Modal>
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
