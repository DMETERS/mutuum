"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Solicitud, Dentist } from "@/lib/types";
import { usd, pct } from "@/lib/format";

// Ícono custom (divIcon) para no depender de los assets de Leaflet en el bundle.
function pinIcon(tipo: Solicitud["tipo"], activo: boolean): L.DivIcon {
  const color = tipo === "prestar" ? "#0c6b4f" : "#2f6f8f";
  const size = activo ? 24 : 18;
  const ring = activo ? "box-shadow:0 0 0 5px rgba(12,107,79,.22);" : "box-shadow:0 2px 4px rgba(21,20,15,.25);";
  return L.divIcon({
    className: "",
    html: `<div style="background:${color};width:${size}px;height:${size}px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:2.5px solid #fffdf9;${ring}transition:all .2s ease;"></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size + 2],
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
