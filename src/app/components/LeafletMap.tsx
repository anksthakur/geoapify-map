import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const LeafletMap = ({ data }: { data: any }) => {
  const mapRef = useRef<L.Map | null>(null);
  const [position, setPosition] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && !mapRef.current) {
      const map = L.map("map").setView([51.505, -0.09], 15);
      mapRef.current = map;

      L.tileLayer(`https://maps.geoapify.com/v1/tile/osm-carto/{z}/{x}/{y}.png?apiKey=${process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY}`, {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 25,
      }).addTo(map);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (data && data.features && data.features.length > 0) {
      const location = data.features[0];
      const { lat, lon } = location.properties;
      
      setPosition([lat, lon]);

      if (mapRef.current) {
        const map = mapRef.current;
        map.eachLayer(layer => {
          if (layer instanceof L.Marker) {
            map.removeLayer(layer); // Remove old markers
          }
        });

        const marker = L.marker([lat, lon]).addTo(map);
        marker.bindPopup(`
          <div>
            <strong>Address:</strong><br/>
            ${location.properties.address_line1 || ''}<br/>
            ${location.properties.address_line2 || ''}<br/>
            ${location.properties.state || ''}<br/>
            ${location.properties.country || ''}<br/>
            ${location.properties.lat || ''}<br/>
            ${location.properties.lon || ''}
          </div>
        `).openPopup();
      }
    }
  }, [data]);

  useEffect(() => {
    if (position && mapRef.current) {
      const map = mapRef.current;

      // Zoom out to a wider view and then zoom in to the new position
      map.setZoom(15);
      map.panTo(map.getCenter());

      setTimeout(() => {
        map.setView(position, 18, { animate: true });
      }, 900); // Short delay to transition smoothly between zoom levels
    }
  }, [position]);

  return (
    <div id="map" style={{ height: "500px", width: "100%" }}></div>
  );
};

export default LeafletMap;
