import type { Dentist, DemoProfile } from "@/lib/types";

// Odontólogos del NEA (datos ficticios para el demo).
export const dentists: Dentist[] = [
  {
    id: "d-laura",
    nombre: "Laura",
    apellido: "Benítez",
    matricula: "OCH-2418",
    ciudad: "Resistencia",
    provincia: "Chaco",
    coords: [-27.4514, -58.9867],
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    reputacion: 4.9,
    operaciones: 23,
    score: 812,
    antiguedadMeses: 34,
    insignias: ["Fundadora", "100% cumplimiento", "Avala colegas"],
    bio: "Odontóloga general, consultorio propio en el centro de Resistencia. Coloca excedentes a colegas de confianza.",
    verificaciones: { matricula: true, renaper: true, kyc: true, vouching: true },
  },
  {
    id: "d-martin",
    nombre: "Martín",
    apellido: "Ferreyra",
    matricula: "OCT-1907",
    ciudad: "Corrientes",
    provincia: "Corrientes",
    coords: [-27.4692, -58.8306],
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    reputacion: 4.6,
    operaciones: 11,
    score: 688,
    antiguedadMeses: 19,
    insignias: ["Buen pagador", "Endodoncista"],
    bio: "Endodoncista, recién mudó el consultorio. Busca financiar equipamiento sin pasar por el banco.",
    verificaciones: { matricula: true, renaper: true, kyc: true, vouching: true },
    avaladoPor: "d-laura",
  },
  {
    id: "d-sofia",
    nombre: "Sofía",
    apellido: "Acosta",
    matricula: "OMI-3055",
    ciudad: "Posadas",
    provincia: "Misiones",
    coords: [-27.3621, -55.9008],
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    reputacion: 4.8,
    operaciones: 17,
    score: 770,
    antiguedadMeses: 28,
    insignias: ["Ortodoncista", "Avala colegas"],
    bio: "Ortodoncista en Posadas. Presta y toma según el momento del año.",
    verificaciones: { matricula: true, renaper: true, kyc: true, vouching: true },
    avaladoPor: "d-laura",
  },
  {
    id: "d-julian",
    nombre: "Julián",
    apellido: "Romero",
    matricula: "OCH-2890",
    ciudad: "Pdcia. Roque Sáenz Peña",
    provincia: "Chaco",
    coords: [-26.7852, -60.4388],
    avatar: "https://randomuser.me/api/portraits/men/75.jpg",
    reputacion: 4.3,
    operaciones: 6,
    score: 642,
    antiguedadMeses: 9,
    insignias: ["Nuevo en la red"],
    bio: "Odontólogo general. Necesita renovar el sillón odontológico.",
    verificaciones: { matricula: true, renaper: true, kyc: true, vouching: true },
    avaladoPor: "d-sofia",
  },
  {
    id: "d-valentina",
    nombre: "Valentina",
    apellido: "Duarte",
    matricula: "OCT-2233",
    ciudad: "Goya",
    provincia: "Corrientes",
    coords: [-29.1402, -59.2614],
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    reputacion: 4.7,
    operaciones: 14,
    score: 731,
    antiguedadMeses: 22,
    insignias: ["Buen pagador", "Implantóloga"],
    bio: "Implantóloga en Goya. Coloca parte de sus ahorros entre colegas.",
    verificaciones: { matricula: true, renaper: true, kyc: true, vouching: true },
    avaladoPor: "d-laura",
  },
  {
    id: "d-tomas",
    nombre: "Tomás",
    apellido: "Vega",
    matricula: "OMI-3411",
    ciudad: "Oberá",
    provincia: "Misiones",
    coords: [-27.4858, -55.1199],
    avatar: "https://randomuser.me/api/portraits/men/51.jpg",
    reputacion: 4.1,
    operaciones: 4,
    score: 610,
    antiguedadMeses: 7,
    insignias: ["Nuevo en la red"],
    bio: "Odontopediatra. Busca capital para insumos de la temporada escolar.",
    verificaciones: { matricula: true, renaper: true, kyc: true, vouching: true },
    avaladoPor: "d-sofia",
  },
];

export const dentistById = (id: string): Dentist | undefined =>
  dentists.find((d) => d.id === id);

// Perfiles ofrecidos en el selector de acceso del demo.
export const demoProfiles: DemoProfile[] = [
  {
    dentistId: "d-laura",
    rol: "prestamista",
    titulo: "Dra. Laura Benítez",
    descripcion:
      "Prestamista con excedente. Entrá como quien coloca capital y evaluá tomadores con su score y reputación.",
  },
  {
    dentistId: "d-martin",
    rol: "tomador",
    titulo: "Dr. Martín Ferreyra",
    descripcion:
      "Tomador que busca financiar equipamiento. Recorré el alta, el matching y el cierre de una operación.",
  },
  {
    dentistId: "d-sofia",
    rol: "admin",
    titulo: "Dra. Sofía Acosta",
    descripcion:
      "Perfil mixto: tiene una solicitud para prestar y otra para tomar. Además es operadora del equipo, con acceso al panel de confirmación de comisiones (Fase 1).",
  },
];

export const profileOf = (dentistId: string): DemoProfile | undefined =>
  demoProfiles.find((p) => p.dentistId === dentistId);

export const isAdmin = (dentistId?: string): boolean =>
  !!dentistId && profileOf(dentistId)?.rol === "admin";
