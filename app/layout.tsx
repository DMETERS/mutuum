import type { Metadata, Viewport } from "next";
import { Manrope, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { UserProvider } from "@/lib/user-context";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-manrope-src",
  display: "swap",
});

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-grotesk-src",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono-src",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mutuum — Préstamos entre odontólogos",
  description:
    "Plataforma P2P de préstamos entre odontólogos del NEA. Confianza basada en matrícula, aval de colegas y reputación. Demo por Dmeter.",
  applicationName: "Mutuum",
  authors: [{ name: "Dmeter" }],
};

export const viewport: Viewport = {
  themeColor: "#047857",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${manrope.variable} ${grotesk.variable} ${mono.variable}`}>
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  );
}
