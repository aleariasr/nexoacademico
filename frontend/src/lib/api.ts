import { API_URL } from "./constants";

type ApiOptions = RequestInit & {
  token?: string;
};

type ApiErrorBody = {
  detail?: string;
  [key: string]: unknown;
};

export async function apiFetch<T>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> {
  const { token, headers, ...rest } = options;

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Token ${token}` } : {}),
      ...headers,
    },
  });

  if (!response.ok) {
    const errorBody = (await response.json().catch(() => null)) as
      | ApiErrorBody
      | null;

    throw new Error(
      errorBody?.detail ?? "An error occurred while communicating with the server."
    );
  }

  if (response.status === 204) {
    return null as T;
  }

  return response.json() as Promise<T>;
}