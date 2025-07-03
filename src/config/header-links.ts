import { History, LayoutDashboard, Rotate3D } from "lucide-react";
import { routes } from "./routes";

export const headerlinks = [
  { label: "Dashboard", link: routes.dashboard, icon:LayoutDashboard },
  { label: "Transactions", link: routes.transactions, icon: History },
  { label: "Exchanges", link: routes.exchanges, icon: Rotate3D },
];