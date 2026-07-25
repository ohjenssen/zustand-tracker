"use client";
import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { useMealsStore } from '@/app/store/store';
import Navbar from '@/app/components/Navbar';

export default function DetailsClientForm({ food }) {
  const router = useRouter();
  const mealId = useSearchParams().get('mealId');
  const [grams, setGrams] = useState(100);

  const { addFoodToMeal, createNewMeal } = useMealsStore();
  const factor = grams / 100;

  const handleSave = () => {
    const data = { ...food, gramsEaten: parseInt(grams) || 0 };
    
    if (mealId === 'new') {
      const newId = createNewMeal(data);
      router.push(`/meal/${newId}`);
    } else {
      addFoodToMeal(mealId || 1, data);
      router.push(`/meal/${mealId}`);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <button onClick={() => router.back()} className="text-[#00ffb3] mb-12 self-start">
        <ChevronLeft size={32} />
      </button>

      <div className="space-y-2 flex-1 px-2">
        {[
          { l: "Kcal", v: Math.round(food.kcal * factor) },
          { l: "Proteins", v: (food.protein * factor).toFixed(1) + " g" },
          { l: "Fats", v: (food.fat * factor).toFixed(1) + " g" },
          { l: "Carbohydrates", v: (food.carbs * factor).toFixed(1) + " g" }
        ].map(item => (
          <div key={item.l} className="flex justify-between border-b border-white/20 py-4 text-lg">
            <span className="opacity-90">{item.l}</span>
            <span className="font-semibold">{item.v}</span>
          </div>
        ))}
      </div>

      {/* Interaktiv input og lagringsknapp koblet mot Zustand */}
      <div className="space-y-6 mt-auto px-2">
        <div className="bg-white rounded-xl p-4 flex items-center justify-end text-black shadow-lg">
          <input 
            type="number" 
            value={grams} 
            onChange={e => setGrams(e.target.value)} 
            className="w-full text-right bg-transparent text-2xl font-medium outline-none pr-2 text-[#003d2b]" 
          />
          <span className="text-2xl text-gray-400 font-medium">g</span>
        </div>
        <button onClick={handleSave} className="w-full bg-yellow-400 text-[#003d2b] font-bold py-4 rounded-xl text-xl shadow-xl">
          Save
        </button>
      </div>

      <Navbar />
    </div>
  );
}