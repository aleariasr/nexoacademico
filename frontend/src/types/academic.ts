export type Course = {
  id: number;
  name: string;
  code: string;
  professor: string;
  credits: number;
  color: string;
  status: "active" | "completed";
  created_at?: string;
  professor_user: number | null;
  professor_username: string | null;
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
  professor_user?: number | null;
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

export type CourseEnrollment = {
  id: number;
  course: number;
  course_name: string;
  course_code: string;
  student: number;
  student_username: string;
  student_email: string;
  enrolled_at: string;
};

export type TaskSubmission = {
  id: number;
  academic_task: number;
  task_title: string;
  course_name: string;
  student: number;
  student_username: string;
  comment: string;
  file: string | null;
  status: "submitted" | "reviewed";
  grade: string | null;
  feedback: string;
  submitted_at: string;
  reviewed_at: string | null;
  course: number;
};

export type EnrollmentPayload = {
  course: number;
  student: number;
};

export type SubmissionPayload = {
  academic_task: number;
  comment?: string;
  file?: File | null;
};

export type ReviewSubmissionPayload = {
  grade?: string | null;
  feedback?: string;
};