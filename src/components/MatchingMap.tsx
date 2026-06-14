"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Solicitud, Dentist } from "@/lib/types";
import { usd, pct } from "@/lib/format";

// Ícono custom (divIcon) para no depender de los assets de Leaflet en el bundle.
function pinIcon(tipo: Solicitud["tipo"], activo: boolean): L.DivIcon {
  const color = tipo === "prestar" ? "#047857" : "#0ea5e9";
  const ring = activo ? "box-shadow:0 0 0 4px rgba(4,120,87,.25);" : "";
  return L.divIcon({
    className: "",
    html: `<div style="background:${color};width:18px;height:18px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:2px solid #fff;${ring}"></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 18],
    popupAnchor: [0, -16],
  });
}

interface PinData {
  solicitud: Solicitud;
  autor: Dentist;
}

export default function MatchingMap({
  pins,
  selectedId,
  onSelect,
}: {
  pins: PinData[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
}) {
  // Centro aproximado del NEA (Chaco / Corrientes / Misiones).
  const center: [number, number] = [-27.6, -57.5];

  return (
    <MapContainer
      center={center}
      zoom={6}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%", minHeight: 380 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      {pins.map(({ solicitud, autor }) => (
        <Marker
          key={solicitud.id}
          position={autor.coords}
          icon={pinIcon(solicitud.tipo, selectedId === solicitud.id)}
          eventHandlers={{ click: () => onSelect?.(solicitud.id) }}
        >
          <Popup>
            <div className="font-mono text-xs">
              <strong>
                {solicitud.tipo === "prestar" ? "Presta" : "Toma"} {usd(solicitud.monto)}
              </strong>
              <br />
              {autor.ciudad}, {autor.provincia}
              <br />
              {pct(solicitud.tasaMin)}–{pct(solicitud.tasaMax)} · {solicitud.plazoMeses} meses
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
