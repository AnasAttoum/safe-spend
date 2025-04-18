import Icon from "@/components/icon/icon";
import { Separator } from "@/components/ui/separator";

type Props = {
  firstName: string;
};

export default function CurrencyView({ firstName }: Props) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-3xl flex items-center gap-2">
        Welcome, <strong>{firstName}!</strong>
        <Icon icon="welcome" size={50} />
      </h2>

      <div className="text-center text-gray-500">
        <h3>Let’s get started by setting your currency</h3>
        <h3>You can change it at any time</h3>
      </div>
      <Separator />
    </div>
  );
}
