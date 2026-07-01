import { apiFetch } from "@/lib/api";

export type User = {
  id: number;
  username: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  role?: string;
  degree_program?: string;
};

export type LoginResponse = {
  token: string;
  user: User;
};

export type RegisterPayload = {
  username: string;
  first_name?: string;
  last_name?: string;
  email: string;
  password: string;
  password_confirm: string;
};

const TOKEN_KEY = "token";
const USER_KEY = "user";

export async function login(username: string, password: string) {
  return apiFetch<LoginResponse>("/auth/login/", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export async function register(payload: RegisterPayload) {
  return apiFetch<LoginResponse>("/auth/register/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function me() {
  const token = getToken();

  if (!token) {
    throw new Error("No authentication token found.");
  }

  return apiFetch<User>("/auth/me/", {
    token,
  });
}

export function saveAuthSession(data: LoginResponse) {
  localStorage.setItem(TOKEN_KEY, data.token);
  localStorage.setItem(USER_KEY, JSON.stringify(data.user));
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): User | null {
  const rawUser = localStorage.getItem(USER_KEY);

  if (!rawUser) return null;

  try {
    return JSON.parse(rawUser) as User;
  } catch {
    return null;
  }
}

export function isAuthenticated() {
  return Boolean(getToken());
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("authToken");
  localStorage.removeItem("nexo_token");
}

export async function getUsers(role?: "admin" | "professor" | "student") {
  const token = getToken();

  if (!token) {
    throw new Error("No authentication token found.");
  }

  const query = role ? `?role=${role}` : "";

  return apiFetch<User[]>(`/auth/users/${query}`, {
    token,
  });
}

export type ManagedUser = {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  is_active: boolean;
  profile_role: "admin" | "professor" | "student" | null;
  profile_degree_program: string | null;
};

export type ManagedUserPayload = {
  username: string;
  first_name?: string;
  last_name?: string;
  email: string;
  password?: string;
  is_active: boolean;
  role: "admin" | "professor" | "student";
  degree_program?: string;
};

export async function getManagedUsers() {
  const token = getToken();

  if (!token) {
    throw new Error("No authentication token found.");
  }

  const response = await apiFetch<{
    count: number;
    next: string | null;
    previous: string | null;
    results: ManagedUser[];
  }>("/auth/manage-users/", {
    token,
  });

  return response.results;
}

export async function createManagedUser(payload: ManagedUserPayload) {
  const token = getToken();

  if (!token) {
    throw new Error("No authentication token found.");
  }

  return apiFetch<ManagedUser>("/auth/manage-users/", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export async function updateManagedUser(
  id: number,
  payload: Partial<ManagedUserPayload>
) {
  const token = getToken();

  if (!token) {
    throw new Error("No authentication token found.");
  }

  return apiFetch<ManagedUser>(`/auth/manage-users/${id}/`, {
    method: "PATCH",
    token,
    body: JSON.stringify(payload),
  });
}