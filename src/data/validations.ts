import type { Provincia } from "@/lib/types";

// Validaciones de matrícula que llegan al panel del equipo (demo).
// Flujo: REFEPS automático → adaptador provincial → si no se confirma, queda
// pendiente y el usuario sube la credencial para aprobación manual.
export type EstadoValidacion =
  | "auto_pendiente" // REFEPS sin coincidencia, adaptador provincial reintentando
  | "esperando_credencial" // se le pidió la credencial al usuario
  | "credencial_subida"; // lista para aprobar/rechazar

export interface ValidacionPendiente {
  id: string;
  dentistId?: string;
  nombre: string;
  apellido: string;
  provincia: Provincia;
  matricula: string;
  estado: EstadoValidacion;
  detalle: string;
  hora: string;
}

export const validacionesPendientes: ValidacionPendiente[] = [
  {
    id: "v-1",
    dentistId: "d-tomas",
    nombre: "Tomás",
    apellido: "Vega",
    provincia: "Misiones",
    matricula: "OMI-3411",
    estado: "credencial_subida",
    detalle: "No figura en REFEPS · credencial del Colegio de Odontólogos de Misiones adjunta.",
    hora: "hoy 09:50",
  },
  {
    id: "v-2",
    nombre: "Mariana",
    apellido: "López",
    provincia: "Chaco",
    matricula: "OCH-3418",
    estado: "credencial_subida",
    detalle: "No figura en REFEPS · credencial del Colegio del Chaco adjunta.",
    hora: "hoy 08:20",
  },
  {
    id: "v-3",
    nombre: "Carla",
    apellido: "Niella",
    provincia: "Corrientes",
    matricula: "OCT-3120",
    estado: "auto_pendiente",
    detalle: "REFEPS sin coincidencia · adaptador del Colegio de Corrientes reintentando.",
    hora: "hoy 11:30",
  },
  {
    id: "v-4",
    nombre: "Diego",
    apellido: "Sosa",
    provincia: "Chaco",
    matricula: "OCH-3402",
    estado: "esperando_credencial",
    detalle: "No figura en REFEPS ni en el padrón provincial · se le pidió la credencial.",
    hora: "ayer 17:10",
  },
];
