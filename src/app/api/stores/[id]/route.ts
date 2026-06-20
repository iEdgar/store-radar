import { apiSuccess, handleApiError } from "@/lib/api-response";
import { getStoreDetail } from "@/services/store.service";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const detail = await getStoreDetail(id);
    return apiSuccess(detail);
  } catch (error) {
    return handleApiError(error);
  }
}
