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