import type { z } from "zod";

import type { StoreSchema } from "@/schemas/store.schema";

export type Store = z.infer<typeof StoreSchema>;
