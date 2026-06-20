import { apiSuccess, handleApiError } from "@/lib/api-response";
import { getOverview } from "@/services/store.service";

export async function GET() {
  try {
    const overview = await getOverview();
    return apiSuccess(overview);
  } catch (error) {
    return handleApiError(error);
  }
}
