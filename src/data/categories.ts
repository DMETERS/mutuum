import type { CategoriaInsumo } from "@/lib/types";

// Categorías de insumos/equipamiento odontológico con precio de referencia (USD).
// Permiten contrastar el monto solicitado contra un valor de mercado.
export const categorias: CategoriaInsumo[] = [
  { id: "sillon", nombre: "Sillón odontológico", precioRef: 6500, grupo: "Equipamiento" },
  { id: "rayos", nombre: "Equipo de rayos X portátil", precioRef: 2200, grupo: "Equipamiento" },
  { id: "rvg", nombre: "Sensor RVG (radiografía digital)", precioRef: 1800, grupo: "Equipamiento" },
  { id: "autoclave", nombre: "Autoclave / esterilizador", precioRef: 1500, grupo: "Equipamiento" },
  { id: "scanner", nombre: "Escáner intraoral", precioRef: 9000, grupo: "Equipamiento" },
  { id: "compresor", nombre: "Compresor odontológico", precioRef: 900, grupo: "Equipamiento" },
  { id: "implantes", nombre: "Kit de implantes (lote)", precioRef: 1200, grupo: "Insumos" },
  { id: "ortodoncia", nombre: "Insumos de ortodoncia (stock)", precioRef: 700, grupo: "Insumos" },
  { id: "consumibles", nombre: "Consumibles generales (trimestre)", precioRef: 500, grupo: "Insumos" },
  { id: "reforma", nombre: "Reforma del consultorio", precioRef: 4000, grupo: "Otros" },
  { id: "capital", nombre: "Capital de trabajo", precioRef: 3000, grupo: "Otros" },
];

export const categoriaById = (id?: string): CategoriaInsumo | undefined =>
  id ? categorias.find((c) => c.id === id) : undefined;
