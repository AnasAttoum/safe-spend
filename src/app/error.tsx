"use client";

import Header from "@/components/header/header";
import { Button } from "@/components/ui/button";
import { routes } from "@/config/routes";
import { Link } from "@/lib/localization/navigation";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useState } from "react";


export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const t = useTranslations()
  const [imgKey, setImgKey] = useState(Date.now());
  useEffect(() => {
    console.error(error);
    setImgKey(Date.now())
  }, [error]);

  return (
    <div className="w-full overflow-x-hidden px-3">
      <Header simple />

      {/* <h1 className="text-3xl font-bold text-center text-safeSpend-primary my-5">An unexpected error occurred.<br/> Please try again later.</h1> */}
      <div className="flex flex-col items-center w-full">
        <div className="relative w-full h-120">
          <Image src={`/assets/pages/500.svg?cache=${imgKey}`} alt="500" fill />
        </div>

        <Link href={routes.dashboard} className="text-2xl py-1 w-full md:w-1/2 rounded-md text-center primaryBtn uppercase">{t("dashboard.dashboard")}</Link>
        <Button onClick={reset} className="mt-3 text-2xl py-5 w-full md:w-1/2 deleteBtn">{t("reset")}</Button>
      </div>
    </div>);
}
