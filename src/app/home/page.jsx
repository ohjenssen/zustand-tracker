'use client'
import React from 'react';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import CalorieStats from '../components/CalorieStats';
import MealCard from '../components/MealCard';
import { useMealsStore, useAuthStore } from '../store/store';
import { useEffect } from 'react';

export default function CalorieTrackerHome() {

    const meals = useMealsStore((state) => state.meals);
    const token = useAuthStore((state) => state.token);

    useEffect(() => {
        async function getMeals(){
            try {
                const response = await fetch('https://foodtracker-api.oskarjenssen.com/api/meals', {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        'Authorization': `Bearer ${token}`
                    }
                })

                const json = await response.json();

                console.log('response: ', response);
                console.log('json: ', json);
            } catch(error) {
                console.log('error: ', error)
            }
        }

        getMeals();
    }, [])

    return (
        <main className="min-h-screen bg-[#003d2b] text-[#22c55e] p-6 pb-32">
            
            <CalorieStats eaten={691} />


            <section className="space-y-4">
                {meals.map(meal => (
                    <MealCard key={meal.id} {...meal} />
                ))}
            </section>

            <div className="flex justify-center mt-12">
                <Link href="/search?mealId=new" className="bg-yellow-400 text-[#003d2b] p-4 rounded-full shadow-2xl">
                <Plus size={32} strokeWidth={3} />
                </Link>
            </div>

            <Navbar />
        </main>
    );
}