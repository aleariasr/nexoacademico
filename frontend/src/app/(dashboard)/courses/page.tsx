"use client";

import CourseCard from "@/components/courses/CourseCard";
import CourseModal from "@/components/courses/CourseModal";
import DeleteCourseDialog from "@/components/courses/DeleteCourseDialog";
import { getCourses } from "@/services/academic.service";
import { getToken } from "@/services/auth.service";
import type { Course } from "@/types/academic";
import { Plus } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import EmptyState from "@/components/ui/EmptyState";
import GlassCard from "@/components/ui/GlassCard";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import LoadingState from "@/components/ui/LoadingState";
import SearchBar from "@/components/ui/SearchBar";

export default function CoursesPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const loadCourses = useCallback(async () => {
    try {
      const nextCourses = await getCourses();
      setCourses(nextCourses);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load courses");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = getToken();

    if (!token) {
      router.replace("/login");
      return;
    }

    const timeoutId = window.setTimeout(() => {
      void loadCourses();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadCourses, router]);

  const filteredCourses = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) {
      return courses;
    }

    return courses.filter((course) => {
      return (
        course.name.toLowerCase().includes(query) ||
        course.code.toLowerCase().includes(query) ||
        course.professor.toLowerCase().includes(query)
      );
    });
  }, [courses, searchTerm]);

  if (loading) {
    return <LoadingState label="Loading courses" />;
  }

  const handleDeleteCourse = (course: Course) => {
    setCourseToDelete(course);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    await loadCourses();
    setDeleteDialogOpen(false);
    setCourseToDelete(null);
  };

  return (
    <div className="flex w-full flex-col gap-6 pb-24 md:pb-0">
      <PageHeader title="Courses">
        <Button
          variant="primary"
          onClick={() => {
            setSelectedCourse(null);
            setCourseModalOpen(true);
          }}
        >
          <Plus size={18} strokeWidth={2.2} />
          New
        </Button>
      </PageHeader>

      {error && (
        <GlassCard className="p-5">
          <p className="font-semibold text-slate-950">Unable to load courses</p>
          <p className="mt-1 text-sm text-slate-500">{error}</p>
        </GlassCard>
      )}

      <GlassCard className="p-4 md:p-5">
        <div className="max-w-xl">
          <SearchBar
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>
      </GlassCard>

      <GlassCard className="p-6">
        <SectionHeader title="Your courses" />

        {filteredCourses.length > 0 ? (
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onEdit={(course) => {
                  setSelectedCourse(course);
                  setCourseModalOpen(true);
                }}
                onDelete={(id) => {
                  const courseToDelete = courses.find((item) => item.id === id);
                  if (courseToDelete) {
                    handleDeleteCourse(courseToDelete);
                  }
                }}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title={courses.length === 0 ? "No courses yet" : "No courses matching your search"}
            description={
              courses.length === 0
                ? "Create your first course to start organizing tasks."
                : "Try a different search term."
            }
          />
        )}
      </GlassCard>

      <CourseModal
        open={courseModalOpen}
        course={selectedCourse}
        onClose={() => {
          setCourseModalOpen(false);
          setSelectedCourse(null);
        }}
        onSaved={loadCourses}
      />

      <DeleteCourseDialog
        open={deleteDialogOpen}
        courseId={courseToDelete?.id ?? null}
        courseName={courseToDelete?.name ?? ""}
        onClose={() => {
          setDeleteDialogOpen(false);
          setCourseToDelete(null);
        }}
        onDeleted={handleConfirmDelete}
      />
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return <h2 className="text-xl font-semibold tracking-tight text-slate-950">{title}</h2>;
}
