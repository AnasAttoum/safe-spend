import Icon from "@/components/icon/icon";
import { Separator } from "@/components/ui/separator";
import { CurrencyCard } from "./components/card";

type Props = {
  firstName: string;
};

export default function CurrencyView({ firstName }: Props) {
  return (
    <div className="flex flex-col gap-3 text-center">
      <h2 className="text-3xl flex justify-center items-center gap-2">
        Welcome{firstName !== "" && <strong>, {firstName}!</strong>}
        <Icon icon="welcome" size={50} />
      </h2>

      <div className="text-gray-500">
        <h3>Let’s get started by setting your currency</h3>
        <h3>You can change it at any time</h3>
      </div>
      <Separator />
      <CurrencyCard />
    </div>
  );
}
