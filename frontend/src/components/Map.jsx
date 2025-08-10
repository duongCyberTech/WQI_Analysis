// MapViewer.jsx
import React, { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const MapViewer = ({ lat = 10.3, lng = 106.3, zoom = 13, address = "Bến Tre" }) => {
  useEffect(() => {
    const map = L.map("map").setView([lat, lng], zoom);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    L.marker([lat, lng])
      .addTo(map)
      .bindPopup(address)
      .openPopup();

    return () => {
      map.remove();
    };
  }, [lat, lng, zoom, address]);

  return <div id="map" style={{ height: "400px", width: "400px" }} />;
};

export default MapViewer;
