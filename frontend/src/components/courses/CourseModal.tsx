"use client";

import { createCourse, updateCourse } from "@/services/academic.service";
import type { Course, CoursePayload } from "@/types/academic";
import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import TextInput from "@/components/ui/TextInput";
import Modal from "@/components/ui/Modal";

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
  color: "#0A84FF",
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
    <Modal
      open={open}
      title={editing ? "Edit course" : "New course"}
      description={
        editing
          ? "Update course details."
          : "Create a course to organize tasks and deadlines."
      }
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Course name">
              <TextInput
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
                <TextInput
                  value={form.code}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, code: event.target.value }))
                  }
                  required
                  className="h-12 w-full rounded-[18px] border border-white/60 bg-white/55 px-4 text-slate-950 outline-none transition focus:bg-white/80"
                />
              </Field>

              <Field label="Credits">
                <TextInput
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
              <TextInput
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
              <TextInput
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
              <Button variant="glass" onClick={onClose}>
                Cancel
              </Button>

              <Button variant="primary" type="submit" disabled={saving}>
                {saving ? "Saving..." : editing ? "Save changes" : "Create course"}
              </Button>
            </div>
          </form>
        }
      </form>
    </Modal>
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