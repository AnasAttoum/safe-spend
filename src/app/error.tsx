"use client";

import Header from "@/components/header/header";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useEffect, useState } from "react";


export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const [imgKey, setImgKey] = useState(Date.now());
  useEffect(() => {
    console.error(error);
    setImgKey(Date.now())
  }, [error]);

  return (
    <>
      <Header />

      {/* <h1 className="text-3xl font-bold text-center text-blue-primary my-5">An unexpected error occurred.<br/> Please try again later.</h1> */}
      <div className="flex flex-col items-center">
        <div className="relative w-full h-[30rem]">
          <Image src={`/assets/pages/500.svg?cache=${imgKey}`} alt="500" fill />
        </div>

        <Button onClick={reset} className="text-2xl py-5 w-full md:w-1/2">Reset</Button>
      </div>
    </>);
}
