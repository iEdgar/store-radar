import type { ApiErrorCode } from "@/constants/api";

/**
 * Domain error thrown by the service layer. Carries the API error code and the
 * HTTP status so Route Handlers can produce a standardized error response.
 */
export class ApiError extends Error {
  readonly code: ApiErrorCode;
  readonly status: number;

  constructor(code: ApiErrorCode, message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
  }
}
