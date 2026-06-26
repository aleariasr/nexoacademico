import { apiFetch } from "@/lib/api";
import { getToken } from "@/services/auth.service";
import type {
  AcademicTask,
  Course,
  CoursePayload,
  PaginatedResponse,
  TaskPayload,
  TaskType,
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

export async function getTasks() {
  const response = await apiFetch<PaginatedResponse<AcademicTask>>("/tasks/", {
    token: authToken(),
  });

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