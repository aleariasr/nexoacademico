"use client";

import { createCourse, updateCourse } from "@/services/academic.service";
import type { Course, CoursePayload } from "@/types/academic";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

type CourseModalProps = {
  open: boolean;
  course?: Course | null;
  onClose: () => void;
  onSaved: () => void;
};

const initialForm: CoursePayload = {
  name: "",
  code: "",
  professor: "",
  credits: 3,
  color: "#007AFF",
  status: "active",
};

export default function CourseModal({
  open,
  course = null,
  onClose,
  onSaved,
}: CourseModalProps) {
  const [form, setForm] = useState<CoursePayload>(initialForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editing = Boolean(course);

  useEffect(() => {
    if (!open) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setError(null);

    if (course) {
      setForm({
        name: course.name,
        code: course.code,
        professor: course.professor,
        credits: course.credits,
        color: course.color,
        status: course.status,
      });
    } else {
      setForm(initialForm);
    }
  }, [open, course]);

  if (!open) return null;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (course) {
        await updateCourse(course.id, form);
      } else {
        await createCourse(form);
      }

      onSaved();
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not save course.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 px-4 backdrop-blur-md">
      <div className="w-full max-w-xl rounded-[32px] border border-white/50 bg-white/70 p-6 shadow-[0_30px_120px_rgba(15,23,42,0.24)] backdrop-blur-2xl">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
              {editing ? "Edit course" : "New course"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {editing
                ? "Update course details."
                : "Create a course to organize tasks and deadlines."}
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Course name">
            <input
              value={form.name}
              onChange={(event) =>
                setForm((current) => ({ ...current, name: event.target.value }))
              }
              required
              className="h-12 w-full rounded-[18px] border border-white/60 bg-white/55 px-4 text-slate-950 outline-none transition focus:bg-white/80"
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Code">
              <input
                value={form.code}
                onChange={(event) =>
                  setForm((current) => ({ ...current, code: event.target.value }))
                }
                required
                className="h-12 w-full rounded-[18px] border border-white/60 bg-white/55 px-4 text-slate-950 outline-none transition focus:bg-white/80"
              />
            </Field>

            <Field label="Credits">
              <input
                type="number"
                min={1}
                max={12}
                value={form.credits}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    credits: Number(event.target.value),
                  }))
                }
                required
                className="h-12 w-full rounded-[18px] border border-white/60 bg-white/55 px-4 text-slate-950 outline-none transition focus:bg-white/80"
              />
            </Field>
          </div>

          <Field label="Professor">
            <input
              value={form.professor}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  professor: event.target.value,
                }))
              }
              className="h-12 w-full rounded-[18px] border border-white/60 bg-white/55 px-4 text-slate-950 outline-none transition focus:bg-white/80"
            />
          </Field>

          <Field label="Color">
            <input
              type="color"
              value={form.color}
              onChange={(event) =>
                setForm((current) => ({ ...current, color: event.target.value }))
              }
              className="h-12 w-full cursor-pointer rounded-[18px] border border-white/60 bg-white/55 px-3"
            />
          </Field>

          {error && (
            <p className="rounded-[18px] bg-red-500/15 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-2">
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
              {saving
                ? "Saving..."
                : editing
                  ? "Save changes"
                  : "Create course"}
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
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-600">
        {label}
      </span>
      {children}
    </label>
  );
}