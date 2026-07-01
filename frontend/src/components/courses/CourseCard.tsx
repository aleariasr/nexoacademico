"use client";

import Button from "@/components/ui/Button";
import GlassCard from "@/components/ui/GlassCard";
import type { Course } from "@/types/academic";
import { motion } from "framer-motion";
import { Edit2, UserPlus, Trash2 } from "lucide-react";
import { useState } from "react";

type CourseCardProps = {
  course: Course;
  canManage?: boolean;
  canEnroll?: boolean;
  onEdit: (course: Course) => void;
  onDelete: (id: number) => void;
  onEnroll?: (course: Course) => void;
  onOpen?: (course: Course) => void;
};

export default function CourseCard({
  course,
  canManage = true,
  canEnroll = false,
  onEdit,
  onDelete,
  onEnroll,
  onOpen,
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
    <motion.article
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: "spring", stiffness: 360, damping: 30 }}
      onClick={() => onOpen?.(course)}
      className="cursor-pointer"
    >
      <GlassCard className="group p-4">
        <div
          className="relative mb-5 h-24 overflow-hidden rounded-[var(--radius-md)]"
          style={{
            background:
              course.color ||
              "linear-gradient(135deg, rgba(10,132,255,.28), rgba(175,82,222,.18))",
          }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_12%,rgba(255,255,255,0.58),transparent_32%),linear-gradient(135deg,rgba(255,255,255,0.24),transparent_54%)]" />
          <div className="absolute inset-x-4 top-0 h-px bg-white/70" />
        </div>

        <div className="mb-5 min-w-0">
          <p className="truncate text-base font-semibold tracking-[-0.015em] text-slate-950">
            {course.code} · {course.name}
          </p>

          <p className="mt-1 truncate text-sm text-slate-500">
            {course.professor || "No professor assigned"}
          </p>

          <p className="mt-3 inline-flex rounded-full bg-white/38 px-3 py-1 text-xs font-semibold text-slate-600 ring-1 ring-white/45">
            {course.credits} credits
          </p>
          {course.professor_username && (
            <p className="mt-2 text-xs font-medium text-slate-500">
              Assigned to {course.professor_username}
            </p>
          )}
        </div>
        
        {(canManage || canEnroll) && (
          <div className="flex gap-2 border-t border-white/30 pt-4">
            {canManage && (
              <>
                <Button
                  variant="primary"
                  className="h-9 flex-1 px-3 text-xs"
                  onClick={() => onEdit(course)}
                >
                  <Edit2 size={14} />
                  Edit
                </Button>

                <Button
                  variant="glass"
                  className="h-9 flex-1 px-3 text-xs text-red-600 hover:bg-red-500/15"
                  onClick={(event) => {
                    event.stopPropagation();
                    void handleDelete();
                  }}
                  disabled={isDeleting}
                >
                  <Trash2 size={14} />
                  {isDeleting ? "Deleting..." : "Delete"}
                </Button>
              </>
            )}

            {canEnroll && (
              <Button
                variant="glass"
                className="h-9 flex-1 px-3 text-xs"
                onClick={(event) => {
                  event.stopPropagation();
                  onEnroll?.(course);
                }}
              >
                <UserPlus size={14} />
                Enroll
              </Button>
            )}
          </div>
        )}
      </GlassCard>
    </motion.article>
  );
}