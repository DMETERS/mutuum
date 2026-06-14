import type { Mensaje } from "@/lib/types";

// Hilos de chat trazable por solicitud (demo). Timestamps inmutables.
export const mensajes: Mensaje[] = [
  {
    id: "m-1",
    solicitudId: "s-101",
    autorId: "d-laura",
    texto: "Hola Martín, vi tu solicitud por el equipo de rayos. ¿El monto es solo por el equipo o incluye instalación?",
    hora: "10:02",
  },
  {
    id: "m-2",
    solicitudId: "s-101",
    autorId: "d-martin",
    texto: "Hola Laura, gracias. Es solo el equipo, la instalación la cubro yo. Por eso pedí 2.200.",
    hora: "10:09",
  },
  {
    id: "m-3",
    solicitudId: "s-101",
    autorId: "d-laura",
    texto: "Perfecto. Te puedo ofrecer a 2% mensual por 6 meses. ¿Avanzamos y generamos el contrato?",
    hora: "10:14",
  },
  {
    id: "m-4",
    solicitudId: "s-101",
    autorId: "d-martin",
    texto: "Me sirve. Dale, avancemos.",
    hora: "10:16",
  },
];

export const mensajesDeSolicitud = (solicitudId: string): Mensaje[] =>
  mensajes.filter((m) => m.solicitudId === solicitudId);
