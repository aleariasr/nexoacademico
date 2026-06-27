import { apiFetch } from "@/lib/api";
import { getToken } from "@/services/auth.service";
import type { DashboardResponse } from "@/types/dashboard";

function getTokenOrThrow() {
  const token = getToken();

  if (!token) {
    throw new Error("No authentication token found.");
  }

  return token;
}

export async function getDashboard() {
  return apiFetch<DashboardResponse>("/dashboard/", {
    token: getTokenOrThrow(),
  });
}