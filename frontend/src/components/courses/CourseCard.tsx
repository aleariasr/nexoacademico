"use client";

import type { Course } from "@/types/academic";
import { Edit2, Trash2 } from "lucide-react";
import { useState } from "react";

type CourseCardProps = {
  course: Course;
  onEdit: (course: Course) => void;
  onDelete: (id: number) => void;
};

export default function CourseCard({
  course,
  onEdit,
  onDelete,
}: CourseCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      onDelete(course.id);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="group rounded-[24px] border border-white/45 bg-white/30 p-4 shadow-sm transition-all duration-300 hover:border-white/60 hover:bg-white/40 hover:shadow-[0_20px_50px_rgba(15,23,42,0.1)]">
      {/* Color banner */}
      <div
        className="mb-5 h-24 rounded-[18px] transition-transform duration-300 group-hover:scale-105"
        style={{
          background:
            course.color ||
            "linear-gradient(135deg, rgba(0,122,255,.24), rgba(175,82,222,.18))",
        }}
      />

      {/* Course info */}
      <div className="mb-4">
        <p className="truncate font-semibold text-slate-950">
          {course.code} · {course.name}
        </p>

        <p className="mt-1 truncate text-sm text-slate-500">
          {course.professor || "No professor assigned"}
        </p>

        <p className="mt-2 text-sm font-medium text-slate-600">
          {course.credits} credits
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => onEdit(course)}
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
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
}
