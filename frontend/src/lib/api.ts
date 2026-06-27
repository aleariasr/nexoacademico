import { API_URL } from "./constants";

type ApiOptions = RequestInit & {
  token?: string;
};

type ApiErrorBody = {
  detail?: string;
  message?: string;
  error?: string;
  [key: string]: unknown;
};

function buildHeaders(options: ApiOptions) {
  const headers = new Headers(options.headers);

  if (options.token) {
    headers.set("Authorization", `Token ${options.token}`);
  }

  if (options.body && !(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  return headers;
}

function getErrorMessage(errorBody: ApiErrorBody | null) {
  if (!errorBody) {
    return "An error occurred while communicating with the server.";
  }

  return (
    errorBody.detail ??
    errorBody.message ??
    errorBody.error ??
    "An error occurred while communicating with the server."
  );
}

export async function apiFetch<T>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> {
  const headers = buildHeaders(options);
  const requestOptions = { ...options };
  delete requestOptions.token;

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...requestOptions,
    headers,
  });

  if (!response.ok) {
    const errorBody = (await response.json().catch(() => null)) as ApiErrorBody | null;
    throw new Error(getErrorMessage(errorBody));
  }

  if (response.status === 204) {
    return null as T;
  }

  return response.json() as Promise<T>;
}