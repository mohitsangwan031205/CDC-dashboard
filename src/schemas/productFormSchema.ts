import { z } from "zod";

export const productFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),

  department: z.string().min(1, "Department is required"),

  unitPrice: z.number().positive("Price must be greater than 0"),

  quantityAvailable: z.number().int().nonnegative(),

  summary: z.string().optional(),

  images: z.array(z.string()).optional().default([]),

  status: z.enum(["active", "inactive"]).default("active"),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;
