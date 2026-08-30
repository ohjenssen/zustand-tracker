"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/app/store/store';
import RulerSlider from '@/app/components/RulerSlider/RulerSlider'; // Importer komponenten
import styles from './detailsClientForm.module.css';

export default function DetailsClientForm({ id }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const mealId = searchParams.get('mealId');
    const dateParam = searchParams.get('date');
    
    // Grams er nå et tall (standard 100)
    const [grams, setGrams] = useState(100);

    const foodProducts = useAuthStore((state) => state.foodProducts);
    const getFoodProducts = useAuthStore((state) => state.getFoodProducts);
    const createNewMeal = useAuthStore((state) => state.createNewMeal);
    const updateMeal = useAuthStore((state) => state.updateMeal);
    const getSingleMeal = useAuthStore((state) => state.getSingleMeal);
    const getMeals = useAuthStore((state) => state.getMeals);

    useEffect(() => {
        if (!foodProducts) {
            getFoodProducts();
        }
    }, [foodProducts, getFoodProducts]);

    if (!foodProducts) {
        return <div className={styles.notFound}>Henter matvare...</div>;
    }

    const food = foodProducts.find((f) => String(f.id) === String(id));

    if (!food) {
        return <div className={styles.notFound}>Fant ikke matproduktet.</div>;
    }

    const numericGrams = Number(grams) || 0;
    const factor = numericGrams / 100;

    const protein = parseFloat(food.proteins || 0);
    const fat = parseFloat(food.fat || 0);
    const carbs = parseFloat(food.carbohydrates || 0);

    const kcalPer100g = (protein * 4) + (carbs * 4) + (fat * 9);
    const calculatedKcal = Math.round(kcalPer100g * factor);

    const handleSave = async (e) => {
        e.preventDefault();

        const numericId = parseInt(id);
        const finalGrams = parseInt(grams) || 0;

        if (mealId === 'new') {
            const foodItemWithGrams = { 
                products: [
                    {
                        id: numericId,
                        grams: finalGrams
                    }
                ],
                ...(dateParam && { "date": dateParam })
            };

            const newMeal = await createNewMeal(foodItemWithGrams);
            if (newMeal) {
                router.push(`/meal/${newMeal}`);
            }
        } else if (mealId) {
            const mealResponse = await getSingleMeal(mealId);
            const mealData = mealResponse?.data || mealResponse;

            const existingProducts = (mealData?.foodComponents || []).map(p => ({
                id: p.id,
                grams: p.gramsEaten || 0
            }));

            const filteredProducts = existingProducts.filter(p => p.id !== numericId);

            const updatedProducts = [
                ...filteredProducts,
                {
                    id: numericId,
                    grams: finalGrams
                }
            ];

            const mealObject = { 
                products: updatedProducts
            };
            await updateMeal(parseInt(mealId), mealObject);
            await getMeals();
            router.push(`/meal/${mealId}`);
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>{food.name}</h1>
        
            <div className={styles.statsContainer}>
                {[
                    { label: "Kcal", value: calculatedKcal },
                    { label: "Proteins", value: `${(protein * factor).toFixed(1)} g` },
                    { label: "Fats", value: `${(fat * factor).toFixed(1)} g` },
                    { label: "Carbohydrates", value: `${(carbs * factor).toFixed(1)} g` }
                ].map(item => (
                    <div key={item.label} className={styles.statRow}>
                        <span className={styles.statLabel}>{item.label}</span>
                        <span className={styles.statValue}>{item.value}</span>
                    </div>
                ))}
            </div>

            {/* Linjal-slideren er plassert her */}
            <form onSubmit={handleSave} className={styles.actionsContainer}>
                <RulerSlider 
                    value={grams} 
                    onChange={setGrams} 
                    min={0} 
                    max={1000} 
                    step={1} 
                    unit="g"
                />

                <button type="submit" className={styles.saveButton}>
                    Lagre
                </button>
            </form>
        </div>
    );
}