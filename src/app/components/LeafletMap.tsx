"use client"
import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface LocationProperties {
  address_line1?: string;
  address_line2?: string;
  state?: string;
  country?: string;
  postcode?: string;
  category?: string;
  lat?: string | null;
  lon?: string | null;
}

interface Suggestion {
  properties: LocationProperties;
}

interface GeoapifyResponse {
  features: Suggestion[];
}

const LeafletMap = ({ data }: { data: GeoapifyResponse | null }) => {
  const mapRef = useRef<L.Map | null>(null);
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [prevPosition, setPrevPosition] = useState<[number, number] | null>(null);

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

      // Convert lat and lon to number, defaulting to 0 if not present
      const latNumber = lat ? parseFloat(lat) : 0;
      const lonNumber = lon ? parseFloat(lon) : 0;

      console.log("Location data:", location.properties);

      setPosition([latNumber, lonNumber]);

      if (mapRef.current) {
        const map = mapRef.current;

        map.eachLayer((layer: L.Layer) => {
          if (layer instanceof L.Marker) {
            console.log("Removing old marker...");
            map.removeLayer(layer);
          }
        });

        const handleFlyTo = (lat: number, lon: number, zoom: number, duration: number) => {
          map.flyTo([lat, lon], zoom, {
            animate: true,
            duration,
          });
        };

        if (prevPosition) {
          // Zoom out to the previous position
          handleFlyTo(prevPosition[0], prevPosition[1], 5, 2); // Zoom out

          // Use Geoapify transitions (for demo, adjust as per actual Geoapify methods)
          map.once('zoomend', () => {
            // Add a new marker at the new position
            const marker = L.marker([latNumber, lonNumber]).addTo(map);
            marker.bindPopup(`
              <div>
                <strong>Address:</strong><br/>
                ${location.properties.address_line1 || ''}<br/>
                ${location.properties.address_line2 || ''}<br/>
                ${location.properties.state || ''}<br/>
                ${location.properties.country || ''}<br/>
                ${lat || ''}<br/>
                ${lon || ''}
              </div>
            `).openPopup();

            console.log("New marker added at:", [latNumber, lonNumber]);

            // Zoom in to the new position
            handleFlyTo(latNumber, lonNumber, 15, 2); // Zoom in
          });
        } else {
          // Add a new marker at the new position
          const marker = L.marker([latNumber, lonNumber]).addTo(map);
          marker.bindPopup(`
            <div>
              <strong>Address:</strong><br/>
              ${location.properties.address_line1 || ''}<br/>
              ${location.properties.address_line2 || ''}<br/>
              ${location.properties.state || ''}<br/>
              ${location.properties.country || ''}<br/>
              ${lat || ''}<br/>
              ${lon || ''}
            </div>
          `).openPopup();

          console.log("New marker added at:", [latNumber, lonNumber]);

          // Zoom in to the new position
          handleFlyTo(latNumber, lonNumber, 15, 2); // Zoom in
        }

        setPrevPosition([latNumber, lonNumber]);
      }
    } else {
      console.log("No valid location data found.");
    }
  }, [data]);

  return (
    <div id="map" style={{ height: "550px", width: "100%" }}></div>
  );
};

export default LeafletMap;
