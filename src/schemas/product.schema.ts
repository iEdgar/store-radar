import { z } from "zod";

export const ProductSchema = z.object({
  id: z.string(),
  sku: z.string(),
  name: z.string(),
  category: z.string(),
});

export const ProductsSchema = z.array(ProductSchema);
