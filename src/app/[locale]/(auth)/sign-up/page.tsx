"use client";

import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FullForm } from "@/components/ui/form";
import Field from "@/components/fields/field";
import PasswordField from "@/components/fields/password";
import ThemeBtn from "@/components/buttons/theme-btn";
import LocaleSwitcher from "@/components/buttons/locale-switcher";
import Logo from "@/components/logo";
import { Link } from "@/lib/localization/navigation";
import { routes } from "@/config/routes";
import { signUpSchema, signUpType } from "@/schema/auth";
import { signUp } from "@/actions/user";

export default function SignUp() {
  const t = useTranslations();
  const tAuth = useTranslations("auth");
  const tErrors = useTranslations("errors");
  const router = useRouter();

  const form = useForm<signUpType>({
    resolver: zodResolver(signUpSchema(tErrors)),
    defaultValues: { fName: "", lName: "", email: "", password: "", confirmPassword: "" },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: signUpType) => {
      const res = await signUp(data);
      if (res?.error) throw new Error(res.error);
      return res?.data;
    },
    onSuccess: (data) => {
      toast.success(tAuth("signUp-success", { fName: data?.fName || "User" }), { id: "signUp" });
      router.push(routes.currency);
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : t("something-went-wrong"), { id: "signUp" }),
  });

  const onSubmit = form.handleSubmit((data) => {
    toast.loading(t("loading"), { id: "signUp" });
    mutate(data);
  });

  return (
    <div className="relative grid min-h-screen w-full overflow-hidden bg-background text-foreground lg:grid-cols-2">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_0%_100%,color-mix(in_oklch,var(--safeSpend-primary)_18%,transparent),transparent_42%),radial-gradient(ellipse_at_90%_0%,color-mix(in_oklch,var(--safeSpend-secondary)_10%,transparent),transparent_35%)]" />
      <section className="relative z-10 flex min-h-screen items-center justify-center px-5 pb-12 pt-24 sm:px-10 lg:px-14">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-3"><Logo /><h1 className="text-3xl font-semibold text-safeSpend-primary">Safe Spend</h1></div>
          <p className="mb-5 mt-2 text-sm font-medium text-safeSpend-primary">{tAuth("tagline")}</p>
          <div className="flex gap-1"><ThemeBtn /><LocaleSwitcher /></div>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight">{tAuth("create-account")}</h2>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">{tAuth("signUp-description")}</p>
          <FullForm form={form} onSubmit={onSubmit}>
            <div className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field control={form.control} name="fName" label="fName" />
                <Field control={form.control} name="lName" label="lName" />
              </div>
              <Field control={form.control} name="email" label="email" type="email" />
              <PasswordField control={form.control} name="password" />
              <PasswordField control={form.control} name="confirmPassword" label="confirmPassword" />
              <Button type="submit" disabled={isPending} className="primaryBtn h-13 w-full">
                {isPending ? t("loading") : tAuth("signUp")}
              </Button>
            </div>
          </FullForm>
          <p className="mt-6 text-center text-sm text-muted-foreground">{tAuth("already-have-account")} <Link href="/sign-in" className="font-semibold text-safeSpend-primary">{tAuth("signIn")}</Link></p>
        </div>
      </section>
      <aside className="relative hidden min-h-screen items-center justify-center overflow-hidden border-r border-border/70 lg:flex">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,color-mix(in_oklch,var(--safeSpend-light)_26%,var(--background)),var(--background)_68%)]" />
        <div className="absolute left-1/2 top-1/2 aspect-square w-[min(70%,680px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-safeSpend-secondary shadow-[0_0_0_42px_color-mix(in_oklch,var(--safeSpend-secondary)_4%,transparent),0_0_0_100px_color-mix(in_oklch,var(--safeSpend-secondary)_3%,transparent),inset_0_0_100px_color-mix(in_oklch,var(--safeSpend-primary)_18%,transparent)]" />
        <div className="relative z-10 mx-auto max-w-md px-10 text-center">
          <div className="mx-auto mb-9 grid size-24 rotate-45 place-items-center rounded-[28px] border border-safeSpend-secondary/50 bg-card/50 shadow-2xl shadow-safeSpend-secondary/10 backdrop-blur"><div className="-rotate-45 text-safeSpend-secondary"><Logo size={70} /></div></div>
          <h2 className="text-4xl font-medium leading-[1.55]">{tAuth("peace-of-mind")}<br /><span className="text-safeSpend-light">{tAuth("starts-here")}</span></h2>
          <div className="mx-auto my-7 h-px w-16 bg-linear-to-l from-transparent via-safeSpend-secondary to-transparent" />
          <p className="text-sm text-muted-foreground">{tAuth("security-promise")}</p>
        </div>
      </aside>
    </div>
  );
}
