"use client"

import React from "react";
import { Button } from "../ui/button";
import { routes } from "@/config/routes";
import Icon from "../icon/icon";
import { useRouter } from "next/navigation";

export default function SettingsBtn() {
  const router = useRouter();

  return (
    <Button
      variant="outline"
      className="px-2 cursor-pointer"
      onClick={() => router.push(routes.settings)}
    >
      <Icon icon="settings" rotate />
    </Button>
  );
}
