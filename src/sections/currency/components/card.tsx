import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ComboBox } from "./combobox"

export function CurrencyCard() {
  return (
    <Card className="w-[350px]">
      <CardHeader className="text-start">
        <CardTitle>Add Currency</CardTitle>
        <CardDescription>Set your default currency for your transations</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="w-full">
              <ComboBox/>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button className="w-full cursor-pointer">Continue</Button>
      </CardFooter>
    </Card>
  )
}
