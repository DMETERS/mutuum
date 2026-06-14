import { fileURLToPath } from "url";
import { dirname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Este proyecto es la raíz del workspace (evita que Next infiera un lockfile externo).
  outputFileTracingRoot: __dirname,
  // Tree-shaking de los íconos (iconoir no está en la lista por defecto de Next).
  experimental: {
    optimizePackageImports: ["iconoir-react"],
  },
};

export default nextConfig;
