import { apiSuccess, handleApiError } from "@/lib/api-response";
import { getRegions } from "@/services/store.service";

export async function GET() {
  try {
    const regions = await getRegions();
    return apiSuccess(regions, { count: regions.length });
  } catch (error) {
    return handleApiError(error);
  }
}
