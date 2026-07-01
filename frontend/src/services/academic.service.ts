import { apiFetch } from "@/lib/api";
import { getToken } from "@/services/auth.service";
import type {
  AcademicTask,
  Course,
  CoursePayload,
  PaginatedResponse,
  TaskPayload,
  TaskType,
  CourseEnrollment,
  EnrollmentPayload,
  ReviewSubmissionPayload,
  SubmissionPayload,
  TaskSubmission,
} from "@/types/academic";

function authToken() {
  const token = getToken();

  if (!token) {
    throw new Error("No authentication token found.");
  }

  return token;
}

export async function getCourses() {
  const response = await apiFetch<PaginatedResponse<Course>>("/courses/", {
    token: authToken(),
  });

  return response.results;
}

export async function getCourse(id: number) {
  return apiFetch<Course>(`/courses/${id}/`, {
    token: authToken(),
  });
}

export async function createCourse(payload: CoursePayload) {
  return apiFetch<Course>("/courses/", {
    method: "POST",
    token: authToken(),
    body: JSON.stringify(payload),
  });
}

export async function updateCourse(id: number, payload: Partial<CoursePayload>) {
  return apiFetch<Course>(`/courses/${id}/`, {
    method: "PATCH",
    token: authToken(),
    body: JSON.stringify(payload),
  });
}

export async function deleteCourse(id: number) {
  return apiFetch<void>(`/courses/${id}/`, {
    method: "DELETE",
    token: authToken(),
  });
}

export async function getTaskTypes() {
  const response = await apiFetch<PaginatedResponse<TaskType>>("/task-types/", {
    token: authToken(),
  });

  return response.results;
}

export async function getTasks(courseId?: number) {
  const query = courseId ? `?course=${courseId}` : "";

  const response = await apiFetch<PaginatedResponse<AcademicTask>>(
    `/tasks/${query}`,
    {
      token: authToken(),
    }
  );

  return response.results;
}

export async function createTask(payload: TaskPayload) {
  return apiFetch<AcademicTask>("/tasks/", {
    method: "POST",
    token: authToken(),
    body: JSON.stringify(payload),
  });
}

export async function updateTask(id: number, payload: Partial<TaskPayload>) {
  return apiFetch<AcademicTask>(`/tasks/${id}/`, {
    method: "PATCH",
    token: authToken(),
    body: JSON.stringify(payload),
  });
}

export async function deleteTask(id: number) {
  return apiFetch<void>(`/tasks/${id}/`, {
    method: "DELETE",
    token: authToken(),
  });
}

export async function getEnrollments() {
  const response = await apiFetch<PaginatedResponse<CourseEnrollment>>(
    "/enrollments/",
    {
      token: authToken(),
    }
  );

  return response.results;
}

export async function getCourseEnrollments(courseId: number) {
  const enrollments = await getEnrollments();

  return enrollments.filter((enrollment) => enrollment.course === courseId);
}

export async function createEnrollment(payload: EnrollmentPayload) {
  return apiFetch<CourseEnrollment>("/enrollments/", {
    method: "POST",
    token: authToken(),
    body: JSON.stringify(payload),
  });
}

export async function deleteEnrollment(id: number) {
  return apiFetch<void>(`/enrollments/${id}/`, {
    method: "DELETE",
    token: authToken(),
  });
}

export async function getSubmissions() {
  const response = await apiFetch<PaginatedResponse<TaskSubmission>>(
    "/submissions/",
    {
      token: authToken(),
    }
  );

  return response.results;
}

export async function getCourseSubmissions(courseId: number) {
  const submissions = await getSubmissions();

  return submissions.filter((submission) => submission.course === courseId);
}

export async function createSubmission(payload: SubmissionPayload) {
  const formData = new FormData();

  formData.append("academic_task", String(payload.academic_task));

  if (payload.comment) {
    formData.append("comment", payload.comment);
  }

  if (payload.file) {
    formData.append("file", payload.file);
  }

  return apiFetch<TaskSubmission>("/submissions/", {
    method: "POST",
    token: authToken(),
    body: formData,
  });
}

export async function reviewSubmission(
  id: number,
  payload: ReviewSubmissionPayload
) {
  return apiFetch<TaskSubmission>(`/submissions/${id}/`, {
    method: "PATCH",
    token: authToken(),
    body: JSON.stringify(payload),
  });
}