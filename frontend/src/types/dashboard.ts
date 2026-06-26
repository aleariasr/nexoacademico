import type { AcademicTask } from "@/types/academic";

export type DashboardResponse = {
  active_courses: number;
  pending_tasks: number;
  in_progress_tasks: number;
  completed_tasks: number;
  overdue_tasks: number;
  completion_rate: number;
  upcoming_tasks: AcademicTask[];
};