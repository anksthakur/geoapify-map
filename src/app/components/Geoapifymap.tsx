"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css"; // Import Leaflet CSS

// Dynamically import the Leaflet map
const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false, // This line ensures the component is only rendered on the client side
});

const Geoapifymap = () => {
  const [data, setData] = useState<any>(null);

  const getApiData = async () => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY;
      console.log('API Key:', apiKey);
      const res = await axios.get(`https://api.geoapify.com/v2/place-details?id=51ee2852712f32534059f76e980dd7ba3e40f00101f90119a51d0000000000c0020a&features=details,details.names&apiKey=${apiKey}`);
      console.log("data ", res.data);
      setData(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getApiData();
  }, []);

  return (
    <>
      <div className="wrapper">
        <div className="main">
          <div className="name flex justify-center mt-4">
            <h1>Geoapify Map</h1>
          </div>
          <div className="input1 border">
            <input type="text" placeholder="search" name="search" />
          </div>
          <LeafletMap />
        </div>
      </div>
    </>
  );
};

export default Geoapifymap;
