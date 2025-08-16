import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ComboBox } from "@/sections/currency/components/combobox";
import React from "react";

export default function Currency() {
  return (
    <Card>
      <CardHeader className="text-start">
        <CardTitle>Currency</CardTitle>
        <CardDescription>
          Set your default currency for your transations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ComboBox />
      </CardContent>
    </Card>
  );
}
