import React, { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const LeafletMap = () => {
  useEffect(() => {
    // Ensure the code only runs on the client-side
    if (typeof window !== "undefined") {
      // Create map instance
      const map = L.map("map").setView([51.505, -0.09], 18); // Set initial zoom level to 18

      // Add tile layer with maxZoom option 
      L.tileLayer(`https://maps.geoapify.com/v1/tile/osm-carto/{z}/{x}/{y}.png?apiKey=${process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY}`, {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 25, 
      }).addTo(map);

      // Cleanup on unmount
      return () => {
        map.remove();
      };
    }
  }, []);

  return <div id="map" style={{ height: "500px", width: "100%" }}></div>;
};

export default LeafletMap;
