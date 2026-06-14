import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Mutuum — Préstamos entre odontólogos",
    short_name: "Mutuum",
    description:
      "Plataforma P2P de préstamos entre odontólogos del NEA. Demo por Dmeter.",
    start_url: "/",
    display: "standalone",
    background_color: "#fbf8f2",
    theme_color: "#047857",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
