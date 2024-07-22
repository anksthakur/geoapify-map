"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css"; 
import { name } from "./Fetch";

// Dynamically import the LeafletMap component to ensure it's only rendered on the client side
const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false, // Disable server-side rendering for this component
});

const Geoapifymap = () => {
  const [data, setData] = useState<any>(null); 
  const [searchQuery, setSearchQuery] = useState<string>("");

  const getApiData = async (query: string) => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY; 
      let url = `https://api.geoapify.com/v1/geocode/search?text=${query}&apiKey=${apiKey}`;
      let res = await name(url);
      console.log("data ", res);
      setData(res); 
    } catch (error) {
      console.error(error); 
    }
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery) {
      console.log("enter Data ", searchQuery);
      getApiData(searchQuery);
    }
  };

  return (
    <>
      <div className="wrapper max-w-screen-lg mx-auto p-4">
        <div className="main">
          <div className="name flex justify-center mt-4">
            <h1 className="text-xl md:text-2xl lg:text-3xl">Geoapify Map</h1>
          </div>
          <div className="input1 mt-4 mb-4">
            <form onSubmit={handleSearch} className="flex flex-col items-center">
              <input 
                type="text" 
                placeholder="Search" 
                name="search" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)} 
                className="border p-2 rounded w-full md:w-1/2 lg:w-1/3"
              />
              <button 
                type="submit" 
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Search
              </button>
            </form>
          </div>
          <div className="map mt-5">
            <LeafletMap data={data} />
          </div> 
        </div>
      </div>
    </>
  );
};

export default Geoapifymap;
