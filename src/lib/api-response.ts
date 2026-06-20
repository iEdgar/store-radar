import { NextResponse } from "next/server";

import { API_ERROR_CODES, type ApiErrorCode } from "@/constants/api";
import { ApiError } from "@/lib/api-error";
import type { ApiErrorBody, ApiMeta, ApiSuccess } from "@/types/api";

const INTERNAL_ERROR_STATUS = 500;

export function apiSuccess<T>(
  data: T,
  meta?: ApiMeta,
): NextResponse<ApiSuccess<T>> {
  const body: ApiSuccess<T> = meta
    ? { success: true, data, meta }
    : { success: true, data };

  return NextResponse.json(body);
}

function apiError(
  code: ApiErrorCode,
  message: string,
  status: number,
): NextResponse<ApiErrorBody> {
  const body: ApiErrorBody = { success: false, error: { code, message } };

  return NextResponse.json(body, { status });
}

/**
 * Maps any thrown value to a standardized error response. Known domain errors
 * keep their code/status; anything else is reported as an internal error
 * without leaking implementation details.
 */
export function handleApiError(error: unknown): NextResponse<ApiErrorBody> {
  if (error instanceof ApiError) {
    return apiError(error.code, error.message, error.status);
  }

  return apiError(
    API_ERROR_CODES.INTERNAL_SERVER_ERROR,
    "An unexpected error occurred.",
    INTERNAL_ERROR_STATUS,
  );
}
