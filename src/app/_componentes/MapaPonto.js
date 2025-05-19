"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";

// Corrige o ícone do marcador
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

export default function MapaPonto({ ponto }) {
  useEffect(() => {
    if (!ponto || !ponto.latitude || !ponto.longitude) {
      console.warn("Coordenadas do ponto não disponíveis.");
    }
  }, [ponto]);

  if (!ponto?.latitude || !ponto?.longitude) {
    return (
      <p className="text-gray-500">
        Coordenadas não disponíveis para este ponto.
      </p>
    );
  }

  return (
    <MapContainer
      center={[ponto.latitude, ponto.longitude]}
      zoom={16}
      scrollWheelZoom={false}
      className="h-80 w-full rounded-lg z-0"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap contributors"
      />
      <Marker position={[ponto.latitude, ponto.longitude]}>
        <Popup>{ponto.nome}</Popup>
      </Marker>
    </MapContainer>
  );
}
