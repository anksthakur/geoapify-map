import React, { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const LeafletMap = ({ data }: { data: any }) => {
  useEffect(() => {
    // Ensure the code runs only on the client-side
    if (typeof window !== "undefined") {
      // Initialize the Leaflet map instance and set its initial view
      const map = L.map("map").setView([51.505, -0.09], 18);

      // Add the tile layer to the map
      L.tileLayer(`https://maps.geoapify.com/v1/tile/osm-carto/{z}/{x}/{y}.png?apiKey=${process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY}`, {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 25, // Maximum zoom level
      }).addTo(map);

      // Check if data is available and has features
      if (data && data.features && data.features.length > 0) {
        // Extract the first feature from the data
        const location = data.features[0];
        const { lat, lon } = location.properties; // Extract latitude and longitude from properties

        // Update the map view to the location's coordinates with a zoom level of 18
        map.setView([lat, lon], 18);

        // Add a marker to the map at the location's coordinates
        L.marker([lat, lon]).addTo(map);
      }

      // Cleanup function to remove the map instance on component unmount
      return () => {
        map.remove();
      };
    }
  }, [data]); // Depend on data to re-render the map when data changes

  return (
    <div id="map" style={{ height: "500px", width: "100%" }}></div>
  );
};

export default LeafletMap;