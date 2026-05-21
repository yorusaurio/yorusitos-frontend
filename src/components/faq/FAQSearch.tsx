"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

interface FAQSearchProps {
  onSearch: (query: string) => void;
}

export default function FAQSearch({ onSearch }: FAQSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearch(value);
  };

  return (
    <section className="bg-white py-12 sticky top-16 z-40 border-b border-gray-200">
      <div className="max-w-3xl mx-auto px-6">
        <div className="relative">
          <FontAwesomeIcon 
            icon={faSearch} 
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl"
          />
          <input
            type="text"
            placeholder="Buscar pregunta..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-14 pr-6 py-4 border-2 border-black text-lg focus:outline-none focus:border-gray-600 transition-colors"
          />
        </div>
      </div>
    </section>
  );
}
