"use client";

import { getCourses } from "@/services/academic.service";
import { getDashboard } from "@/services/dashboard.service";
import type { DashboardResponse } from "@/types/dashboard";
import type { AcademicTask, Course } from "@/types/academic";
import {
  Bell,
  BookOpen,
  CalendarDays,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  Plus,
  TrendingUp,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/services/auth.service";
import CourseModal from "@/components/courses/CourseModal";
import CourseCard from "@/components/courses/CourseCard";
import DeleteCourseDialog from "@/components/courses/DeleteCourseDialog";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import GlassCard from "@/components/ui/GlassCard";
import LoadingState from "@/components/ui/LoadingState";
import PageHeader from "@/components/ui/PageHeader";
import IconButton from "@/components/ui/IconButton";
import SectionHeader from "@/components/ui/SectionHeader";
import StatCard from "@/components/ui/StatCard";
import {
  MotionCard,
  MotionPage,
  MotionSection,
} from "@/components/motion";


type DashboardState = {
  dashboard: DashboardResponse | null;
  courses: Course[];
  loading: boolean;
  error: string | null;
};

const initialState: DashboardState = {
  dashboard: null,
  courses: [],
  loading: true,
  error: null,
};

export default function DashboardPage() {
  const [state, setState] = useState<DashboardState>(initialState);
  const router = useRouter();
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);
  const [calendarOffset, setCalendarOffset] = useState(0);

  const loadDashboard = useCallback(async () => {
    try {
      const [dashboard, courses] = await Promise.all([
        getDashboard(),
        getCourses(),
      ]);

      setState({
        dashboard,
        courses,
        loading: false,
        error: null,
      });
    } catch {
      router.replace("/login");
    }
  }, [router]);

  useEffect(() => {
    const token = getToken();

    if (!token) {
      router.replace("/login");
      return;
    }

    const timeoutId = window.setTimeout(() => {
      void loadDashboard();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [router, loadDashboard]);

  if (state.loading) {
    return <LoadingState label="Loading dashboard" />;
  }

  const dashboard = state.dashboard;

  const metrics = [
    {
      label: "Courses",
      value: dashboard ? String(dashboard.active_courses) : "—",
      detail: "Active courses",
      icon: BookOpen,
      tone: "blue",
    },
    {
      label: "Pending",
      value: dashboard ? String(dashboard.pending_tasks) : "—",
      detail: "Pending tasks",
      icon: CheckSquare,
      tone: "green",
    },
    {
      label: "Overdue",
      value: dashboard ? String(dashboard.overdue_tasks) : "—",
      detail: "Need attention",
      icon: CalendarDays,
      tone: "purple",
    },
    {
      label: "Completion",
      value: dashboard ? `${Math.round(dashboard.completion_rate)}%` : "—",
      detail: "Task progress",
      icon: TrendingUp,
      tone: "blue",
    },
  ];

  const handleDeleteCourse = (course: Course) => {
    setCourseToDelete(course);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (courseToDelete) {
      await loadDashboard();
      setDeleteDialogOpen(false);
      setCourseToDelete(null);
    }
  };

  return (
    <MotionPage className="flex w-full flex-col gap-6 pb-24 md:pb-0">
      <MotionCard hover={false} tap={false}>
        <PageHeader title="Dashboard">
          <div className="hidden items-center gap-3 md:flex">
            <Button
              variant="glass"
              size="icon"
              aria-label="Open notifications"
              onClick={() => router.push("/tasks")}
            >
              <Bell size={21} strokeWidth={2} />
            </Button>

            <Button
              variant="primary"
              onClick={() => {
                setSelectedCourse(null);
                setCourseModalOpen(true);
              }}
            >
              <Plus size={18} strokeWidth={2.2} />
              Add
            </Button>
          </div>
        </PageHeader>
      </MotionCard>

      {state.error && (
        <MotionCard>
          <GlassCard className="p-5">
            <p className="font-semibold text-slate-950">Backend not connected</p>
            <p className="mt-1 text-sm text-slate-500">{state.error}</p>
          </GlassCard>
        </MotionCard>
      )}

      <MotionSection
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {metrics.map((metric) => (
          <StatCard
            key={metric.label}
            label={metric.label}
            value={metric.value}
            detail={metric.detail}
            icon={metric.icon}
            tone={metric.tone as "blue" | "green" | "purple"}
          />
        ))}
      </MotionSection>

      <MotionSection
        className="grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_390px]"
      >
        <MotionCard>
          <GlassCard className="min-h-[330px] p-6">
            <SectionHeader title="Upcoming tasks" />

            {dashboard?.upcoming_tasks.length ? (
              <div className="mt-5 divide-y divide-slate-900/8">
                {dashboard.upcoming_tasks.map((task) => (
                  <TaskRow key={task.id} task={task} />
                ))}
              </div>
            ) : (
              <EmptyState
                title={state.loading ? "Loading tasks" : "No upcoming tasks"}
                description={
                  state.loading
                    ? "Fetching your academic workload."
                    : "Upcoming tasks from your backend will appear here."
                }
              />
            )}
          </GlassCard>
        </MotionCard>

        <MotionCard delay={0.08}>
          <GlassCard className="p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold tracking-tight text-slate-950">
                  Calendar
                </h2>
                <p className="mt-1 text-sm text-slate-500">Upcoming events</p>
              </div>

              <div className="flex gap-2">
                <IconButton
                  aria-label="Previous calendar period"
                  onClick={() => setCalendarOffset((value) => value - 1)}
                >
                  <ChevronLeft size={19} />
                </IconButton>
                <IconButton
                  aria-label="Next calendar period"
                  onClick={() => setCalendarOffset((value) => value + 1)}
                >
                  <ChevronRight size={19} />
                </IconButton>
              </div>
            </div>

            <p className="mb-4 text-sm text-slate-500">
              {calendarOffset === 0
                ? "Showing the next deadlines"
                : calendarOffset > 0
                  ? `Shifted ${calendarOffset} period${calendarOffset === 1 ? "" : "s"} forward`
                  : `Shifted ${Math.abs(calendarOffset)} period${Math.abs(calendarOffset) === 1 ? "" : "s"} back`}
            </p>

            {dashboard?.upcoming_tasks.length ? (
              <div className="space-y-3">
                {dashboard.upcoming_tasks.slice(0, 4).map((task) => (
                  <div
                    key={task.id}
                    className="rounded-[20px] bg-white/24 p-4 ring-1 ring-white/40"
                  >
                    <p className="font-semibold text-slate-950">{task.title}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {formatDate(task.due_date)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No calendar events"
                description="Deadlines and exams will appear here."
              />
            )}
          </GlassCard>
        </MotionCard>
      </MotionSection>

      <MotionCard delay={0.14}>
        <GlassCard className="p-6">
          <SectionHeader title="Courses" />

          {state.courses.length ? (
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {state.courses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onEdit={(course) => {
                    setSelectedCourse(course);
                    setCourseModalOpen(true);
                  }}
                  onDelete={(id) => {
                    const courseToDelete = state.courses.find(c => c.id === id);
                    if (courseToDelete) {
                      handleDeleteCourse(courseToDelete);
                    }
                  }}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title={state.loading ? "Loading courses" : "No courses yet"}
              description={
                state.loading
                  ? "Fetching your active courses."
                  : "Courses created in your backend will appear here."
              }
            />
          )}
        </GlassCard>
      </MotionCard>
      <CourseModal
        open={courseModalOpen}
        course={selectedCourse}
        onClose={() => {
          setCourseModalOpen(false);
          setSelectedCourse(null);
        }}
        onSaved={loadDashboard}
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
    </MotionPage>
  );
}

function TaskRow({ task }: { task: AcademicTask }) {
  return (
    <div className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] bg-[var(--primary)]/10 text-[var(--primary)]">
        <CheckSquare size={22} strokeWidth={2.1} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-slate-950">{task.title}</p>
        <p className="mt-1 truncate text-sm text-slate-500">
          {task.course_name || "No course"}
        </p>
      </div>

      <p className="shrink-0 text-sm font-medium text-slate-600">
        {formatDate(task.due_date)}
      </p>
    </div>
  );
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "No date";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  }).format(date);
}
