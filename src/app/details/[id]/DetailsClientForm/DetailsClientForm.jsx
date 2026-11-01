"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/app/store/store';
import RulerSlider from '@/app/components/RulerSlider/RulerSlider'; // Importer komponenten
import styles from './detailsClientForm.module.css';
import { API_URL } from '@/app/utils/api';
import { dateToTimestamp } from '@/app/utils/dates';

export default function DetailsClientForm({ id }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const mealId = searchParams.get('mealId');
    const dateParam = searchParams.get('date');
    
    // null betyr at brukeren ikke har endret noe ennå
    const [grams, setGrams] = useState(null);

    const token = useAuthStore((state) => state.token);
    const meals = useAuthStore((state) => state.meals);
    const [food, setFood] = useState(null);
    const [notFound, setNotFound] = useState(false);
    const createNewMeal = useAuthStore((state) => state.createNewMeal);
    const updateMeal = useAuthStore((state) => state.updateMeal);
    const getSingleMeal = useAuthStore((state) => state.getSingleMeal);
    const getMeals = useAuthStore((state) => state.getMeals);

    // Ligger produktet allerede i måltidet, starter linjalen på gramverdien som er lagret
    const isExistingMeal = mealId && mealId !== 'new' && mealId !== 'null';
    const existingGrams = isExistingMeal
        ? meals
            ?.find((m) => m.id === parseInt(mealId))
            ?.foodComponents?.find((f) => f.id === parseInt(id))
            ?.gramsEaten
        : undefined;
    const selectedGrams = grams ?? existingGrams ?? 100;

    // Måltidene finnes ikke i storen hvis siden lastes direkte, f.eks. ved reload
    useEffect(() => {
        if (isExistingMeal && !meals) getMeals();
    }, [isExistingMeal, meals, getMeals]);

    // Hent akkurat dette produktet ferskt fra API-et (ingen gammel cache)
    useEffect(() => {
        const t = token || localStorage.getItem('token');
        if (!t) return;

        fetch(`${API_URL}/food-products/${id}`, {
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${t}`,
            },
        })
            .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
            .then(setFood)
            .catch(() => setNotFound(true));
    }, [id, token]);

    if (notFound) {
        return <div className={styles.notFound}>Fant ikke matproduktet.</div>;
    }

    if (!food) {
        return <div className={styles.notFound}>Henter matvare...</div>;
    }

    const numericGrams = Number(selectedGrams) || 0;
    const factor = numericGrams / 100;

    const protein = parseFloat(food.proteins || 0);
    const fat = parseFloat(food.fat || 0);
    const carbs = parseFloat(food.carbohydrates || 0);

    const kcalPer100g = (protein * 4) + (carbs * 4) + (fat * 9);
    const calculatedKcal = Math.round(kcalPer100g * factor);

    const handleSave = async (e) => {
        e.preventDefault();

        const numericId = parseInt(id);
        const finalGrams = parseInt(selectedGrams) || 0;

        if (mealId === 'new') {
            const foodItemWithGrams = { 
                products: [
                    {
                        id: numericId,
                        grams: finalGrams
                    }
                ],
                ...(dateToTimestamp(dateParam) && { "date": dateToTimestamp(dateParam) })
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
                    value={selectedGrams} 
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