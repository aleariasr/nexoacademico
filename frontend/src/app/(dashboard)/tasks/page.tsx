"use client";

import TaskCard from "@/components/tasks/TaskCard";
import DeleteTaskDialog from "@/components/tasks/DeleteTaskDialog";
import TaskModal from "@/components/tasks/TaskModal";
import { getTasks } from "@/services/academic.service";
import { getCourses } from "@/services/academic.service";
import { getToken } from "@/services/auth.service";
import type { AcademicTask, Course } from "@/types/academic";
import { Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import GlassCard from "@/components/ui/GlassCard";
import PageHeader from "@/components/ui/PageHeader";
import Select from "@/components/ui/Select";
import LoadingState from "@/components/ui/LoadingState";
import SearchBar from "@/components/ui/SearchBar";

export default function TasksPage() {
  const [state, setState] = useState({
    tasks: [] as AcademicTask[],
    courses: [] as Course[],
    loading: true,
    error: null as string | null,
  });
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
      const [tasks, courses] = await Promise.all([getTasks(), getCourses()]);

      setState({ tasks, courses, loading: false, error: null });
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
    return <LoadingState label="Loading tasks" />;
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

  const filteredTasks = state.tasks
    .filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.course_name?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === "all" || task.status === statusFilter;
      const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    })
    .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime());

  return (
    <div className="flex w-full flex-col gap-6 pb-24 md:pb-0">
      <PageHeader title="Tasks">
        <Button
          variant="primary"
          onClick={() => {
            setSelectedTask(null);
            setTaskModalOpen(true);
          }}
        >
          <Plus size={18} strokeWidth={2.2} />
          New
        </Button>
      </PageHeader>

      {state.error && (
        <GlassCard className="p-5">
          <p className="font-semibold text-slate-950">Error loading tasks</p>
          <p className="mt-1 text-sm text-slate-500">{state.error}</p>
        </GlassCard>
      )}

      <GlassCard className="p-4 md:p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-6">
          <SearchBar
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />

          <div className="flex gap-3">
            <Select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as AcademicTask["status"] | "all")
              }
            >
              <option value="all">All status</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </Select>

            <Select
              value={priorityFilter}
              onChange={(event) =>
                setPriorityFilter(event.target.value as AcademicTask["priority"] | "all")
              }
            >
              <option value="all">All priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </Select>
          </div>
        </div>

        {(filteredTasks.length > 0 || searchTerm || statusFilter !== "all" || priorityFilter !== "all") && (
          <p className="mt-4 text-sm text-slate-500">
            {filteredTasks.length} task{filteredTasks.length !== 1 ? "s" : ""} found
          </p>
        )}
      </GlassCard>

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
          title={state.tasks.length === 0 ? "No tasks yet" : "No tasks matching your filters"}
          description={
            state.tasks.length === 0
              ? "Create your first task to get started."
              : "Try adjusting your search or filters."
          }
        />
      )}

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
    </div>
  );
}
