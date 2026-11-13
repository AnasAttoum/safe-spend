import { _Translator } from "next-intl";
import { z } from "zod";

export const signInSchema = (t: _Translator<Record<string, any>, "errors">) =>
  z.object({
    email: z
      .string()
      .min(1, { message: t("required") })
      .email({ message: t("invalid-email") }),
    password: z
      .string()
      .min(8, { message: t("min-8") })
      .max(500, { message: t("max-500") })
      .regex(/[0-9]/, { message: t("at-least-one-number") })
      .regex(/[A-Z]/, { message: t("at-least-one-uppercase") })
      .regex(/[a-z]/, { message: t("at-least-one-lowercase") }),
  });
export type signInType = z.infer<ReturnType<typeof signInSchema>>;
