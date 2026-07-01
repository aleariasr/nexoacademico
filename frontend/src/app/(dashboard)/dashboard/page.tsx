"use client";

import CourseCard from "@/components/courses/CourseCard";
import { MotionCard, MotionPage, MotionSection } from "@/components/motion";
import EmptyState from "@/components/ui/EmptyState";
import GlassCard from "@/components/ui/GlassCard";
import LoadingState from "@/components/ui/LoadingState";
import PageHeader from "@/components/ui/PageHeader";
import SectionHeader from "@/components/ui/SectionHeader";
import StatCard from "@/components/ui/StatCard";
import { getCourses } from "@/services/academic.service";
import { getStoredUser, getToken, type User } from "@/services/auth.service";
import { getDashboard } from "@/services/dashboard.service";
import type { AcademicTask, Course } from "@/types/academic";
import type { DashboardResponse } from "@/types/dashboard";
import { BookOpen, CheckSquare, Clock3 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

type DashboardState = {
  dashboard: DashboardResponse | null;
  courses: Course[];
  loading: boolean;
  error: string | null;
};

type DashboardMetric = {
  label: string;
  value: string;
  detail: string;
  icon: React.ElementType;
  tone: "blue" | "green" | "purple";
  href: string | null;
};

const initialState: DashboardState = {
  dashboard: null,
  courses: [],
  loading: true,
  error: null,
};

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [state, setState] = useState<DashboardState>(initialState);

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
    } catch (error) {
      setState((current) => ({
        ...current,
        loading: false,
        error:
          error instanceof Error ? error.message : "Could not load dashboard.",
      }));
    }
  }, []);

  useEffect(() => {
    const token = getToken();

    if (!token) {
      router.replace("/login");
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setUser(getStoredUser());
      void loadDashboard();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [router, loadDashboard]);

  if (state.loading) {
    return <LoadingState label="Loading dashboard" />;
  }

  const dashboard = state.dashboard;
  const isAdmin = user?.role === "admin";

  const metrics: DashboardMetric[] = isAdmin
    ? [
        {
          label: "Courses",
          value: dashboard ? String(dashboard.active_courses) : "—",
          detail: "Managed courses",
          icon: BookOpen,
          tone: "blue",
          href: "/courses",
        },
      ]
    : [
        {
          label: "Courses",
          value: dashboard ? String(dashboard.active_courses) : "—",
          detail: "Available courses",
          icon: BookOpen,
          tone: "blue",
          href: "/courses",
        },
        {
          label: "Assignments",
          value: dashboard ? String(dashboard.pending_tasks) : "—",
          detail: "Pending assignments",
          icon: CheckSquare,
          tone: "green",
          href: "/tasks",
        },
        {
          label: "Overdue",
          value: dashboard ? String(dashboard.overdue_tasks) : "—",
          detail: "Past due date",
          icon: Clock3,
          tone: "purple",
          href: null,
        },
      ];

  return (
    <MotionPage className="flex w-full flex-col gap-6 pb-24 md:pb-0">
      <MotionCard hover={false} tap={false}>
        <PageHeader
          eyebrow={user?.role ? user.role.toUpperCase() : "WORKSPACE"}
          title="Dashboard"
        />
      </MotionCard>

      {state.error && (
        <MotionCard>
          <GlassCard className="p-5">
            <p className="font-semibold text-slate-950">Backend not connected</p>
            <p className="mt-1 text-sm text-slate-500">{state.error}</p>
          </GlassCard>
        </MotionCard>
      )}

      <MotionSection className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {metrics.map((metric) => {
          const content = (
            <StatCard
              label={metric.label}
              value={metric.value}
              detail={metric.detail}
              icon={metric.icon}
              tone={metric.tone}
            />
          );

          if (!metric.href) {
            return (
              <div key={metric.label} className="cursor-default">
                {content}
              </div>
            );
          }

          return (
            <button
              key={metric.label}
              type="button"
              onClick={() => router.push(metric.href as string)}
              className="text-left"
            >
              {content}
            </button>
          );
        })}
      </MotionSection>

      {!isAdmin && (
        <MotionCard>
          <GlassCard className="min-h-[260px] p-6">
            <SectionHeader title="Upcoming assignments" />

            {dashboard?.upcoming_tasks.length ? (
              <div className="mt-5 divide-y divide-slate-900/8">
                {dashboard.upcoming_tasks.map((task) => (
                  <TaskRow
                    key={task.id}
                    task={task}
                    onOpen={() => router.push(`/tasks?task=${task.id}`)}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No upcoming assignments"
                description="Assignments from your courses will appear here."
              />
            )}
          </GlassCard>
        </MotionCard>
      )}

      <MotionCard>
        <GlassCard className="p-6">
          <SectionHeader title={isAdmin ? "Managed courses" : "My courses"} />

          {state.courses.length ? (
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {state.courses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  canManage={false}
                  canEnroll={false}
                  onEdit={() => undefined}
                  onDelete={() => undefined}
                  onOpen={(course) => router.push(`/courses/${course.id}`)}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No courses"
              description={
                isAdmin
                  ? "Create courses from the Courses page."
                  : "Your enrolled or assigned courses will appear here."
              }
            />
          )}
        </GlassCard>
      </MotionCard>
    </MotionPage>
  );
}

function TaskRow({
  task,
  onOpen,
}: {
  task: AcademicTask;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex w-full items-center gap-4 py-4 text-left first:pt-0 last:pb-0"
    >
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
    </button>
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