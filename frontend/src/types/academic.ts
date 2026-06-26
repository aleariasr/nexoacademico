export type Course = {
  id: number;
  name: string;
  code: string;
  professor: string;
  credits: number;
  color: string;
  status: "active" | "completed";
  created_at?: string;
};

export type TaskType = {
  id: number;
  name: string;
  description: string;
};

export type AcademicTask = {
  id: number;
  course: number;
  course_name: string;
  task_type: number;
  task_type_name: string;
  title: string;
  description: string;
  due_date: string;
  priority: "low" | "medium" | "high" | "critical";
  status: "pending" | "in_progress" | "completed" | "cancelled";
  progress_percentage: number;
  reminder_at: string | null;
  weight_percentage: string | null;
  grade: string | null;
  is_overdue: boolean;
  created_at: string;
  updated_at: string;
};

export type PaginatedResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type CoursePayload = {
  name: string;
  code: string;
  professor?: string;
  credits: number;
  color?: string;
  status?: "active" | "completed";
};

export type TaskPayload = {
  course: number;
  task_type: number;
  title: string;
  description?: string;
  due_date: string;
  priority: "low" | "medium" | "high" | "critical";
  status?: "pending" | "in_progress" | "completed" | "cancelled";
  progress_percentage?: number;
  reminder_at?: string | null;
  weight_percentage?: string | null;
  grade?: string | null;
};