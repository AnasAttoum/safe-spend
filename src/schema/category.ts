import { _Translator } from "next-intl";
import { z } from "zod";

export const createCategorySchema = (
  t: _Translator<Record<string, any>, "errors">,
) =>
  z.object({
    name: z
      .string()
      .min(1, { message: t("required") })
      .max(100, { message: t("max-100") }),
    icon: z.string().max(20, { message: t("max-20") }),
    type: z.enum(["income", "expense"]),
  });

export type CreateCategorySchemaType = z.infer<
  ReturnType<typeof createCategorySchema>
>;

export const deleteSchema = (t: _Translator<Record<string, any>, "errors">) =>
  z.string().min(1, { message: t("required") });

export type deleteSchemaType = z.infer<ReturnType<typeof deleteSchema>>;

export const updateCategorySchema = (
  t: _Translator<Record<string, any>, "errors">,
) =>
  createCategorySchema(t).extend({
    id: z
      .string()
      .min(1, { message: t("required") })
      .max(100, { message: t("max-100") }),
  });

export type updateCategoryType = z.infer<
  ReturnType<typeof updateCategorySchema>
>;
