import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Mutuum — Préstamos entre odontólogos",
    short_name: "Mutuum",
    description:
      "Plataforma P2P de préstamos entre odontólogos del NEA. Demo por Dmeter.",
    start_url: "/",
    display: "standalone",
    background_color: "#faf7f1",
    theme_color: "#0c6b4f",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
