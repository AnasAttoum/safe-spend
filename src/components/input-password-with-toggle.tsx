"use client";

import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";

const InputPasswordWithToggle = () => {
  const [showPassword, setShowPassword] = useState(false);

  const handleToggle = () => {
    setShowPassword((current) => !current);
  };

  return (
    <Field className="w-full max-w-sm">
      <FieldLabel htmlFor="password-toggle">Password</FieldLabel>
      <InputGroup className="bg-background">
        <InputGroupInput
          id="password-toggle"
          placeholder="Enter your password"
          type={showPassword ? "text" : "password"}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={handleToggle}
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
    </Field>
  );
};

export default InputPasswordWithToggle;
