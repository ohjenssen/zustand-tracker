import { useSearchParams } from "next/navigation";
import { Search } from 'lucide-react';
import SearchItem from "../SearchItem";
import foodData from '../../data/foodData.json';
import { useState } from "react";

export default function SearchContent() {
  const [query, setQuery] = useState("");
  const searchParams = useSearchParams();

  // Henter ut f.eks. "1" hvis URL er /search?mealId=1
  const mealId = searchParams.get('mealId'); 
  
  const filteredFood = query 
    ? foodData.filter(f => f.name.toLowerCase().includes(query.toLowerCase()))
    : [];

  const displayList = query ? filteredFood : foodData;

  return (
    <>
      {/* Search Input Box */}
      <div className="relative mb-8 mt-4">
        <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
        <input 
          type="text"
          placeholder="Search"
          className="w-full bg-white rounded-xl py-3 pl-12 pr-4 text-black focus:outline-none"
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* Results Section */}
      <section>
        <h3 className="text-lg font-medium mb-4 text-[#00ffb3]">
          {query ? "Search results" : "Recent searches"}
        </h3>
        
        <div className="space-y-6">
          {displayList.map((food) => (
            <SearchItem 
              key={food.id} 
              id={food.id} 
              name={food.name} 
              brand={food.brand} 
              mealId={mealId} 
            />
          ))}
          {query && filteredFood.length === 0 && (
            <p className="text-gray-400 italic">No results found for "{query}"</p>
          )}
        </div>
      </section>
    </>
  );
}