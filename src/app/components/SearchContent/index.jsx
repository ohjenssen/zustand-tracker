'use client'
import styles from './searchContent.module.css';
import { useSearchParams } from "next/navigation";
import { Search } from 'lucide-react';
import SearchItem from "../SearchItem";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/app/store/store";

export default function SearchContent() {
    const [query, setQuery] = useState("");
    const searchParams = useSearchParams();
    
    const getFoodProducts = useAuthStore((state) => state.getFoodProducts);
    const foodProducts = useAuthStore((state) => state.foodProducts);
    
    const getFoodProductsByName = useAuthStore((state) => state.getFoodProductsByName);
    const foodProductsByName = useAuthStore((state) => state.foodProductsByName);
    
    function handleSearch(e){
        getFoodProductsByName(e);
        setQuery(e)
    }
    useEffect(() => {
        if(foodProducts){
            return
        } else {
            getFoodProducts()
        }
    }, [])
    // Henter ut f.eks. "1" hvis URL er /search?mealId=1
    const mealId = searchParams.get('mealId'); 
    
    const filteredFood = query 
        ? foodProducts.filter(f => f.name.toLowerCase().includes(query.toLowerCase()))
        : [];

    return (
        <>
            {/* Search Input Box */}
            <div className={styles.searchBoxWrapper}>
                <Search className={styles.searchIcon} size={20} />
                <input 
                    type="text"
                    placeholder="Search"
                    className={styles.searchInput}
                    onChange={(e) => handleSearch(e.target.value)}
                />
            </div>

            {/* Results Section */}
            <section>
                <h3 className={styles.sectionTitle}>
                {query ? "Search results" : "Recent searches"}
                </h3>
                
                <div className={styles.resultsList}>
                    {foodProductsByName && foodProductsByName.map((food) => (
                        <SearchItem 
                            key={food.id} 
                            food={food} 
                            mealId={mealId} 
                        />
                    ))}

                    {query && foodProductsByName && foodProductsByName.length === 0 && (
                        <p className={styles.noResults}>No results found for "{query}"</p>
                    )}

                    {!foodProducts && (
                        <div className={styles.failedFoodProducts}>
                            <p>Failed to get food products</p>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}