// ── Modelo de dominio de Mutuum (demo) ──────────────────────────

export type Provincia = "Chaco" | "Corrientes" | "Misiones";

export interface Verificaciones {
  matricula: boolean;
  renaper: boolean;
  kyc: boolean;
  vouching: boolean;
}

export interface Dentist {
  id: string;
  nombre: string;
  apellido: string;
  matricula: string;
  ciudad: string;
  provincia: Provincia;
  coords: [number, number]; // [lat, lng]
  /** Foto de perfil (placeholder). Si falta, se muestran las iniciales. */
  avatar?: string;
  /** Reputación 0–5 (promedio de valoraciones de contrapartes). */
  reputacion: number;
  operaciones: number;
  /** Score crediticio híbrido 300–850 (visible al prestamista). */
  score: number;
  antiguedadMeses: number;
  insignias: string[];
  bio: string;
  verificaciones: Verificaciones;
  /** Avalado por (id de un colega ya registrado). */
  avaladoPor?: string;
}

export type TipoSolicitud = "prestar" | "tomar";

export type EstadoSolicitud =
  | "activa"
  | "en_match"
  | "acordada"
  | "cobrada"
  | "cerrada";

export interface Solicitud {
  id: string;
  tipo: TipoSolicitud;
  autorId: string;
  monto: number; // USD
  tasaMin: number; // % mensual
  tasaMax: number;
  plazoMeses: number;
  distanciaKm: number;
  destino: string;
  categoria?: string; // categoría de insumo/equipamiento
  estado: EstadoSolicitud;
  /** Fecha relativa legible (demo, sin Date dinámica). */
  publicada: string;
}

export interface Mensaje {
  id: string;
  solicitudId: string;
  autorId: string;
  texto: string;
  /** Timestamp legible e inmutable (demo). */
  hora: string;
}

export interface CategoriaInsumo {
  id: string;
  nombre: string;
  precioRef: number; // USD de referencia
  grupo: string;
}

export interface DemoProfile {
  dentistId: string;
  rol: "prestamista" | "tomador" | "admin";
  titulo: string;
  descripcion: string;
}

export interface Comision {
  id: string;
  /** Fase 1 = cobro manual (comprobante + confirmación del equipo). Fase 2 = automático (CVU por operación). */
  fase: 1 | 2;
  tomadorId: string;
  prestamistaId: string;
  monto: number; // monto de la operación (USD)
  comision: number; // comisión de la plataforma (USD)
  estado: "pendiente" | "confirmada";
  /** Fase 1: comprobante subido por el tomador. */
  comprobante?: boolean;
  detalle: string;
  hora: string;
}
