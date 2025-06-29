import React from "react";
import { Button } from "../ui/button";
import { routes } from "@/config/routes";
import Link from "next/link";
import SettingsIcon from "../icon/lib/settings-icon";

export default function SettingsBtn() {

  return (
    <Link href={routes.settings}>
      <Button
        variant="secondary"
        className="px-2 cursor-pointer"
      >
        <SettingsIcon rotate />
      </Button>
    </Link>
  );
}
