"use client";

import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { FullForm } from "@/components/ui/form";
import Field from "@/components/fields/field";
import ThemeBtn from "@/components/buttons/theme-btn";
import LocaleSwitcher from "@/components/buttons/locale-switcher";
import Logo from "@/components/logo";
import PasswordField from "@/components/fields/password";
import { ShieldCheckIcon } from "lucide-react";
import { Link } from "@/lib/localization/navigation";
import { useMutation } from "@tanstack/react-query";
import { signInSchema, signInType } from "@/schema/auth";
import { toast } from "sonner";
import { routes } from "@/config/routes";
import { useRouter } from "next/navigation";
import { signIn } from "@/actions/user";
import { zodResolver } from "@hookform/resolvers/zod";

export default function SignIn() {
  const t = useTranslations();
  const tAuth = useTranslations("auth");
  const tErrors = useTranslations("errors");

  const router = useRouter();

  const form = useForm<signInType>({
    resolver: zodResolver(signInSchema(tErrors)),
    defaultValues: { email: "", password: "" },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (form: signInType) => {
      const res = await signIn(form);
      if (res && res.error) {
        throw new Error(res.error);
      }
      return res.data!;
    },
    onSuccess: async ({ fName }: { fName: string }) => {
      toast.success(tAuth("signIn-success", { fName }), {
        id: "signIn",
      });
      router.push(routes.dashboard);
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : t("something-went-wrong"),
        {
          id: "signIn",
        }
      );
    },
  });

  const onSubmit = form.handleSubmit((data: signInType) => {
    toast.loading(t("loading"), {
      id: "signIn",
    });
    mutate(data);
  });

  return (
    <div className="relative grid min-h-screen overflow-hidden bg-background text-foreground lg:grid-cols-2">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_0%_100%,color-mix(in_oklch,var(--safeSpend-primary)_18%,transparent),transparent_42%),radial-gradient(ellipse_at_90%_0%,color-mix(in_oklch,var(--safeSpend-secondary)_10%,transparent),transparent_35%)]" />

      <section className="relative z-10 flex min-h-screen items-center justify-center px-5 pb-20 pt-28 sm:px-10 lg:px-14">
        <div className="w-full max-w-md">

          <div className="flex gap-3">
            <Logo />
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl text-safeSpend-primary">Safe Spend</h1>
          </div>
          <div className="mb-5 flex items-center gap-2 text-sm font-medium text-safeSpend-primary"><span className="h-px w-7 bg-income" />{tAuth("tagline")}</div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{tAuth("welcome-back")}</h1>
          <div className="flex gap-1">
            <ThemeBtn />
            <LocaleSwitcher />
          </div>
          <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">{tAuth("signIn-description")}</p>

          <FullForm form={form} onSubmit={onSubmit}>
            <div className="mt-8 space-y-5">
              <Field control={form.control} name="email" label="email" type="email" />
              <PasswordField control={form.control} name="password" />

              <div className="flex items-center justify-end gap-3">
                <Link href="/forgot-password" className="text-xs font-medium text-safeSpend-primary transition hover:text-safeSpend-secondary">{tAuth("forgot-password")}</Link>
              </div>
              <Button type="submit" disabled={form.formState.isSubmitting} className="primaryBtn h-13 w-full">
                {isPending ? t("loading") : tAuth("signIn")}
              </Button>
            </div>
          </FullForm>

          <p className="mt-6 text-center text-sm text-muted-foreground">{tAuth("new-to-app")} <Link href="/sign-up" className="font-semibold text-safeSpend-primary hover:text-safeSpend-secondary">{tAuth("create-account")}</Link></p>
        </div>
      </section>

      <aside className="relative hidden min-h-screen items-center justify-center overflow-hidden border-r border-border/70 lg:flex">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,color-mix(in_oklch,var(--safeSpend-light)_26%,var(--background)),var(--background)_68%)]" />
        <div className="absolute left-1/2 top-1/2 aspect-square w-[min(70%,680px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-safeSpend-secondary shadow-[0_0_0_42px_color-mix(in_oklch,var(--safeSpend-secondary)_4%,transparent),0_0_0_100px_color-mix(in_oklch,var(--safeSpend-secondary)_3%,transparent),inset_0_0_100px_color-mix(in_oklch,var(--safeSpend-primary)_18%,transparent)]" />
        <div className="relative z-10 mx-auto max-w-md px-10 text-center">
          <div className="mx-auto mb-9 grid size-24 rotate-45 place-items-center rounded-[28px] border border-safeSpend-secondary/50 bg-card/50 shadow-2xl shadow-safeSpend-secondary/10 backdrop-blur">
            <div className="-rotate-45 text-safeSpend-secondary">
              <Logo size={70} />
            </div>
          </div>
          <h2 className="text-4xl font-medium leading-[1.55]">{tAuth("peace-of-mind")}<br /><span className="text-safeSpend-light">{tAuth("starts-here")}</span></h2>
          {/* <p className="mx-auto mt-4 max-w-sm text-sm leading-8 text-muted-foreground">{tAuth("feature-description")}</p> */}
          <div className="mx-auto my-7 h-px w-16 bg-linear-to-l from-transparent via-safeSpend-secondary to-transparent" />
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground"><ShieldCheckIcon className="size-4 text-safeSpend-secondary" />{tAuth("security-promise")}</div>
        </div>
      </aside>
    </div>
  );
}
