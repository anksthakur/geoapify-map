import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const LeafletMap = ({ data }: { data: any }) => {
  const mapRef = useRef<L.Map | null>(null);
  const [position, setPosition] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && !mapRef.current) {
      console.log("Initializing map...");

      const map = L.map("map").setView([51.505, -0.09], 15);
      mapRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 25,
      }).addTo(map);

      console.log("Map initialized");
    }

    return () => {
      if (mapRef.current) {
        console.log("Cleaning up map...");
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    console.log("Data updated:", data);

    if (data && data.features && data.features.length > 0) {
      const location = data.features[0];
      const { lat, lon } = location.properties;
      
      console.log("Location data:", location.properties);

      setPosition([lat, lon]);

      if (mapRef.current) {
        const map = mapRef.current;
        
        map.eachLayer(layer => {
          if (layer instanceof L.Marker) {
            console.log("Removing old marker...");
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

        console.log("New marker added at:", [lat, lon]);
      }
    } else {
      console.log("No valid location data found.");
    }
  }, [data]);

  useEffect(() => {
    console.log("Position updated:", position);

    if (position && mapRef.current) {
      const map = mapRef.current;

      map.setZoom(15);
      map.panTo(map.getCenter());

      setTimeout(() => {
        console.log("Setting new view...");
        map.setView(position, 18, { animate: true });
      }, 900);
    }
  }, [position]);

  return (
    <div id="map" style={{ height: "500px", width: "100%" }}></div>
  );
};

export default LeafletMap;
