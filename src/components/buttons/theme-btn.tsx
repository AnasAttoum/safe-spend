"use client"

import React from "react";
import { Button } from "../ui/button";
import { useTheme } from "next-themes";
import SunIcon from "../icon/lib/sun-icon";
import MoonIcon from "../icon/lib/moon-icon";

export default function ThemeBtn() {

  const { setTheme, theme } = useTheme();

  return (
    <Button
      variant="secondary"
      className="px-2 cursor-pointer"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <SunIcon rotate className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <MoonIcon className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  );
}
