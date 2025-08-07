import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Safe Spend",
    short_name: "Safe Spend",
    description:
      "Take control of your finances with Safe Spend. Easily track your expenses, set budgets, and achieve your saving goals with a clean and intuitive interface.",
    start_url: "/",
    display: "standalone",
    background_color: "#023e8a",
    theme_color: "#023e8a",
    icons: [
      {
        purpose: "maskable",
        sizes: "512x512",
        src: "safeSpend_maskable.png",
        type: "image/png",
      },
      {
        purpose: "any",
        sizes: "512x512",
        src: "safeSpend_rounded.png",
        type: "image/png",
      },
    ],
  };
}
