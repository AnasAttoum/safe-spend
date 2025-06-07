import React from "react";
import { Button } from "../ui/button";
import { routes } from "@/config/routes";
import Icon from "../icon/icon";
import Link from "next/link";

export default function SettingsBtn() {

  return (
    <Link href={routes.settings}>
      <Button
        variant="outline"
        className="px-2 cursor-pointer"
      >
        <Icon icon="settings" rotate />
      </Button>
    </Link>
  );
}
