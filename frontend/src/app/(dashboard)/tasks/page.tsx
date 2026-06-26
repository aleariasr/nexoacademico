"use client";

import AppShell from "@/components/layout/AppShell";
import TaskCard from "@/components/tasks/TaskCard";
import DeleteTaskDialog from "@/components/tasks/DeleteTaskDialog";
import TaskModal from "@/components/tasks/TaskModal";
import { getTasks } from "@/services/academic.service";
import { getCourses } from "@/services/dashboard.service";
import type { AcademicTask, Course } from "@/types/academic";
import { Plus, Search, Inbox } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/services/auth.service";

type TasksState = {
  tasks: AcademicTask[];
  courses: Course[];
  loading: boolean;
  error: string | null;
};

const initialState: TasksState = {
  tasks: [],
  courses: [],
  loading: true,
  error: null,
};

export default function TasksPage() {
  const [state, setState] = useState<TasksState>(initialState);
  const router = useRouter();
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<AcademicTask | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<AcademicTask | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<AcademicTask["status"] | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<AcademicTask["priority"] | "all">("all");

  const loadTasks = useCallback(async () => {
    try {
      const [tasks, courses] = await Promise.all([
        getTasks(),
        getCourses(),
      ]);

      setState({
        tasks,
        courses,
        loading: false,
        error: null,
      });
    } catch (err) {
      setState((current) => ({
        ...current,
        error: err instanceof Error ? err.message : "Failed to load tasks",
        loading: false,
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
      void loadTasks();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [router, loadTasks]);

  if (state.loading) {
    return null;
  }

  const handleDeleteTask = (task: AcademicTask) => {
    setTaskToDelete(task);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (taskToDelete) {
      await loadTasks();
      setDeleteDialogOpen(false);
      setTaskToDelete(null);
    }
  };

  // Filter tasks
  let filteredTasks = state.tasks.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
      task.course_name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || task.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Sort by due date
  filteredTasks = filteredTasks.sort((a, b) => {
    return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
  });

  return (
    <AppShell>
      <div className="flex w-full flex-col gap-6 pb-24 md:pb-0">
        {/* Header */}
        <header className="flex items-center justify-between gap-6">
          <div>
            <p className="text-base font-medium text-slate-500">
              Academic workspace
            </p>
            <h1 className="mt-1 text-3xl font-semibold tracking-[-0.035em] text-slate-950 md:text-[42px]">
              Tasks
            </h1>
          </div>

          <button
            onClick={() => {
              setSelectedTask(null);
              setTaskModalOpen(true);
            }}
            className="flex h-11 items-center gap-2 rounded-full bg-[#007AFF] px-4 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(0,122,255,0.22)] transition hover:brightness-105"
          >
            <Plus size={18} strokeWidth={2.2} />
            New
          </button>
        </header>

        {state.error && (
          <GlassCard className="p-5">
            <p className="font-semibold text-slate-950">Error loading tasks</p>
            <p className="mt-1 text-sm text-slate-500">{state.error}</p>
          </GlassCard>
        )}

        {/* Search and filters */}
        <GlassCard className="p-4 md:p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-6">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-11 w-full rounded-[18px] border border-white/60 bg-white/55 pl-11 pr-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:bg-white/80"
              />
            </div>

            <div className="flex gap-3">
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value as AcademicTask["status"] | "all"
                  )
                }
                className="h-11 rounded-[18px] border border-white/60 bg-white/55 px-4 text-sm text-slate-950 outline-none transition focus:bg-white/80"
              >
                <option value="all">All status</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <select
                value={priorityFilter}
                onChange={(e) =>
                  setPriorityFilter(
                    e.target.value as AcademicTask["priority"] | "all"
                  )
                }
                className="h-11 rounded-[18px] border border-white/60 bg-white/55 px-4 text-sm text-slate-950 outline-none transition focus:bg-white/80"
              >
                <option value="all">All priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          {(filteredTasks.length > 0 || searchTerm || statusFilter !== "all" || priorityFilter !== "all") && (
            <p className="mt-4 text-sm text-slate-500">
              {filteredTasks.length} task{filteredTasks.length !== 1 ? "s" : ""} found
            </p>
          )}
        </GlassCard>

        {/* Tasks grid */}
        {filteredTasks.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={(task) => {
                  setSelectedTask(task);
                  setTaskModalOpen(true);
                }}
                onDelete={(id) => {
                  const taskToDelete = state.tasks.find((t) => t.id === id);
                  if (taskToDelete) {
                    handleDeleteTask(taskToDelete);
                  }
                }}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title={
              state.tasks.length === 0
                ? "No tasks yet"
                : "No tasks matching your filters"
            }
            description={
              state.tasks.length === 0
                ? "Create your first task to get started."
                : "Try adjusting your search or filters."
            }
          />
        )}
      </div>

      {/* Modals */}
      <TaskModal
        open={taskModalOpen}
        task={selectedTask}
        courses={state.courses}
        onClose={() => {
          setTaskModalOpen(false);
          setSelectedTask(null);
        }}
        onSaved={loadTasks}
      />

      <DeleteTaskDialog
        open={deleteDialogOpen}
        taskId={taskToDelete?.id ?? null}
        taskTitle={taskToDelete?.title ?? ""}
        onClose={() => {
          setDeleteDialogOpen(false);
          setTaskToDelete(null);
        }}
        onDeleted={handleConfirmDelete}
      />
    </AppShell>
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

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mt-5 flex min-h-[300px] flex-col items-center justify-center rounded-[24px] border border-dashed border-slate-400/30 bg-white/18 px-6 text-center">
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
