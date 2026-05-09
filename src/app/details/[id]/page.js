"use client";
import { ChevronLeft, Home, User } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import foodData from '../../data/foodData.json';

export default function DetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const food = foodData.find(f => f.id === id);

  if (!food) return <div>Food not found</div>;

  return (
    <main className="min-h-screen bg-[#003d2b] text-white p-6 flex flex-col">
      <Link href="/search" className="mb-8"><ChevronLeft size={32} /></Link>

      <h1 className="text-3xl font-bold text-center mb-12">{food.name}</h1>

      <div className="space-y-8 flex-1">
        {[
          { label: "Kcal", value: food.kcal },
          { label: "Proteins", value: food.protein + " g" },
          { label: "Fats", value: food.fat + " g" },
          { label: "Carbohydrates", value: food.carbs + " g" }
        ].map((item) => (
          <div key={item.label} className="flex justify-between border-b border-white/30 pb-2">
            <span className="text-lg">{item.label}</span>
            <span className="text-lg">{item.value}</span>
          </div>
        ))}
      </div>

      <div className="mt-auto space-y-4 mb-20">
        <div className="bg-white rounded-xl p-4 flex justify-between items-center">
          <input type="number" defaultValue="80" className="text-black text-2xl font-bold w-20 outline-none" />
          <span className="text-gray-500 text-2xl font-bold">g</span>
        </div>
        
        <button 
          className="w-full bg-yellow-400 text-black font-bold py-4 rounded-xl text-xl uppercase"
          onClick={() => {
            router.push("/");
          }}
        >
          Save
        </button>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-[#003d2b] border-t border-white/10 p-4 flex justify-around">
        <Link href="/"><Home size={28} /></Link>
        <User size={28} />
      </nav>
    </main>
  );
}