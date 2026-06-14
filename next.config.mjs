import { fileURLToPath } from "url";
import { dirname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Este proyecto es la raíz del workspace (evita que Next infiera un lockfile externo).
  outputFileTracingRoot: __dirname,
};

export default nextConfig;
