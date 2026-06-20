import type { z } from "zod";

import { API_ERROR_CODES } from "@/constants/api";
import {
  ApiErrorBodySchema,
  UnknownApiSuccessSchema,
} from "@/schemas/api.schema";
import { buildQueryString } from "@/utils/url";

const API_BASE_PATH = "/api";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface ApiRequestOptions<TSchema extends z.ZodTypeAny> {
  /** Endpoint path relative to the API base, e.g. "/stores". */
  path: string;
  /** Zod schema used to validate the `data` field of the response. */
  schema: TSchema;
  method?: HttpMethod;
  /** Query parameters; empty values are omitted. */
  searchParams?: Record<string, string | undefined>;
  /** JSON request body, serialized automatically for write operations. */
  body?: unknown;
  signal?: AbortSignal;
}

/**
 * Error thrown by the API client. Mirrors the server error codes and keeps the
 * HTTP status so the UI can render the proper feedback.
 */
export class ApiClientError extends Error {
  readonly code: string;
  readonly status: number;

  constructor(code: string, message: string, status: number) {
    super(message);
    this.name = "ApiClientError";
    this.code = code;
    this.status = status;
  }
}

/**
 * Single entry point for talking to the Mock API. Validates the response
 * envelope with Zod and returns the typed `data` payload. The options-object
 * shape keeps it extensible for future write operations.
 */
export async function apiRequest<TSchema extends z.ZodTypeAny>(
  options: ApiRequestOptions<TSchema>,
): Promise<z.infer<TSchema>> {
  const { path, schema, method = "GET", searchParams, body, signal } = options;

  const hasBody = body !== undefined;
  const url = `${API_BASE_PATH}${path}${buildQueryString(searchParams)}`;

  const response = await fetch(url, {
    method,
    signal,
    headers: {
      Accept: "application/json",
      ...(hasBody ? { "Content-Type": "application/json" } : {}),
    },
    ...(hasBody ? { body: JSON.stringify(body) } : {}),
  });

  const json: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const parsed = ApiErrorBodySchema.safeParse(json);
    if (parsed.success) {
      throw new ApiClientError(
        parsed.data.error.code,
        parsed.data.error.message,
        response.status,
      );
    }
    throw new ApiClientError(
      API_ERROR_CODES.INTERNAL_SERVER_ERROR,
      "The request failed unexpectedly.",
      response.status,
    );
  }

  const envelope = UnknownApiSuccessSchema.safeParse(json);
  if (!envelope.success) {
    throw new ApiClientError(
      API_ERROR_CODES.INVALID_DATA,
      "The API returned an unexpected response.",
      response.status,
    );
  }

  const data = schema.safeParse(envelope.data.data);
  if (!data.success) {
    throw new ApiClientError(
      API_ERROR_CODES.INVALID_DATA,
      "The API returned an unexpected response.",
      response.status,
    );
  }

  return data.data;
}
