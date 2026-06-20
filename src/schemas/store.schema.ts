import { z } from "zod";

export const StoreSchema = z.object({
  id: z.string(),
  name: z.string(),
  city: z.string(),
  region: z.string(),
});

export const StoresSchema = z.array(StoreSchema);
