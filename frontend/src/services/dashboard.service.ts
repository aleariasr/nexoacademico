import { apiFetch } from "@/lib/api";
import { getToken } from "@/services/auth.service";
import type { Course, PaginatedResponse } from "@/types/academic";
import type { DashboardResponse } from "@/types/dashboard";

function getTokenOrThrow() {
  const token = getToken();

  if (!token) {
    throw new Error("No authentication token found.");
  }

  return token;
}

export async function getDashboard() {
  const token = getTokenOrThrow();

  return apiFetch<DashboardResponse>("/dashboard/", {
    token,
  });
}

export async function getCourses() {
  const token = getTokenOrThrow();

  const response = await apiFetch<PaginatedResponse<Course>>("/courses/", {
    token,
  });

  return response.results;
}