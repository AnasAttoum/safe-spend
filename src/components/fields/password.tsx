import React, { useState } from "react";
import { useTranslations } from "next-intl";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "../ui/input-group";
import { EyeIcon, EyeOffIcon } from "lucide-react";

type Props = {
  control: any;
  name: string;
  label?: string;
};

export default function PasswordField({
  control,
  name,
  label = "password",
}: Props) {
  const t = useTranslations("labels");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t(label)}</FormLabel>

          <FormControl>
            <InputGroup>
              <InputGroupInput
                {...field}
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
              />

              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  type="button"
                  aria-label={showPassword ? t("hide-password") : t("show-password")}
                  onClick={() => setShowPassword((current) => !current)}
                  size="icon-xs"
                >
                  {showPassword ? (
                    <EyeOffIcon aria-hidden="true" />
                  ) : (
                    <EyeIcon aria-hidden="true" />
                  )}
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}