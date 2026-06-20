import type { NextRequest } from "next/server";

import { API_ERROR_CODES } from "@/constants/api";
import { ApiError } from "@/lib/api-error";
import { apiSuccess, handleApiError } from "@/lib/api-response";
import { ProductQuerySchema } from "@/schemas/query.schema";
import { getProducts } from "@/services/product.service";

const INVALID_QUERY_STATUS = 400;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const parsed = ProductQuerySchema.safeParse({
      search: searchParams.get("search") || undefined,
      sku: searchParams.get("sku") || undefined,
      category: searchParams.get("category") || undefined,
    });

    if (!parsed.success) {
      throw new ApiError(
        API_ERROR_CODES.INVALID_QUERY,
        "Invalid query parameters.",
        INVALID_QUERY_STATUS,
      );
    }

    const products = await getProducts(parsed.data);
    return apiSuccess(products, { count: products.length });
  } catch (error) {
    return handleApiError(error);
  }
}
