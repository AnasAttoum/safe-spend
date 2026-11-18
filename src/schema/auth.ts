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
      .max(500, { message: t("max-500") }),
  });
export type signInType = z.infer<ReturnType<typeof signInSchema>>;

export const signUpSchema = (t: _Translator<Record<string, any>, "errors">) =>
  z
    .object({
      fName: z.string().trim().min(1, t("required")).max(20, t("max-20", { max: 20 })),
      lName: z.string().trim().min(1, t("required")).max(20, t("max-20", { max: 20 })),
      email: z.string().trim().email(t("invalid-email")).max(500, t("max-500", { max: 500 })),
      password: z
      .string()
      .min(8, { message: t("min-8") })
      .max(500, { message: t("max-500") })
      .regex(/[0-9]/, { message: t("at-least-one-number") })
      .regex(/[A-Z]/, { message: t("at-least-one-uppercase") })
      .regex(/[a-z]/, { message: t("at-least-one-lowercase") }),
      confirmPassword: z.string().min(1, t("required")),
    })
    .refine((data) => data.password === data.confirmPassword, {
      path: ["confirmPassword"],
      message: t("passwords-dont-match"),
    });
export type signUpType = z.infer<ReturnType<typeof signUpSchema>>;