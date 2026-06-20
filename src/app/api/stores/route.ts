import type { NextRequest } from "next/server";

import { API_ERROR_CODES } from "@/constants/api";
import { ApiError } from "@/lib/api-error";
import { apiSuccess, handleApiError } from "@/lib/api-response";
import { StoreQuerySchema } from "@/schemas/query.schema";
import { getStores } from "@/services/store.service";

const INVALID_QUERY_STATUS = 400;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const parsed = StoreQuerySchema.safeParse({
      search: searchParams.get("search") || undefined,
      region: searchParams.get("region") || undefined,
      sort: searchParams.get("sort") || undefined,
      order: searchParams.get("order") || undefined,
    });

    if (!parsed.success) {
      throw new ApiError(
        API_ERROR_CODES.INVALID_QUERY,
        "Invalid query parameters.",
        INVALID_QUERY_STATUS,
      );
    }

    const stores = await getStores(parsed.data);
    return apiSuccess(stores, { count: stores.length });
  } catch (error) {
    return handleApiError(error);
  }
}
