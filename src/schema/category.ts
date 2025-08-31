import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(1).max(50),
  icon: z.string().max(20),
  type: z.enum(["income", "expense"]),
});

export type CreateCategorySchemaType = z.infer<typeof createCategorySchema>;

export const deleteSchema = z.string().min(1);

export type deleteSchemaType = z.infer<typeof deleteSchema>;

export const updateCategorySchema = createCategorySchema.extend({
  id: z.string().min(1).max(100),
});

export type updateCategoryType = z.infer<typeof updateCategorySchema>;
