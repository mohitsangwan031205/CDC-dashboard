import { z } from "zod";

export const productSchema = z.object({
  title: z.string().min(2, "Title is required"),
  summary: z.string().optional(),
  department: z.string(),
  unitPrice: z.number().positive(),
  quantityAvailable: z.number().int().nonnegative(),
  images: z.array(z.string()).optional().default([]),
  status: z.enum(["active", "inactive"]).default("active"),
});
