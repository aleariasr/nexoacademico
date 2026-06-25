"use client";

import AppShell from "@/components/layout/AppShell";
import {
  Bell,
  BookOpen,
  CalendarDays,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  Inbox,
  Plus,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState, type ElementType } from "react";

type DashboardResponse = {
  active_courses: number;
  pending_tasks: number;
  in_progress_tasks: number;
  completed_tasks: number;
  overdue_tasks: number;
  completion_rate: number;
  upcoming_tasks: AcademicTask[];
};

type Course = {
  id: number;
  name: string;
  code: string;
  professor: string;
  credits: number;
  color: string;
  status: string;
};

type AcademicTask = {
  id: number;
  title: string;
  description?: string;
  due_date: string;
  priority: "low" | "medium" | "high" | "critical";
  status: "pending" | "in_progress" | "completed" | "cancelled";
  progress_percentage: number;
  course?: number | Course;
  course_name?: string;
  task_type_name?: string;
};

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

function getToken() {
  return (
    localStorage.getItem("token") ??
    localStorage.getItem("authToken") ??
    localStorage.getItem("nexo_token")
  );
}

async function apiGet<T>(path: string, token: string): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured.");
  }

  const response = await fetch(`${baseUrl}${path}`, {
    headers: {
      Authorization: `Token ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return (await response.json()) as T;
}

export default function DashboardPage() {
  const [state, setState] = useState<DashboardState>(initialState);

  useEffect(() => {
    async function loadDashboard() {
      const token = getToken();

      if (!token) {
        setState({
          dashboard: null,
          courses: [],
          loading: false,
          error: "No authentication token found.",
        });
        return;
      }

      try {
        const [dashboard, courses] = await Promise.all([
          apiGet<DashboardResponse>("/dashboard/", token),
          apiGet<Course[]>("/courses/", token),
        ]);

        setState({
          dashboard,
          courses,
          loading: false,
          error: null,
        });
      } catch {
        setState({
          dashboard: null,
          courses: [],
          loading: false,
          error: "Could not load dashboard data.",
        });
      }
    }

    loadDashboard();
  }, []);

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

  return (
    <AppShell>
      <div className="flex w-full flex-col gap-6 pb-24 md:pb-0">
        <header className="flex items-center justify-between gap-6">
          <div>
            <p className="text-base font-medium text-slate-500">
              Academic workspace
            </p>
            <h1 className="mt-1 text-3xl font-semibold tracking-[-0.035em] text-slate-950 md:text-[42px]">
              Dashboard
            </h1>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <button className="relative flex h-11 w-11 items-center justify-center rounded-full bg-white/38 text-slate-800 shadow-sm ring-1 ring-white/50 transition hover:bg-white/60">
              <Bell size={21} strokeWidth={2} />
            </button>

            <button className="flex h-11 items-center gap-2 rounded-full bg-[#007AFF] px-4 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(0,122,255,0.22)] transition hover:brightness-105">
              <Plus size={18} strokeWidth={2.2} />
              Add
            </button>
          </div>
        </header>

        {state.error && (
          <GlassCard className="p-5">
            <p className="font-semibold text-slate-950">Backend not connected</p>
            <p className="mt-1 text-sm text-slate-500">{state.error}</p>
          </GlassCard>
        )}

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <MetricCard key={metric.label} metric={metric} loading={state.loading} />
          ))}
        </section>

        <section className="grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_390px]">
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

          <GlassCard className="p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold tracking-tight text-slate-950">
                  Calendar
                </h2>
                <p className="mt-1 text-sm text-slate-500">Upcoming events</p>
              </div>

              <div className="flex gap-2">
                <IconButton>
                  <ChevronLeft size={19} />
                </IconButton>
                <IconButton>
                  <ChevronRight size={19} />
                </IconButton>
              </div>
            </div>

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
        </section>

        <GlassCard className="p-6">
          <SectionHeader title="Courses" />

          {state.courses.length ? (
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {state.courses.map((course) => (
                <div
                  key={course.id}
                  className="rounded-[24px] bg-white/30 p-4 ring-1 ring-white/45"
                >
                  <div
                    className="mb-5 h-24 rounded-[18px]"
                    style={{
                      background:
                        course.color ||
                        "linear-gradient(135deg, rgba(0,122,255,.24), rgba(175,82,222,.18))",
                    }}
                  />

                  <p className="truncate font-semibold text-slate-950">
                    {course.code} · {course.name}
                  </p>

                  <p className="mt-1 truncate text-sm text-slate-500">
                    {course.professor || "No professor assigned"}
                  </p>

                  <p className="mt-4 text-sm font-medium text-slate-600">
                    {course.credits} credits
                  </p>
                </div>
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
      </div>
    </AppShell>
  );
}

function TaskRow({ task }: { task: AcademicTask }) {
  return (
    <div className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] bg-[#007AFF]/10 text-[#007AFF]">
        <CheckSquare size={22} strokeWidth={2.1} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-slate-950">{task.title}</p>
        <p className="mt-1 truncate text-sm text-slate-500">
          {getCourseLabel(task)}
        </p>
      </div>

      <p className="shrink-0 text-sm font-medium text-slate-600">
        {formatDate(task.due_date)}
      </p>
    </div>
  );
}

function getCourseLabel(task: AcademicTask) {
  if (task.course_name) return task.course_name;

  if (typeof task.course === "object" && task.course?.name) {
    return task.course.name;
  }

  return "No course";
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

function MetricCard({
  metric,
  loading,
}: {
  metric: {
    label: string;
    value: string;
    detail: string;
    icon: ElementType;
    tone: string;
  };
  loading: boolean;
}) {
  const Icon = metric.icon;

  return (
    <GlassCard className="min-h-[128px] p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{metric.label}</p>
          <p className="mt-2 text-[34px] font-semibold leading-none tracking-tight text-slate-950">
            {loading ? "…" : metric.value}
          </p>
          <p className="mt-2 text-sm text-slate-500">{metric.detail}</p>
        </div>

        <div
          className={`
            flex h-11 w-11 shrink-0 items-center justify-center rounded-[15px]
            ${
              metric.tone === "green"
                ? "bg-emerald-400/12 text-emerald-600"
                : metric.tone === "purple"
                  ? "bg-purple-400/12 text-purple-600"
                  : "bg-[#007AFF]/12 text-[#007AFF]"
            }
          `}
        >
          <Icon size={22} strokeWidth={2.1} />
        </div>
      </div>
    </GlassCard>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <h2 className="text-xl font-semibold tracking-tight text-slate-950">
      {title}
    </h2>
  );
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mt-5 flex min-h-[190px] flex-col items-center justify-center rounded-[24px] border border-dashed border-slate-400/30 bg-white/18 px-6 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/35 text-slate-500 shadow-sm">
        <Inbox size={22} strokeWidth={2} />
      </div>

      <p className="font-semibold text-slate-950">{title}</p>
      <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
}

function GlassCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`
        rounded-[28px]
        border
        border-white/45
        bg-white/28
        shadow-[0_16px_48px_rgba(15,23,42,0.055)]
        backdrop-blur-[24px]
        backdrop-saturate-[160%]
        ${className}
      `}
    >
      {children}
    </div>
  );
}

function IconButton({ children }: { children: React.ReactNode }) {
  return (
    <button className="flex h-9 w-9 items-center justify-center rounded-full bg-white/35 text-slate-700 shadow-sm ring-1 ring-white/45 transition hover:bg-white/55">
      {children}
    </button>
  );
}