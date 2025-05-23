import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ComboBox } from "./combobox";
import Link from "next/link";
import { routes } from "@/config/routes";

export function CurrencyCard() {
  return (
    <Card className="w-[350px]">
      <CardHeader className="text-start">
        <CardTitle>Add Currency</CardTitle>
        <CardDescription>
          Set your default currency for your transations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="w-full">
            <ComboBox />
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button className="w-full cursor-pointer">
          <Link href={routes.dashboard}>Continue</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
