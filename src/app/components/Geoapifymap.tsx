"use client";
import axios from "axios";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

// Dynamically import the LeafletMap component to ensure it's only rendered on the client side
const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false, // Disable server-side rendering for this component
});

const Geoapifymap = () => {
  const [data, setData] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  useEffect(() => {
    if (searchQuery.length > 2 && !isSearching) {
      // Fetch suggestions based on the search query
      getSuggestions(searchQuery);
    } else if (searchQuery.length <= 2) {
      setSuggestions([]); // Clear suggestions if query is too short
    }
  }, [searchQuery, isSearching]);

  const getSuggestions = async (query: string) => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY;
      const encodedQuery = encodeURIComponent(query);
      const res = await axios.get(`https://api.geoapify.com/v1/geocode/search?text=${encodedQuery}&apiKey=${apiKey}`);
      setSuggestions(res.data.features); // Update suggestions based on API response
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission behavior
    if (selectedLocation) {
      // Fetch data for the selected location and update the map
      setData({ features: [selectedLocation] });
      setSuggestions([]); // Hide suggestions after search
      setIsSearching(true); // Set flag to prevent suggestions from showing
    }
  };

  const handleSuggestionClick = (location: any) => {
    setSelectedLocation(location); // Set the selected location
    setSearchQuery(location.properties.address_line1 || location.properties.state || location.properties.country);
    setSuggestions([]); // Hide suggestions
    setIsSearching(true); // Set flag to prevent suggestions from showing
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
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearching(false); // Reset search flag when query changes
                }} 
                className="border p-2 rounded w-full md:w-1/2 lg:w-1/3"
              />
              <button 
                type="submit" 
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Search
              </button>
            </form>
            {suggestions.length > 0 && !isSearching && (
              <ul className="mt-2 border border-gray-300 rounded w-full md:w-1/2 lg:w-1/3">
                {suggestions.map((location: any, index: number) => (
                  <li
                    key={index}
                    onClick={() => handleSuggestionClick(location)}
                    className="p-2 cursor-pointer hover:bg-gray-100"
                  >
                    {location.properties.address_line1 || location.properties.state || location.properties.country}
                  </li>
                ))}
              </ul>
            )}
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
