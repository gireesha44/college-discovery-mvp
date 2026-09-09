import { z } from "zod";

export const collegeListQuerySchema = z.object({
  q: z.string().trim().max(100).optional(),
  state: z.string().trim().max(100).optional(),
  type: z.enum(["Government", "Private", "Deemed"]).optional(),
  minFees: z.coerce.number().int().nonnegative().optional(),
  maxFees: z.coerce.number().int().nonnegative().optional(),
  minRating: z.coerce.number().min(0).max(5).optional(),
  sort: z.enum(["rating_desc", "fees_asc", "fees_desc", "name_asc"]).default("rating_desc"),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(12),
});

export type CollegeListQuery = z.infer<typeof collegeListQuerySchema>;

export const compareQuerySchema = z.object({
  slugs: z
    .string()
    .min(1)
    .transform((s) => s.split(",").map((x) => x.trim()).filter(Boolean))
    .refine((arr) => arr.length >= 2 && arr.length <= 3, {
      message: "Provide 2 to 3 college slugs to compare",
    }),
});
