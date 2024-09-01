"use client";

import { useState } from "react";
import { CiSearch } from "react-icons/ci";

const Bar = () => {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    console.log("Searching for:", query);
  };

  return (
    <div className="flex items-center w-full max-w-6xl mx-auto mt-10 pr-10">
      <div className="relative w-full">
        <input
          type="text"
          placeholder="Search Documents"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full h-14 py-2 pl-4 pr-10 text-sm border rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
        />
        <button
          onClick={handleSearch}
          className="h-full w-14 absolute top-0 right-0 px-4 py-2 bg-transparent rounded-full hover:bg-gray-300 focus:outline-none"
        >
          <CiSearch className="text-xl font-bold" />
        </button>
      </div>
    </div>
  );
};

export default Bar;
