import { History, LayoutDashboard, Rotate3D, SquareStack } from "lucide-react";
import { routes } from "./routes";

export const headerlinks = [
  { label: "dashboard.dashboard", link: routes.dashboard, icon: LayoutDashboard },
  { label: "dashboard.details" },
  { label: "transaction.transactions", link: routes.transactions, icon: History },
  { label: "exchange.exchanges", link: routes.exchanges, icon: Rotate3D },
  { label: "category.categories", link: routes.categories, icon: SquareStack },
];
