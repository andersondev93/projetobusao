"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Corrige o ícone padrão do Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

export default function MapaRota({ pontos = [] }) {
  // Converte e filtra pontos com latitude/longitude válidas
  const pontosValidos = pontos
    .map((p) => ({
      ...p,
      latitude: parseFloat(p.latitude),
      longitude: parseFloat(p.longitude),
    }))
    .filter(
      (p) =>
        typeof p.latitude === "number" &&
        typeof p.longitude === "number" &&
        !isNaN(p.latitude) &&
        !isNaN(p.longitude)
    );

  if (!pontosValidos.length) {
    return <p>Não há pontos com coordenadas válidas para exibir.</p>;
  }

  const center = [pontosValidos[0].latitude, pontosValidos[0].longitude];
  const rota = pontosValidos.map((p) => [p.latitude, p.longitude]);

  return (
    <MapContainer
      center={center}
      zoom={13}
      scrollWheelZoom={false}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Marcadores */}
      {pontosValidos.map((ponto) => (
        <Marker key={ponto.id} position={[ponto.latitude, ponto.longitude]}>
          <Popup>
            <strong>{ponto.nome}</strong>
            <br />
            {ponto.endereco}
          </Popup>
        </Marker>
      ))}

      {/* Linha ligando os pontos */}
      <Polyline positions={rota} color="blue" />
    </MapContainer>
  );
}
