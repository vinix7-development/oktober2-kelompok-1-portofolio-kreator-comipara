export type ApiError = {
  status: number;
  message: string;
  errors: Record<string, string[]>;
};

export class RequestError extends Error {
  status: number;
  errors: Record<string, string[]>;

  constructor(status: number, message: string, errors: Record<string, string[]> = {}) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://127.0.0.1:8000/api";

const TOKEN_KEY = "kreatorpara.token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) {
    window.localStorage.setItem(TOKEN_KEY, token);
  } else {
    window.localStorage.removeItem(TOKEN_KEY);
  }
}

type Options = {
  method?: string;
  body?: unknown;
  auth?: boolean;
};

export async function api<T>(path: string, options: Options = {}): Promise<T> {
  const { method = "GET", body, auth = false } = options;
  const headers: Record<string, string> = { Accept: "application/json" };

  if (body !== undefined && !(body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body:
        body === undefined
          ? undefined
          : body instanceof FormData
            ? body
            : JSON.stringify(body),
      cache: "no-store",
    });
  } catch {
    throw new RequestError(0, "Tidak bisa terhubung ke server. Pastikan backend berjalan.");
  }

  const text = await response.text();
  let payload: unknown = null;
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = null;
    }
  }

  const data = (payload ?? {}) as {
    message?: string;
    errors?: Record<string, string[]>;
  };

  if (!response.ok) {
    const firstError = data.errors ? Object.values(data.errors)[0]?.[0] : undefined;
    throw new RequestError(
      response.status,
      firstError || data.message || "Terjadi kesalahan. Coba lagi.",
      data.errors ?? {},
    );
  }

  return payload as T;
}

export function errorMessage(error: unknown): string {
  if (error instanceof RequestError) return error.message;
  if (error instanceof Error) return error.message;
  return "Terjadi kesalahan tak terduga.";
}
